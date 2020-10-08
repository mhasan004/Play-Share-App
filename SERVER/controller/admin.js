const User = require('../model/User')
const Post = require('../model/Post')

exports.getAllUsers = async (req,res,next) => {
    const users = await User.find()
    if (!users) 
        return res.status(400).json({status: -1, message: "No user found!"}) 
    res.status(200).json({status:1, users})
}
exports.getAllPosts = async (req,res,next) => {
    const posts = await Post.find()
    if (!posts) 
        return res.status(400).json({status: -1, message: "No posts found!"}) 
    res.status(200).json({status:1, posts})
}

exports.getUserById = async (req,res,next) => {
    const user = await User.findOne({_id: req.params.user_id})
    if (!user) 
        return res.status(400).json({status: -1, message: "User not found!"}) 
    res.status(200).json({status:1, user})
}
exports.getUserByUsername = async (req,res,next) => {
    const user = await User.findOne({username: req.params.username})
    if (!user) 
        return res.status(400).json({status: -1, message: "User not found!"}) 
    res.status(200).json({status:1, user})
}
exports.deleteUser = async (req,res,next) => {
    const user_to_del = await User.findOne({username: req.params.username})
    if (!user_to_del)
        return res.status(401).json({status: -1, message: "User not found!"})   
    try{
        const deleted_user = await User.deleteOne({ _id: user_to_del._id })
        res.status(200).json({status: 1, deleted_user})
    }
    catch(err){
        res.status(400).json({status: -1, message: "Failed to delete user: "+err})
    }
}

exports.getPost = async (req,res,next) => {
    const post = await Post.findOne({_id: req.params.post_id})
    if (!post) 
        return res.status(400).json({status: -1, message: "Post not found!"}) 
    res.status(200).json({status:1, post})
}
exports.deletePost = async (req,res,next) => {
    const post_to_del = await Post.findOne({_id: req.params.post_id})
    if (!post_to_del)
        return res.status(401).json({status: -1, message: "Post not found!"})   
    try{
        const deleted_post = await Post.deleteOne({ _id: post_to_del._id })
        res.status(200).json({status: 1, deleted_post})
    }
    catch(err){
        res.status(400).json({status: -1, message: "Failed to delete post: "+err})
    }
}

exports.getAllPostsOfUsername = async (req,res,next) => {
    try{ 
        const user_posts = await Post.find({author: req.params.username})
        res.status(200).json({status:1, user_posts})                                                          
    }
    catch{
        res.status(401).json({status: -1, message: "Failed to get all psots of this user"}) 
    }
}
exports.getAllPostsOfEmail = async (req,res,next) => {
    try{
        const user = await User.find({email: req.params.email})              // Find the user's profile doc '_id' using email
        const user_posts = await Post.find({author: user.username})
        res.status(200).json({status:1, user_posts})                                                          
    }
    catch{
        res.status(400).json({status: -1, message: "Failed to get all posts of this email"}) 
    }
}

/* exports.deleteUserPostsALL = async (req,res,next) => {
    try{
        const user_posts = await Post.find({author: username})
        user_posts.forEach(async function(post){
            try{
                const deleted_post = await Post.deleteOne({ _id: post._id })
                res.status(200).json({status: 1, deleted_post})
            }
            catch(err){
                res.status(400).json({status: -1, message: "Failed to delete this post "+post._id+" : "+err}) 
            }
        })
    }
    catch(err){
        res.status(400).json({status: -1, message: "Failed to delete all posts of this user"+err}) 
    }
}*/


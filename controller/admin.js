const User = require('../model/User')
const Post = require('../model/Post')

exports.getAllUsers = async (req,res,next) => {
    const users = await User.find()
    if (!users) return res.status(401).json({status: -1, message: "No Users"}) 
    res.json({status:1, users})
}
exports.getAllPosts = async (req,res,next) => {
    const posts = await Post.find()
    if (!posts) return res.status(401).json({status: -1, message: "No Posts"}) 
    res.json({status:1, posts})
}


exports.getUser = async (req,res,next) => {
    const user_id = req.params.user_id
    const user = await User.findOne({_id: user_id})
    if (!user) return res.status(401).json({status: -1, message: "User not found"}) 
    res.json({status:1, user})
}
exports.getPost = async (req,res,next) => {
    const post_id = req.params.post_id
    const post = await Post.findOne({_id: post_id})
    if (!post) return res.status(401).json({status: -1, message: "Post not found"}) 
    res.json({status:1, post})
}


exports.getAllPostsOfUsername = async (req,res,next) => {
    try{ 
        const user_doc_id = await User.find({username: req.params.username})._id        // Find the user's profile doc '_id' using username
        const user_posts = await Post.find({author: user_doc_id})
        res.json({status:1, user_posts})                                                          
    }
    catch{
        res.status(401).json({status: -1, message: "Failed to get all psots of this user"}) 
    }
}

exports.getAllPostsOfEmail = async (req,res,next) => {
    try{
        const user_doc_id = await User.find({email: req.params.email})._id              // Find the user's profile doc '_id' using email
        const user_posts = await Post.find({author: user_doc_id})
        res.json({status:1, user_posts})                                                          
    }
    catch{
        res.status(401).json({status: -1, message: "Failed to get all psots of this email"}) 
    }
}

 
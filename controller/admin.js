const User = require('../model/User')
const Post = require('../model/Post')

exports.getAllUsers = async (req,res,next) => {
    const users = await User.find()
    res.json({users})
}
exports.getAllPosts = async (req,res,next) => {
    const posts = await Post.find()
    res.json({posts})
}


exports.getUser = async (req,res,next) => {
    const user_id = req.params.user_id
    const user = await User.findOne({_id: user_id})
    res.json({user})
}
exports.getPost = async (req,res,next) => {
    const post_id = req.params.post_id
    const post = await Post.findOne({_id: post_id})
    res.json({post})
}


exports.getAllPostsOfUsername = async (req,res,next) => {
    const user_doc_id = await User.find({username: req.params.username})._id        // Find the user's profile doc '_id' using username
    const user_posts = await Post.find({author: user_doc_id})
    res.json({user_posts})                                                          // a
}
exports.getAllPostsOfEmail = async (req,res,next) => {
    const user_doc_id = await User.find({email: req.params.email})._id              // Find the user's profile doc '_id' using email
    const user_posts = await Post.find({author: user_doc_id})
    res.json({user_posts})                                                          // 
}

 
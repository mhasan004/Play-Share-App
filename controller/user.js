const User = require("../model/User")
const Post = require('../model/Post')

exports.getAllPostsOfUsername = async (req,res,next) => {
    const user_doc_id = await User.find({email: req.params.email})._id              // Find the user's profile doc '_id' using email
    const user_posts = await Post.find({author: user_doc_id})
    res.json({user_posts})                                                          // 
}
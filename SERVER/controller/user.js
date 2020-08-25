const jwt  = require('jsonwebtoken')
const User = require("../model/User")
const Post = require('../model/Post')
const {postValidation} = require('../model/ValidationSchema')

exports.getAllPosts = async (req,res,next) => 
{
    const username = req.baseUrl.split('/')[3]
    try{
        const user_posts = await Post.find({author: username})
        res.status(200).json({status: 1, user_posts})                                                       
    }
    catch{
        res.status(400).json({status: -1, message: "Failed to get post of this user: "+err})
    }
}
exports.addPost = async (req,res,next) => 
{
    const username = req.baseUrl.split('/')[3]
    const {error} = postValidation(req.body)                                                                // 1) VALIDATE the POST request:              
    if(error){ return res.status(400).json({status:-1, message: error.details[0].message}) }

    const post = new Post({                                                                                 // 2) Make New Post:
        author: username,
        title: req.body.title,
        content: req.body.content,
    })

    try{                                                                                                    // 3) Save to DB:
        const added_post = await post.save()
        res.status(200).json({status: 1, added_post_id: added_post._id})
    }       
    catch(err){
        res.status(400).json({status: -1, message: "Failed to post: "+err})
    }
}


exports.getAPost = async (req,res,next) => 
{
    const post = await Post.findOne({_id: req.params.post_id})
    if (!post)
        return res.status(401).json({status: -1, message: "This Post Doesn't Exist!"})       
    res.status(200).json({status: 1, post: post})       
}
exports.editAPost = async (req,res,next) => 
{
    const updated_fields = JSON.parse(JSON.stringify(req.body))

    const post = await Post.findOne({_id: req.params.post_id})
    if (!post)
        return res.status(401).json({status: -1, message: "This Post Doesn't Exist!"})    
    try{
        const edited_post = await Post.updateOne({_id: post._id}, updated_fields)
        res.status(200).json({status: 1, edited_post: edited_post})
    }       
    catch(err){
        res.status(400).json({status: -1, message: "Failed to edit post: "+err})
    }
}
exports.deleteAPost = async (req,res,next) => 
{
    const post_to_del = await Post.findOne({_id: req.params.post_id})
    if (!post_to_del)
        return res.status(401).json({status: -1, message: "This Post Doesn't Exist!"})   
    try{
        const deleted_post = await Post.deleteOne({ _id: post_to_del._id })
        res.status(200).json({status: 1, deleted_post: deleted_post})
    }
    catch(err){
        res.status(400).json({status: -1, message: "Failed to delete post: "+err})
    }
}


exports.getFeed = async (req,res,next) => {
    try{
        const posts = await Post.find().sort([['date', -1]]).exec()
        res.status(200).json({status: 1, feed: posts})
    }
    catch{
        res.status(400).json({status: -1, message: "Failed to get post feed: "+err})
    }
}
exports.likeFeedPost = async (req,res,next) => {
    const post = await Post.findOne({_id: req.params.post_id})
    const like_dislike = req.params.like_dislike

    if (!post)
        return res.status(401).json({status: -1, message: "Couldn't get post"})  

    let like_update = null
    try{
        if (like_dislike === "like")
            like_update = await Post.updateOne({_id: post._id}, {$inc : {'likes' : 1}}).exec()
        else if (like_dislike === "dislike" && post.likes != 0)
            like_update = await Post.updateOne({_id: post._id}, {$inc : {'likes' : -1}}).exec()
        else{
            return res.status(400).json({status: -1, message: "Wrong url or cant downvote past 0. URL: /like/ or /dislike/"})
        }
        res.status(200).json({status: 1, like: like_update})
    }       
    catch(err){
        res.status(400).json({status: -1, message: "Failed to increase like: "+err})
    }
}
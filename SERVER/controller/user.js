const Post = require('../model/Post')
const {postValidation, editPostValidation} = require('../model/ValidationSchema')
const {S3Upload} = require("../helpers/AWSFunctions");
const FileType = require('file-type');                                                                          // detect filetype. need for aws

Date.prototype.formatMMDDYYYY = function(){
    return (this.getMonth() + 1) + 
    "/" +  this.getDate() +
    "/" +  this.getFullYear();
}

exports.getAllPosts = async (req,res,next) => 
{
    const username = req.username
    try{
        const user_posts = await Post.find({username: username})
        return res.status(200).json({status: 1, message: "Successfully retrieved all posts. See user_posts field!", user_posts})                                                     
    }catch(err){
        return res.status(400).json({status: -1, message: "Failed to get post of this user: "+err})
    }
}

exports.makePost = async (req,res,next) => 
{
    const username = req.username                                                                               // Setting up variables and edge cases  
    let isURL = req.header('isURL')     
    let isFile = req.header('isFile')
    if (!isURL) isURL = "false"
    if (!isFile) isFile = "false"
    if(!req.body.group) req.body.group = 'None'
    if(!req.body.group_type) req.body.group_type = 'None'

    if (isFile === "true"){                                                                              
        const filename = `${username}/${Date.now().toString()}`;                                                // files will be added inm this fileaname
        const {file, body: {title}} = req   
        req.body.title = title
        file.type = await FileType.fromBuffer(file.buffer)   
        try{ 
            const AWSdata = await S3Upload(filename, file.buffer, file.type)
            req.body.content = AWSdata.Location
            isURL = true
        } catch(err){ 
            console.log("Error uploading to s3. Error: "+err)
            return res.status(400).json({status:-1, mesage: err})
        }
    }

    const {error} = postValidation(req.body)                                                                    // 1) VALIDATE the POST request:              
    if(error)
        return res.status(400).json({status:-1, message: "Post Validation Error - "+error.details[0].message}) 

    const post = new Post({                                                                                     // 2) Make New Post:
        username: username,
        handle:'@'+username,
        title: req.body.title,
        content: req.body.content,
        likes: 1,
        total_likes: 1,
        user_liked: [username],
        date: new Date().toLocaleDateString('en-US'),
        isURL: isURL,
        isFile: isFile,
        group: req.body.group,
        group_type: req.body.group_type,
    })

    try{                                                                                                        // 3) Save to DB:
        const added_post = await post.save()
        console.log("Post made")
        return res.status(200).json({status: 1, added_post_id: added_post._id})
    } catch(err){
        console.log("Dailed to make post for: "+ (new Date()).toLocaleDateString('en-US'))
        return res.status(400).json({status: -1, message: "Failed to post: "+err})
    }
}

exports.getAPost = async (req,res,next) => 
{   
    console.log("!!! Need to limit user to only get their post! Currently, they can  get any!")
    const post = await Post.findOne({_id: req.headers["post-id"]})
    if (!post)
        return res.status(401).json({status: -1, message: "This Post Doesn't Exist!"})       
    return res.status(200).json({status: 1, post: post})       
}

exports.editAPost = async (req,res,next) => 
{
    const {error} = editPostValidation(req.body)                                                                // VALIDATE the edit post request, cant have username            
    if(error)
        return res.status(400).json({status:-1, message: error.details[0].message}) 
    const updated_fields = JSON.parse(JSON.stringify(req.body))
    const post = await Post.findOne({_id: req.headers["post-id"]})
    if (!post)
        return res.status(401).json({status: -1, message: "This Post Doesn't Exist!"})        
    try{
        const edited_post = await Post.updateOne({_id: post._id}, updated_fields)
        return res.status(200).json({status: 1, edited_post: edited_post})    
    } catch(err){
        return res.status(400).json({status: -1, message: "Failed to edit post: "+err})    
    }
}

exports.deleteAPost = async (req,res,next) => 
{
    const post_to_del = await Post.findOne({_id: req.headers["post-id"]})
    if (!post_to_del)
        return res.status(401).json({status: -1, message: "This Post Doesn't Exist!"})       
    try{
        const deleted_post = await Post.deleteOne({ _id: post_to_del._id })
        return res.status(200).json({status: 1, deleted_post: deleted_post})    
    } catch(err){
        return res.status(400).json({status: -1, message: "Failed to delete post: "+err})    
    }
}

exports.getFeed = async (req,res,next) => {
    try{
        let posts = await Post.find()                                                                           // Post.find().sort([['date', -1]]).exec()
        posts = posts.reverse()
        
        return res.status(200).json({status: 1, posts})    
    } catch{
        return  res.status(400).json({status: -1, message: "Failed to get post feed: "+err})    
    }
}
exports.likeFeedPost = async (req,res,next) => {
    let update, total_likes
    const like_dislike = req.headers["like-dislike"]
    const post = await Post.findOne({_id: req.headers["post-id"]})
    if (!post)
        return res.status(401).json({status: -1, message: "Couldn't get post"})      
    if (!like_dislike)
        return res.status(401).json({status: -1, message: "Couldn't get like or dislike action"})  
         
    try{
        if (like_dislike === "like"){
            update = await Post.updateOne({_id: post._id}, {$inc : {'likes' : 1}}).exec()
            total_likes = await Post.updateOne({_id: post._id}, {$inc : {'total_likes' : 1}}).exec()
            return res.status(200).json({status: 1, like: update, total_likes: total_likes})    
        }
        else if (like_dislike === "dislike"){
            update = await Post.updateOne({_id: post._id}, {$inc : {'dislikes' : 1}}).exec()
            total_likes = await Post.updateOne({_id: post._id}, {$inc : {'total_likes' : -1}}).exec()
            return res.status(200).json({status: 1, dislike: update, total_likes: total_likes})    
        }
        else{
            return res.status(400).json({status: -1, message: "Wrong url or cant downvote past 0. URL: /like/ or /dislike/"})    
        }
    } catch(err){
        return res.status(400).json({status: -1, message: "Failed to increase or decrease like: "+err})    
    }
}
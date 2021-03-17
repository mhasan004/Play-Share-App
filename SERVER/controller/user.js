const Post = require('../model/Post')
const {postValidation, editPostValidation} = require('../model/ValidationSchema')
const {S3Upload} = require("../helpers/AWS");
const FileType = require('file-type');                                                                                          // detect filetype. need for aws

Date.prototype.formatMMDDYYYY = function(){
    return (this.getMonth() + 1) + 
    "/" +  this.getDate() +
    "/" +  this.getFullYear();
}

exports.getFeed = async (req,res,next) => {
    try{
        let posts = await Post.find()                                                                                           // Post.find().sort([['date', -1]]).exec()
        posts = posts.reverse()
        return res.status(200).json({status: 1, posts})    
    } catch{
        return  res.status(400).json({status: -1, message: "Failed to get post feed: "+err})    
    }
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
    const username = req.username                                                                                               // Setting up variables and edge cases  
    let isURL = req.header('isURL')     
    let isFile = req.header('isFile')
    if (!isURL) isURL = "false"
    if (!isFile) isFile = "false"
    if(!req.body.group) req.body.group = 'None'
    if(!req.body.group_type) req.body.group_type = 'None'

    if (isFile === "true"){                                                                              
        const filename = `${username}/${Date.now().toString()}`;                                                                // files will be added inm this fileaname
        const {file, body: {title}} = req   
        req.body.title = title
        file.type = await FileType.fromBuffer(file.buffer)   
        try{ 
            const AWSdata = await S3Upload(filename, file.buffer, file.type)
            req.body.content = AWSdata.Location
            isURL = true
        } catch(err){ 
            console.error("Error uploading to s3. Error: "+err)
            return res.status(400).json({status:-1, message: err})
        }
    }

    const {error} = postValidation(req.body)                                                                                    // 1) VALIDATE the POST request:              
    if(error)
        return res.status(400).json({status:-1, message: "Post Validation Error - "+error.details[0].message}) 

    const post = new Post({                                                                                                     // 2) Make New Post:
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

    try{                                                                                                                        // 3) Save to DB:
        const added_post = await post.save()
        return res.status(200).json({status: 1, message: added_post})
    } catch(err){
        console.error("Dailed to make post for: "+ (new Date()).toLocaleDateString('en-US'))
        return res.status(400).json({status: -1, message: "Failed to post: "+err})
    }
}

exports.getAPost = async (req,res,next) => 
{   
    console.log("        !!! Need to limit user to ONLY get their post! Currently, they can  get any USER'S POST!")
    const post = await Post.findOne({_id: req.headers["post-id"]})
    if (!post)
        return res.status(401).json({status: -1, message: "This Post Doesn't Exist!"})       
    return res.status(200).json({status: 1, message: post})       
}

exports.editAPost = async (req,res,next) => 
{
    const {error} = editPostValidation(req.body)                                                                                // VALIDATE the edit post request, cant have username            
    if(error)
        return res.status(400).json({status:-1, message: error.details[0].message}) 
    const updated_fields = JSON.parse(JSON.stringify(req.body))
    const post = await Post.findOne({_id: req.headers["post-id"]})
    if (!post)
        return res.status(401).json({status: -1, message: "This Post Doesn't Exist!"})        
    try{
        const editedPost = await Post.updateOne({_id: post._id}, updated_fields)
        return res.status(200).json({status: 1, message: editedPost})    
    } catch(err){
        return res.status(400).json({status: -1, message: "Failed to edit post: "+err})    
    }
}

exports.deleteAPost = async (req,res,next) =>                                                                                   // METHOD: DELETE. HEADERS: post-id
{
    // const post_to_del = await Post.findOne({_id: req.headers["post-id"]})
    const postId = req.headers["post-id"]
    if (!postId)
        return res.status(401).json({status: -1, message: "This Post Doesn't Exist!"})       
    try{
        await Post.deleteOne({ _id: postId })
        return res.status(200).json({status: 1, message: "Successfully Deleted Post"})    
    } catch(err){
        return res.status(400).json({status: -1, message: "Failed to delete post: "+err})    
    }
}
exports.likeFeedPost = async (req,res,next) => {                                                                                // METHOD: PATCH. HEADERS: post-id, username
    const post = await Post.findOne({_id: req.headers["post-id"]})
    if (!post)
        return res.status(401).json({status: -1, message: "Couldn't get post"})      

    const username = req.username
    const userLikedb4 = post.user_liked.includes(username)                                                                      // true or false - did user like this post?
    const userDislikedb4 = post.user_disliked.includes(username)                                                                // true or false - did user dilike this post?
    const filter = {_id: post._id}  
    try{
        let doc
        // 1) NONE -> LIKE: if user didnt like or dislike before, likes++, total_likes++, add user to user_liked array
        if (!userLikedb4 && !userDislikedb4){
            try{
                doc = await Post.findOneAndUpdate(filter,{   
                        $inc: { likes: 1, total_likes: 1},
                        $push: { user_liked: username },
                    },
                    { new: true }                                                                                               // to return the newly updated doc. not true = give the old doc
                )
            } catch(err){
                console.error("     Mongoose 'like' error: "+err)
                return res.status(400).json({status: -1, message: "Mongoose 'like' error: "+err})  
            }
        } 
        // 2) LIKE -> UNLIKE: if user liked before, like--, total_likes--, remove user to user_liked array
        else if (userLikedb4 && !userDislikedb4){    
            try{
                doc = await Post.findOneAndUpdate(filter,{   
                        $inc:  { likes: -1, total_likes: -1},
                        $pull: { user_liked: username }
                    },{ new: true }                                                                                           
                )
            } catch(err){
                console.error("     Mongoose 'like' error: "+err)
                return res.status(400).json({status: -1, message: "Mongoose 'like' error: "+err})  
            }                
        } 
        // 3) DISLIKE -> LIKE: if user disliked before, like++, dislike--, total_likes++, add user to user_liked array, remove user from user_disliked array
        else if (userDislikedb4 && !userLikedb4){
            try{
                doc = await Post.findOneAndUpdate(filter,{   
                        $inc:  { likes: 1, dislikes: -1, total_likes: 2},
                        $push: { user_liked: username },
                        $pull: { user_disliked: username }
                    },{ new: true }                                                                                           
                )
            } catch(err){
                console.error("     Mongoose 'like' error: "+err)
                return res.status(400).json({status: -1, message: "Mongoose 'like' error: "+err})  
            }    
        } 
        return res.status(200).json({status: 1, message: {new_doc: doc, total_likes: doc.total_likes}})  
    } catch(err){
        return res.status(400).json({status: -1, message: "Failed to increase or decrease like: "+err})    
    }
}
exports.dislikeFeedPost = async (req,res,next) => {                                                                             // METHOD: PATCH.  HEADERS: post-id, username
    const post = await Post.findOne({_id: req.headers["post-id"]})
    if (!post)
        return res.status(401).json({status: -1, message: "Couldn't get post"})      

    const username = req.username
    const userLikedb4 = post.user_liked.includes(username)                                                                      // true or false - did user like this post?
    const userDislikedb4 = post.user_disliked.includes(username)                                                                // true or false - did user dilike this post?
    const filter = {_id: post._id}  
    try{
        let doc
        // 1) NONE -> DISLIKE: if user didnt like or dislike before, dislikes++, total_likes--, add user to user_disliked array
        if (!userLikedb4 && !userDislikedb4){
            try{
                doc = await Post.findOneAndUpdate(filter,{   
                        $inc: { dislikes: 1, total_likes: -1},
                        $push: { user_disliked: username },
                    },
                    { new: true }                                                                                           
                )
            } catch(err){
                console.error("     Mongoose 'dislike' error: "+err)
                return res.status(400).json({status: -1, message: "Mongoose 'dislike' error: "+err})  
            }
        }
        // 2) DISLIKE -> UN-DISLIKE: if user disliked before, dislike--, total_likes++, remove user to user_disliked array
        else if (!userLikedb4 && userDislikedb4){    
            try{
                doc = await Post.findOneAndUpdate(filter,{   
                        $inc:  { dislikes: -1, total_likes: 1},
                        $pull: { user_disliked: username }
                    },{ new: true }                                                                                           
                )
            } catch(err){
                console.error("     Mongoose 'dislike' error: "+err)
                return res.status(400).json({status: -1, message: "Mongoose 'dislike' error: "+err})  
            }                
        } 
        // 3) LIKE -> DISLIKE: if user liked before,    like--, dislike++, total_likes--, remove user from user_liked array, add user to user_disliked array
        else if (!userDislikedb4 && userLikedb4){
            try{
                doc = await Post.findOneAndUpdate(filter,{   
                        $inc:  { dislikes: 1, likes: -1, total_likes: -2},
                        $push: { user_disliked: username },
                        $pull: { user_liked: username }
                    },{ new: true }                                                                                           
                )
            } catch(err){
                console.error("     Mongoose 'dislike' error: "+err)
                return res.status(400).json({status: -1, message: "Mongoose 'dislike' error: "+err})  
            }    
        } 
        return res.status(200).json({status: 1, message: {new_doc: doc, total_likes: doc.total_likes}})  
    } catch(err){
        return res.status(400).json({status: -1, message: "Failed to increase or decrease like: "+err})    
    }
}


// exports.likeFeedPost = async (req,res,next) => {                                                                             // METHOD: PATCH, HEADERS: like-dislike = "like" or "dislike", post-id , BODY:
//     let update, total_likes
//     const like_dislike = req.headers["like-dislike"]
//     const post = await Post.findOne({_id: req.headers["post-id"]})
//     if (!post)
//         return res.status(401).json({status: -1, message: "Couldn't get post"})      
//     if (!like_dislike)
//         return res.status(401).json({status: -1, message: "Couldn't get like or dislike action"})  
    
//     const username = req.username
//     const usersLiked = post.user_liked                                                                                       // array of all users that liked    
//     const usersDisliked = post.user_disliked                                                                                 // array of all users that disliked     
//     const userLikedb4 = usersLiked.includes(username)                                                                        // true or false - did user like this post?
//     const userDislikedb4 = usersDisliked.includes(username)                                                                  // true or false - did user dilike this post?
//     const filter = {_id: post._id}  
//     try{
//         let doc
//         if (like_dislike === "like"){
//             // 1) if user didnt like or dislike before, likes++, total_likes++, add user to user_liked array
//             if (!userLikedb4 && !userDislikedb4){
//                 try{
//                     doc = await Post.findOneAndUpdate(filter,{   
//                             $inc: { likes: 1, total_likes: 1},
//                             $push: { user_liked: username },
//                         },
//                         { new: true }                                                                                       // to return the newly updated doc. not true = give the old doc
//                     )
//                 } catch(err){
//                     console.error("     Mongoose like error: "+err)
//                     return res.status(200).json({status: -1, message: "Mongoose like error: "+err})  
//                 }
//                 return res.status(200).json({status: 1, message: {new_doc: doc, total_likes: doc.total_likes}})  
//             } 
//             // 2) if user liked before, like--, total_likes--, remove user to user_liked array
//             else if (userLikedb4 && !userDislikedb4){    
//                 try{
//                     doc = await Post.findOneAndUpdate(filter,{   
//                             $inc:  { likes: -1, total_likes: -1},
//                             $pull: { user_liked: username }
//                         },{ new: true }                                                                                           
//                     )
//                 } catch(err){
//                     console.error("     Mongoose like error: "+err)
//                     return res.status(200).json({status: -1, message: "Mongoose like error: "+err})  
//                 }                
//                 return res.status(200).json({status: 1, message: {new_doc: doc, total_likes: doc.total_likes}})  
//             } 
//             // 3) if user disliked before, like++, dislike--, total_likes++, add user to user_liked array, remove user from user_disliked array
//             else if (userDislikedb4 && !userLikedb4){
//                 try{
//                     doc = await Post.findOneAndUpdate(filter,{   
//                             $inc:  { likes: 1, dislikes: -1, total_likes: 1},
//                             $push: { user_liked: username },
//                             $pull: { user_disliked: username }
//                         },{ new: true }                                                                                           
//                     )
//                 } catch(err){
//                     console.error("     Mongoose like error: "+err)
//                     return res.status(200).json({status: -1, message: "Mongoose like error: "+err})  
//                 }    
//                 return res.status(200).json({status: 1, message: {new_doc: doc, total_likes: doc.total_likes}})  
//             } 
//         }
//         else if (like_dislike === "dislike"){
//             // 1) if user didnt like or dislike before, dislikes++, total_likes--, add user to user_disliked array
//             if (!userLikedb4 && !userDislikedb4){
//                 try{
//                     doc = await Post.findOneAndUpdate(filter,{   
//                             $inc: { dislikes: 1, total_likes: -1},
//                             $push: { user_disliked: username },
//                         },
//                         { new: true }                                                                                           
//                     )
//                 } catch(err){
//                     console.error("     Mongoose dislike error: "+err)
//                     return res.status(200).json({status: -1, message: "Mongoose dislike error: "+err})  
//                 }
//                 return res.status(200).json({status: 1, message: {new_doc: doc, total_likes: doc.total_likes}})  
//             }
//             // 2) if user disliked before, dislike--, total_likes++, remove user to user_disliked array
//             else if (!userLikedb4 && userDislikedb4){    
//                 try{
//                     doc = await Post.findOneAndUpdate(filter,{   
//                             $inc:  { dislikes: -1, total_likes: 1},
//                             $pull: { user_disliked: username }
//                         },{ new: true }                                                                                           
//                     )
//                 } catch(err){
//                     console.error("     Mongoose dislike error: "+err)
//                     return res.status(200).json({status: -1, message: "Mongoose dislike error: "+err})  
//                 }                
//                 return res.status(200).json({status: 1, message: {new_doc: doc, total_likes: doc.total_likes}})  
//             } 
//             // 3) if user liked before,    like--, dislike++, total_likes--, remove user from user_liked array, add user to user_disliked array
//             else if (!userDislikedb4 && userLikedb4){
//                 try{
//                     doc = await Post.findOneAndUpdate(filter,{   
//                             $inc:  { dislikes: 1, likes: -1, total_likes: -1},
//                             $push: { user_disliked: username },
//                             $pull: { user_liked: username }
//                         },{ new: true }                                                                                           
//                     )
//                 } catch(err){
//                     console.error("     Mongoose dislike error: "+err)
//                     return res.status(200).json({status: -1, message: "Mongoose dislike error: "+err})  
//                 }    
//                 return res.status(200).json({status: 1, message: {new_doc: doc, total_likes: doc.total_likes}})  
//             } 
           
//         }
//         else{
//             return res.status(400).json({status: -1, message: "Wrong url or can't downvote past 0. URL: /like/ or /dislike/"})    
//         }
//     } catch(err){
//         return res.status(400).json({status: -1, message: "Failed to increase or decrease like: "+err})    
//     }
// }
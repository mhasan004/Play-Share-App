const User = require("../model/User")
const Post = require('../model/Post')
const jwt = require('jsonwebtoken')


exports.getAllPostsOfUsername = async (req,res,next) => {
    // if (username != req.username){
    //     console.log("wriongt er")
    // }
    // const recieved_token = req.header('auth-token')                                             
    // if(!recieved_token) return res.status(401).json({status: -1, message: "Access Denied!"})    

    // try{
    //     const user = await User.findOne({username: req.params.username})
    //     const verified = jwt.verity(recieved_token, )
    // }
    // catch{

    // }
    



    // console.log("fsdfsdfsd")
    // console.log(req.username)
    // const user_doc_id = (await User.find({username: req.params.username}))[0]._id             // Find the user's profile doc '_id' using email
    // const user_posts = await Post.find({author: user_doc_id})
    // res.json({user_posts})                                                          // 
}
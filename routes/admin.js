const router = require('express').Router()
const adminController = require('../controller/admin')

// Get all user profiles and all posts
router.get('/users', adminController.getAllUsers)    
router.get('/posts', adminController.getAllPosts)         

// Get specific user/post using '_id'
router.get('/user/:user_id', adminController.getUser)                               // Get specific user profile using '_id' 
router.get('/post/:post_id', adminController.getPost)                               // Get specific posts        using '_id' 

// SEARCHING: Get ALL of this user's posts using user's username or email
router.get('/user/:username/posts', adminController.getAllPostsOfUsername)          // Get ALL user's Posts usign username or email
router.get('/user/:email/posts',    adminController.getAllPostsOfEmail)    

// Edit User Profile


module.exports = router
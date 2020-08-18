const router = require('express').Router()
const adminController = require('../controller/admin')

// Get all user profiles and all posts
router.get('/users', adminController.getAllUsers)    
router.get('/posts', adminController.getAllPosts)         

// Get user by '_id' or username
router.get('/user/:user_id',  adminController.getUserById)                          // Get specific user profile using '_id' 
router.get('/user/:username', adminController.getUserByUsername)            
// Delete user by username
router.delete('/user/:username', adminController.deleteUser)                   


// Get/delete post by '_id'
router.get   ('/post/:post_id', adminController.getPost)                            // Get specific posts        using '_id' 
router.delete('/post/:post_id', adminController.deletePost)                   



// SEARCHING: Get ALL of this user's posts using user's username or email
router.get('/user/:username/posts', adminController.getAllPostsOfUsername)          // Get ALL user's Posts using username or email
router.get('/user/:email/posts',    adminController.getAllPostsOfEmail)    


// Delete All User's Posts
// router.delete('/user/:username/', adminController.deleteUserPostsALL)         





module.exports = router
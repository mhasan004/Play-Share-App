const router = require('express').Router()
const adminController = require('../controller/admin')

router.get('/users', adminController.getAllUsers)                                   // Get all user profiles and all posts
router.get('/posts', adminController.getAllPosts)         

router.get('/user/id/:user_id', adminController.getUserById)                        // Get specific user profile using '_id' 
router.get('/user/:username', adminController.getUserByUsername)                    // Get specific user profile using 'username' 
router.delete('/user/:username', adminController.deleteUser)                        // Delete user by 'username'  

router.get('/post/:post_id', adminController.getPost)                               // Get post by '_id'
router.delete('/post/:post_id', adminController.deletePost)                         // Delete post by '_id'  

router.get('/user/:username/posts', adminController.getAllPostsOfUsername)          // Get ALL user's Posts using 'username'
router.get('/user/:email/posts', adminController.getAllPostsOfEmail)                // Get ALL user's Posts using 'email'

// router.delete('/user/:username/', adminController.deleteUserPostsALL)            // Delete All User's Posts

// reset password

module.exports = router
const router = require('express').Router()
const adminController = require('../controller/admin')

router.get('/users', adminController.getUsers)    
router.get('/posts', adminController.getPosts)         

router.get('/user/:user_id', adminController.getUser)    


module.exports = router
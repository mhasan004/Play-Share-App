const express = require('express')
const router  = express.Router()
const registerController = require('../controller/auth')

router.post('/register', registerController.registerNewUser)

// router.post('/login', registerController)






module.exports = router
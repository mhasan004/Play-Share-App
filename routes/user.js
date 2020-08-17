const router = require('express').Router()
const userController = require('../controller/user')
const {verifyUser}  = require('../routes/verifyPermissions')                        // PRIVATE ROUTE MIDDLEWARE: Import the Private Routes Middleare      


router.get('/:username', verifyUser, userController.getAllPostsOfUsername)

module.exports = router
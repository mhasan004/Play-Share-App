const router = require('express').Router()
const {verifyUser} = require('../helpers/verifyPermissions')                                                 
const authController = require('../controller/auth')

router.post('/register', authController.registerNewUser)                // /api/v1/register   - Add a new user to the DB
router.post('/login', authController.login)                             // /api/v1/login      - Login user
router.get('/logout', verifyUser, authController.logout)                // /api/v1/logout     - Logout user. deletes RT from redis and db.
router.get('/refresh', authController.refresh)                          // /api/v1/refresh    - refresh jwt, make new new session

module.exports = router

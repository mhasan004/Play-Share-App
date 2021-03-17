const router = require('express').Router()
const authController = require('../controller/auth')
const {accountRateLimiter, passwordRateLimiter} = require('../config')

router.post('/register', accountRateLimiter, authController.registerNewUser)        // /api/v1/register   - Add a new user to the DB
router.post('/login', authController.login)                                         // /api/v1/login      - Login user
router.get('/logout', authController.logout)                                        // /api/v1/logout     - Logout user. deletes RT from redis and db.
router.get('/refresh', authController.refresh)                                      // /api/v1/refresh    - refresh jwt, make new new session
router.get('/passwordReset', passwordRateLimiter, authController.passwordReset)     // /api/v1/passwordReset - reset password

module.exports = router

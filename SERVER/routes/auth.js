const router = require('express').Router()
const authController = require('../controller/auth')

router.post('/register', authController.registerNewUser)                // /api/register   - Add a new user to the DB
router.post('/login',    authController.login)                          // /api/login      - Login user
router.get('/refresh',  authController.refresh)                        // /api/refresh    - refresh jwt, make new new session

module.exports = router
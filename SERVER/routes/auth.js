const router = require('express').Router()
const registerController = require('../controller/auth')

router.post('/register', registerController.registerNewUser)            // /api/user/register   - Add a new user to the DB
router.post('/login',    registerController.login)                      // /api/user/login      - Login user

module.exports = router
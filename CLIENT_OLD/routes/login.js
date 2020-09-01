const router = require('express').Router()
const authController = require('../controllers/login')

router.get('/register', authController.getLogin) 
router.get('/login',    authController.getLogin)  
router.get('/',         authController.getLogin)     

router.post('/register', authController.postRegister) 
router.post('/login',    authController.postLogin)  
   
module.exports = router
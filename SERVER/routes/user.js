const multer = require('multer')                                                    //! a) multer to parse multipart forms, to parse file data
const upload = multer()  
const router = require('express').Router()
const userController = require('../controller/user')


router.get('/',  userController.getAllPosts)

router.post('/post', upload.single("file"), userController.makePost)
router.get   ('/post', userController.getAPost)
router.patch ('/post', userController.editAPost)
router.delete('/post', userController.deleteAPost)    

router.get('/feed', userController.getFeed)                                         // get posts sorted by latest upload                           
router.patch('/feed/like', userController.likeFeedPost)                                  // LIKE POST: 
router.patch('/feed/dislike', userController.dislikeFeedPost)                                  // DISLIKE POST: 

module.exports = router
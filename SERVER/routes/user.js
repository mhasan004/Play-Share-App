const router = require('express').Router()
const userController = require('../controller/user')

router.get('/',  userController.getAllPosts)

router.post('/post', userController.makePost)
router.get   ('/post', userController.getAPost)
router.patch ('/post', userController.editAPost)
router.delete('/post', userController.deleteAPost)    

router.get('/feed', userController.getFeed)                                         // get posts sorted by latest upload                           
router.patch('/feed', userController.likeFeedPost)          // LIKE POST: pass "like" or "dislike" into url with poost id to inc,dec liek count

module.exports = router
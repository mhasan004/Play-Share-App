const router = require('express').Router()
const userController = require('../controller/user')


router.get('/',  userController.getAllPosts)
router.post('/post', userController.makePost)

router.get('/feed', userController.getFeed)                                         // get posts of all users                               
router.patch('/feed/:like_dislike/:post_id/', userController.likeFeedPost)          // LIKE POST: pass "like" or "dislike" into url with poost id to inc,dec liek count

router.get   ('/:post_id', userController.getAPost)
router.patch ('/:post_id', userController.editAPost)
router.delete('/:post_id', userController.deleteAPost)          

module.exports = router
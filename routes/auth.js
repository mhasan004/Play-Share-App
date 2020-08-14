const express = require('express')
const router = express.Router()

router.post('/register', (req,res,next) => {
    res.send("dsfds")
    console.log('sdff')
})

module.exports = router
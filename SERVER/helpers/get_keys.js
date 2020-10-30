// used to serve keys to client so client dont need to svae keys
const router = require('express').Router()

router.get('/clientKey',  (req,res,next) =>{
    try{res.status(200).json({status:1, keyVal: process.env.CLIENT_ENCRYPTION_KEY})}
    catch{res.status(400).json({status:-1, message: `Key '${key}' not found in .env`})}
})

router.get('/serverKey',  (req,res,next) =>{
    try{res.status(200).json({status:1, keyVal: process.env.SERVER_ENCRYPTION_KEY})}
    catch{res.status(400).json({status:-1, message: `Key '${key}' not found in .env`})}
})

module.exports = router
const User = require('../model/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const {registerValidation, loginValidation} = require('../validation')                                                  // 0) Import the Joi Validation functions

exports.registerNewUser = async (req,res,next) =>                                                                       
{
    // 1a) VALIDATE the POST request: See if it adhears to the rules of the schema
    const {error} = registerValidation(req.body)                                       
    if(error){ return res.status(400).json({status:-1, message: error.details[0].message}) }

    // 1b) VALIDATE the POST request: See if user and email already exists in DB
    const user_exists  = await User.findOne({user: req.body.user})                      
    const email_exists = await User.findOne({email: req.body.email})
    if (user_exists)  return res.status(400).json( {status: -1, message: "This User is Already Registered!" } ) 
    if (email_exists) return res.status(400).json( {status: -1, message: "This Email is Already Registered!"} ) 
    
    // 1c) HASH Password
    const salt = await bcrypt.genSalt(10)
    const hash_password = await bcrypt.hash(req.body.password, salt)

    // 2) CAN NOW ADD USER: Populate the Mongoose Schema to push to the Post collection in the DB
    const new_user = new User({                                                         
        user: req.body.user,
        email: req.body.email,
        password: hash_password,
    })
               
    // 3) Add the user to the DB
    try{                                                                                
        const added_user = await new_user.save()
        res.json({status: 1, added_user_id: added_user._id})
    }
    catch(err){
        res.status(400).json({status: -1, message:"Error: " + err})
    }
}   


exports.login = async (req,res,next) => {       
    // 1a) VALIDATE the POST request: See if it adhears to the rules of the schema
    const {error} = loginValidation(req.body)                                       
    if(error){ return res.status(400).json({status:-1, message: error.details[0].message}) }

    // 1b) VALIDATE the POST request: See if user and email already exists in DB
    const user = await User.findOne({email: req.body.email})                                                        // Find the user doc in DB with this email
    if (!user) return res.status(400).json( {status: -1, message: "Invalid username or password"} ) 

    // 1c) CHECK PASSWORD
    try{
        const valid_pass = await bcrypt.compare(req.body.password, user.password)                                   // CHECK PASSWORD: Compare if the passed in pas and the hashed db pass are the same
        if(!valid_pass){ return res.status(400).json( {status: -1, message: "Invalid username or password"} ) }
    }
    catch(err){
        return res.status(400).json( {status: -1, message:"Error: " + err} )
    }

    // 2) CREATE + ASSIGN TOKEN So User Can Access Private Routes
    let token = null
    if (user.email === process.env.ADMIN_EMAIL){
        token = jwt.sign({id: process.env.DB_ADMIN_ID}, process.env.ADMIN_SECRET_TOKEN)                             // Admin Token
    }
    else{
        token = jwt.sign({id: user._id}, process.env.USER_SECRET_TOKEN)                                             // Make a new JWT Tocken. Pass in user's db _id and ur made up token    
    }
    res.header('auth-token', token)                                                                                 // Send the token with the response
    res.json( {status: 1, message: "Logged In! "+ token} ) 
}
   
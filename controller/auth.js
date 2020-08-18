const User = require('../model/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const {registerValidation, loginValidation} = require('../model/ValidationSchema')                                                  // Import the Joi Validation functions
const CryptoJS = require("crypto-js");

exports.registerNewUser = async (req,res,next) =>                                                                       
{
    // 1a) VALIDATE the POST request: See if it adhears to the rules of the schema
    const {error} = registerValidation(req.body)                                       
    if(error){ return res.status(400).json({status:-1, message: error.details[0].message}) }

    // 1b) VALIDATE the POST request: See if user and email already exists in DB
    const user_exists  = await User.findOne({user: req.body.username})                      
    const email_exists = await User.findOne({email: req.body.email})
    if (user_exists || email_exists)   return res.status(400).json( {status: -1, message: "This Username or Email Address is Already Registered!" } ) 
    
    // 1c) Decrypt Password and then store the HASHed Password
    const bytes  = CryptoJS.AES.decrypt(req.body.password,  process.env.ENCRYPTION_KEY);
    const password = bytes.toString(CryptoJS.enc.Utf8);  
    const salt = await bcrypt.genSalt(10)
    const hashed_password = await bcrypt.hash(password, salt)

    // 2) CAN NOW ADD USER: Populate the Mongoose Schema to push to the Post collection in the DB
    const new_user = new User({                                                         
        username: req.body.username,
        email: req.body.email,
        password: hashed_password,
    })
               
    // 3) Add the user to the DB
    try{                                                                                
        const added_user = await new_user.save()
        res.status(100).json({status: 1, added_user_id: added_user._id})
    }
    catch(err){
        res.status(400).json({status: -1, message:"Error: " + err})
    } 
}   


exports.login = async (req,res,next) => 
{    
    // 1a) VALIDATE the POST request: See if it adhears to the rules of the schema
    const {error} = loginValidation(req.body)                                       
    if(error){ return res.status(400).json({status:-1, message: error.details[0].message}) }

    // 1b) VALIDATE the POST request: See if user and email already exists in DB
    const user = await User.findOne({email: req.body.email})                                                                            // Find the user doc in DB with this email
    if (!user) return res.status(400).json( {status: -1, message: "Invalid username or password"} ) 

    // 1c) DECRYPT & CHECK PASSWORD: retrieved password is encrypted with PASSWORD_ENCRYPTION_KEY. Decrypt and check hash on DB
    const bytes  = CryptoJS.AES.decrypt(req.body.password,  process.env.ENCRYPTION_KEY);
    const password = bytes.toString(CryptoJS.enc.Utf8);   
    try{
        const valid_pass = await bcrypt.compare(password, user.password)                                                                // CHECK PASSWORD: Compare if the passed in pas and the hashed db pass are the same
        if(!valid_pass){ return res.status(400).json( {status: -1, message: "Invalid username or password"} ) }
    }
    catch(err){
        return res.status(400).json( {status: -1, message:"Error: " + err} )
    }

    // 2) CREATE + ASSIGN TOKEN So User Can Access Private Routes (admin secret is set in .env, user secret is uniquely generated)
    let token = null
    const unique_user_secret_key = await bcrypt.hash(user._id+user.email+user.username+user.password, process.env.USER_SECRET_KEY)      // Each user need to have a different JWT so one user cant go to anothe ruser's private route
    if (user.email === process.env.ADMIN_EMAIL)
        token = jwt.sign({id: user._id+user.email+user.username+user.password}, process.env.ADMIN_SECRET_KEY, {expiresIn: '1h'})        // Admin Token
    else{
        token = jwt.sign({id: user._id+user.email+user.username+user.password}, unique_user_secret_key, {expiresIn: '1h'})              // Make a new JWT Token. Pass in user's db _id and ur made up token    
    }

    // 3) Encrypt actual token of a user and store in DB so one user cant peek at another user's page
    if (user.username != "admin"){
        const salt = await bcrypt.genSalt(10)
        const hashed_secret_key = await bcrypt.hash(unique_user_secret_key, salt)
        try{ await User.updateOne({ _id: user._id }, {secret_key: hashed_secret_key})}                                                  // Save the hashed unique user secret key in the user's profile so we can verify the user for the route
        catch{ return res.status(400).json({status:-1, message: "Failed to add hashed user token to DB so login failed"})}
    }
    res.header('auth-token', token)                                                                                                     // Send the token with the response
    res.status(200).json( {status: 1, message: "Logged In! Set header with token to access private routes!"} ) 
}
   
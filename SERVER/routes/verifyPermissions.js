const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const CryptoJS = require("crypto-js");
const User = require('../model/User')

exports.verifyApp = (req,res,next) => {                                                                                     // MiddleWare: App Register/login Access
    const recieved_access_key = req.header('auth-app')
    if(!recieved_access_key) 
        return res.status(401).json({status: -1, message: "Access Denied! No auth-app Header"})   
    const bytes = CryptoJS.AES.decrypt(recieved_access_key, process.env.CLIENT_ENCRYPTION_KEY);                             // DECRYPT KEY
    const recieved_token = bytes.toString(CryptoJS.enc.Utf8);
    if (recieved_token != process.env.APP_AUTH_KEY) {
        console.log("not verified app")
        return res.status(401).json({status: -1, message: "This app does not have the correct auth-app header"})   
    }
    next()
}

exports.verifyAdmin = async (req,res,next) => {                                                                             // MiddleWare: Private Admin Route
    const userType = req.baseUrl.split('/')[2]                                                                              // Get the user type: admin or user
    const recieved_encypted_token = req.header('auth-token')                                                                // 1) Get the token from the header  of the request
    if(!recieved_encypted_token) 
        return res.status(401).json({status: -1, message: "Access Denied! No auth-token Header"})   
    
    const bytes = CryptoJS.AES.decrypt(recieved_encypted_token, process.env.CLIENT_ENCRYPTION_KEY);                         // DECRYPT TOKEN
    const recieved_token = bytes.toString(CryptoJS.enc.Utf8);
    
    const unique_user_secret_key = await bcrypt.hash(user._id+user.email+user.username+user.password, process.env.USER_SECRET_KEY)      
    try{
        let verified = null
        if (userType === "admin") 
            verified = jwt.verify(recieved_token, process.env.ADMIN_SECRET_KEY+unique_user_secret_key)                      // 2) (returns _id doc of verified user in DB) Verify the user by checkign to see if the tokens in header with otu secret token
        else{throw err}
        req.user = verified                                                                                                 // 3) req.user = JWT object
        next()
    }
    catch(err){
        return res.status(400).json({status: -1, message: "Invalid Token Error: " +err})                                    // If wrong JWT token, will throw an error
    }
}

exports.verifyUser = async (req,res,next) => {                                                                              // MiddleWare: Private Unique User Route
    const bytes = CryptoJS.AES.decrypt(req.params.username, process.env.CLIENT_ENCRYPTION_KEY);                             // DECRYPT USER
    const username = bytes.toString(CryptoJS.enc.Utf8);
    const user = await User.findOne({username: username})

    const recieved_encypted_token = req.header('auth-token') 
    if(!recieved_encypted_token || !user)  
        return res.status(401).json({status: -1, message: "Access Denied! Maybe Wrong auth-token Header?"}) 
    const bytes  = CryptoJS.AES.decrypt(recieved_encypted_token, process.env.CLIENT_ENCRYPTION_KEY);                        // DECRYPT TOKEN
    const recieved_token = bytes.toString(CryptoJS.enc.Utf8);

    // VERIFY the user by checking if correct JWT
    let verified = null
    try{
        try{
            verified = jwt.verify(recieved_token, process.env.ADMIN_SECRET_KEY)                                             // See if if the admin is trying to access this router
        }                       
        catch(err){
            try{
                // Recreate what the User's Secret Key hash should be and verify. Then calculate the JWT hash and verify:
                const user_secret_key = await bcrypt.hash(user._id+user.email+user.username+user.password, process.env.USER_SECRET_KEY) // salted hashed secret key is stored in db. can create the prehash code using user data + .env key. So if we cant calcumlate the hash stored in db with this, then wrong user               
                const verify_user_secret_key = await bcrypt.compare(user_secret_key, user.secret_key)
                if (!verify_user_secret_key)
                    return res.status(401).json({status: -1, message: "Access Denied! Invalid Secret Token"}) 
                verified = jwt.verify(recieved_token, user_secret_key)                                                      // See if a right user is trying to access this router
            }            
            catch{throw err}                                                                                                // If neither the admin or the right user, throw error        
        }
        req.user = verified                                                                                                 // req.user = JWT object
        next()
    }
    catch(err){
        return res.status(400).json({status: -1, message: "Access Denied! Invalid Token: " + err}) 
    }
}
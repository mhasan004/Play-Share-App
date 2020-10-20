const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const CryptoJS = require("crypto-js");
const User = require('../model/User')
const {decryptRequestItems} = require("../controller/auth")                                                                 // Will use this function to decrypt request body

exports.verifyApp = (req,res,next) => {                                                                                     // MiddleWare: App Register/login Access
    const recieved_access_key = req.headers['auth-app']
    // if(!recieved_access_key) 
    //     return res.status(401).json({status: -1, message: "Access Denied! No auth-app Header!"})
    // const {decryptedItemArray, errObj} = decryptRequestItems(process.env.CLIENT_ENCRYPTION_KEY, [recieved_access_key])      // Decrypt auth-app header
    // if (errObj != null){
    //     console.log("bye")
    //     return res.status(400).json({status: -1, message: "Couldn't decrypt request data! Error: "+errObj.message, err_location: {err_output_location: errObj.err_output_location, err_location: "verifyPermisisons.js -> verifyApp Middleware "}})
    // }
    // if (decryptedItemArray[0] != process.env.APP_AUTH_KEY) {                                                                // see in the decrypted auth-app header is the one on file, if so, pass
    if (recieved_access_key != process.env.APP_AUTH_KEY) {                                                                // see in the decrypted auth-app header is the one on file, if so, pass
        console.log("not verified app")
        return res.status(401).json({status: -1, message: "Access Denied! This app does not have the correct auth-app header"})   
    }
    console.log("**Note** Disabling verifyApp middle ware temporarily")
    next()
}

exports.verifyUser = async (req,res,next) => {                                                                              // MiddleWare: Private Unique User Route
    // 1a) DECRYPT ALL FILEDS FROM REQUEST (username, password) 
    // const {decryptedItemArray, errObj} = await decryptRequestItems(               //    const decryptedItemArray = decryptRequestItems(process.env.CLIENT_ENCRYPTION_KEY, [req.body.username, req.body.password])                                   
    //     process.env.CLIENT_ENCRYPTION_KEY, 
    //     [req.body.username, req.body.password]
    // )     
    // if (errObj != null){
    //     console.log("failed to decrypt req!")
    //     return res.status(400).json({status: -1, message: "Couldn't decrypt request data! Error: "+errObj.message, err_location: {err_output_location: errObj.err_output_location, err_location: "auth.js -> registerNewUser Middleware "}})
    // }
    // const username = decryptedItemArray[0]
    // const password = decryptedItemArray[1]
    // req.body.username = username
    // req.body.password = password
   
    const user = await User.findOne({username: req.originalUrl.split('/')[3]})
    const recieved_encypted_token = req.headers['auth-token'] 
    // const auth_header = req.headers['authorization']
    // const recieved_encypted_token = auth_header && auth_header.split(' ')[1]

    if(!recieved_encypted_token || !user)  
        return res.status(401).json({status: -1, message: "Access Denied! Maybe Wrong auth-token Header or bad url? Make user username is in /api/user/:username"}) 
    // bytes  = CryptoJS.AES.decrypt(recieved_encypted_token, process.env.CLIENT_ENCRYPTION_KEY);                        // DECRYPT TOKEN
    const recieved_token = recieved_encypted_token// bytes.toString(CryptoJS.enc.Utf8);
    const encryption_input = (user._id+user.username).toString()
    // VERIFY the user by checking if correct JWT - Recreate what the User's Secret Key hash should be and verify. Then calculate the JWT hash and verify:
    let verified = null
    const bytes_token = CryptoJS.AES.decrypt(encryption_input, process.env.USER_SECRET_KEY);                             // DECRYPT USER
    const user_secret_key = bytes_token.toString(CryptoJS.enc.Utf8);    // salted hashed secret key is stored in db. can create the prehash code using user data + .env key. So if we cant calcumlate the hash stored in db with this, then wrong user               
    try{
        try{
            verified = jwt.verify(recieved_encypted_token, (user_secret_key+process.env.ADMIN_SECRET_KEY).toString())                                             // See if if the admin is trying to access this router
        }                       
        catch(err){
            try{
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


/* Admin In DEV
exports.verifyAdmin = async (req,res,next) => {                                                                             // MiddleWare: Private Admin Route
    const userType = req.baseUrl.split('/')[2]                                                                              // Get the user type: admin or user
    const user = await User.findOne({username: "admin"})
    const encryption_input = (user._id+user.email+user.username+user.password).toString()

    const recieved_encypted_token = req.header('auth-token')                                                                // 1) Get the token from the header  of the request
    if(!recieved_encypted_token) 
        return res.status(401).json({status: -1, message: "Access Denied! No auth-token Header"})   
    const bytes = CryptoJS.AES.decrypt(recieved_encypted_token, process.env.CLIENT_ENCRYPTION_KEY);                         // DECRYPT TOKEN
    const recieved_token = bytes.toString(CryptoJS.enc.Utf8);
    
    const bytes_token = CryptoJS.AES.decrypt(encryption_input, process.env.USER_SECRET_KEY);                             // DECRYPT USER
    const user_secret_key = bytes_token.toString(CryptoJS.enc.Utf8);    // salted hashed secret key is stored in db. can create the prehash code using user data + .env key. So if we cant calcumlate the hash stored in db with this, then wrong user               

    const unique_user_secret_key = await bcrypt.hash(encryption_input, process.env.USER_SECRET_KEY)      
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
*/
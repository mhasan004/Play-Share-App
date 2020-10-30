const jwt = require('jsonwebtoken')
const CryptoJS = require("crypto-js");
const User = require('../model/User')

exports.verifyApp = (req,res,next) =>                                                                                               // MiddleWare: App Register/login Access
{                                                                                             
    if (req.headers['auth-app'] != process.env.APP_AUTH_KEY) {                                                                      // see in the decrypted auth-app header is the one on file, if so, pass
        console.log("not verified app")
        return res.status(401).json({status: -1, message: "Access Denied! This app does not have the correct auth-app header"})   
    }
    console.log("**Note** Disabling verifyApp middleware")
    next()
}

exports.verifyUser = async (req,res,next) =>                                                                                        // MiddleWare: Private Unique User Route
{                                                                              
    const user = await User.findOne({username: req.originalUrl.split('/')[3]})
    const recieved_token = req.headers['auth-token'] 
    // const auth_header = req.headers['authorization']
    // const recieved_token = auth_header && auth_header.split(' ')[1]

    if(!recieved_token || !user )//|| user.login_status === 0)  
        return res.status(401).json({status: -1, message: `Access Denied! Wrong auth-token Header, user not found, or user not logged in!`}) 
          
    // VERIFY the user by checking if correct JWT - Recreate what the User's Secret Key hash should be and verify. Then calculate the JWT hash and verify:
    let verified = null
    const JWT_admin_key = CryptoJS.AES.encrypt(process.env.USER_SECRET_KEY, process.env.ADMIN_SECRET_KEY).toString();               // encrypt USER_SECRET_KEY with ADMIN_SECRET_KEY 
    try{
        try{
            verified = jwt.verify(recieved_token, process.env.USER_SECRET_KEY)                                                      // See if a right user is trying to access this router
        }                       
        catch(err){
            try{
                verified = jwt.verify(recieved_token, JWT_admin_key)                                                                // See if if the admin is trying to access this router
                return res.status(401).json({status: -1, message: "Access Denied! Invalid Secret Token"}) 
            }            
            catch{throw err}                                                                                                        // If neither the admin or the right user, throw error        
        }
        req.user = verified                                                                                                         // req.user = JWT object
        if (verified.username != user.username)
            return res.status(401).json({status: -1, message: "Access Denied! User stored in JWT doesn't have access to this route!!"})  
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

    const recieved_token = req.header('auth-token')                                                                // 1) Get the token from the header  of the request
    if(!recieved_token) 
        return res.status(401).json({status: -1, message: "Access Denied! No auth-token Header"})   
    const bytes = CryptoJS.AES.decrypt(recieved_token, process.env.CLIENT_ENCRYPTION_KEY);                         // DECRYPT TOKEN
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

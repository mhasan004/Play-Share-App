const jwt = require('jsonwebtoken')
const CryptoJS = require("crypto-js")
const User = require('../model/User')
const bcrypt = require('bcryptjs')

function verifyToken(token, type = "access", role = "user"){                                                                                                // Function to verify user access tokens, admin access tokens, and refresh tokens 
    if (type === "refresh"){
        try{ 
            return decryptPayload( jwt.verify(token, process.env.REFRESH_TOKEN_SECRET) )                                                                    // Verify refresh token  
        } catch(err){ throw err }
    }
    else if (role === "admin"){
        try{ 
            return decryptPayload( jwt.verify(token, process.env.ADMIN_SECRET_KEY) )                                                                        // Try to verify token if its an admin   
        } catch(err){ throw err }
    }
    else{
        try{ 
            return decryptPayload( jwt.verify(token, process.env.USER_SECRET_KEY) )                                                                         // Try to verify token if its a user              
        } catch(err){ throw err }
    }
}

async function tokenNameVerified(res, passedUsername, accessTokenVerified, refreshTokenVerified){
    if (accessTokenVerified.username !== passedUsername){                                                                                                   // 1) Access Token Payload name Check. If payload name of the access tokens != username --> then somethings fishy!
        console.log("     Fishy Behavior Detected - Access Token! (1) - Deleting RF from DB")
        res.clearCookie("refreshToken")
        res.clearCookie("accessToken")
        await deleteToken("RT-"+accessTokenVerified.username+'-'+accessTokenVerified.id)                                                            
        res.status(401).json({status: -3, message: "Access Denied! Fishy Behavior! Token Mismatch!"}).end() 
        return false
    }
    if (passedUsername === process.env.ADMIN_USERNAME){                                                                                                     // 2) RF Token Payload Name Check (for Admins only)
        if (refreshTokenVerified.username !== process.env.ADMIN_USERNAME || 
            refreshTokenVerified.username !== accessTokenVerified.username  || 
            refreshTokenVerified.id !== accessTokenVerified.id
        ){
            console.log("     Fishy Behavior Detected - RF Token! (2) - Deleting RF from DB")
            res.clearCookie("refreshToken")
            res.clearCookie("accessToken")
            await deleteToken("RT-"+refreshTokenVerified.username+'-'+refreshTokenVerified.id)                                                                                          
            res.status(401).json({status: -3, message: "Access Denied! Fishy Behavior! Token Mismatch!"}).end()  
            return false
        }
    }
    return true
}

function encryptPayload(JWTpayload){
    let payload = {}
    if (JWTpayload.username)
        payload.username = CryptoJS.AES.encrypt(JWTpayload.username, process.env.PAYLOAD_ENCRYPTION_KEY).toString()
    if (JWTpayload.id)
        payload.id = CryptoJS.AES.encrypt(JWTpayload.id.toString(), process.env.PAYLOAD_ENCRYPTION_KEY).toString()
    return payload;     
}    

function decryptPayload(JWTpayload){ 
    let payload = {}
    if (JWTpayload.username){
        let bytes = CryptoJS.AES.decrypt(JWTpayload.username, process.env.PAYLOAD_ENCRYPTION_KEY)    
        payload.username = bytes.toString(CryptoJS.enc.Utf8)   
    }
    if (JWTpayload.id){
        let bytes = CryptoJS.AES.decrypt(JWTpayload.id, process.env.PAYLOAD_ENCRYPTION_KEY)    
        payload.id = parseInt(bytes.toString(CryptoJS.enc.Utf8))
    }
    return payload                                                          
}    

async function doesUsernameEmailExist(res, username, email){                                                                                                // Fucntion that checks if username or email exists in database - used for registration. Returns true if it does, response will be sent out. false if there is no username/email                                                            
    let user_exists, email_exists                                                                                                                                        
    try{
        [user_exists, email_exists] = await Promise.all([
            User.findOne({username: username}),
            User.findOne({email: email})
        ])
    } catch(err){
        res.status(400).json({status: -1, message: "Database Query Error: couldn't search database! Err: " + err }) 
        return true
    }
    if (user_exists || email_exists){
        res.status(400).json({status: -1, message: "This Username or Email Address is Already Registered!" }) 
        return true
    }
    return false
}

async function comparePasswords(res, password, dbPassword){                                                                                                 // Function to check passwords - Compare password that was passed to the one in the db. Returns true if successfull or false if not successfull.
    try{                                                                                                                                                                                                                                                                        
        if(!await bcrypt.compare(password, dbPassword)){                                                                                               
            res.status(401).json( {status: -1, message: "Invalid username or password!"} )
            return false 
        } 
    } catch(err){
        console.log("Bycrypt Error - Failed to compare passwords! Error: " + err)
        res.status(400).json({status: -1, message:"Bycrypt Error - Failed to compare passwords! Error: " + err})
        return false
    }
    return true
}


module.exports = {
    doesUsernameEmailExist,
    comparePasswords,
    encryptPayload,
    decryptPayload,
    verifyToken,
    tokenNameVerified
}
  
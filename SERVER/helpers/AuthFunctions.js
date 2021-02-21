const User = require('../model/User')
const bcrypt = require('bcryptjs')
const {deleteToken}= require("../helpers/TokenFunctions")

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
    tokenNameVerified
}
  
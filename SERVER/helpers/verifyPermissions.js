const jwt = require('jsonwebtoken')
const CryptoJS = require("crypto-js");
const User = require('../model/User')
const APP_EXPORTS = require('../app')

function verifyToken(token, type = "access", role = "user"){
    if (type === "refresh"){
        try{
            return jwt.verify(token, process.env.REFRESH_TOKEN_SECRET)                                                                          // verify refresh token 
        }                       
        catch(err){ throw err }
    }
    else if (role === "user"){
        try{
            return jwt.verify(token, process.env.USER_SECRET_KEY)                                                                               // try to vberify jwt if its a user
        }                       
        catch(err){ throw err }
    }
    else if (role === "admin"){
        try{
            return jwt.verify(token, process.env.ADMIN_SECRET_KEY)                                                                              // try to vberify jwt if its an admin
        }                       
        catch(err){ throw err }
    }
}

exports.verifyUser = async (req,res,next) =>                                                                                                    // MiddleWare: Private Unique User Route. Passed user object, role, username to request so the next middleware can use it
{           
    // 1) Get username and access token from header and verify if they exist. Get RT from cookie
    let role
    let username_in = req.headers['username']                                                                                                          
    if (!username_in)
        return res.status(400).json({status: -1, message: "Not username header! Who is the user?"}) 
    if (username_in == process.env.ADMIN_USERNAME)
        role = "admin"
    else        
        role = "user"
    const recieved_access_token = req.headers['auth-token']                                                                                     // AUTHORIZATION HEADER: const auth_header = req.headers['authorization']; const recieved_access_token = auth_header && auth_header.split(' ')[1]
    const recieved_RT = req.signedCookies.refreshToken;
    if(!recieved_access_token || !recieved_RT) 
        return res.status(401).json({status: -1, message: "Access Denied! No auth-token Header or RF Cookie!"}) 
        
    // 2) (a) Verify if access is valid. If valid, move on to (b). If invalid, check rf and tell client they need to refresh tokens (acess invalid, rf valid). (b) Check if the payload of access matches the username. (c) for admin usernames, check also if rf payload match. 
    let verified_rt, verified_access
    try{
        verified_access = verifyToken(recieved_access_token, "access", role)                                                                    // 2.a.1) Verify Access Token -> Valid: 1. Invalid: check validity of refresh token
    }
    catch(err){
        try{
            verified_rt = verifyToken(recieved_RT, "refresh")                                                                                   // 2.a.2) Verify Refresh Token Token -> Valid: -2; access token is invalid but refresh token is valid, need to refresh tokens from /refresh. Invalid: -1; both tokens are invalid so need to login
        }
        catch(err2){
            return res.status(401).json({status: -1, message: "Access Denied! Incorrect Tokens! Error: "+err2}).end()
        }
        return res.status(401).json({status: -2, message: "Access Denied! Incorrect Access Token! Send request to /refresh. Error: "+err, action_needed: "refresh"}).end() 
    }
    if (verified_access.username !== username_in)                                                                                               // 2.b) Access Token Payload name Check. If payload name of the access tokens != username --> then somethings fishy!
        return res.status(401).json({status: -1, message: "Access Denied! Invalid User! Token Mismatch!"}).end() 
    if (username_in === process.env.ADMIN_USERNAME){                                                                                            // 2.c) RF Token Payload Name Check (for Admins only)
        if (verified_rt.username !== process.env.ADMIN_USERNAME)
            return res.status(401).json({status: -1, message: "Access Denied! Not Admin RT!"}).end()  
        req.role = "admin"
    }   
    else
        req.role = "user"

    // 3) See if username exists in db. If so, can move on to the next middleware, setting role, username, and user object fileds of the request for the next middleware to use.
    try{                                                                                                                                        
        const user_obj = await User.findOne({username: username_in})
        req.user = user_obj
    }    
    catch{
        return res.status(401).json({status: -1, message: "User Doesn't Exist!"}).end() 
    }    
    req.username = verified_access.username       
    req.tokenId = verified_access.id                                                         
    next()
}


exports.verifyAdmin = async (req,res,next) =>                                                                                                    // MiddleWare: Admin Route. See if req.role is admin or not
{
    if (req.role !== "admin")
        return res.status(401).json({status: -1, message: "Access Denied! Not Admin!"}).end() 
    next()
}
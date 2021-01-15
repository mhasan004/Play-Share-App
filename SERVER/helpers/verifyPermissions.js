const jwt = require('jsonwebtoken')
const CryptoJS = require("crypto-js");
const User = require('../model/User')
const {redis_client} = require('./redisDB')
const {REDIS_USER_CACHE_EXP} = require("../config")                                         


// Function to verify user access tokens, admin access tokens, and refresh tokens 
function verifyToken(token, type = "access", role = "user"){
    if (type === "refresh"){
        try{ return jwt.verify(token, process.env.REFRESH_TOKEN_SECRET) }                                                                           // Verify refresh token                     
        catch(err){ throw err }
    }
    else if (role === "user"){
        try{ return jwt.verify(token, process.env.USER_SECRET_KEY) }                                                                                // Try to verify token if its a user              
        catch(err){ throw err }
    }
    else if (role === "admin"){
        try{ return jwt.verify(token, process.env.ADMIN_SECRET_KEY) }                                                                               // Try to verify token if its an admin                  
        catch(err){ throw err }
    }
}

// Middleware authenticates the user and adds to req  object: (1) user: user object from db, (2) isUserCached = if user is cached in redis or not (3) username, (4) tokenId: random toklenid to find refreshtoken with username-tokenId,
exports.verifyUser = async (req,res,next) =>                                                                                                        // MiddleWare: Private Unique User Route. Passed user object, role, username to request so the next middleware can use it
{           
    // 1) Get username and access token from header and verify if they exist. Get RT from cookie
    let username_in = req.headers['username']                                                                                                          
    if (!username_in)
        return res.status(400).json({status: -1, message: "No username header! Who is the user?"}) 
    if (username_in === process.env.ADMIN_USERNAME)
        req.role = "admin"
    else        
        req.role = "user"
    const recieved_access_token = req.signedCookies.accessToken;                                                                                    // AUTHORIZATION HEADER: const auth_header = req.headers['authorization']; const recieved_access_token = auth_header && auth_header.split(' ')[1]
    const recieved_RF = req.signedCookies.refreshToken;
    if(!recieved_RF) 
        return res.status(401).json({status: -1, message: "Access Denied! No refresh token cookie!"}) 
        
    // 2) (a) Verify if access token is valid. If valid, move on to b. If invalid, check rf and tell client they need to refresh tokens (acess invalid, rf valid). (b) Check if the payload of access token matches the username in header. (c) for admin usernames, check also if rf payload match. 
    let verified_access, verified_rf
    try{
        verified_access = verifyToken(recieved_access_token, "access", req.role)                                                                    // 2.a.1) Verify Access Token -> Valid: 1. Invalid: check validity of refresh token
        if (username_in === process.env.ADMIN_USERNAME){
            try{
                verified_rf = verifyToken(recieved_RF, "refresh") 
            }
            catch(err){
                return res.status(401).json({status: -1, message: "Access Denied! Invalid Admin RF! Error: "+err}).end()
            }
        }
    }
    catch(err){
        try{
            verified_rf = verifyToken(recieved_RF, "refresh")                                                                                       // 2.a.2) Verify Refresh Token Token -> Valid: -2; access token is invalid but refresh token is valid, need to refresh tokens from /refresh. Invalid: -1; both tokens are invalid so need to login
        }
        catch(err2){
            return res.status(401).json({status: -1, message: "Access Denied! Invalid Tokens! Error: "+err2}).end()
        }
        return res.status(401).json({status: -2, message: "Access Denied! Invalid Access Token! Send request to /auth/refresh. Error: "+err}).end() 
    }
    if (verified_access.username !== username_in){                                                                                                  // 2.b) Access Token Payload name Check. If payload name of the access tokens != username --> then somethings fishy!
        console.log("Fishy Behavior Detected - Access Token!")
        res.clearCookie("refreshToken")
        await redis_client.del("RT-"+verified_access.username+'-'+verified_access.id )                                                            
        return res.status(401).json({status: -3, message: "Access Denied! Fishy Behavior! Token Mismatch!"}).end() 
    }
    if (username_in === process.env.ADMIN_USERNAME){                                                                                                // 2.c) RF Token Payload Name Check (for Admins only)
        if (verified_rf.username !== process.env.ADMIN_USERNAME){
            console.log("Fishy Behavior Detected - RF Token!")
            res.clearCookie("refreshToken")
            await redis_client.del("RT-"+verified_rf.username+'-'+verified_rf.id)                                                                                          
            return res.status(401).json({status: -3, message: "Access Denied! Fishy Behavior! Token Mismatch!"}).end()  
        }
    }
    // 3) See if username exists in redis cache, if not, find in db and add to cache. then, we can move on to the next middleware, setting role, username, and user object fileds of the request for the next middleware to use.
    req.isUserCached = false  
    try{
        if(await redis_client.exists("user-"+username_in))
            req.isUserCached = true  
    }
    catch{
        console.log("     Verify User Error: user not found in redis! - delete this catch??")
    }
    if (!req.isUserCached){
        try{
            const user = await User.findOne({username: username_in})
            req.user = user
            try{
                await redis_client.set("user-"+username_in, user, 'EX', REDIS_USER_CACHE_EXP)                                                       // Saving Refresh token to Redis Cache
            }
            catch(err){
                console.log("CreateStoreRefreshToken Error: couldn't save RF to redis db. Error:  "+err)
                throw "CreateStoreRefreshToken Error - FAILED to add Refresh Token to Redis Cache. Err: "+err
            } 

        }
        catch(err){
            return res.status(401).json({status: -1, message: "Failed to get user from DB! " + err}).end() 
        }
    }
    if (req.isUserCached){
        try{
            const user = await redis_client.get("user-"+username)
            req.user = JSON.parse(user)
        }
        catch{
            req.isUserCached = false  
            try{
                req.user = await User.findOne({username: username_in})
            }
            catch{
                return res.status(401).json({status: -1, message: "Failed to get user from DB! " + err}).end() 
            }
        }
    }
    req.username = verified_access.username       
    req.tokenId = verified_access.id                                                         
    next()
}

exports.isAdmin = async (req,res,next) =>                                                                                                       // MiddleWare: Admin Route. See if req.role is admin or not
{
    if (req.role !== "admin")
        return res.status(401).json({status: -1, message: "Access Denied! Not Admin!"}).end() 
    next()
}

exports.isUser = async (req,res,next) =>                                                                                                       // MiddleWare: Admin Route. See if req.role is admin or not
{
    if (req.role !== "user")
        return res.status(401).json({status: -1, message: "Access Denied! Not User! If Admin, try admin routes instead!"}).end() 
    next()
}



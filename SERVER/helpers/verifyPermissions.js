const jwt = require('jsonwebtoken')
const CryptoJS = require("crypto-js");
const User = require('../model/User')
const APP_EXPORTS = require('../app')

function verifyToken(token, type = "access", role = "user"){
    if (type === "refresh"){
        try{
            return jwt.verify(token, process.env.REFRESH_TOKEN_SECRET)                                                                      // verify refresh token 
        }                       
        catch(err){ throw err }
    }
    else if (role === "user"){
        try{
            return jwt.verify(token, process.env.USER_SECRET_KEY)                                                                           // try to vberify jwt if its a user
        }                       
        catch(err){ throw err }
    }
    else if (role === "admin"){
        try{
            return jwt.verify(token, process.env.ADMIN_SECRET_KEY)                                                                          // try to vberify jwt if its an admin
        }                       
        catch(err){ throw err }
    }
}

exports.verifyUser = async (req,res,next) =>                                                                                                    // MiddleWare: Private Unique User Route
{           
    // 1) Get username and access token from header, get RT from cookie
    let user_url = req.headers['username']                                                                                                      // let user_url = req.originalUrl.split('/')[3]..if (req.originalUrl.split('/')[2] === "admin") .. user_url = process.env.ADMIN_USERNAME       //await User.findOne({username: })
    if (!user_url)
        return res.status(400).json({status: -1, message: "Not username header! Who is the user?"}) 
    if (user_url == process.env.ADMIN_USERNAME)
        req.role = "admin"
    else        
        req.role = "user"

    // const auth_header = req.headers['authorization']
    // const recieved_access_token = auth_header && auth_header.split(' ')[1]
    const recieved_RT = req.signedCookies.refreshToken;
    const recieved_access_token = req.headers['auth-token'] 
    if(!recieved_access_token || !recieved_RT) 
        return res.status(401).json({status: -1, message: "Access Denied! No auth-token Header or RF Cookie!"}) 
    console.log(recieved_RT)

    // 2) VERIFY the user by checking if correct JWT access token.  
    let verified_rt = null
    let verified_access = null
    try{
        verified_access = verifyToken(recieved_access_token, "access", req.role)                                                                // 2.1) Verify Access Token -> Valid: 1. Invalid: check validity of refresh token
    }
    catch(err){
        try{
            verified_rt = verifyToken(recieved_RT, "refresh")                                                                                   // 2.2) Verify Refresh Token Token -> Valid: -2; access token is invalid but refresh token is valid, need to refresh tokens from /refresh. Invalid: -1; both tokens are invalid so need to login
        }
        catch(err2){
            return res.status(401).json({status: -1, message: "Access Denied! Incorrect Tokens! Error: "+err2}).end()
        }
        return res.status(401).json({status: -2, message: "Access Denied! Incorrect Access Token! Send request to /refresh. Error: "+err, action_needed: "refresh"}).end() 
    }
    
    if (verified_access.username !== user_url)                                                                                                  // 3) See if name payloads are the same. If payload name of the rt and access tokens and user_url are different, then somethings fishy!
        return res.status(401).json({status: -1, message: "Access Denied! Invalid User! Token Mismatch!"}).end() 
    req.username = verified_access.username                                                                                                     // passing the logged user tot he next middleware
    next()
}


exports.checkOrigin = (req,res,next) =>                                                                       
{
    console.log(APP_EXPORTS.CLIENT_URL)
    /*if (res.headers.origin != APP_EXPORTS.CLIENT_URL) {
            console.log(`Request tnot made from Client! Only ${APP_EXPORTS.CLIENT_URL} can Access API!`)
            return res.status(401).json({status:-1, message:`Request tnot made from Client! Access Denied`}).end()
        } 
        const origin = req.get('host')
        console.log(origin)
    */
    next()
}

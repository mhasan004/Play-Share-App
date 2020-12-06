const jwt = require('jsonwebtoken')
const CryptoJS = require("crypto-js");
const User = require('../model/User')
const APP_EXPORTS = require('../app')

function verifyToken(token){
    try{
        return jwt.verify(token, process.env.USER_SECRET_KEY)                                                                           // See if a right user is trying to access this router
    }                       
    catch(err){
        try{
            return jwt.verify(token, process.env.ADMIN_SECRET_KEY)                                                                      // See if if the admin is trying to access this router
        }            
        catch{
            throw err
        }                                                                                                                               // If neither the admin or the right user, throw error        
    }
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


exports.verifyUser = async (req,res,next) =>                                                                                            // MiddleWare: Private Unique User Route
{           
    let user_url = req.params.username                                                                                                  // let user_url = req.originalUrl.split('/')[3]       //await User.findOne({username: })

    if (!user_url)
        if (req.originalUrl.split('/')[2] === "admin") 
            user_url = process.env.ADMIN_USERNAME

    // 1) Get RT from cookie and Access Token from header
    const recieved_RT = req.signedCookies.refreshToken;
    const recieved_access_token = req.headers['auth-token'] 
    // const auth_header = req.headers['authorization']
    // const recieved_access_token = auth_header && auth_header.split(' ')[1]

    if(!recieved_access_token || !recieved_RT) 
        return res.status(401).json({status: -1, message: `Access Denied! Wrong auth-token Header, user not found, or user not logged in!`}) 
          
    // 2) VERIFY the user by checking if correct JWT 
    let verified_rt = null
    let verified_access = null
    try{        
        try{
            verified_rt = verifyToken(recieved_RT)                                                                                      // 2.1) Verify Refresh Token Token -> If error return with -1 prompting user to relogin 
        }
        catch(err){
            return res.status(401).json({status: -1, message: "Access Denied! Invalid RT! Need to Login. Error: "+err}).end() 
        }
        try{
            verified_access = verifyToken(recieved_access_token)                                                                        // 2.2) Verify Access Token -> If error return with -2, indicating, refresh token is ok but acces token expired so need to refresh
        }
        catch(err){
            return res.status(401).json({status: -2, message: "Access Denied! May need to refresh Access Token from /refresh endpoint. Error: "+err}).end()
        }
    }
    catch(err){
        return res.status(401).json({status: -1, message: "Access Denied! Invalid Token! Error: " + err}).end() 
    }

    // 3) See if name payloads are the same
    if (verified_access.username !== verified_rt.username || verified_access.username !== user_url)
        return res.status(401).json({status: -1, message: "Access Denied! Invalid User! RT and Access Token Mismatch!"}).end() 

    // 4) see if user is in DB
    req.username = verified_access.username                                                                                             // passing the logged user tot he next middleware
    next()
}




const User = require('../model/User')
const bcrypt = require('bcryptjs')
const { registerValidation, loginValidationUsername } = require('../model/ValidationSchema')                                                                // Joi validation functions
const { doesUsernameEmailExist, comparePasswords } = require('../helpers/AuthFunctions')
const { createJWT, createStoreRefreshToken, verifyToken, findToken, storeToken, deleteToken } = require('../helpers/TokenFunctions')                                   // Getting access and refresh token creation funcions
const { findUserFromCacheOrDB } = require('../helpers/CachingFunctions')
const { REDIS_USER_CACHE_EXP } = require("../config")                                         

function randomNum(min=0, max=1000000000000){                                                                                                               // Function to generate a random id so that we can store the refresh tokens in a key value database for O(1) access
    return (Math.random() * (max - min + 1) ) << 0
}

exports.registerNewUser = async (req,res,next) =>                                                                                                           // Input Fields: display_name, username, email, password                                                             
{
    let hashed_password = null 
    const {username, email, password} = req.body                                                                                                            // 1a) VALIDATE the POST request: See if it adhears to the rules of the schema     
    const {error} = registerValidation(req.body)                                                                                                      
    if(error){return res.status(400).json({status:-1, message: "Joi Validation Error: " + error.details[0].message})}
    if (await doesUsernameEmailExist(res, username, email))                                                                                                 // 1b) VALIDATE the POST request: See if user and email already exists in DB
        return

    const salt = await bcrypt.genSalt(process.env.SALT_NUMBER)                                                                                              // 1c) HASH THE PASSWORD FOR STORAGE! - Leave salt as 10 and every year increase it by 1 to make cracking uyr passwords difficult                                                                     
    try{  
        hashed_password = await bcrypt.hash(password, salt)
    } catch(err){ 
        return res.status(401).json( {status: -1, message: "Failed to hash password! Error: "+err } )
    }
    const new_user = new User({                                                                                                                             // 2) CAN NOW ADD USER: Populate the Mongoose Schema to push to the Post collection in the D                                                                                                         
        username: username,
        handle: "@"+username, 
        // display_name: username,                                                                                                                          // Disabeld for now                                                                                      
        email: email,
        password: hashed_password,
    })        
    try{                                                                                                                                                    // 3) Add the user to the DB                                                                                                                                                                            
        await new_user.save()
    } catch(err){ 
        return res.status(400).json({status: -1, message:"Error adding user to DB: " + err})
    } 
    res.status(201).json({status: 1, message: "Succesfuly added user! Check 'user' property"})
}

exports.login = async (req,res,next) => 
{    
    const {username, password} = req.body       
    const {error} = loginValidationUsername(req.body)                                                                                                       // 1) Validate the request body by using Joi. See if user is in the DB                                                                                                           
    if(error) 
        return res.status(400).json({status:-1, message: error.details[0].message}) 
    let {user, isUserCached} = await findUserFromCacheOrDB(username)      
    if (!user) 
        return res.status(401).json( {status: -1, message: "Invalid username or password! Error: "+err} )
    if(!await comparePasswords(res, password, user.password))                                                                                               // 2) CHECK PASSWORD - Compare password that was passed in to the one in the DB    
        return

    const payload = {username: user.username, id: randomNum()}                                                                                              // 3) CREATE + ASSIGN TOKEN So User Can Access Private Routes (admin secret is set in .env, user secret is uniquely generated
    try{
        createJWT(res, payload, "access")
        await createStoreRefreshToken(res, payload)   
    } catch(err){
        return res.status(400).json({status:-1, message: "Failed to create access or refresh token! Error: "+err})
    }
    res.status(201).json( {status: 1, message: "Logged In!"} )
    
    if (!isUserCached){                                                                                                                                     // 4) After sending response - Add user to redis cache so that we can use it later for the session
        try{
            await storeToken("user-"+username, JSON.stringify(user), REDIS_USER_CACHE_EXP)                                                                  // Set refresh token in redis cache as a key
        } catch(err){
            console.log("     Failed to add user data to redis cache. Error: "+err)
        }
    }
}

exports.logout = async (req,res,next) => 
{ 
    const rfCookie = req.signedCookies.refreshToken;   
    res.clearCookie("refreshToken")    
    res.clearCookie("accessToken")    
    let verified_RF                                                                                                                                                                                           
    if (!rfCookie){
        return res.status(400).json({status: -1, message: "No refresh-token cookie sent with request! Couldn't delete rf from db!"})
    }
    try{
        verified_RF = verifyToken(rfCookie, "refresh", req.role)                                                                          
    } catch(err){ 
        return res.status(401).json({status:-1, message: "Incorrect or Expired Refresh Token! Couldn't delete rf from db!"})
    }
    try{
        await deleteToken("RT-"+verified_RF.username+'-'+verified_RF.id)                                                                                    // Delete RT from redis
        console.log("     Deleted redis RF")
        return res.status(200).json({status:1, message: "Successfully logged out and cookie deleted!"})
    } catch(err){
        console.log("     Logout Error: Failed to delete RT from redis")
        return res.status(400).json({status:-1, message: "Failed to logout! Error: "+err})
    }
}

// Middleware to renew JWT and Refresh Token given valid old refresh token
exports.refresh = async (req,res,next) => {
    let verified_RF                                                                                                                                         
    const old_RF = req.signedCookies.refreshToken;                                                                                                          // Get signed refreshToken cookie
    const username_in = req.headers['username']   
    if (!old_RF)
        return res.status(401).json({status: -1, message: "No refresh-token cookie sent with request! Need to login again!"})
    try{
        verified_RF = verifyToken(old_RF, "refresh", req.role)                                                                                              // 1) check if token expired - if it is expired, it will be deleted from db anyways
    } catch(err){ 
        res.clearCookie("refreshToken")    
        res.clearCookie("accessToken")
        return res.status(401).json({status:-1, message: "Incorrect or Expired Refresh Token! Need to login again!"})
    }

    if (username_in !== verified_RF.username){
        res.clearCookie("refreshToken")    
        res.clearCookie("accessToken") 
        return res.status(401).json({status:-1, message: "Refresh Token Mismatch! Login again!"})
    }
    if (!await findToken("RT-"+verified_RF.username+'-'+verified_RF.id))                                                                                    // 2) RT exists so we will make a new one, check if it is in redis db and continue to delete         // set refresh token in redis cache as a key. no value. 
        return res.status(401).json({status:-1, message: "Refresh Token not in DB, need to login again"})
    try{
        await deleteToken("RT-"+verified_RF.username+'-'+verified_RF.id)                                                                                    // 3) Delete old RT from redis, Make new jwt and RT from username and email stored in payload
    } catch{
        return res.status(400).json({status:-1, message: "Failed to delete old RT from cache in refresh! Log in again!"})
    }

    const payload = {username: verified_RF.username, id: randomNum()}   
    try{
        createJWT(res, payload, "access")
        await createStoreRefreshToken(res, payload)   
    } catch(err){
        return res.status(400).json({status:-1, message: "Either failed to create JWT, create and store refresh token, or update login status of user! Error: "+err})
    }
    return res.status(201).json({status: 2, message: "Successfully refreshed JWT and refresh token"})
}



const User = require('../model/User')
const Token = require('../model/Token')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const {registerValidation, loginValidationUsername} = require('../model/ValidationSchema')                                                                  // Import the Joi Validation functions
const {SYMMETRIC_KEY_encrypt} = require('../helpers/EncryptDecryptRequest')
const {redis_client} = require('../helpers/redisDB')
const {cookieConfig} = require("../config")
const JWT_expire_time        = '10m'                                            // Access token expire time: 10 min 
const JWT_RT_expire_time     = 86400*15                                         // RF token expire time:    15 days                      
const redis_user_expire_time = 86400                                            // Redis user expire time:   1 day                                          // storing logged in user's data so that we dont have to make a user data fetch to db when user does ost req, etc. if user resets pass, it will rewrite redis entry of "user-<username>"

function randomNum(min=0, max=1000){                                                                                                                        // Function to generate a random id
    return (Math.random() * (max - min + 1) ) << 0
}
async function createJWT(JWT_payload, type = "access") {                                                                                                    // Function to create new JWT: Input: {payload}, expiration time. Output: JWT Token 
    let token
    if (type === "refresh")
        token = jwt.sign(JWT_payload, process.env.REFRESH_TOKEN_SECRET, {expiresIn: JWT_RT_expire_time})    
    else if (JWT_payload.username === process.env.ADMIN_USERNAME)
        token = jwt.sign(JWT_payload, process.env.ADMIN_SECRET_KEY, {expiresIn: JWT_expire_time})    
    else
        token = jwt.sign(JWT_payload, process.env.USER_SECRET_KEY, {expiresIn: JWT_expire_time})  
    return token
}
async function createStoreRefreshToken(res, JWT_payload) {                                                                                                  // Function to create new refresh token: Input: {payload}. Output: JWT Refresh Token 
    const refresh_token = await createJWT(JWT_payload, "refresh") 
    try{
        await redis_client.set("RT-"+JWT_payload.username+"-"+JWT_payload.id, refresh_token, 'EX', JWT_RT_expire_time)                                      // Saving Refresh token to Redis Cache
    }
    catch(err){
        console.log("CreateStoreRefreshToken Error: couldn't save RF to redis db. Error:  "+err)
        throw "CreateStoreRefreshToken Error - FAILED to add Refresh Token to Redis Cache. Err: "+err
    } 
    res.cookie('refreshToken', refresh_token, cookieConfig);
}
findUserFromCacheOrDB = async (username)  =>                                                                                                                // Function to find user in either Redis Cache or MongoDB.  returns {user, isUserCached}                                                                    
{
    let isUserCached = false
    let user
    try{
        if(await redis_client.exists("user-"+username)){
            try{
                isUserCached = true
                console.log("(DEL) Got user from cache!")
                user = await redis_client.get("user-"+username)
                user = JSON.parse(user)
                return {user, isUserCached}
            }
            catch(err){
                console.log("Failed to add user data to redis cache. Error: "+err)
            }     
        }
        else{
            console.log("Not in cache so will get from DB and will cache later") 
        }
    }
    catch(err){
        console.log("Failed to see if user exists in Redis. Error: "+err)
    }
    try{
        user = await User.findOne({username: username})
        return {user, isUserCached}
    }
    catch(err){
        console.log("Error finding user form Mongo DB. Error: "+err) 
    }
}

// Input Fields: display_name, username, email, password
exports.registerNewUser = async (req,res,next) =>                                                                       
{
    const {username, email, password} = req.body                                                                                                            // 1a) VALIDATE the POST request: See if it adhears to the rules of the schema     
    const {error} = registerValidation(req.body)                                                                                                      
    if(error){ return res.status(400).json({status:-1, message: "Joi Validation Error: " + error.details[0].message}).end() }
    let user_exists, email_exists                                                                                                                           // 1b) VALIDATE the POST request: See if user and email already exists in DB
    try{
        [user_exists, email_exists] = await Promise.all([
            User.findOne({username: username}),
            User.findOne({email: email})
        ])
    }
    catch(err){
        return res.status(400).json( {status: -1, message: "Database find error: couldn't search database! Err: "+err } ).end() 
    }
    if (user_exists || email_exists)   
        return res.status(400).json( {status: -1, message: "This Username or Email Address is Already Registered!" } ).end() 
    const salt = await bcrypt.genSalt(process.env.SALT_NUMBER)                                                                                              // 1c) HASH THE PASSWORD FOR STORAGE!    leave salt as 10 and every year increase it by 1 to make cracking uyr passwords difficult                                                                     
    let hashed_password = null
    try{  hashed_password = await bcrypt.hash(password, salt)}
    catch{ return res.status(401).json( {status: -1, message: "Failed to hash password!" } ).end()}
    const new_user = new User({                                                                                                                             // 2) CAN NOW ADD USER: Populate the Mongoose Schema to push to the Post collection in the D                                                                                                         
        username: username,
        handle: "@"+username, 
        // display_name: username,                                                                                                                          // Disabeld for now                                                                                      
        email: email,
        password: hashed_password,
    })        
    let added_user = null                                                                                                                                   // 3) Add the user to the DB                                                                                                                                                                            
    try{ added_user = await new_user.save()}
    catch(err){ return res.status(400).json({status: -1, message:"Error adding user to DB: " + err}).end()} 
    try{
        console.log("registered: "+added_user.username)
        return res.status(201).json( {status: 1, added_user: added_user}.end())
    }
    catch(err){  return res.status(400).json({status: -1, message:"Error Encrypting db user id to send to client. Error: " + err}).end()} 
}


/*  Input Fields: username, password. JWT_payload: {username: user.username, id: randomNum()}  
    user token     = jwt.sign(JWT_payload, USER_SECRET_KEY,      {expiresIn: '10m'})    
    admin token    = jwt.sign(JWT_payload, ADMIN_SECRET_KEY,     {expiresIn: '10m'})  
    refresh tokens = jwt.sign(JWT_payload, REFRESH_TOKEN_SECRET, {expiresIn: '15d'})  */
exports.login = async (req,res,next) => 
{    
    let token                                                                                                                                      
    const {username, password} = req.body                                                                                                                   // 1a) VALIDATE the POST request: See if it adhears to the rules of the schema
    const {error} = loginValidationUsername(req.body)                                                                                       
    if(error) 
        return res.status(400).json({status:-1, message: error.details[0].message}).end() 
    let {user, isUserCached} = await findUserFromCacheOrDB(username)                                                                                        // 2) Find the user - eitcher in Redis cache or mongoDB
    if (!user) 
        return res.status(401).json( {status: -1, message: "Invalid username or password!"} ).end()
   
    try{                                                                                                                                                    // 3) CHECK PASSWORD on DB:                                                                                                                    
        const valid_pass = await bcrypt.compare(password, user.password)                                                                                    // CHECK PASSWORD: Compare if the passed in pas and the hashed db pass are the same
        if(!valid_pass)
            return res.status(401).json( {status: -1, message: "Invalid username or password!"} ).end() 
    }
    catch(err){
        console.log("Bycrypt Error - Failed to compare passwords! Error: " + err)
        return res.status(400).json( {status: -1, message:"Bycrypt Error - Failed to compare passwords! Error: " + err} ).end()
    }
    // 4) CREATE + ASSIGN TOKEN So User Can Access Private Routes (admin secret is set in .env, user secret is uniquely generated
    try{
        const payload = {username: user.username, id: randomNum()}     
        token = await Promise.all([                                                                                                                 
            createJWT(payload),
            createStoreRefreshToken(res, payload)   
        ]);                                                            
    }
    catch(err){
        return res.status(400).json({status:-1, message: "Either failed to create JWT or create and store refresh token! Error: "+err}).end()
    } 
    token = token[0]    
    res.set('auth-token', token)                                                                                                                            // Send the token with the response
    // 5) Encrypt (if TLS handshake in effect - just for practice, not needed) the JWT token and set it in the 
    if (process.env.USE_TLS === true)
        res.set('auth-token', SYMMETRIC_KEY_encrypt(token, req.headers["handshake"]))                                                                       // SYMMETRIC_KEY_encrypt() is disabled if using https                                                                                                             // Send the token with the response
    res.status(201).json( {status: 1, message: "Logged In! Set header 'auth-token' with token to access private routes!"} ).end()
    // 6) After sending response - Add user to redis cache so that we cna use it later for the session
    if (!isUserCached){
        try{
            await redis_client.set("user-"+username,JSON.stringify(user), 'EX', redis_user_expire_time)                                                     // set refresh token in redis cache as a key. no value. 
            console.log("Cached user data to Redis for 1 Day")
        }
        catch(err){
            console.log("Failed to add user data to redis cache. Error: "+err)
        }
    }
    try{
        await User.updateOne({ _id: user._id }, {login_status: 1})                                                                                          // Change logged in status for user                             
    }
    catch(err){
        console.log("Failed to update login status of user! Error: "+err)
    }
    console.log("(DEL) Set cookie secure flag to true so when client uses https! ")                                                     
    console.log("(DEL) Sending auth-token in res body. Had issues reading header from React!")
    console.log("Logged In: " + user.username)
    console.log("(DEL) ACCESS:\n    "+token)
    return 
}

exports.logout = async (req,res,next) => 
{ 
    try{
        await redis_client.del("RT-"+req.username+'-'+req.tokenId)                                                                                          // Delete RT from redis
        return res.status(200).json({status:1, message: "Successfully logged out!"})
    }
    catch(err){
        return res.status(400).json({status:-1, message: "Failed to logout! Error: "+err})
    }
}

// Middleware to renew JWT and Refresh Token given valid old refresh token
exports.refresh = async (req,res,next) => {
    let RT_verified                                                                                                                                         
    const old_RT = req.signedCookies.refreshToken;                                                                                                          // Get signed refreshToken cookie
    const username_in = req.headers['username']   
    if (!old_RT){
        return res.status(401).json({status: -1, message: "No refresh-token cookie sent with request! Need to login again!"})
    }
    try{
        RT_verified = jwt.verify(old_RT, process.env.REFRESH_TOKEN_SECRET)                                                                                  // 1) check if token expired - if it is expired, it will be deleted from db anyways
    }
    catch(err){ 
        return res.status(401).json({status:-1, message: "Incorrect or Expired Refresh Token! Need to login again!"}).end()
    }
    if (username_in !== RT_verified.username)
        return res.status(401).json({status:-1, message: "Refresh Token Mismatch! Login again!"}).end()

    if (!await redis_client.exists("RT-"+RT_verified.username+'-'+RT_verified.id))                                                                          // 2) RT exists so we will make a new one, check if it is in redis db and continue to delete         // set refresh token in redis cache as a key. no value. 
        return res.status(401).json({status:-1, message: "Refresh Token not in DB, need to login again"}).end()
    try{
        await redis_client.del("RT-"+RT_verified.username+'-'+RT_verified.id)                                                                               // 3) Delete old RT from redis, Make new jwt and RT from username and email stored in payload
    }
    catch{
        return res.status(400).json({status:-1, message: "Failed to delete old RT from cache in refresh! Log in again!"}).end()
    }

    let new_token
    try{
        const payload = {username: RT_verified.username, id: randomNum()}   
        new_token = await Promise.all([     
            createJWT(payload),
            createStoreRefreshToken(res, payload),   
        ]);            
    }
    catch(err){
        return res.status(400).json({status:-1, message: "Either failed to create JWT, create and store refresh token, or update login status of user! Error: "+err}).end()
    }
    new_token = new_token[0]   
    res.set("auth-token", new_token)  
    console.log("(DEL) SET COOKIE SECURE FLAG TO TRUE SO WHEN CLIENT USES HTTPS")
    console.log("(DEL) REMINDER: PUT JWT IN AUTH HEADER!!!")
    console.log("(DEL) ACCESS:\n    "+new_token)
    console.log("(TODO) Refresh tokens are stored in redis. But i need to store in MongoDB so its permanent. Also need to cache it")
    console.log('REFRESHED TOKEN RESPONSE SENT!')
    return res.status(201).json({status: 2, message: "Successfully refreshed JWT and refresh token"}).end()
}



const User = require('../model/User')
const Token = require('../model/Token')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const CryptoJS = require("crypto-js");
const {registerValidation, loginValidationUsername} = require('../model/ValidationSchema')                                                          // Import the Joi Validation functions
const {SYMMETRIC_KEY_encrypt} = require('../helpers/EncryptDecryptRequest')
const {redis_client} = require('../helpers/redisDB')
const JWT_expire_time = '10m'
const JWT_RT_expire_time = 24*60*60*7  //'7d'                        
const RT_cookie_expire_time = '7d' 
const redis_user_expire_time = 24*60*60     //'1d'                                                                                                            // storing logged in user's data so that we dont have to make a user data fetch to db when user does ost req, etc. if user resets pass, it will rewrite redis entry of "user-<username>"
const cookieConfig = {
    maxAge: RT_cookie_expire_time,                                              // expire time in seconds (remove this option and cookie will die when browser is closed)
    httpOnly: true,                                                             // to disable accessing cookie via client side js
    signed: true,                                                               // if you use the secret with cookieParser
    // secure: true,                                                            // only set cookies over https
    // ephemeral: false                                                         // true = cookie destroyed when browser closes
    // SameSite: strict, 
}

// Function to create new JWT
async function createJWT(JWT_payload, expire_time = JWT_expire_time) {               
    let token
    if (JWT_payload.email === process.env.ADMIN_EMAIL)
        token = jwt.sign(JWT_payload, process.env.ADMIN_SECRET_KEY, {expiresIn: expire_time})    
    else
        token = jwt.sign(JWT_payload, process.env.USER_SECRET_KEY, {expiresIn: expire_time})  
    return token
}
// Function to create new refresh token
async function createStoreRefreshToken(JWT_payload) {
    const refresh_token = createJWT(JWT_payload, JWT_RT_expire_time) 
    // Saving Refresh token to Redis Cache
    try{
        await redis_client.set("RT-"+username, refresh_token, 'EX', JWT_RT_expire_time)
    }
    catch(err){
        console.log("CreateStoreRefreshToken: "+err)
        throw "CreateStoreRefreshToken Error - FAILED to add Refresh Token to Redis Cache. Err: "+err
    }        
    return refresh_token
}
// Function to find user in either Redis Cache or MongoDB
exports.findUserFromCacheOrDB = async (username)  =>             // returns {user, isUserCached}
// async function findUserFromCacheOrDB (username)              // returns 
{
    let isUserCached = false
    let user
    try{
        if(await redis_client.exists("user-"+username)){
            try{
                isUserCached = true
                console.log("Got user from cache!")
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
    const {username, email, password} = req.body                                                                                                    // 1a) VALIDATE the POST request: See if it adhears to the rules of the schema     
    const {error} = registerValidation(req.body)                                                                                                      
    if(error){ return res.status(400).json({status:-1, message: "Joi Validation Error: " + error.details[0].message}).end() }
    let user_exists, email_exists                                                                                                                   // 1b) VALIDATE the POST request: See if user and email already exists in DB
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
    const salt = await bcrypt.genSalt(process.env.SALT_NUMBER)                                                                                      // 1c) HASH THE PASSWORD FOR STORAGE!    leave salt as 10 and every year increase it by 1 to make cracking uyr passwords difficult                                                                     
    let hashed_password = null
    try{  hashed_password = await bcrypt.hash(password, salt)}
    catch{ return res.status(401).json( {status: -1, message: "Failed to hash password!" } ).end()}
    const new_user = new User({                                                                                                                     // 2) CAN NOW ADD USER: Populate the Mongoose Schema to push to the Post collection in the D                                                                                                         
        username: username,
        handle: "@"+username, 
        // display_name: username,                                                                                                                  // Disabeld for now                                                                                      
        email: email,
        password: hashed_password,
    })        
    let added_user = null                                                                                                                           // 3) Add the user to the DB                                                                                                                                                                            
    try{ added_user = await new_user.save()}
    catch(err){ return res.status(400).json({status: -1, message:"Error adding user to DB: " + err}).end()} 
    try{
        console.log("registered: "+added_user.username)
        return res.status(201).json( {status: 1, added_user: added_user}.end())
    }
    catch(err){  return res.status(400).json({status: -1, message:"Error Encrypting db user id to send to client. Error: " + err}).end()} 
}


/*  Input Fields: username, password
    JWT_payload: {id: user.username}
    user token  = jwt.sign(JWT_payload, USER_SECRET_KEY,  {expiresIn: '1h'})    
    admin token = jwt.sign(JWT_payload, ADMIN_SECRET_KEY, {expiresIn: '1h'})   -----  JWT_admin_key = encrypt USER_SECRET_KEY with ADMIN_SECRET_KEY 
*/
exports.login = async (req,res,next) => 
{    
    const {username, password} = req.body                                                                                                           // 1a) VALIDATE the POST request: See if it adhears to the rules of the schema
    const {error} = loginValidationUsername(req.body)                                                                                       
    if(error) 
        return res.status(400).json({status:-1, message: error.details[0].message}).end() 
    let {user, isUserCached} = await findUserFromCacheOrDB(username)                                                                               // 2) Find the user - eitcher in Redis cache or mongoDB
    if (!user) 
        return res.status(401).json( {status: -1, message: "Invalid username or password!"} ).end()
    try{                                                                                                                                            // 3) CHECK PASSWORD on DB:                                                                                                                    
        const valid_pass = await bcrypt.compare(password, user.password)                                                                            // CHECK PASSWORD: Compare if the passed in pas and the hashed db pass are the same
        if(!valid_pass)
            return res.status(401).json( {status: -1, message: "Invalid username or password!"} ).end() 
    }
    catch(err){
        console.log("Bycrypt Error - Failed to compare passwords! Error: " + err)
        return res.status(400).json( {status: -1, message:"Bycrypt Error - Failed to compare passwords! Error: " + err} ).end()
    }
   
    let token, refresh_token                                                                                                                        // 4) CREATE + ASSIGN TOKEN So User Can Access Private Routes (admin secret is set in .env, user secret is uniquely generated
    try{
        [token, refresh_token] = await Promise.all([
            createJWT({username: user.username, email: user.email}),
            createStoreRefreshToken({username: user.username, email: user.email})   
        ]);                                        
    }
    catch(err){
        return res.status(400).json({status:-1, message: "Either failed to create JWT or create and store refresh token! Error: "+err}).end()
    }


    // 4) Encrypt (if TLS handshake in effect - just for practice, not needed) the JWT token and set it in the header
    // res.set('auth-token', SYMMETRIC_KEY_encrypt(token, req.headers["handshake"]))                                                                           // SYMMETRIC_KEY_encrypt() is disabled sinc eim using https                                                                                                             // Send the token with the response
    res.set('auth-token', token)                                                                                                                                                                                    // Send the token with the response
    res.cookie('refreshToken', refresh_token, cookieConfig)                                                                                                    // 3) Set refresh token cookie and rend res
    res.status(201).json( {status: 1, message: "Logged In! Set header 'auth-token' with token to access private routes!", auth_app: token} ).end()
    

    // 6) Post response - Change logged in status for user
    // Add user to redis cache so that we cna use it later for the session
    if (!isUserCached){
        try{
            await redis_client.set("user-"+username,JSON.stringify(user), 'EX', redis_user_expire_time)                                                                  // set refresh token in redis cache as a key. no value. 
            console.log("Cached user data to Redis for 1 Day")
        }
        catch(err){
            console.log("Failed to add user data to redis cache. Error: "+err)
        }
    }
    // Change logged in status for user
    try{
        await User.updateOne({ _id: user._id }, {login_status: 1})                                    
    }
    catch(err){
        console.log("Failed to update login status of user! Error: "+err)
    }
    // console.log("*** Set cookie secure flag to true so when client uses https! ")                                                     
    // console.log("*** Sending auth-token in res body. Had issues reading header from React!")
    // console.log(token)
    console.log(" Logged In: " + user.username)
    return 
}


// Middleware to renew JWT and Refresh Token given valid old refresh token
exports.refresh = async (req,res,next) => {
    const old_refresh_token = req.get('refresh-token')
    if (!old_refresh_token){
        return res.status(401).json({status: -1, message: "No refresh-token sent, need to login"})
    }

    let RT_verified                                                                                                                                         // 1) check if token expired - if it is expired, it will be deleted from db anyways
    try{
        RT_verified = jwt.verify(old_refresh_token, process.env.REFRESH_TOKEN_SECRET)
    }
    catch(err){ 
        return res.status(401).json({status:-1, message: "Incorrect or Expired Refresh Token! Need to login again!"}).end()
    }

    if (!await redis_client.exists("RT-"+RT_verified.username))                                                                                             // 2) RT exists so we will make a new one, check if it is in redis db and continue to delete         // set refresh token in redis cache as a key. no value. 
        return res.status(401).json({status:-1, message: "Refresh Token not in DB, need to login again"}).end()
    
    try{
        await redis_client.del("RT-"+RT_verified.username)                                                                                                  // 3) Delete old RT from redis, Make new jwt and RT from username and email stored in payload
    }
    catch{
        return res.status(400).json({status:-1, message: "Failed to delete old RT from cache in refresh! Log in again!"}).end()
    }

    let new_jwt_token, new_refresh_token
    try{
        [new_jwt_token, new_refresh_token] = await Promise.all([
            createJWT({username: RT_verified.username, email: RT_verified.email}),
            createStoreRefreshToken({username: RT_verified.username, email: RT_verified.email}),   
        ]);                                        
    }
    catch(err){
        return res.status(400).json({status:-1, message: "Either failed to create JWT, create and store refresh token, or update login status of user! Error: "+err}).end()
    }
    res.cookie('refreshToken', new_refresh_token, cookieConfig);
    console.log("*** SET COOKIE SECURE FLAG TO TRUE SO WHEN CLIENT USES HTTPS")
    console.log("***REMINDER: PUT JWT IN AUTH HEADER!!!")
    return res.status(201).json({status: 1, message: "Successfully refreshed JWT and refresh token", jwt: new_jwt_token})
}



const User = require('../model/User')
const Token = require('../model/Token')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const CryptoJS = require("crypto-js");
const {registerValidation, loginValidationUsername} = require('../model/ValidationSchema')                                                          // Import the Joi Validation functions
const {SYMMETRIC_KEY_encrypt} = require('../helpers/EncryptDecryptRequest')
const {REDIS_CLIENT} = require('../helpers/redisDB')
const JWT_expire_time = '10m'
const JWT_RT_expire_time = 24*60*60*15  //'15d'                        
const RT_cookie_expire_time = '15d' 
const redis_user_expire_time = 24*60*60*15     //'15d'                                                                                                            // storing logged in user's data so that we dont have to make a user data fetch to db when user does ost req, etc. if user resets pass, it will rewrite redis entry of "user-<username>"


// Function to create new JWT
async function createJWT(req, res, next, username, email) {               
    const JWT_payload = {id: username}                                                                                          
    let token
    if (email === process.env.ADMIN_EMAIL)
        token = jwt.sign(JWT_payload, process.env.ADMIN_SECRET_KEY, {expiresIn: JWT_expire_time})    
    else
        token = jwt.sign(JWT_payload, process.env.USER_SECRET_KEY, {expiresIn: JWT_expire_time})  
    return token
}
// Function to create new refresh token
async function createStoreRefreshToken(req, res, next, username, email) {
    const JWT_payload = {username: username, email: email}                                                                                       
    const refresh_token = jwt.sign(JWT_payload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: JWT_RT_expire_time})
    // Saving Refresh token to Redis Cache
    REDIS_CLIENT.set("RT-"+username, refresh_token, 'EX', JWT_RT_expire_time, (err) =>{                                                                   // set refresh token in redis cache as a key. no value. 
        if (err){
            console.log("CreateStoreRefreshToken: "+err)
            throw "CreateStoreRefreshToken Error - FAILED to add Refresh Token to Redis Cache. Err: "+err
        }
    })                   
    return refresh_token
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
    
    // 1) Get user for DB, if user is cached, sue it or else get form DB
    var user                                                                                                                                        // CACHING USER FROM DB  
    var isUserCached
    REDIS_CLIENT.exists("user-"+username, async (err, reply, user, isUserCached)=>{
        if(!err) {
            if(reply === 1){                                                                                                                        // user exists in redis cache so use it instea dof makign a db call
                REDIS_CLIENT.get("user-"+username, async (err, reply, user) =>{                                                                   // set refresh token in redis cache as a key. no value. 
                    if (!err){
                        user = reply
                        console.log(user)
                        console.log("Got user for cache!")
                    }
                    else{ 
                        console.log("Failed to add user data to redis cache")
                        user = await User.findOne({username: username})                                                                                             // 1b) VALIDATE the POST request: See if user and email already exists in DB    Find the user doc in DB with this email                                                                         
                    }
                })
            }
            else{
                console.log("Not in cache so will get from DB and will cache later")
                user = await User.findOne({username: username})                                                                                             // 1b) VALIDATE the POST request: See if user and email already exists in DB    Find the user doc in DB with this email  
                console.log(user)  
            }
            isUserCached = reply
        }
        else
            user = await User.findOne({username: username})
    });

    // const isUserCached = await REDIS_CLIENT.exists("user-"+username)
    // if (isUserCached){
    //     const cachedUser = await REDIS_CLIENT.get("user-"+username)                                                                   // set refresh token in redis cache as a key. no value. 
    //     if (cachedUser){
    //         user = cachedUser
    //         console.log(user)
    //         console.log("Got user form cache!")
    //     }
    //     else{ 
    //         console.log("User not in cache data! Will add later")
    //         user = await User.findOne({username: username})                                                                                             // 1b) VALIDATE the POST request: See if user and email already exists in DB    Find the user doc in DB with this email                                                                         
    //     }
    // }
    // else{
    //     console.log("Not in cache so will get from DB and will cache later")
    //     user = await User.findOne({username: username})                                                                                             // 1b) VALIDATE the POST request: See if user and email already exists in DB    Find the user doc in DB with this email      
    // }
    console.log("_______________")

    console.log(user)
    console.log("_______________")

    if (!user) 
        return res.status(401).json( {status: -1, message: "Invalid username or password!"} ).end()


    try{                                                                                                                                            // 1c) CHECK PASSWORD on DB:                                                                                                                    
        const valid_pass = await bcrypt.compare(password, user.password)                                                                            // CHECK PASSWORD: Compare if the passed in pas and the hashed db pass are the same
        if(!valid_pass)
            return res.status(401).json( {status: -1, message: "Invalid username or password!"} ).end() 
    }
    catch(err){
        return res.status(400).json( {status: -1, message:"Error: " + err} ).end()
    }
   
    let token, refresh_token                                                                                                                        // 2) CREATE + ASSIGN TOKEN So User Can Access Private Routes (admin secret is set in .env, user secret is uniquely generated
    try{
        [token, refresh_token] = await Promise.all([
            createJWT(req, res, next, user.username,  user.email),
            createStoreRefreshToken(req, res, next, user.username, user.email),   
        ]);                                        
    }
    catch(err){
        return res.status(400).json({status:-1, message: "Either failed to create JWT or create and store refresh token! Error: "+err}).end()
    }
    res.cookie('refresh_token', refresh_token, {                                                                                                    // 3) Set refresh token cookie and rend res
        maxAge: parseInt(RT_cookie_expire_time),
        httpOnly: true,
        sameSite: 'strict', 
        // secure: true,
    });

    // 4) Encrypt (if TLS handshake in effect - just for practice, not needed) the JWT token and set it in the header
    // res.set('auth-token', SYMMETRIC_KEY_encrypt(token, req.headers["handshake"]))                                                                           // SYMMETRIC_KEY_encrypt() is disabled sinc eim using https                                                                                                             // Send the token with the response
    res.set('auth-token', token)                                                                                                                                                                                    // Send the token with the response
    res.status(201).json( {status: 1, message: "Logged In! Set header 'auth-token' with token to access private routes!", auth_app: token} ).end()
    
    console.log("_________________________ ")

    console.log("isUserCached "+isUserCached)
    // 5) Add user data to cache so if they log in later, can have their info
    if (!isUserCached){
        const setReply = await EDIS_CLIENT.set("user-"+username,JSON.stringify(user), 'EX', redis_user_expire_time)                                                                  // set refresh token in redis cache as a key. no value. 
        // if(setReply) console.log("Failed to add user data to redis cache. Error: "+err)
        console.log(setReply)
    }
    console.log("_________________________ ")


    // 6) Post response - Change logged in status for user
    try{
        await User.updateOne({ _id: user._id }, {login_status: 1})                                    
    }
    catch(err){
        console.log("Failed to update login status of user! Error: "+err)
    }
    console.log("*** SET COOKIE SECURE FLAG TO TRUE SO WHEN CLIENT USES HTTPS")                                                     
    console.log("*** Sending auth-token in res body. Had issues reading header from react!")
    console.log(token)
    console.log("Logged In: " + user.username)
    return 
}


// Middleware to renew JWT and Refresh Token given valid old refresh token
exports.refresh = async (req,res,next) => {
    const old_refresh_token = req.get('refresh-token')
    if (!old_refresh_token){
        return res.status(401).json({status: -1, message: "No refresh-token sent, need to login"})
    }

    let RT_verified                                                                                                                                 // 1) check if token expired - if it is expired, it will be deleted from db anyways
    try{
        RT_verified = jwt.verify(old_refresh_token, process.env.REFRESH_TOKEN_SECRET)
    }
    catch(err){ 
        return res.status(401).json({status:-1, message: "Incorrect or Expired Refresh Token! Need to login again!"}).end()
    }

    REDIS_CLIENT.exists("RT-"+RT_verified.username, (err)=>{                                                                                              // 2) RT exists so we will make a new one, check if it is in redis db and continue to delete         // set refresh token in redis cache as a key. no value. 
        return res.status(401).json({status:-1, message: "Refresh Token not in DB, need to login again. Err: "+err})
    })                   
    
    REDIS_CLIENT.del("RT-"+RT_verified.username, (err)=>{                                                                                                 // 3) Delete old RT from redis, Make new jwt and RT from username and email stored in payload
        return res.status(400).json({status:-1, message: "Failed to delete old RT from cache in refresh!"}).end()
    })
    let new_jwt_token, new_refresh_token
    try{
        [new_jwt_token, new_refresh_token] = await Promise.all([
            createJWT(req, res, next, RT_verified.username),
            createStoreRefreshToken(req, res, next, RT_verified.username, RT_verified.email),   
        ]);                                        
    }
    catch(err){
        return res.status(400).json({status:-1, message: "Either failed to create JWT, create and store refresh token, or update login status of user! Error: "+err}).end()
    }
    res.cookie('refresh_token', new_refresh_token, {
        maxAge: RT_cookie_expire_time,
        httpOnly: true,
        sameSite: 'strict', 
        // secure: true,
    });
    console.log("*** SET COOKIE SECURE FLAG TO TRUE SO WHEN CLIENT USES HTTPS")
    console.log("***REMINDER: PUT JWT IN AUTH HEADER!!!")
    return res.status(201).json({status: 1, message: "Successfully refreshed JWT and refresh token", jwt: new_jwt_token})
}




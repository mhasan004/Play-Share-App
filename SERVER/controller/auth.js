const User = require('../model/User')
const Token = require('../model/Token')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const CryptoJS = require("crypto-js");
const {registerValidation, loginValidationUsername} = require('../model/ValidationSchema')                                                  // Import the Joi Validation functions
const {SYMMETRIC_KEY_encrypt} = require('../routes/Decrypt_Encrypt_Request')
const JWT_expire_time = 10
const RT_expire_time = 21900 // 1/2 month

// Input Fields: display_name, username, email, password
exports.registerNewUser = async (req,res,next) =>                                                                       
{
    const {username, email, password} = req.body
    const {error} = registerValidation(req.body)                                                                                            // 1a) VALIDATE the POST request: See if it adhears to the rules of the schema                 
    if(error){ return res.status(400).json({status:-1, message: "Joi Validation Error: " + error.details[0].message}) }

    const user_exists  = await User.findOne({username: username})                                                                           // 1b) VALIDATE the POST request: See if user and email already exists in DB
    const email_exists = await User.findOne({email: email})
    if (user_exists || email_exists)   
        return res.status(400).json( {status: -1, message: "This Username or Email Address is Already Registered!" } ) 
    
    const salt = await bcrypt.genSalt(process.env.SALT_NUMBER)                                                                              // 1c) HASH THE PASSWORD FOR STORAGE!    leave salt as 10 and every year increase it by 1 to make cracking uyr passwords difficult
    let hashed_password = null
    try{  hashed_password = await bcrypt.hash(password, salt)}
    catch{ return res.status(401).json( {status: -1, message: "Failed to hash password!" } )}
    
    const new_user = new User({                                                                                                             // 2) CAN NOW ADD USER: Populate the Mongoose Schema to push to the Post collection in the DB
        username: username,
        handle: "@"+username, 
        // display_name: username,                                                                                                          // disabeld for now                                                                                      
        email: email,
        password: hashed_password,
    })        

    let added_user = null                                                                                                                   // 3) Add the user to the DB                                                                
    try{ added_user = await new_user.save()}
    catch(err){ return res.status(400).json({status: -1, message:"Error adding user to DB: " + err})} 
    try{
        console.log("registered: "+added_user.username)
        return res.status(200).json( {status: 1, added_user: added_user})
    }
    catch(err){  return res.status(400).json({status: -1, message:"Error Encrypting db user id to send to client. Error: " + err})} 
}

/*  Input Fields: username, password
    Will generete a JWT using a secret key, string to hash in token, expiration time
        data - id of token = string of username
        secret key for users = AES(JWT_payload, USER_SECRET_KEY)
        secret key for admin = AES(AES(JWT_payload, USER_SECRET_KEY),ADMIN_SECRET_KEY) 
    * JWT_payload: {id: user.username}
    * user token = jwt.sign(JWT_payload, USER_SECRET_KEY, {expiresIn: '1h'})    
    * admin token = jwt.sign(JWT_payload, JWT_admin_key,   {expiresIn: '1h'})   -----  JWT_admin_key = encrypt USER_SECRET_KEY with ADMIN_SECRET_KEY
*/
exports.login = async (req,res,next) => 
{    
    const {username, password} = req.body
    const {error} = loginValidationUsername(req.body)                                                                                       // 1a) VALIDATE the POST request: See if it adhears to the rules of the schema
    if(error) return res.status(400).json({status:-1, message: error.details[0].message}) 
   
    const user = await User.findOne({username: username})                                                                                   // 1b) VALIDATE the POST request: See if user and email already exists in DB    Find the user doc in DB with this email
    if (!user) return res.status(400).json( {status: -1, message: "Invalid username or password"} ) 
    
    try{                                                                                                                                    // 1c) CHECK PASSWORD on DB:
        const valid_pass = await bcrypt.compare(password, user.password)                                                                    // CHECK PASSWORD: Compare if the passed in pas and the hashed db pass are the same
        if(!valid_pass){ return res.status(400).json( {status: -1, message: "Invalid username or password"} ) }
    }
    catch(err){
        return res.status(400).json( {status: -1, message:"Error: " + err} )
    }

    const token = await createJWT(req, res, next, user.username,  user.email)
    await createRefreshToken(req, res, next, user.username, user.email)                                                                                    // 2) CREATE + ASSIGN TOKEN So User Can Access Private Routes (admin secret is set in .env, user secret is uniquely generated)

    try{                                                                                                                                    // 3) Change logged in status for user
        await User.updateOne({ _id: user._id }, {login_status: 1})                                                                          // Save the hashed unique user secret key in the user's profile so we can verify the user for the route
    }                                                  
    catch{ 
        console.log("Failed change login status for user: " + user.username)
        return res.status(400).json({status:-1, message: "Failed change login status for user"})
    }

    const token_enc = SYMMETRIC_KEY_encrypt(token, req.headers["handshake"])                                                                // 4) Encrypt the JWT token and set it in the header
    res.set('auth-token', token_enc)                                                                                                        // Send the token with the response
    console.log("***WARNING! sending auth-token in res body. had issues reading header from react")
    console.log(token_enc)
    console.log("Logged In: " + user.username)
    return res.status(200).json( {status: 1, message: "Logged In! Set header 'auth-token' with token to access private routes!", auth_app: token_enc} ).end()
    // console.log("** Remove this! (auth.js) JWT (not ecrypted versison) sent: "+ token)
}


// function to create new JWT
async function createJWT(req, res, next, username, email) {               
    const JWT_payload = {id: username.toString()}                                                                                          
    let token = null
    if (email === process.env.ADMIN_EMAIL){
        try{    
            const JWT_admin_key = CryptoJS.AES.encrypt(process.env.USER_SECRET_KEY, process.env.ADMIN_SECRET_KEY).toString();                           // encrypt USER_SECRET_KEY with ADMIN_SECRET_KEY 
            token = jwt.sign(JWT_payload, JWT_admin_key, {expiresIn: JWT_expire_time})                                                                    // Admin Token uses an encryption of USER_SECRET_KEY with ADMIN_SECRET_KEY 
        }
        catch (err){
            console.log('FAILED to to make admin encryption key for JWT creation for admin failed!')
            return res.status(400).json({status:-1, message: "FAILED to to make admin encryption key for JWT creation for admin failed!: Error:" + err})
        }
    }
    else{
        token = jwt.sign(JWT_payload, process.env.USER_SECRET_KEY, {expiresIn: JWT_expire_time})                                                          // User JWT is simple, just encrypt with USER_SECRET_KEY 
    }
    return token
}

// function to create new refresh token
async function createRefreshToken(req, res, next, username, email) {               
    const refresh_token = jwt.sign({username: username, email: email}, process.env.REFRESH_TOKEN_SECRET, { expiresIn: RT_expire_time})
    const RT_entry = new Token({refreshToken: refresh_token})        
    try{ 
        console.log("refresh token: "+refresh_token)
        await RT_entry.save()
    }
    catch{
        console.log('FAILED to add Refresh Token to DB')
        return res.status(400).json({status:-1, message: "FAILED to add Refresh Token to DB! Error:" + err})
    }
}


// function to renew jwt and refresh token from old refresh token
async function refreshSession(req,res,next, refresh_token) {  
    // 1) check if token in db 
    const old_rt = await Token.findOne({refreshToken: refresh_token})
    if (!old_rt){
        return res.status(400).json({status:-1, message: "Refresh Token not in DB, need to login again"})
    }
    // 2) check if token expired - if its expired, delete from db
    let  RT_verified  
    try{RT_verified = jwt.verify(refresh_token, process.env.REFRESH_TOKEN_SECRET)}
    catch(err){ 
        try{await Token.deleteOne({ _id: old_rt._id })}
        catch(err){res.status(400).json({status: -1, message: "Failed to delete expired refresh Token: "+err})}
        return res.status(400).json({status:-1, message: "Failed to verify refresh token! Might be expired! Error: "+err})
    }

    if (!RT_verified){
        return res.status(400).json({status:-1, message: "Incorrect Refresh Token, need to login again"})
    }
    // 3) delete current rt from db
    try{await Token.deleteOne({ _id: old_rt._id })}
    catch(err){ return res.status(400).json({status: -1, message: "Failed to delete old refresh Token: "+err})}

    // 4) Make new jwt and refresh token from username and emailstored in payload
    const new_jwt = await createJWT(req, res, next, RT_verified.username)
    const new_rt  = await createRefreshToken(req, res, next, RT_verified.username, RT_verified.email) 

    return {jwt_token: new_jwt, refresh_token: new_rt}
}



exports.refresh = async (req,res,next) => {
    const old_refresh_token = req.get('refresh-token')
    if (!old_refresh_token){
        return res.status(400).json({status: -1, message: "No refresh-token sent, need to login"})
    }
    // 1) check if token in db 
    const old_rt = await Token.findOne({refreshToken: old_refresh_token})
    if (!old_rt){
        return res.status(400).json({status:-1, message: "Refresh Token not in DB, need to login again"})
    }
    // 2) check if token expired - if its expired, delete from db
    let  RT_verified  
    try{RT_verified = jwt.verify(old_refresh_token, process.env.REFRESH_TOKEN_SECRET)}
    catch(err){ 
        try{await Token.deleteOne({ _id: old_rt._id })}
        catch(err){res.status(400).json({status: -1, message: "Failed to delete expired refresh Token: "+err})}
        return res.status(400).json({status:-1, message: "Failed to verify refresh token! Might be expired! Error: "+err})
    }

    if (!RT_verified){
        return res.status(400).json({status:-1, message: "Incorrect Refresh Token, need to login again"})
    }
    // 3) delete current rt from db
    try{await Token.deleteOne({ _id: old_rt._id })}
    catch(err){ return res.status(400).json({status: -1, message: "Failed to delete old refresh Token: "+err})}

    // 4) Make new jwt and refresh token from username and emailstored in payload
    const new_jwt_token = await createJWT(req, res, next, RT_verified.username)
    const new_refresh_token  = await createRefreshToken(req, res, next, RT_verified.username, RT_verified.email) 

    console.log("***REMIUNER: PUT JWT IN AUTH HEADER!!!")
    return res.status(200).json({status: 1, message: "Successfully refreshed JWT and refresh token", jwt: new_jwt_token})
}




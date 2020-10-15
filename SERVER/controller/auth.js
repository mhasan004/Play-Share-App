const User = require('../model/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const CryptoJS = require("crypto-js");
//const crypto = require('crypto')                            // using just to make jwt secret key
const {registerValidation, loginValidationUsername} = require('../model/ValidationSchema')                                                  // Import the Joi Validation functions

// Function to decrypt request fields. Input: decryption_key, [fields, to, decrypt]. Returns: {[decrypted, fields], errObj} 
function decryptRequestItems(decryptionkey, requestItemArray){              // 1) DECRYPT Request Body
    let bytes = "";
    let decryptedItemArray = []
    let errObj = null
    try{
        requestItemArray.forEach(passedReq =>{
            bytes = CryptoJS.AES.decrypt(passedReq, decryptionkey);
            decryptedItemArray.push(bytes.toString(CryptoJS.enc.Utf8))
        })
    }
    catch(err){
        errObj = {
            message: "ERROR: Couldn't decrypt request data!\n\t\tError: "+ err, 
            err_output_location: "auth.js -> decryptRequestItems()"
        }
        console.log("Printing from auth.js: "+errObj.message+" \n\t\terr_output_location"+errObj.location)
    }
    return {decryptedItemArray, errObj}
}

// Input Fields: display_name, username, email, password
exports.registerNewUser = async (req,res,next) =>                                                                       
{
    // 1a) DECRYPT ALL FILEDS FROM REQUEST (display_name, username, email, password) 
    const {decryptedItemArray, errObj} = decryptRequestItems(                                      
        process.env.CLIENT_ENCRYPTION_KEY, 
        [req.body.display_name, req.body.username, req.body.email, req.body.password]
    )     
    if (errObj != null){
        console.log("bye")
        return res.status(400).json({status: -1, message: "Couldn't decrypt request data! Error: "+errObj.message, err_location: {err_output_location: errObj.err_output_location, err_location: "auth.js -> registerNewUser Middleware "}})
    }
    const display_name = decryptedItemArray[0]
    const username = decryptedItemArray[1]
    const email = decryptedItemArray[2]
    const password = decryptedItemArray[3]
    req.body.display_name = display_name                                                                                                    // Setting req body for Joi verification!
    req.body.username = username                                                                                                            // for validation with Joi!
    req.body.email = email
    req.body.password = password

    // 1b) VALIDATE the POST request: See if it adhears to the rules of the schema
    const {error} = registerValidation(req.body)                                       
    if(error){ return res.status(400).json({status:-1, message: "Joi Validation Error: " + error.details[0].message}) }

    // 1c) VALIDATE the POST request: See if user and email already exists in DB
    const user_exists  = await User.findOne({username: username})                      
    const email_exists = await User.findOne({email: email})
    if (user_exists || email_exists)   
        return res.status(400).json( {status: -1, message: "This Username or Email Address is Already Registered!" } ) 
    
    // 1d) HASH THE PASSWORD FOR STORAGE!
    const salt = await bcrypt.genSalt(process.env.SALT_NUMBER)                                                                              // leave salt as 10 and every year increase it by 1 to make cracking uyr passwords difficult
    let hashed_password = null
    try{  hashed_password = await bcrypt.hash(password, salt)}
    catch{ return res.status(401).json( {status: -1, message: "Failed to hash password!" } )}

    // 2) CAN NOW ADD USER: Populate the Mongoose Schema to push to the Post collection in the DB
    const new_user = new User({   
        username: username,
        handle: "@"+username, 
        display_name: display_name,                                                                                      
        email: email,
        password: hashed_password,
    })
               
    // 3) Add the user to the DB
    let added_user = null                                                                   
    try{ added_user = await new_user.save()}
    catch(err){  return res.status(400).json({status: -1, message:"Error adding user to DB: " + err})} 
    try{
        const enc_added_user = CryptoJS.AES.encrypt(added_user._id.toString(), process.env.SERVER_ENCRYPTION_KEY).toString(); 
        res.status(200).json( {status: 1, added_user: enc_added_user})
        console.log("registered: "+added_user.username)
    }
    catch(err){  return res.status(400).json({status: -1, message:"Error Encrypting db user id to send to client. Error: " + err})} 
}

// Input Fields: username, password
// Will generete a JWT using a secret key, string to hash in token, expiration time
    // data - id of token = string of usernmae, _id
    // secret key for users = AES(data_to_encrypt, USER_SECRET_KEY)
    // secret key for admin = AES(AES(data_to_encrypt, USER_SECRET_KEY),ADMIN_SECRET_KEY) 
// Chnages to JWT -> secret key made with a randomly hashed 
exports.login = async (req,res,next) => 
{    
    // 1a) DECRYPT ALL FILEDS FROM REQUEST (username, password) 
    const decryptedItemArray = decryptRequestItems(process.env.CLIENT_ENCRYPTION_KEY, [req.body.username, req.body.password])
    const username = decryptedItemArray[0]
    const password = decryptedItemArray[2]
    req.body.username = username
    req.body.password = password

    // 1b) VALIDATE the POST request: See if it adhears to the rules of the schema
    const {error} = loginValidationUsername(req.body)  
    if(error) return res.status(400).json({status:-1, message: error.details[0].message}) 

    // 1c) VALIDATE the POST request: See if user and email already exists in DB
    const user = await User.findOne({username: username})                                                                                   // Find the user doc in DB with this email
    if (!user) return res.status(400).json( {status: -1, message: "Invalid username or password"} ) 
    
    // 1d) CHECK PASSWORD: retrieved password is encrypted with CLIENT_ENCRYPTION_KEY. Decrypt and check hash on DB
    try{
        const valid_pass = await bcrypt.compare(password, user.password)                                                                    // CHECK PASSWORD: Compare if the passed in pas and the hashed db pass are the same
        if(!valid_pass){ return res.status(400).json( {status: -1, message: "Invalid username or password"} ) }
    }
    catch(err){
        return res.status(400).json( {status: -1, message:"Error: " + err} )
    }

    // 2) CREATE + ASSIGN TOKEN So User Can Access Private Routes (admin secret is set in .env, user secret is uniquely generated)
    // const data_to_encrypt = crypto.randomBytes(64).toString('hex')
    const data_to_encrypt = (user._id+user.username).toString()
    let token = null
    let unique_user_secret_key = null
    try{    
        unique_user_secret_key = CryptoJS.AES.encrypt(data_to_encrypt, process.env.USER_SECRET_KEY).toString();         // Each user need to have a different JWT so one user cant go to anothe ruser's private route
    }
    catch (err){
        console.log( 'FAILED TO MAKE UNIQUE KEY!')
        return res.status(400).json({status:-1, message: "Failed to to hash secret key:" + err})
    }
    if (user.email === process.env.ADMIN_EMAIL){
        unique_user_secret_key = CryptoJS.AES.encrypt(unique_user_secret_key, process.env.ADMIN_SECRET_KEY).toString(); 
        token = jwt.sign({id: data_to_encrypt}, unique_user_secret_key, {expiresIn: '1h'})        // Admin Token
    }
    else{
        token = jwt.sign({id: data_to_encrypt}, unique_user_secret_key, {expiresIn: '1h'})                  // Make a new JWT Token. Pass in user's db _id and ur made up token    
    }

    // 3) STORE THE UNIQUE SECRET KEY: Hash the unique user secret token and store in DB so one user cant peek at another user's page
    const salt = await bcrypt.genSalt(process.env.SALT_NUMBER)
    try{ 
        const hashed_secret_key = await bcrypt.hash(unique_user_secret_key, salt)
        await User.updateOne({ _id: user._id }, {secret_key: hashed_secret_key})                                                        // Save the hashed unique user secret key in the user's profile so we can verify the user for the route
    }                                                  
    catch{ 
        return res.status(400).json({status:-1, message: "Failed to add hashed user token to DB so login failed"})
    }
    /* if (user.username != "admin"){...^}
       else{console.log("\nNEED TO WRITE CODE TO LOG IN ADMIN!\n")}*/

    // 4) Encrypt the JWT token and set it in the header
    const server_token_enc = CryptoJS.AES.encrypt(token, process.env.SERVER_ENCRYPTION_KEY).toString(); 
    res.header('auth-token', server_token_enc)                                                                                              // Send the token with the response
    res.status(200).json( {status: 1, message: "Logged In! Set header with token to access private routes!"} ) 
    console.log("Logged In: "+user.username)
    console.log("** Remove this! (auth.js) JWT encrypted sent: "+ server_token_enc)
}

   
exports.decryptRequestItems = decryptRequestItems
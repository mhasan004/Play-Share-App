const jwt = require('jsonwebtoken')
const {redis} = require('./Redis')  
const {cookieConfigRefresh, cookieConfigAccess, REDIS_TOKEN_CACHE_EXP, JWT_ACCESS_EXP, JWT_REFRESH_EXP} = require("../config")     
const {SYMMETRIC_KEY_encrypt} = require('./EncryptDecryptFunctions')
const {encryptPayload, decryptPayload} = require('./EncryptDecryptFunctions')

/*  JWT_payload = encrypted with AES: {username: username, id: random number}  
    user access token   = jwt.sign(JWT_payload, USER_SECRET_KEY,      {expiresIn: '5m'})    
    admin access token  = jwt.sign(JWT_payload, ADMIN_SECRET_KEY,     {expiresIn: '5m'})  
    refresh tokens      = jwt.sign(JWT_payload, REFRESH_TOKEN_SECRET, {expiresIn: '15d'})  
*/

function createJWT (res, JWT_payload, type = "access"){                                                                                                     // Function to create new JWT acess token and store it in a cookie (if the jwt creation type isnt "refresh"). Returns token if jwt creation type is "refresh"
    let token
    const username = JWT_payload.username  
    JWT_payload = encryptPayload(JWT_payload)
    res.set('access-token-exp', new Date().getTime()+60000*JWT_ACCESS_EXP);                                                                                 // send the expiration time to client so that client will know when to silently refresh tokens (Since client cant access the access token)
    if (type === "refresh")
        return jwt.sign(JWT_payload, process.env.REFRESH_TOKEN_SECRET, {expiresIn: JWT_REFRESH_EXP})    
    else if (username === process.env.ADMIN_USERNAME)
        token = jwt.sign(JWT_payload, process.env.ADMIN_SECRET_KEY, {expiresIn: JWT_ACCESS_EXP})    
    else
        token = jwt.sign(JWT_payload, process.env.USER_SECRET_KEY, {expiresIn: JWT_ACCESS_EXP})  
    res.cookie('accessToken', token, cookieConfigAccess); 
    if (process.env.USE_TLS === "true")
        res.cookie('accessToken', SYMMETRIC_KEY_encrypt(token, req.headers["handshake"]), cookieConfigAccess);                                              // Encrypt (if TLS handshake in effect - just for practice, not needed) the JWT token and set it in the. SYMMETRIC_KEY_encrypt() is disabled if using https    
}

async function createStoreRefreshToken(res, JWT_payload){                                                                                                   // Function to create a new JWT refresh token and store the refresh token in a cookie
    const refresh_token = createJWT(res, JWT_payload, "refresh") 
    try{
        await storeToken("RT-"+JWT_payload.username+"-"+JWT_payload.id, refresh_token, REDIS_TOKEN_CACHE_EXP)                                               // Storing refresh token to redis cache and db
    } catch(err){
        console.log("CreateStoreRefreshToken Error: couldn't save RF to redis db. Error:  "+err)
        throw "CreateStoreRefreshToken Error - FAILED to add Refresh Token to Redis Cache. Err: "+err
    } 
    res.cookie('refreshToken', refresh_token, cookieConfigRefresh);
}

function verifyToken(token, type = "access", role = "user"){                                                                                                // Function to verify user access tokens, admin access tokens, and refresh tokens 
    if (type === "refresh"){
        try{ 
            return decryptPayload( jwt.verify(token, process.env.REFRESH_TOKEN_SECRET) )                                                                    // Verify refresh token  
        } catch(err){ throw err }
    }
    else if (role === "admin"){
        try{ 
            return decryptPayload( jwt.verify(token, process.env.ADMIN_SECRET_KEY) )                                                                        // Try to verify token if its an admin   
        } catch(err){ throw err }
    }
    else{
        try{ 
            return decryptPayload( jwt.verify(token, process.env.USER_SECRET_KEY) )                                                                         // Try to verify token if its a user              
        } catch(err){ throw err }
    }
}

async function findToken(tokenName){
    let token
    token = await redis.exists(tokenName)
    // if not in redis, see db
    return token
}

async function storeToken(key, value, exp){  
    try{
        //store in key value DB (Dynamo DB)
    } catch(err){
        throw err
    }
    try{
        await redis.set(key, value, exp)                                                                                                       // set refresh token in redis cache and a key value db as the value. key = rf-username-id 
    } catch(err){
        console.log("     Couldn't store refrewsh token to redis cache!")
    }
}                                                                                             
async function deleteToken(key){  
    await redis.del(key)                                                                                                                             // delete refresh token from redis cache and mongodb as a key
    // delete from db
}    



module.exports = {
    createJWT,
    createStoreRefreshToken,
    verifyToken,
    findToken,
    storeToken,
    deleteToken
}

// async function authenticateToken(token, type = "access", role = "user"){                                                                                               
//     let verified_RF       
//     // 1) verify with jwt.verify (done)
//     // 2) check if incomming username is the same as payload                                                                                                                                   
//     try{
//         verified_RF = verifyToken(token, type, role)                                                                                                    // 1) check if token expired - if it is expired, it will be deleted from db anyways
//     } catch(err){ 
//         return res.status(401).json({status:-1, message: "Incorrect or Expired Refresh Token! Need to login again!"}).end()
//     }
//     if (username_in !== verified_RF.username)
//         return res.status(401).json({status:-1, message: "Refresh Token Mismatch! Login again!"}).end()

//     if (!await redis.exists("RT-"+verified_RF.username+'-'+verified_RF.id))                   // 2) RT exists so we will make a new one, check if it is in redis db and continue to delete         // set refresh token in redis cache as a key. no value. 
//         // return res.status(401).json({status:-1, message: "Refresh Token not in DB, need to login again"}).end()
//         console.log("sfd")
//     try{
//         await redis.del("RT-"+verified_RF.username+'-'+verified_RF.id)                                                                           // 3) Delete old RT from redis, Make new jwt and RT from username and email stored in payload
//     } catch{
//         return res.status(400).json({status:-1, message: "Failed to delete old RT from cache in refresh! Log in again!"}).end()
//     }
// }
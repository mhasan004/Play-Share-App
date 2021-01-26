const User = require('../model/User')
const {REDIS_USER_CACHE_EXP} = require("../config")                                         
const {redis_client} = require('./RedisDB')
const {storeToken} = require('./TokenFunctions')

async function findUserFromCacheOrDB(username)                                                                                                              // Function to find user in either Redis Cache or MongoDB.  returns {user: Object, isUserCached: Boolean}                                                                    
{
    let isUserCached = false
    let user
    try{
        if(await redis_client.exists("user-"+username)){
            try{
                user = await redis_client.get("user-"+username)
                user = JSON.parse(user)
                isUserCached = true
                return {user, isUserCached}
            } catch(err){
                console.log("Failed to add user data to redis cache. Error: "+err)
            }     
        }
        else{
            console.log("Not in cache so will get from DB and will cache later") 
        }
    } catch(err){
        console.log("Failed to see if user exists in Redis. Error: "+err)
    }
    if (!isUserCached){
        try{
            user = await User.findOne({username: username})
            return {user, isUserCached}
        } catch(err){
            console.log("Error finding user form Mongo DB. Error: "+err) 
        }
    }
}

async function cacheUser(req, username)
{ 
    req.isUserCached = false  
    try{
        if(await redis_client.exists("user-"+username))
            req.isUserCached = true  
    } catch{
        console.log("     Verify User Error: user not found in redis! - delete this catch??")
    }
    if (!req.isUserCached){
        try{
            const user = await User.findOne({username: username})
            req.user = user
            try{
                await storeToken("user-"+username, user, REDIS_USER_CACHE_EXP)                                              // Saving Refresh token to Redis Cache
            } catch(err){
                console.log("CreateStoreRefreshToken Error: couldn't save RF to redis db. Error:  "+err)
                throw "CreateStoreRefreshToken Error - FAILED to add Refresh Token to Redis Cache. Err: "+err
            } 
        } catch(err){
            throw "Failed to get user from both DBs! " + err
        }
    }
    if (req.isUserCached){
        try{
            const user = await redis_client.get("user-"+username)
            req.user = JSON.parse(user)
        } catch{
            req.isUserCached = false  
            try{
                req.user = await User.findOne({username: username})
            } catch{
                throw "Failed to get user from DB! " + err
            }
        }
    }
}

module.exports = {
    findUserFromCacheOrDB,
    cacheUser,
}
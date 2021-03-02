const User = require('../model/User')
const {REDIS_USER_CACHE_EXP} = require("../config")                                         
const {redis} = require('./Redis')    

async function findUserFromCacheOrDB(username)                                                                                                              // Function to find user in either Redis Cache or MongoDB.  returns {user: Object, isUserCached: Boolean}                                                                    
{
    let isUserCached = false
    let user
    try{
        if(await redis.exists(("user-"+username))){                                                                  
            try{
                user = await redis.get("user-"+username)                                                                                      
                user = JSON.parse(user)
                isUserCached = true
                return {user, isUserCached}
            } catch(err){
                console.error("     FindUserCacheDB - Failed to get user data to redis cache. Error: "+err)
            }     
        } else{
            console.error("     FindUserCacheDB - Not in cache so will get from DB and will cache later") 
        }
    } catch(err){
        console.error("     FindUserCacheDB - Failed to see if user exists in Redis. Error: "+err)
    }
    if (!isUserCached){
        try{
            user = await User.findOne({username: username})
            return {user, isUserCached}
        } catch(err){
            console.error("     FindUserCacheDB - Error finding user form MongoDB. Error: "+err) 
            throw "Error finding user form MongoDB. Error: "+err
        }
    } else
        throw "Error finding user form MongoDB and cache (thrown from findUserFromCacheOrDB)"+err
}

async function cacheUser(req, username)
{ 
    req.isUserCached = false  
    try{
        if(await redis.exists("user-"+username))                                                                      
            req.isUserCached = true  
    } catch{
        console.log("     VerifyUser - user not found in redis! - delete this catch??")
    }
    if (!req.isUserCached){
        try{
            const user = await User.findOne({username: username})
            req.user = user
            try{
                await redis.set("user-"+username, JSON.stringify(user), REDIS_USER_CACHE_EXP, true)                                          // caching user locally for a day
            } catch(err){
                console.error("     CacheUser - Couldn't save RF to redis db. Error:  "+err)
                throw "CacheUser - FAILED to add Refresh Token to Redis Cache. Err: "+err
            } 
        } catch(err){
            throw "Failed to get user from both DBs! " + err
        }
    }
    if (req.isUserCached){
        try{
            const user = await redis.get("user-"+username)                                                        
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
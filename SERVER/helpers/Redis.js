const Redis      = require("redis")
const AsyncRedis = require("async-redis")                                                           // async await version of redis

const REDIS_LOCAL_PORT = process.env.REDIS_LOCAL_PORT || 6379                                       // redis local port
const REDIS_CLOUD_PORT = process.env.REDIS_CLOUD_PORT                                               // redis cloud port
const REDIS_CLOUD_HOST = process.env.REDIS_CLOUD_HOST || '127.0.0.1'
const REDIS_AUTH = {
    'auth_pass': process.env.REDIS_CLOUD_PASSWD,
    'return_buffers': true
}

const redis = AsyncRedis.createClient(REDIS_LOCAL_PORT)
// const clientCloud = Redis.createClient(REDIS_CLOUD_PORT, REDIS_CLOUD_HOST, REDIS_AUTH)                      
// const redisCloud = AsyncRedis.decorate(clientCloud)                                                 // promisify redis

redis.on("error", err => {
    console.log("     Error Connecting to Redis! - There could be no redis server running.\n\
        Install redis then run 'redis-server' to start the redis server!.\n\
        Error: " + err+"\n");
})
// redisCloud.on("error", err => {
//     console.log("     Error Connecting to Redis Cloud!\n          Error: " + err+"\n");
// })

redisLocal = {}
redisLocal.set = async (key, value, exp)=>{                     // await redisLocal.set(...)
    return redis.set(key, value, 'EX', exp)                                                          
}
redisLocal.get = async (key)=>{                                     // await redisLocal.get(...)
    return redis.get(key)    
}
redisLocal.exists = async(key)=>{                                   // await redisLocal.exists(...)
    return redis.exists(key)
}


module.exports = {
    redis,
    // redisCloud,
    redisLocal
}

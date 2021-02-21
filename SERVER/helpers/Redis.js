const asyncRedis = require("async-redis");                                              // Asynchronous version of redis 
const REDIS_PORT = process.env.REDIS_PORT || 6379
var redis = asyncRedis.createClient(REDIS_PORT)

redis.on("error", function (err) {
    console.log("Error Connecting to Redis! - There could be no redis server running. Install redis then run 'redis-server' to start the redis server!. Error: " + err);
});

module.exports = {
    redis
}

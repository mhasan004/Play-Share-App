const asyncRedis = require("async-redis");                                          //  Async redis! No more stinky callbacks! (npm install --save async-redis) redis-server. redis-cli. This is the asynchronous version of redis 
const REDIS_PORT = process.env.REDIS_PORT || 6379
var redis_client = asyncRedis.createClient(REDIS_PORT)

redis_client.on("error", function (err) {
  console.log("Error Connecting to Redis! - There could be no redis server running. Install redis then run 'redis-server' to start the redis server!. Error: " + err);
});

module.exports = {
  redis_client
}


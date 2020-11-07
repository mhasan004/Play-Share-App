const redis        = require('redis')                                                               // (npm install redis, redis-server) in-memory, persistent data structure store to store key value pairs         
const REDIS_PORT   = process.env.REDIS_PORT || 6379
var REDIS_CLIENT = redis.createClient(REDIS_PORT)


REDIS_CLIENT.on("error", function (err) {
  console.log("Error Connectign to Redis! " + err);
});


module.exports = {
  REDIS_CLIENT: REDIS_CLIENT
}
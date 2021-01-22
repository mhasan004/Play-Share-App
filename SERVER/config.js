const rateLimit = require("express-rate-limit");                                                        // Request rate limiter
/* Expire Times:
    Access Token expire time:               5 min   (300 s)
    Refresh Token expire time:             15 days  (86400 * 15 = 1296000 s)
    Access Token cookie expire time:        1 day   (86400 s)
    Refresh Token cookie expire time:      15 days  
    Redis User Cache expire time:           1 day
    Redis Refresh Token Cache expire time:  1 day
    Rate Limiter: 50 requests per 60000*10 ms or 10 minutes
*/

module.exports = {
    JWT_EXP: 300,
    REDIS_USER_CACHE_EXP: 86400,                                                                        // How long to cache the user data in redis - 1 day
    REDIS_TOKEN_CACHE_EXP: 86400,                                                                       // How long to cache the token data in redis - 1 day

    corsOptions: {
        origin: 'http://localhost:3000',                                                                // Access-Control-Allow-Origin
        credentials: true,
        exposedHeaders: ['access-token-exp'],                                                           // Set it so that this header can be retrieved in client side
    },
    rateLimiter: rateLimit({
        max: 50,                                                                                        // limit each IP to 50 requests per 10 minutes (60000 * 10 ms)
        windowMs: 60000 * 10,                                                                           // 10 minutes. will send a 429 response if there is 50 requests made in 15 minutes
        message: "Your doing too much, please try again in 10 minutes"
    }),
    cookieConfigRefresh: {
        maxAge: 1296000,                                                                                // Cookie expires in 15 days (86400*15 s) 
        httpOnly: true,                                                                                 // to disable accessing cookie via client side js
        signed: true,                                                                                   // if you use the secret with cookieParser
        sameSite: "strict",                                                                             // cookies won't be sent if not the same domain (guard against CSRF)
        // secure: true,                                                                                // only set cookies over https
        // ephemeral: false                                                                             // true = cookie destroyed when browser closes
    },
    cookieConfigAccess: {                                                                               // Cookie expires in 1 day (86400 s) 
        maxAge: 86400,                                                                 
        httpOnly: true,                                                                                
        signed: true,  
        sameSite: "strict",                                                                                                                                                             
        // secure: true,                                                                               
        // ephemeral: false                                                                            
    },
}
 
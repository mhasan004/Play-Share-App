const rateLimit = require("express-rate-limit");                                                        // Request rate limiter
/* Expire Times:
    Access Token expire time:               5 min  = 300 s
    Access Token cookie expire time:        5 min =  300000 ms
    Refresh Token expire time:             15 days = 1296000 s
    Refresh Token cookie expire time:      15 days = 1296000000 ms
    Redis User Cache expire time:           1 day = 86400 s
    Redis Refresh Token Cache expire time:  1 day = 86400 s
    Rate Limiter: 50 requests per 60000*10 ms or 10 minutes
*/
module.exports = {
    JWT_ACCESS_EXP: 300,                                                                                // Expire time of access token (5min)
    JWT_REFRESH_EXP: 1296000,                                                                           // Expire time of refresh token (15 days) 
    REDIS_USER_CACHE_EXP: 86400,                                                                        // How long to cache the user data in redis - 1 day
    REDIS_TOKEN_CACHE_EXP: 1296000,// 86400,                                                            // How long to cache the token data in redis - 1 day (15 days for now)

    corsOptions: {
        origin: 'http://localhost:3000',                                                                // Access-Control-Allow-Origin
        credentials: true,
        exposedHeaders: ['access-token-exp'],                                                           // Set it so that this header can be retrieved in client side
    },
    rateLimiter: rateLimit({
        max: 50,                                                                                        // limit each IP to 50 requests per 10 minutes (60000 * 10 ms)
        windowMs: 60000 * 10,                                                                           // 10 minutes. will send a status 429 response if there is 50 requests made in 10 minutes
        message: "Your doing too much, please try again in 10 minutes"
    }),
    cookieConfigRefresh: {
        maxAge: 1296000000,                                                                             // Cookie expires in 15 days 
        httpOnly: true,                                                                                 // to disable accessing cookie via client side js
        signed: true,                                                                                   // if you use the secret with cookieParser
        sameSite: "strict",                                                                             // cookies won't be sent if not the same domain (guard against CSRF)
        secure: true,                                                                                   // only set cookies over https
    },
    cookieConfigAccess: {                                                                               // Cookie expires in 5 min
        maxAge: 300000,                                                                 
        httpOnly: true,                                                                                
        signed: true,  
        sameSite: "strict",                                                                                                                                                             
        secure: true,                                                                               
    },
}
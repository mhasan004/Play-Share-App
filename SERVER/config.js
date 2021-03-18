const rateLimit = require("express-rate-limit");                                                        // Request rate limiter
/* Expire Times:
    Access Token expire time:               5 min  = 300 s
    Access Token cookie expire time:        5 min =  300000 ms
    Refresh Token expire time:             15 days = 1296000 s
    Refresh Token cookie expire time:      15 days = 1296000000 ms
    Redis User Cache expire time:           1 day = 86400 s
    Redis Refresh Token Cache expire time:  1 day = 86400 s
    API Rate Limiter: 50 requests per 10 minutes
    Password Rate Limiter: 10 requests per 30 minutes
    Account Creation Rate Limiter: 5 requests per day
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
    apiRateLimiter: rateLimit({
        max: 200,                                                                                        // limit each IP to 50 requests per 10 minutes 
        windowMs: 600000,                                                                               // 10 minutes (60000 * 10 min). will send a status 429 response if there is 50 requests made in 10 minutes
        message: "Your doing too much, please try again in 10 minutes"
    }),
    passwordRateLimiter: rateLimit({
        max: 10,                                                                                        // limit each IP to 10 requests per 30 minutes 
        windowMs: 18000000,                                                                             // 30 minutes (60000 * 30 min). will send a status 429 response if there is 10 requests made in 30 minutes
        message: "You've made too many password resets. Please try again in 30 minutes"
    }),
    accountRateLimiter: rateLimit({
        max: 5,                                                                                         // limit 5 account creation per day for each each IP
        windowMs: 86400000,                                                                             // 1 day (60000 * 60 min * 24 hrs). will send a status 429 response if there is 10 requests made in 30 minutes
        message: "You've made too many new accounts. Please try again in 1 day"
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
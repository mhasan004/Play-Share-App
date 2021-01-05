const rateLimit = require("express-rate-limit");                                                        // Request rate limiter
const RT_cookie_expire_time  = 86400*15                                                                 // RF cookie expire time:   15 days 

module.exports = {
    corsOptions: {
        origin: 'http://localhost:3000',                                                                // Access-Control-Allow-Origin
        credentials: true,
        exposedHeaders: ['Authorization', 'auth-token'],                                                // Set it so that this header can be retrieved in client side
    },
    rateLimiter: rateLimit({
        max: 50,                                                                                        // limit each IP to 50 requests per windowMs
        windowMs: 60000 * 10                                                                            // 10 minutes. will send a 429 response if there is 50 requests made in 15 minutes
    }),
    cookieConfig: {
        maxAge: RT_cookie_expire_time,                                                                  // expire time in seconds (remove this option and cookie will die when browser is closed)
        httpOnly: true,                                                                                 // to disable accessing cookie via client side js
        signed: true,                                                                                   // if you use the secret with cookieParser
        // secure: true,                                                                                // only set cookies over https
        // ephemeral: false                                                                             // true = cookie destroyed when browser closes
        // SameSite: strict,                                                                            // disable because of not same origin, cookies wont be sent
    }
}
 
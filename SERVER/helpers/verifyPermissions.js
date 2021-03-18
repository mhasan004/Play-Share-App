const {verifyToken} = require('./TokenFunctions')
const {tokenNameVerified} = require('./AuthFunctions')
const {cacheUser} = require('./CachingFunctions')

// Middleware authenticates the user and adds to req  object: (1) user: user object from db, (2) isUserCached = if user is cached in redis or not (3) username, (4) tokenId: random toklenid to find refreshtoken with username-tokenId,
exports.verifyUser = async (req,res,next) =>                                                                                                        // MiddleWare: Private Unique User Route. Passed user object, role, username to request so the next middleware can use it
{           
    // 1) Get username and access token from header and verify if they exist. Get RT from cookie
    const username_in = req.headers['username']                                                                                                          
    if (!username_in)
        return res.status(400).json({status: -1, message: "No username header! Who is the user?"}) 
    if (username_in === process.env.ADMIN_USERNAME)
        req.role = "admin"
    else        
        req.role = "user"
    const recieved_access_token = req.signedCookies.accessToken;                                                                                    // AUTHORIZATION HEADER: const auth_header = req.headers['authorization']; const recieved_access_token = auth_header && auth_header.split(' ')[1]
    const recieved_RF = req.signedCookies.refreshToken;
    //if(!recieved_RF) return res.status(401).json({status: -1, message: "Access Denied! No refresh token cookie!"}) 
 
    // 2) (a) Verify if access token is valid. If valid, move on to b. If invalid, check rf and tell client they need to refresh tokens (acess invalid, rf valid). (b) Check if the payload of access token matches the username in header. (c) for admin usernames, check also if rf payload match. 
    let verified_access, verified_rf
    try{
        verified_access = verifyToken(recieved_access_token, "access", req.role)                                                                    // 2.a.1) Verify Access Token -> Valid: 1. Invalid: check validity of refresh token
        if (req.role === "admin"){
            try{
                verified_rf = verifyToken(recieved_RF, "refresh") 
            } catch(err){
                res.clearCookie("accessToken")    
                res.clearCookie("refreshToken")    
                return res.status(401).json({status: -1, message: "Access Denied! Invalid Admin RF! Error: "+err}).end()
            }
        }
    } catch(err){
        try{
            verified_rf = verifyToken(recieved_RF, "refresh")                                                                                       // 2.a.2) Verify Refresh Token Token -> Valid: -2; access token is invalid but refresh token is valid, need to refresh tokens from /refresh. Invalid: -1; both tokens are invalid so need to login
        } catch(err2){
            return res.status(401).json({status: -1, message: "Access Denied! Invalid Tokens! Error: "+err2}).end()
        }
        return res.status(401).json({status: -2, message: "Access Denied! Invalid Access Token! Send request to /auth/refresh. Error: "+err}).end() 
    }
    if (!await tokenNameVerified(res, username_in, verified_access, verified_rf))                                                                   // 2.b) check if the username stored in token is the same username that was passed in through the header.
        return                                                                                                                                      // If names are not the same, an error message was sent out so exist                                                                        

    // 3) See if username exists in redis cache, if not, find in db and add to cache. then, we can move on to the next middleware, setting role, username, and user object fileds of the request for the next middleware to use.
    try{
        await cacheUser(req, username_in)
    } catch(err){
        console.error("      failed to cached user! Err: "+err)
        return res.status(401).json({status: -1, message: err})
    }
    req.username = verified_access.username       
    req.tokenId = verified_access.id    
    next()
}

exports.isAdmin = async (req,res,next) => {                                                                                                         // MiddleWare: Admin Route. See if req.role is admin or not
    if (req.role !== "admin")
        return res.status(401).json({status: -1, message: "Access Denied! Not Admin!"}).end() 
    next()
}




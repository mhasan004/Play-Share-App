const jwt = require('jsonwebtoken')

exports.verifyAdmin = (req,res,next) => {                                                       // MiddleWare Private Route (can acess the route without the token)
    const recieved_token = req.header('auth-token')                                             // 1) Get the token from the header  of the request
    if(!recieved_token) return res.status(401).json({status: -1, message: "Access Denied!"})    // 2) If there is no token, user isnt logged so deny access 

    try{
        const verified = jwt.verify(recieved_token, process.env.ADMIN_SECRET_TOKEN)             // 3) (returns _id of verified user in DB) Verify the user by checkign to see if the tokens in header with otu secret token
        req.user = verified                                                                     // settign user to the _id of doc in DB
        next()
    }
    catch(err){
        return res.status(400).json({status: -1, message: "Invalid Token Error: " +err})
    }
}

exports.verifyUser = (req,res,next) => {                                                
    const recieved_token = req.header('auth-token')                                             
    if(!recieved_token) return res.status(401).json({status: -1, message: "Access Denied!"})    

    try{
        const verified = jwt.verify(recieved_token, process.env.USER_SECRET_TOKEN)             
        req.user = verified                                                                    
        next()
    }
    catch(err){
        return res.status(400).json({status: -1, message: "Invalid Token Error: " +err})
    }
}

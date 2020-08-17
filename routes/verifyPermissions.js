const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const User = require('../model/User')

exports.verifyAdmin = (req,res,next) => {                                                           // MiddleWare Private Route (can acess the route without the token)
    const userType = req.baseUrl.split('/')[2]                                                      // Get the user type: admin or user

    const recieved_token = req.header('auth-token')                                                 // 1) Get the token from the header  of the request
    if(!recieved_token) 
        return res.status(401).json({status: -1, message: "Access Denied! No auth-token Header"})   

    try{
        let verified = null
        if (userType === "admin") 
            verified = jwt.verify(recieved_token, process.env.ADMIN_SECRET_TOKEN)                   // 2) (returns _id doc of verified user in DB) Verify the user by checkign to see if the tokens in header with otu secret token
        else{throw err}
        req.user = verified                                                                         // 3) req.user = JWT object
        next()
    }
    catch(err){
        return res.status(400).json({status: -1, message: "Invalid Token Error: " +err})            // If wrong JWT token, will throw an error
    }
}

exports.verifyUser = async (req,res,next) => { 
    const user = await User.findOne({username: req.params.username})

    const recieved_token = req.header('auth-token')                                                
    if(!recieved_token || !user)  
        return res.status(401).json({status: -1, message: "Access Denied! Maybe Wrong auth-token Header?"}) 
    
    // VERIFY if it is the right user by checking the user's secret key for JWT
    const user_secret_key_recieved = await bcrypt.hash(user._id+user.email+user.username+user.password, process.env.USER_SECRET_KEY)                
    const verify_user_secret_key = await bcrypt.compare(user_secret_key_recieved, user.secret_key)
    if (!verify_user_secret_key)
        return res.status(401).json({status: -1, message: "Invalid Secret Key"}) 


    // VERIFY the user by checking if correct JWT
    let verified = null
    try{
        try{
            verified = jwt.verify(recieved_token, user_secret_key_recieved)                         // See if a right user is trying to access this router
        }                       
        catch(err){
            try{verified = jwt.verify(recieved_token, process.env.ADMIN_SECRET_TOKEN) }             // See if its the admin
            catch{throw err}                                                                        // If neither the admin or the right user, throw error        
        }
        req.user = verified                                                                         // req.user = JWT object
        next()
    }
    catch(err){
        return res.status(400).json({status: -1, message: "Invalid Token Error: " +err}) 
    }
}
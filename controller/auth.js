const User = require('../model/User')
const {registerValidation, loginValidation} = require('./validation')                   // 0) Import the Joi Validation functions



exports.registerNewUser = async (req,res,next) =>                                                                       // /api/user/register   - Add a new user to the DB
{
    const {error} = registerValidation(req.body)                                        // 1a) VALIDATE the post request body and see if it adhears to the rules of the schema
    if(error){
        return res.status(400).json({status:-1, message: error.details[0].message})
    }
    
    const user_exists  = await User.findOne({user: req.body.user})                      // 1b) VALIDATE the post request to see if user andm email already exists
    const email_exists = await User.findOne({email: req.body.email})
    if (user_exists)       return res.status(400).json({status: 0, message: "This User Already Registered!"}) 
    else if (email_exists) return res.status(400).json({status: 0, message: "This Email Already Registered!"}) 

    const new_user = new User({                                                         // 2) CAN NOW ADD: Populate the Mongoose Schema to push to the Post collection in the DB
        user: req.body.user,
        email: req.body.email,
        password: req.body.password,
    })
                     
    try{                                                                                // 3) Add the user to the DB
        const added_user = await new_user.save()
        res.json({status: 1, added_user: added_user})
    }
    catch(err){
        res.status(400).json({status: -1, message: err})
    }

}   
   
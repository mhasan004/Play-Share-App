const Joi = require('@hapi/joi')                                    

// Register validation
function registerValidation(data)
{
    const validationSchema = Joi.object({                                                   // MAKE VALIDATION SCHEMA to register a new user
        username: Joi.string().alphanum().min(3).max(15).required(),
        email: Joi.string().min(6).required().email(),
        password: Joi.string().min(6).required()
    })
    return validationSchema.validate(data)                                                  // VALIDATE Data of Post req before we add to DB
}

// Login validation
function loginValidationUsername(data)
{
    const validationSchema = Joi.object({                                                   // MAKE VALIDATION SCHEMA to login a user
        username: Joi.string().alphanum().min(3).max(10).required(),
        password: Joi.string().min(6).required()                                            // *** client posts an encrypted password!     
    })
    return validationSchema.validate(data)                                                  // VALIDATE Data of Post req before we add to DB
}


// Post validation
function postValidation(data)
{
    const validationSchema = Joi.object({
        title: Joi.string().min(2).max(30).required(),
        content: Joi.string().max(1000).required(),             //***VALIDATE URL
    })
    console.log("Validate url in joli for post")
    return validationSchema.validate(data)                                                 
}

module.exports.registerValidation = registerValidation
module.exports.loginValidationUsername = loginValidationUsername
module.exports.postValidation = postValidation

// VALIDATE URL
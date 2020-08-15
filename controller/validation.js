const Joi = require('@hapi/joi')                                    

// Register validation
function registerValidation(data){
    const validationSchema = Joi.object({                                                   // MAKE VALIDATION SCHEMA to register a new user
        user: Joi.string().min(3).required(),
        email: Joi.string().min(6).required().email(),
        password: Joi.string().min(6).required()
    })
    return validationSchema.validate(data)                                                  // VALIDATE Data of Post req before we add to DB
}

// Login validation
function loginValidation(data){
    const validationSchema = Joi.object({                                                   // MAKE VALIDATION SCHEMA to login a user
        email: Joi.string().min(6).required().email(),
        password: Joi.string().min(6).required()
    })
    return validationSchema.validate(data)                                                  // VALIDATE Data of Post req before we add to DB
}

module.exports.registerValidation = registerValidation
module.exports.loginValidation = loginValidation

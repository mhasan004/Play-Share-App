const Joi = require('@hapi/joi')                                    

// Register validation
function registerValidation(data)
{
    const validationSchema = Joi.object({                                                   // MAKE VALIDATION SCHEMA to register a new user
        // display_name: Joi.string().min(1).max(100).required(),
        username: Joi.string().alphanum().min(3).max(15).required(),
        email: Joi.string().min(6).email().required(),
        password: Joi.string().min(6).required()
    })
    return validationSchema.validate(data)                                                  // VALIDATE Data of Post req before we add to DB
}

// Login validation
function loginValidationUsername(data)
{
    const validationSchema = Joi.object({                                                   // MAKE VALIDATION SCHEMA to login a user
        username: Joi.string().alphanum().min(3).max(11).required(),
        password: Joi.string().min(6).required()                                            // *** client posts an encrypted password!     
    })
    return validationSchema.validate(data)                                                  // VALIDATE Data of Post req before we add to DB
}


// Post validation
function postValidation(data)
{
    const validationSchema = Joi.object({        
        username: Joi.string().alphanum().min(3).max(11).required(),
        group: Joi.string().min(1).max(15),
        group_type: Joi.string().min(1).max(20),
        title: Joi.string().min(2).max(75).required(),
        content: Joi.string().max(250),                                                     //.required(),                                       //***VALIDATE URL
        isURL: Joi.boolean(),
    })
    return validationSchema.validate(data)                                                 
}

// Edit A Post validation
function editPostValidation(data)
{
    const validationSchema = Joi.object({                                                   // no username chnage
        group: Joi.string().min(1).max(15),
        group_type: Joi.string().min(1).max(20),
        title: Joi.string().min(2).max(75).required(),
        content: Joi.string().max(250),                                                   
        isURL: Joi.boolean(),
    })
    return validationSchema.validate(data)                                                 
}


// Post validation
function postLikeDislikeValidation(data)
{
    const validationSchema = Joi.object({        
        username: Joi.string().alphanum().min(3).max(11).required(),
        postId:  Joi.string().alphanum().required(),
        likes: Joi.number().required(),
        dislikes: Joi.number().required(),
        total_likes: Joi.number().required(),
        user_liked: Joi.array().items(Joi.string()).required(),
        user_disliked: Joi.array().items(Joi.string()).required(),
    })
    return validationSchema.validate(data)                                                 
}

module.exports.registerValidation = registerValidation
module.exports.loginValidationUsername = loginValidationUsername
module.exports.postValidation = postValidation
module.exports.editPostValidation = editPostValidation
module.exports.postLikeDislikeValidation = postLikeDislikeValidation

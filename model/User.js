const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    user: {
        type: String,
        required: true,
        min: 3,
        max: 255
    },
    email: {
        type: String,
        required: true,
        min: 6,
        max: 255
    },
    password: {
        type: String,
        require: true,
        max: 1024,
        min: 6
    },
    date:{
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('User', userSchema)

// password needs top be hashed or it will be shown in plain text in the DB
// there is no validation of the schema yet so ppl can write passwords thats only one char instead of 6

// npm install @hapi/joi
const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username: {
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
    },
    secret_key:{
        type: String,
        default: "None"
    }
})

module.exports = mongoose.model('User', userSchema)
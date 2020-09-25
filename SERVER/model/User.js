const mongoose = require('mongoose')
// username, handle, email, password, key
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        min: 3,
        max: 255
    },
    handle: {
        type: String,
        required: false,
        min: 3,
        max: 20
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
        default: "None Yet"
    }
})

module.exports = mongoose.model('User', userSchema)
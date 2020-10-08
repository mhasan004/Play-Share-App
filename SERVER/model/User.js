const mongoose = require('mongoose')
// username - not changable, handle, displayname, email, password, key, date made
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        min: 3,
        max: 50
    },
    handle: {                           // same as username for now
        type: String,
        required: true,
        min: 3,
        max: 20
    },
    display_name: {                     // changable
        type: String,
        required: true,
        min: 1,
        max: 100
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
    secretKey:{
        type: String,
        default: "Not Logged In"
    }
})

module.exports = mongoose.model('User', userSchema)
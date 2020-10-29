const mongoose = require('mongoose')

const tokenSchema = new mongoose.Schema({
    refreshToken: {
        type: String,
        required: true,
    },
})

module.exports = mongoose.model('Token', tokenSchema)
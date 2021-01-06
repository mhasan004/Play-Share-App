const mongoose = require('mongoose')

const RFTokenSchema = new mongoose.Schema({
    refreshToken: {
        type: String,
        required: true,
    },
})

module.exports = mongoose.model('RFToken', RFTokenSchema)
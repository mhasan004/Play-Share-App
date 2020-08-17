const mongoose = require('mongoose')
const User = require('../model/User')
const postSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true,
        min:5
    },
    content:{
        type: String,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now
    },
    likes:{
        type: Number,
        default: 0
    },
    author:{
        type: String,                           // User's _id
        required: true, 
    }
})

module.exports = mongoose.model("Posts", postSchema)
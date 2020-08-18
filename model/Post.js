const mongoose = require('mongoose')

const postSchema = new mongoose.Schema({
    author:{
        type: String,                           // User's _id
        required: true, 
    },
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
    }
})

module.exports = mongoose.model("Posts", postSchema)
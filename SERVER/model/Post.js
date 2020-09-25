const mongoose = require('mongoose')

const postSchema = new mongoose.Schema({
    author:{            //username
        type: String,                           // User's _id
        required: true, 
    },
    title:{                     
        type: String,                           // title
        required: true,
        min:5
    },
    content:{
        type: String,                           // url of pic/img
        required: true,
    },
    date: {
        type: Date,
        default: Date.now
    },
    like:{                          //** chnaged from liek to dislike */
        type: Number,
        default: 0
    },
    dislike:{
        type: Number,
        default: 0
    }
})

module.exports = mongoose.model("Posts", postSchema)
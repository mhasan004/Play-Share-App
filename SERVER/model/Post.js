const mongoose = require('mongoose')

const postSchema = new mongoose.Schema({
    username:{                                  // username
        type: String,                           // User's _id
        required: true, 
    },
    // display_name:{                           // username - disabled for now
    //     type: String,                        // User's _id
    //     required: true, 
    // },
    handle:{                                    // username
        type: String,                           // User's _id
        required: true, 
    },
    title:{                     
        type: String,                           // title of img or post              --> IN THE FUTURE: LET USER EITHER PST TITLE ONLY OR URL ONLY
        required: true,
        min:5,
        max:20
    },
    content:{
        type: String,                           // url of pic/img                    --> IN THE FUTURE: LET USER EITHER POST TITLE ONLY OR URL ONLY     
    },
    // group:{
    //     type: String,                           // game group id
    //     min:1,
    //     max:20
    // },
    date: {
        type: Date,
        default: Date.now
    },
    like:{                          //** chnaged from liek to dislike */
        type: Number,
        default: 0
    },
    dislike:{           //addded this
        type: Number,
        default: 0
    },
    total_likes:{
        type: Number,
        default: 0
    }
})

module.exports = mongoose.model("Posts", postSchema)
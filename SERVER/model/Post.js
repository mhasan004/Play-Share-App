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
    handle:{                                                                                                                       //______________new                                    // username
        type: String,                           // User's _id
        required: true, 
    },
    title:{                     
        type: String,                           // title of img or post              --> IN THE FUTURE: LET USER EITHER PST TITLE ONLY OR URL ONLY
        required: true,
        min:2,
        max:75
    },
    content:{
        type: String,                           // url of pic/img          
        max:250
    },
    group:{
        type: String,                           // game group name
        min:1,
        max:20
    },
    group_type:{                                                                                                                       //______________new                                
        type: String,                           // game group type (game, etc)
        min:1,
        max:20
    },
    isURL: {                                                                                                                       //______________new
        type: Number,                           // game group type (game, etc)
        default: 0
    },
    date: {
        type: Date,
        default: Date.now
    },
    likes:{                          //** chnaged from liek to dislike */
        type: Number,
        default: 0
    },
    dislikes:{                                                                                                                       //______________new
        type: Number,
        default: 0
    },
    total_likes:{                                                                                                                       //______________new
        type: Number,
        default: 0
    },
    user_liked: {                                                                                                                       //______________new 
        type : Array , "default" : [] 
    },
    user_disliked: {                                                                                                                       //______________new 
        type : Array , "default" : [] 
    }
})

module.exports = mongoose.model("Posts", postSchema)
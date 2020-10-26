const mongoose = require('mongoose')

const postSchema = new mongoose.Schema({
    username:{                                  // username
        type: String,                           // User's _id
        required: true, 
        min: 3,
        max: 15
    },
    // display_name:{                           // username - disabled for now
    //     type: String,                        // User's _id
    //     required: true, 
    // },
    handle:{                                                                                                                       //______________new                                    // username
        type: String,                           // User's _id
        required: true, 
        min: 3,
        max: 12
    },
    group:{
        type: String,                           // game group name
        min:1,
        max:15
    },
    group_type:{                                                                                                                       //______________new                                
        type: String,                           // game group type (game, etc). so far only one parent gropup
        min:1,
        max:20
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

    
    isURL: {                                                                                                                       //______________new
        type: Boolean,                           // is content a url?
        default: 0
    },
    date: {
        type: Date,
        default: Date.now,
        max:22
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
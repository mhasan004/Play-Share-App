const mongoose = require('mongoose')

const postSchema = new mongoose.Schema({
    username:{                                                                                  // username
        type: String,                                                                            
        required: true, 
        min: 3,
        max: 15
    },
    // display_name:{                                                                           // username - disabled for now
    //     type: String,                                                                        // User's _id
    //     required: true, 
    // },
    handle:{                                                                                    // same as username for now
        type: String,                                                                           
        required: true, 
        min: 3,
        max: 12
    },
    group:{                                                                                     // game group name (game name, etc)
        type: String,                                              
        min:1,
        max:15
    },
    group_type:{                                                                                // game, meme, misc, none, what is the type of group. Parent grouping                              
        type: String,                          
        min:1,
        max:20
    },
    title:{                                                                                     // title of img or post              --> IN THE FUTURE: LET USER EITHER POST TITLE ONLY OR URL ONLY
        type: String,                           
        required: true,
        min:2,
        max:75
    },

    content:{                                                                                   // url of pic/img
        type: String,                                    
        max:250
    },
   
    isURL: {                                                                                    // is content a url?                                                               
        type: Boolean,                          
        default: 0
    },
    isFile: {                                                                                    // is content a url?                                                               
        type: Boolean,                          
        default: 0
    },
    date: {
        type: String, 
        // type: Date,
        default: new Date().toLocaleDateString('en-US'),
        // max:22
    },
    exact_date: {
        type: Date,
        default:  Date.now(),
        // max:22
    },
    likes:{                                                                                     
        type: Number,
        default: 0
    },
    dislikes:{                                                                                  
        type: Number,
        default: 0
    },
    total_likes:{                                                                               // total number
        type: Number,
        default: 0
    },
    user_liked: {                                                                               // keeping track of all users who liked to avoid doubles
        type : Array , "default" : [] 
    },
    user_disliked: {                                                                            // keeping track of all users who disliked to avoid doubles
        type : Array , "default" : [] 
    }
})

module.exports = mongoose.model("Posts", postSchema)
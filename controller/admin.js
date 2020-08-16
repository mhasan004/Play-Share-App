const User = require('../model/User')

exports.getUsers = async (req,res,next) => {
    const users = await User.find()
    res.json({users})
}
exports.getUser = async (req,res,next) => {
    const user_id = req.params.user_id
    const user = await User.findOne({_id: user_id})
    res.json({user})
}



exports.getPosts = (req,res,next) => {
    res.json({
        posts:{
            title: "Shouldn't be able to access this post without logging in"
        }
    })
}

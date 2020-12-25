const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema.Types
const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    followers:[{type:ObjectId,ref:"User"}],
    following:[{type:ObjectId,ref:"User"}],
    userProfilePic:{type:String, default:"https://res.cloudinary.com/alexyoon/image/upload/v1608700297/default_avatar_hafkna.jpg"}
})

mongoose.model('User',userSchema);
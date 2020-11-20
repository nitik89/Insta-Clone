const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema.Types
const userSchema= new mongoose.Schema({
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
    resetToken:String,
    expiresToken:Date,
    pic:{
        type:String,
        default:"https://www.google.co.in/url?sa=i&url=https%3A%2F%2Fwww.flaticon.com%2Ffree-icon%2Fuser_149071&psig=AOvVaw3Sy1e9CcdNcsYuj2W5LmT7&ust=1605811707905000&source=images&cd=vfe&ved=0CAIQjRxqFwoTCMiYgvbgjO0CFQAAAAAdAAAAABAD"
    },
    followers:[{type:ObjectId,ref:"User"}],
    following:[{type:ObjectId,ref:"User"}], 
})
mongoose.model("User",userSchema);
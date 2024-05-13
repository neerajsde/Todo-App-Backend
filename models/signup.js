const mongoose = require('mongoose');

const newuser = new mongoose.Schema({
    name:{
        type:String,
        maxLength:30,
        required: true
    },
    age:{
        type:Number,
        required:true
    },
    email:{
        type:String,
        maxLength:50,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    pendingTask:{
        type:Array
    },
    completedTask:{
        type:Array
    }
})

module.exports = mongoose.model("user", newuser);
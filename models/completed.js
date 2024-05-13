const mongoose = require('mongoose');

const completedTask = new mongoose.Schema({
    id:{
        type:String,
        required:true
    },
    task:{
        type:String,
        required:true
    },
    doneAt:{
        type:Date,
        default:Date.now(),
    }
});

module.exports = mongoose.model("Completed", completedTask);
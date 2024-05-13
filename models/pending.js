const mongoose = require('mongoose');

const pendingTask = new mongoose.Schema({
    id:{
        type:String,
        required:true
    },
    task:{
        type:String,
        required:true
    },
    createdAt:{
        type:Date,
        default:Date.now(),
    }
});

module.exports = mongoose.model("Pending", pendingTask);
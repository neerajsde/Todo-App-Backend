const mongoose = require('mongoose');

const completedTaskSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true
    },
    task: {
        type: String,
        required: true
    },
    doneAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('CompletedTask', completedTaskSchema);
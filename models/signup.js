const mongoose = require('mongoose');

const newUserSchema = new mongoose.Schema({
    name: {
        type: String,
        maxLength: 30,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    email: {
        type: String,
        maxLength: 50,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    pendingTask: [{ type: mongoose.Schema.Types.ObjectId, ref: 'PendingTask' }],
    completedTask: [{ type: mongoose.Schema.Types.ObjectId, ref: 'CompletedTask' }]
});

module.exports = mongoose.model("user", newUserSchema);
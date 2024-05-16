const Pending = require('../models/pending');
const user = require('../models/signup'); // Assuming User model is defined for 'signup'
require('dotenv').config();

exports.addPendingTask = async (req, res) => {
    try {
        const { id, task } = req.body;

        const newPendingTask = await Pending.create({id, task });

        // Find the user by ID and update the pendingTask array
        const updatedUser = await user.findByIdAndUpdate(
            {_id:id}, // Assuming 'id' is the user's ID
            { $push: { pendingTask: newPendingTask } }, // Use $push to add the new task to pendingTasks array
            { new: true } // To return the updated user document
        )
        .populate("pendingTask")
        .exec();

        // const userData = await user.findById({_id:id});

        console.log("Inserted Successfully");
        console.log(updatedUser);

        res.status(200).json({
            success: true,
            message: "New task added successfully",
            user: updatedUser
        });
    } catch (err) {
        console.error("Error:", err);
        res.status(500).json({
            success: false,
            message: "Failed to add new task",
            error: err.message
        });
    }
};
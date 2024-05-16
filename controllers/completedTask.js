const Completed = require('../models/completed');
const user = require('../models/signup'); // Assuming User model is defined for 'signup'
require('dotenv').config();

exports.addCompletedTask = async (req, res) => {
    try {
        const { id, task } = req.body;

        const completedTask = await Completed.create({id, task });

        // Find the user by ID and update the pendingTask array
        const updatedUser = await user.findByIdAndUpdate(
            {_id:id}, // Assuming 'id' is the user's ID
            { $push: { completedTask: completedTask } }, // Use $push to add the new task to pendingTasks array
            { new: true } // To return the updated user document
        )
        .populate("pendingTask", "completedTask")
        .exec();

        console.log("Inserted Successfully");
        console.log(updatedUser);

        res.status(200).json({
            success: true,
            message: "Task Completed successfully",
            user: updatedUser // Return the updated user document if needed
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
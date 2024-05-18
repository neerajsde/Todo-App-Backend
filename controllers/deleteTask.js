const User = require('../models/signup');
const PendingTask = require('../models/pending');
const CompletedTask = require('../models/completed');

exports.deleteTask = async (req, res) => {
    try {
        const { id, task_id } = req.body;

        // Fetch the task details before deleting
        const findUserDetails = await PendingTask.findById(task_id);
        if (!findUserDetails) {
            return res.status(404).json({
                success: false,
                message: 'Task not found'
            });
        }

        // Delete the task from PendingTask collection
        await PendingTask.findByIdAndDelete(task_id);

        // Update the user's pendingTask array to remove the task
        const updatedUser = await User.findByIdAndUpdate(
            {_id: id}, // Assuming 'id' is the user's ID
            { $pull: { pendingTask: task_id } },
            { new: true }
        );

        // Create a completed task entry
        const completed_task = await CompletedTask.create({
            id: id,
            task: findUserDetails.task
        });

        // Update the user's completedTask array to add the new completed task
        const delete_task = await User.findByIdAndUpdate(
            {_id: id}, // Assuming 'id' is the user's ID
            { $push: { completedTask: completed_task._id } }, // Only push the task ID
            { new: true }
        ).populate("pendingTask").populate("completedTask").exec();

        if (!updatedUser || !delete_task) {
            return res.status(404).json({
                success: false,
                message: 'User not found or task not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Task deleted and moved to completed successfully',
            user: delete_task
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: err.message
        });
    }
};
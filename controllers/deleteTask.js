const User = require('../models/signup');

exports.deleteTask = async (req, res) => {
    try {
        const { id, task_id } = req.body;
        
        const updatedUser = await User.findByIdAndUpdate(
            { _id: id },
            { $pull: { pendingTask: { id: task_id } } },
            { new: true }
        )
        .populate("pendingTask")
        .populate("completedTask")
        .exec();
        
        if (!updatedUser) {
            return res.status(404).json({
                success: false,
                message: 'User not found or task not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Task deleted successfully',
            updatedUser
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: err.message
        });
    }
};
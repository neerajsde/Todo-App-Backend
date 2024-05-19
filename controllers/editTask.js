const User = require('../models/signup');
const PendingTask = require('../models/pending');

exports.editTask = async(req, res) => {
    try{
        const {user_id, _id, task} = req.body;

        const updateTask = await PendingTask.findByIdAndUpdate(
            _id,
            {task: task},
            {new: true}
        );

        const userDetails = await User.findById({_id:user_id})
        .populate("pendingTask").populate("completedTask").exec();

        if(!userDetails){
            res.status(400).json({
                sucess:false,
                message:'user not found'
            })
        }

        res.status(200).json({
            sucess:true,
            user:userDetails,
            updateTask,
            message:'Task updated sucessfully'
        })
    }
    catch(err){
        res.status(500).json({
            sucess:false,
            message:'Task not updated',
            error:err.message
        })
    }
}
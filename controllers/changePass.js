const user = require('../models/signup');
const bcrypt = require('bcrypt');

exports.changePass = async (req, res) => {
    try{
        const {id, newPassword} = req.body;
        
        // parse password
        let hashPassword = "";
        try{
            hashPassword = await bcrypt.hash(newPassword, 10);
        }
        catch(err){
            return res.status(400).json({
                sucess:false,
                message:"error in to hashed password"
            })
        }

        const updatePassword = await user.findByIdAndUpdate(
            {_id:id},
            {password: hashPassword},
            {new: true}
        )

        res.status(200).json({
            sucess:true,
            user: updatePassword,
            message: 'Password updated sucessfully'
        })
    }
    catch(err){
        res.status(500).json({
            sucess:false,
            message:err.message
        })
    }
}
const user = require('../models/signup');
const bcrypt = require('bcrypt');

exports.changePass = async (req, res) => {
    try {
        const { email, newPassword } = req.body;

        // Find user by email
        const findEmail = await user.find({ email: email });

        if (findEmail.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'User not found'
            });
        }

        // Hash the new password
        let hashPassword = "";
        try {
            hashPassword = await bcrypt.hash(newPassword, 10);
        } catch (err) {
            return res.status(400).json({
                success: false,
                message: 'Error in hashing password'
            });
        }

        // Update the password
        const updatePassword = await user.findByIdAndUpdate(
            findEmail[0]._id, // Accessing the _id of the first user object
            { password: hashPassword },
            { new: true }
        );

        res.status(200).json({
            success: true,
            user: updatePassword,
            message: 'Password updated successfully'
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};
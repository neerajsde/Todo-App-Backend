const user = require('../models/signup');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
require('dotenv').config();

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

        // Create a transporter object using SMTP transport
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            secure: true,
            port: 465,
            auth: {
                user: process.env.EMAIL_USER, // your Gmail address from environment variable
                pass: process.env.EMAIL_PASS // your Gmail password from environment variable
            }
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Todo App - Password Changed Successfully',
            text: `Dear ${findEmail[0].name},

            We are writing to inform you that your password has been successfully changed.
            
            If you did not initiate this change, please contact our support team immediately to secure your account.
            
            Thank you for your attention to this matter and for using our Todo App.
            
            Best regards,
            The Todo App Team`
        };
        
        console.log("Mail Options:", mailOptions);         

        // Update the password
        const updatePassword = await user.findByIdAndUpdate(
            findEmail[0]._id, // Accessing the _id of the first user object
            { password: hashPassword },
            { new: true }
        );

        await transporter.sendMail(mailOptions);
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
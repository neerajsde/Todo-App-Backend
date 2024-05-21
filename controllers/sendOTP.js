const nodemailer = require('nodemailer');
const crypto = require('crypto');
const user = require('../models/signup');
require('dotenv').config();

// Function to generate a random OTP
function generateOTP() {
    return crypto.randomInt(100000, 999999).toString();
}

exports.sendOTP = async(req, res) => {
    const { email } = req.body;

    console.log("Request Body:", req.body); // Log the incoming request body

    if (!email) {
        return res.status(400).json({
            success: false,
            message: 'Email is required'
        });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({
            success: false,
            message: 'Invalid email format'
        });
    }

    try {
        const findEmail = await user.find({email:email});

        if (findEmail.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'User not found'
            });
        }
        console.log('User Find: ', findEmail);

        const otp = generateOTP();

        // Create a transporter object using SMTP transport
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            secure: true,
            port: 465,
            auth: {
                user: 'neeraj725086@gmail.com', // your Gmail address
                pass: process.env.APP_PASSWORD // your Gmail password
            }
        });

        const mailOptions = {
            from: 'neeraj725086@gmail.com',
            to: email,
            subject: 'Todo App - Password Change Verification Code',
            text: `Dear User,
    
    We received a request to reset your password for your Todo App account. Please use the following One-Time Password (OTP) to proceed with changing your password:
    
    ${otp}
    
    This OTP is valid for the next 10 minutes. If you did not request a password change, please secure your account and contact our support team immediately.
    
    Best regards,
    The Todo App Team`
        };

        console.log("Mail Options:", mailOptions); // Log the mail options to ensure the email is set

        await transporter.sendMail(mailOptions);
        res.status(200).json({
            success: true,
            message: 'OTP sent successfully'
        });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({
            success: false,
            message: 'Error sending OTP',
            error: error.message
        });
    }
}
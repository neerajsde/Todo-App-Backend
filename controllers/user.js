const user = require('../models/signup');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// vaidate email id
function validateEmail(email) {
    // Regular expression pattern for a valid email address
    const pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    
    // Test the email against the pattern
    return pattern.test(email);
}

// vaildate password
function validatePassword(password) {
    // Check if the password meets all criteria
    if (password.length < 8) {
        return "Password must be at least 8 characters long";
    }

    if (!password.match(/[a-z]/)) {
        return "Password must contain at least one lowercase letter";
    }

    if (!password.match(/[A-Z]/)) {
        return "Password must contain at least one uppercase letter";
    }

    if (!password.match(/[0-9]/)) {
        return "Password must contain at least one digit";
    }

    if (!password.match(/[!@#$%^&*()_+{}\[\]:;<>,.?~\\-]/)) {
        return "Password must contain at least one special character";
    }

    // If password meets all criteria
    return "Password is valid";
}

exports.createNewUser = async(req, res) => {
    try{
        const {name, age, email, password} = req.body;

        // verify correct email id
        if(!validateEmail(email)){
            return res.status(301).json({
                sucess:false,
                message:"unvaild email id"
            })
        }

        // check user already exits or not
        const isPersent = await user.findOne({email});
        if(isPersent){
            return res.status(401).json({
                sucess:false,
                message:"user already exits."
            })
        }

        // parse password
        let hashPassword = "";
        try{
            hashPassword = await bcrypt.hash(password, 10);
        }
        catch(err){
            return res.status(500).json({
                sucess:false,
                message:"error in to hashed password"
            })
        }

        const newUser = await user.create({
            name: name,
            age: age,
            email: email,
            password: hashPassword
        });

        res.status(200).json({
            sucess:true,
            user:newUser,
            message:"user created sucessfully"
        })
        console.log(newUser);
    }
    catch(err){
        res.status(500).json({
            sucess:false,
            message:"user not created",
            error:err.message
        })
    }
}

exports.logIn = async(req, res) => {
    try{
        const {email, password} = req.body;

        if(!validateEmail(email)){
            return res.status(402).json({
                sucess:false,
                message:"invaild email id"
            })
        }

        if(!validatePassword(password)){
            return res.status(402).json({
                sucess:false,
                message:"invaild password"
            })
        }

        const isPersent = await user.findOne({email});
        if(!isPersent){
            return res.status(401).json({
                sucess:false,
                message:"user not found."
            })
        }

        let OneUser = await user.findOne({email})
        .populate("pendingTask", "completedTask")
        .exec();

        try{
            const isVaildPass = await bcrypt.compare(password, OneUser.password);
            if(!isVaildPass){
                return res.status(501).json({
                    sucess:false,
                    message:"wrong password"
                })
            }
        }
        catch(err){
            return res.status(502).json({
                sucess:false,
                message:"something went wrong"
            })
        }

        const payload = {
            id: OneUser._id,
            name: OneUser.name,
            email: OneUser.email,
        }

        let token = jwt.sign(
            payload,
            process.env.JWT_SECRET,
            {
                expiresIn:"24h"
            }
        )
        OneUser = OneUser.toObject();
        OneUser.token = token,
        OneUser.password = undefined
        console.log(OneUser);

        // cookies
        const options = {
            expiresIn: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
            httpOnly:true
        }
        res.cookie("token", token, options).status(200).json({
            sucess:true,
            token:token,
            user:OneUser,
            message:"User Loged In sucessfully"
        });
        console.log({
            sucess:true,
            token:token,
            user:OneUser,
            message:"User Loged In sucessfully"
        });
    }
    catch(err){
        res.status(500).json({
            sucess:false,
            message:"something went wrong",
            error:err.message
        });
        console.log(err.message);
    }
}
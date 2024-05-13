const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.auth = (req, res, next) => {
    try{
        // printing token
        console.log("Cokkies: ", req.cookies.token);
        console.log("Body: ", req.body.token);

        let token = req.cookies.token || req.body.token;

        if (req.headers["authorization"]) {
            token = req.headers["authorization"].replace("Bearer ", "");
            console.log("Header: ", token);
        }

        if(!token){
            return res.status(400).json({
                sucess:false,
                message:"Token missing"
            })
        }

        // verify the token 
        try{
            const payload = jwt.verify(token, process.env.JWT_SECRET);
            console.log(payload);
            req.user = payload;
        }
        catch(err){
            return res.status(401).json({
                sucess:false,
                message:"token is inVaild"
            })
        }

        next();
    }
    catch(err){
        res.status(500).json({
            sucess:false,
            message: err.message
        })
    }
}
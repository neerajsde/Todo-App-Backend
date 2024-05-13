const mongoose = require('mongoose');
require('dotenv').config();

const DB_connection = async() => {
    mongoose.connect(process.env.DB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => {console.log("✅ Database connected sucessfully.")})
    .catch((err) => {
        console.log("❌ Database not connected");
        console.log(err);
    })
}

module.exports = DB_connection;
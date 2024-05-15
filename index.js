const express = require('express');
const app = express();

require('dotenv').config();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
const cookieParser = require('cookie-parser');
app.use(cookieParser());

const cors = require('cors');
app.use(cors());

// Define your default route handler before other routes
app.get('/', (req, res) => {
    res.send('<h1>Hello Ji This is Home Page</h1>');
});

// Route middleware for '/api/v1'
const routes = require('./routers/route');
app.use('/api/v1', routes);

// Start listening to the server
app.listen(PORT, () => {
    console.log(`Server is running at Port: ${PORT}`);
});

// Connect to database
require('./config/database')();
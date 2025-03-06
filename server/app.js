// Importing the necessary modules
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const dotenv = require('dotenv');
dotenv.config();
const cors = require('cors');

// Import Routes
const documentRoutes = require('./routes/DocumentsRoutes');
const applicationRoutes = require('./routes/ApplicationRoutes');
const userRoutes = require('./routes/UserRoutes');

// Creating the express app
const app = express();
app.use(express.json());

mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Database connected');
}).catch((err) => {
    console.error('Database connection error:', err);
});

// Setting up the middleware
app.use(morgan('dev'));
app.use(cors({origin: true, credentials: true}));

app.use('/api/documents', documentRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/users', userRoutes);

// Setting up the port
const port = process.env.PORT || 8080;

// Setting up the server
const server = app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

module.exports = server;

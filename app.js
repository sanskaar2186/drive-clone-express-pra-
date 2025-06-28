const express = require('express');
const path = require('path');
const ejs = require('ejs');
const userRouter = require('./routes/user.routes');
const connectDB = require('./config/db');
const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
connectDB();

const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/user', userRouter);





app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

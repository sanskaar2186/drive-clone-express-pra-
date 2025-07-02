const express = require('express');
const path = require('path');
const ejs = require('ejs');
const cookieParser = require('cookie-parser');
const userRouter = require('./routes/user.routes');
const indexRouter = require('./routes/index.routes');
const connectDB = require('./config/db');
const mongoose = require('mongoose');

require('dotenv').config();

// Connect to MongoDB
connectDB();

const app = express();


app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/user', userRouter);
app.use('/', indexRouter);

app.get('/', (req, res) => {
  res.render('index');
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});

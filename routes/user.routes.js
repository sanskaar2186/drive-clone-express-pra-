const express = require('express');
const path = require('path');
const { body,validationResult } = require('express-validator');
const UserModel = require('../models/user.model'); 
const bcrypt = require('bcrypt'); 
const jwt = require('jsonwebtoken'); 


const router = express.Router();



router.get('/register' , (req , res)=>{
    res.render('register');
})


router.post('/register',
    body('email').trim().isEmail().isLength({min:10}),
    body('password').trim().isLength({min:5}),
    body('UserName').trim().isLength({min:3}),
    async (req, res) => {

        // Validate the request body
        const errors = validationResult(req);   
        console.log(errors);    
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array(),message: "Invalid input" });
        }

        const { UserName, email, password } = req.body;

        // Check if the user already exists
        const existingUser = await UserModel.findOne({ UserName });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashpassword = await bcrypt.hash(password, 10);
        
        // Create a new user
        const newUser = await UserModel.create({
            UserName:UserName,
            email: email,
            password: hashpassword
        });
        
        try {
            await newUser.save();
        } catch (error) {
            console.error("Error saving user:", error);
            return res.status(500).json({ message: "Internal server error" });
        }

        if (!newUser) {
            return res.status(500).json({ message: "Failed to create user" });
        }
        
        res.json({
            message: "Registration successful",
            user: {
                UserName: newUser.UserName,
                email: newUser.email
            }
        });
});



router.get('/login', (req, res) => {
    // Render the login page
    console.log(req.query);
    const message = req.query.msg || '';
    res.render('login', { message: message });
});

router.post('/login', 
    body('email').trim().isEmail().isLength({min:10}),
    body('password').trim().isLength({min:5}),
    async (req, res) => {
        // Validate the request body
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array(), message: "Invalid input" });
        }
        
        const { email, password } = req.body;

        // Find the user by email
        const user = await UserModel.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        // Compare the password with the hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        // If using JWT, generate a token here
        const token = jwt.sign({ id: user._id,email: user.email,username: user.username }, process.env.JWT_SECRET, { expiresIn: '5m' });
        if (!token) {
            return res.status(500).json({ message: "Failed to generate token" });
        }

        // Set the token in a cookie (optional)
        res.cookie('token',token, {
            httpOnly: true, // Prevents client-side access to the cookie );
            secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
            maxAge: 5 * 60 * 1000 // Cookie expires in 5 minutes
        });
        console.log("Token set in cookie:", token);


        // Respond with success
        res.json({
            message: "Login successful",
            user: {
                UserName: user.UserName,
                email: user.email
            },
            token: token // Include the token in the response
        });
});





module.exports  = router
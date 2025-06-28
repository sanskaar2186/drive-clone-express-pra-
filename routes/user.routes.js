const express = require('express');
const path = require('path');
const { body,validationResult } = require('express-validator');
const UserModel = require('../models/user.model'); 


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
        // Create a new user
        const newUser = await UserModel.create({
            UserName,
            email,
            password
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





module.exports  = router
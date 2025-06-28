const express = require('express');
const path = require('path');
const { body,validationResult } = require('express-validator');


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


        console.log(req.body);
        res.json({
            message: "Registration successful",
            user: {
                UserName: req.body.UserName,
                email: req.body.email
            }
        });
});





module.exports  = router
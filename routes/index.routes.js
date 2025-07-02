const express = require('express');

const router = express.Router();



router.get('/home', (req, res) => {
    // Render the home page
    // You can pass any data to the view if needed
    // For example, if you have user data to display:
    console.log(req.query);
    const message = req.query.msg || '';
    res.render('home', { message });

    
});








module.exports = router;
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    UserName: { 
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        unique: true,
        minlength:[3, 'Username must be at least 3 characters long'],

    },
    email: { 
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: [10, 'Email must be at least 10 characters long'],
    },
    password: { 
        type: String,
        required: true,
        trim: true,
        minlength: [5, 'Password must be at least 5 characters long'],
    }
    }, {
    timestamps: true
});


const User = mongoose.model('User', userSchema);
module.exports = User;
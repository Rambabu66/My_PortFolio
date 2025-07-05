const User = require('../models/ProjectsSehema').User; // Correct import path
const validator = require('validator');
const crypto = require('crypto');

// This is a placeholder for other auth functions you might have
// exports.signup = async (req, res) => { ... };
// exports.login = async (req, res) => { ... };


// Register
const register = async (req, res) => {
    try {
        if (!req.body) {
            return res.status(400).json({ message: "Request body is missing" });
        }
        let { userName, email, password, confirmPassword } = req.body;
        // trim input
        userName = userName.trim();
        email = email.trim();
        password = password.trim();
        confirmPassword = confirmPassword.trim();
        if (!userName || !email || !password || !confirmPassword) {
            return res.status(400).json({ message: "All fields are required" });
        }
        if (!validator.isEmail(email)) {
            return res.status(400).json({ message: "Invalid email" });
        }
        if (password !== confirmPassword) {
            return res.status(400).json({ message: "Passwords do not match" });
        }
        // Check if username or email already exists
        const existingUser = await User.findOne({ $or: [{ userName }, { email }] });
        if (existingUser) {
            return res.status(400).json({ message: "UserName or Email already exists" });
        }
        // create and save user
        const newUser = new User({ userName, email, password });
        await newUser.save();

        res.status(201).json({ message: "User registered successfully" });

    } catch (error) {
        console.log("Error in register", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
const login = async (req, res) => {
    try {
        if (!req.body) {
            return res.status(400).json({ message: "Request body is missing" });
        }
        const { userNameorEmail, password } = req.body; // 'identifier' can be username or email

        if (!userNameorEmail || !password) {
            return res.status(400).json({ message: "Username/Email and password are required" });
        }

        // Find user by either username or email
        const user = await User.findOne({
            $or: [{ userName: userNameorEmail }, { email: userNameorEmail }],
        });

        if (!user) {
            return res.status(401).json({ message: "Invalid username/email or password" });
        }

        // Compare password
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid username/email or password" });
        }

// Generate a token (you'll need to implement this)
const token = user.generateAuthToken(); // Assuming you have this method

        // Login successful
        res.status(200).json({ message: "Login successful",token });
    } catch (error) {
        console.error("Error in login", error);
        res.status(500).json({ message: "Internal server error" });
    }
};


module.exports = { register,login };

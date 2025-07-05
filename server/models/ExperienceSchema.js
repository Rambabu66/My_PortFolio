const mongoose = require('mongoose');

const experienceSchema = new mongoose.Schema({
    Title: {
        type: String,
        required: [true, "Title is required"],
        trim: true
    },
    Company: {
        type: String,
        required: [true, "Company is required"],
        trim: true
    },
    city: { // New field
        type: String,
        required: [true, "City is required"],
        trim: true
    },
    state: { // New field
        type: String,
        required: [true, "State is required"],
        trim: true
    },
    Years: {
        type: String, // Consider if a more specific type like Number or a Date range is better
        required: [true, "Years of experience is required"]
    },
    Description: {
        type: String,
        trim: true // Description can be optional
    }
}, { timestamps: true });

const Experience = mongoose.model('Experience', experienceSchema);

module.exports = { experince: Experience };
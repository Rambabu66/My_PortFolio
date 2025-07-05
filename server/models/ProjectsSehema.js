const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

// Define the user schema
const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
  
});

// Hash the password before saving
userSchema.pre('save', async function (next) {
    if(!this.isModified('password')){
        return next()
    }
    try {
        const salt = await bcrypt.genSalt(10)
        this.password = await bcrypt.hash(this.password,salt)
        next()
    } catch (error) {
        next(error); // Pass error to the next middleware
    }
})
// Method to compare passwords
userSchema.methods.comparePassword = async function (password) {
    try {
        return await bcrypt.compare(password, this.password)
    } catch (error) {
        throw error; // Throw the error to be caught by the controller
    }
}

// / Method to generate a JWT
userSchema.methods.generateAuthToken = function () {
    try {
      const token = jwt.sign(
        { _id: this._id, userName: this.userName, email: this.email },
        process.env.JWT_SECRET,
        {
          expiresIn: process.env.JWT_EXPIRES_IN || '1h', // Use env var or default to 1h
        }
      );
      return token;
    } catch (error) {
      console.error('Error generating JWT:', error);
      throw new Error('Failed to generate authentication token');
    }
  };

// Method to generate password reset token
userSchema.methods.createPasswordResetToken = function () {
    const resetToken = crypto.randomBytes(32).toString('hex');

    this.passwordResetToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');

    // Token expires in 10 minutes
    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

    return resetToken;
};
  



//  Define ProjectSchema
const projectSchema =new mongoose.Schema({
    projectName:{
        type:String,
        required:true
    },
    projectDescription:{
        type:String,
        required:true
    },
    projectGitHubLink:{
        type:String,
        required:true
    },
    projectLiveLink:{
        type:String,
        required:true
    },
    projectTechStack:{
        type:String,
        required:true
    },
  projectFeatures:{
    type:String,
    required:true
  },
  projectMultiImages:[{
    type:String,
    required:true
  }]
},
{
    timestamps:true
}
)

// Skills schema
const skillsSchema = new mongoose.Schema({
    skillName: {
        type: String,
        required: [true, 'Skill name is required'] // Added error message
    },
    skillDescription: {
        type: String,
        required: [true, 'Skill description is required'] // Added error message
    },
    skillIcons: {
        type: String,
        required: [true, 'Skill icon is required'] // Added error message
    }
}, {
    timestamps: true // Adds createdAt and updatedAt timestamps
});


// Create the User model
const User = mongoose.model('AllUser', userSchema);
const Projects = mongoose.model('AllProjects',projectSchema)
const Skills = mongoose.model('AllSkills',skillsSchema)

module.exports = {User,Projects,Skills}

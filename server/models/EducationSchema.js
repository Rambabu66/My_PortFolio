const mongoose=require('mongoose');


const EducationDetailSchema=new mongoose.Schema({ 
   Stream: {
        type: String,
        required: true,
        trim: true 
    },
    collegeName: {
        type: String,
        required: [true, 'College name is required']
    },
    city: {
        type: String,
        required: [true, 'City is required']
    },
    state: {
        type: String,
        required: [true, 'State is required']
    },
    years: { // Could be a string like "2018-2022" or a number for duration
        type: String,
        required: [true, 'Years are required']
    },
 
    description: {
        type: String,
        required: false // Assuming description might be optional
    }
}, {
    timestamps: true // Adds createdAt and updatedAt timestamps
});


const education=mongoose.model('EducationDetails',EducationDetailSchema)

module.exports={education}
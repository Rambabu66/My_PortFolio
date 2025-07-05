import { configureStore } from '@reduxjs/toolkit'
import authController from '../features/auth/authSlice'
import projectReucer from '../features/products/projectSlice'
import contactReducer from '../features/contact/contactSlice'
import educationReducer from '../features/Education/education';
import experinceReducer from '../features/Experince/ExperinceSlice';
import skillsReducer from "../features/skills/skillsSlice"


const store =configureStore({
    reducer:{
        auth:authController,
        projects:projectReucer,
        contact:contactReducer,
         educations: educationReducer,
         experiences:experinceReducer, // Standardized key name (optional, but good practice)
         skills:skillsReducer
         
        

    }
})


export default store
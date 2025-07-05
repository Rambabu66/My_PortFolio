import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"

import axios from "axios";

// const Api_Url = "http://localhost:5004/api";
const Api_Url = "https://my-portfolio-5pkf.onrender.com/api";

const initialState = {
    experiences:[], // Standardized to plural
    status:'idle',
    error:null
}

// Get Experiences
export const getExperiences = createAsyncThunk( // Renamed for clarity
    "experiences/getExperiences", // Standardized action type
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${Api_Url}/experince/getExperince`); // Corrected typo
            // Robust handling of API response
            if (Array.isArray(response.data)) {
                return response.data;
            } else if (response.data && Array.isArray(response.data.experiences)) {
                return response.data.experiences; // If data is nested
            } else {
                console.warn("API did not return an array for experiences. Payload:", response.data);
                return []; // Return empty array to prevent UI errors
            }
        } catch (error) {
            if (error.response) { // Corrected typo
                return rejectWithValue(error.response.data);
            } else {
                return rejectWithValue(error.message);
            }
        }
    }
)

//  Create Experience
export const createExperience = createAsyncThunk( // Renamed for clarity
    "experiences/createExperience", // Standardized action type
    async (experinceData, { rejectWithValue} ) =>{
        try {
            const responce = await axios.post(`${Api_Url}/experince/addExperince`, experinceData)
            return responce.data
        } catch (error) {
             if (error.response) {
        return rejectWithValue(error.response.data);
      } else {
        return rejectWithValue(error.message);
      }
        }
    }
)

// Delet Experince
export const deleteExperince = createAsyncThunk(
    "experiences/deleteExperince",
    async(id, {rejectWithValue} ) => {
        try {
            const responce = await axios.delete(`${Api_Url}/experince/deleteExperince/${id}`)
            return responce.data
        } catch (error) {
            if(error.responce){
                return rejectWithValue(error.responce.data)
            }else{
                return rejectWithValue(error.message)
            }
        }
    }
)
// Edit Experince
export const editExperince = createAsyncThunk(
    "experiences/editExperince",
    async({id , experinceData}, {rejectWithValue}) =>{
        try {
            const responce =await axios.put(`${Api_Url}/experince/updateExperince/${id}`, experinceData)
            return responce.data
        } catch (error) {
            if (error.responce) {
                return rejectWithValue(error.responce.data)
            } else {
                return rejectWithValue(error.message)
            }
        }
    }
)

const experienceSlice = createSlice({
    name:'experiences',
    initialState,
    
    reducers: {
        clearExperienceError: (state) => {
            state.error = null;
          },
    },
    extraReducers: (builder) => {
    builder
        .addCase(getExperiences.pending, (state) => {
            state.status = "loading";
            state.error = null;
        })
        .addCase(getExperiences.fulfilled, (state, action) => {
            state.status = "succeeded";
            state.experiences = action.payload; // Use plural form
        })
        .addCase(getExperiences.rejected, (state, action) => {
            state.status = "failed";
            state.error = action.payload;
            state.experiences = []; // Use plural form
        })
        .addCase(createExperience.pending, (state) => {
            state.status = "loading";
            state.error = null;
        })
        // CreateExperince
        .addCase(createExperience.fulfilled,(state, action) => { // Corrected argument order
            state.status = "succeeded";
            state.experiences.unshift(action.payload); // Use plural form
        })
        .addCase(createExperience.rejected, (state, action) =>{
            state.status = "failed";
            state.error = action.payload;
        })
        // DeleteExperince
        .addCase(deleteExperince.pending, (state) => {
            state.status = "loading";
            state.error = null;
        })
        .addCase(deleteExperince.fulfilled, (state, action) => {
            state.status = "succeeded";
            const deletedExperinceId = action.meta.arg;
            state.experiences = state.experiences.filter((exp) => exp._id !== deletedExperinceId)
        })
        .addCase(deleteExperince.rejected, (state, action) => {
            state.status = "failed";
            state.error = action.payload;
        })
        // EditExperince
        .addCase(editExperince.pending, (state) => {})


    }
    
})


export const { clearExperienceError } = experienceSlice.actions;
export default experienceSlice.reducer;
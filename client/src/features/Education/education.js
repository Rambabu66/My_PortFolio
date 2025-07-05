// e_RSD-REACT-PROJECTS_Portfolio-fullproject_client_src_features_educations_educationSlice.js
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// API URL (assuming it's the same base as projects)
const Api_Url = "https://my-portfolio-8m08.onrender.com/api"; // Adjust if your education API is different

// Initial state
const initialState = {
  educations: [],
  status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

// Async Thunks

// Get all educations
export const getEducations = createAsyncThunk(
  "education/getEducation",
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(`${Api_Url}/education/getEducation`);
      if (Array.isArray(response.data)) {
        return response.data;
      } else if (response.data && Array.isArray(response.data.educations)) {
        return response.data.educations;
      } else {
        console.warn(
          "API did not return an array for educations. Payload:",
          response.data
        );
        return [];
      }
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Create new education
export const createEducation = createAsyncThunk(
  "education/createEducation",
  async (educationData, thunkAPI) => {
    try {
      const response = await axios.post(
        `${Api_Url}/education/createEducation`,
        educationData
      );
      // Ensure the actual education object is returned for the reducer
      if (response.status === 201 && response.data) {
        // If your API returns the education object nested, e.g., under a key like "education" or "data"
        if (response.data.education) {
          return response.data.education; // Adjust "education" if your API uses a different key
        }
        return response.data; // If the API returns the education object directly in response.data
      } else {
        const message =
          response.data?.message ||
          "Failed to create education: Unexpected status code " +
            response.status;
        return thunkAPI.rejectWithValue(message);
      }
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);
// Update education
export const updateEducation = createAsyncThunk(
  "education/updateEducation", // <-- Changed this string
  async (payload, thunkAPI) => {
    const { educationId, updates } = payload;
    if (!educationId) {
      return thunkAPI.rejectWithValue(
        "Update failed: Education ID is missing."
      );
    }
    try {
      const response = await axios.put(
        `${Api_Url}/education/updateEducation/${educationId}`, // Corrected API endpoint
        updates
      );
      if (response.status === 200 && response.data) {
        return response.data; // Return the updated education object
      } else {
        const message =
          response.data?.message ||
          "Failed to update education: Unexpected status code " +
            response.status;
        return thunkAPI.rejectWithValue(message);
      }
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Delete education
export const deleteEducation = createAsyncThunk(
  "education/deleteEducation",
  async (educationId, thunkAPI) => {
    try {
      await axios.delete(`${Api_Url}/education/deleteEducation/${educationId}`);
      return educationId; // Return the ID of the deleted education
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

const educationSlice = createSlice({
  name: "educations",
  initialState,
  reducers: {
    clearEducationError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get Educations
      .addCase(getEducations.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(getEducations.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.educations = action.payload;
      })
      .addCase(getEducations.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
        state.educations = [];
      })
      // Create Education
      .addCase(createEducation.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createEducation.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.educations.unshift(action.payload); // Add to the beginning
      })
      .addCase(createEducation.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      // Update Education
      .addCase(updateEducation.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateEducation.fulfilled, (state, action) => {
        state.status = "succeeded";
        const index = state.educations.findIndex(
          (edu) => edu._id === action.payload._id
        );
        if (index !== -1) {
          state.educations[index] = action.payload;
        }
      })
      .addCase(updateEducation.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      // Delete Education
      .addCase(deleteEducation.pending, (state) => {
        state.status = "loading"; // Or a specific 'deleting' status
      })
      .addCase(deleteEducation.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.educations = state.educations.filter(
          (edu) => edu._id !== action.payload // action.payload is educationId
        );
      })
      .addCase(deleteEducation.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { clearEducationError } = educationSlice.actions;
export default educationSlice.reducer;

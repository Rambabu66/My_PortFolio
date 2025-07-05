import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// const Api_Url = "http://localhost:5004/api";
const Api_Url = "https://my-portfolio-8m08.onrender.com/api";

const initialState = {
  skills: [],
  status: "idle",
  error: null,
};

// GetSkills
export const getSkills = createAsyncThunk(
  "skills/getSkills",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${Api_Url}/skills/getAllSkills`);
      return response.data;
    } catch (error) {
      if (error.response) {
        return rejectWithValue(error.response.data);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);
// deleteSkilss
export const deleteSkills = createAsyncThunk(
  "skills/deleteSkills",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.delete(
        `${Api_Url}/skills/deleteSkill/${id}`
      );
      return response.data;
    } catch (error) {
      if (error.response) {
        return rejectWithValue(error.response.data);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);

// Create Skill
export const createSkill = createAsyncThunk(
  "skills/createSkill", // Corrected action type string for consistency
  async (skillData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${Api_Url}/skills/createSkills`, // Assuming this is the correct endpoint
        skillData
      );
      // Assuming the API returns the newly created skill object on success
      return response.data;
    } catch (error) {
      if (error.response) {
        return rejectWithValue(error.response.data);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
)

// Update Skill
export const updateSkill = createAsyncThunk(
  "skills/updateSkill",
  async ({ id, skillData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${Api_Url}/skills/updateSkill/${id}`, // Assuming this is the correct endpoint
        skillData
      );
      // Assuming the API returns the updated skill object on success
      return response.data;
    } catch (error) {
      if (error.response) {
        return rejectWithValue(error.response.data);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);


const skillsSlice = createSlice({
  name: "skills",
  initialState,
  reducers: {
    clearSkillsError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getSkills.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(getSkills.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.skills = action.payload;
      })
      .addCase(getSkills.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
        state.skills = [];
      })
       // DeleteSkills
      .addCase(deleteSkills.pending, (state) => {
        state.status = "loading"; // You might use a more specific status like "deleting" if needed
        state.error = null;
      })
      .addCase(deleteSkills.fulfilled, (state, action) => {
        state.status = "succeeded";
        // action.meta.arg contains the id passed to the deleteSkills thunk
        const deletedSkillId = action.meta.arg;
        state.skills = state.skills.filter(skill => skill._id !== deletedSkillId);
        // action.payload is the response from the server (response.data)
      })
      .addCase(deleteSkills.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload; // This is the value from rejectWithValue
      })
      // Create Skill
      .addCase(createSkill.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(createSkill.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.skills.unshift(action.payload); // Add the new skill to the beginning
      })
      .addCase(createSkill.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      // Update Skill
      .addCase(updateSkill.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(updateSkill.fulfilled, (state, action) => {
        state.status = "succeeded";
        const updatedSkill = action.payload;
        const index = state.skills.findIndex(skill => skill._id === updatedSkill._id);
        if (index !== -1) {
          state.skills[index] = updatedSkill;
        }
      })
      .addCase(updateSkill.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { clearSkillsError } = skillsSlice.actions;
export default skillsSlice.reducer;

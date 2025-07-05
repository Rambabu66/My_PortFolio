// e:\RSD-REACT-PROJECTS\Portfolio-fullproject\client\src\features\products\projectSlice.js
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axios from "axios"

// Appi call
// const Api_Url = "http://localhost:5004/api"
const Api_Url = "https://my-portfolio-5pkf.onrender.com/api"

// initial state
const initialState = {
    projects: [],
    project: null,
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
    role: [" Software Developer", "full stack developer"],

}

// getProject
export const getProjects = createAsyncThunk(
    'projects/getProjects',
    async (_, thunkAPI) => {
        try {
            const response = await axios.get(`${Api_Url}/projects/getAllProject`);
            // Ensure the data returned is actually an array before returning it
            if (Array.isArray(response.data)) {
                return response.data;
            } else if (response.data && Array.isArray(response.data.projects)) {
                // Example: Handle if the array is nested like { projects: [...] }
                return response.data.projects;
            } else {
                console.warn("API did not return an array for projects. Payload:", response.data);
                return []; // Return empty array to prevent .map error
            }
        } catch (error) {
            const message = (error.response?.data?.message) || error.message || error.toString(); // Use optional chaining
            return thunkAPI.rejectWithValue(message);
        }
    }
);

//  delete project
export const deleteProject = createAsyncThunk(
    'projects/deleteProject',
    async (projectId, thunkAPI) => {
        try {
            await axios.delete(`${Api_Url}/projects/deleteProject/${projectId}`);
            return projectId;
        } catch (error) {
            const message = (error.response?.data?.message) || error.message || error.toString(); // Use optional chaining
            return thunkAPI.rejectWithValue(message);
        }
    }
)

// createProjects
export const createProject = createAsyncThunk(
    'projects/createProject',
    async (projectData, thunkAPI) => {
        try {
            // Ensure Content-Type is set for FormData if your backend needs it explicitly
            // (axios usually does this automatically for FormData)
            const response = await axios.post(`${Api_Url}/projects/createProject`, projectData /*, { headers: { 'Content-Type': 'multipart/form-data' } }*/);
            // Check for successful creation status code (e.g., 201)
            if (response.status === 201 && response.data) {
                return response.data; // Return the newly created project object
            } else {
                // Use response data if available, otherwise a generic message
                const message = response.data?.message || 'Failed to create project: Unexpected status code ' + response.status;
                return thunkAPI.rejectWithValue(message);
            }
        } catch (error) {
            const message = (error.response?.data?.message) || error.message || error.toString(); // Use optional chaining
            return thunkAPI.rejectWithValue(message);
        }
    }
)

// UpdateProject
export const updateProject = createAsyncThunk(
    'projects/updateProject',
    async (payload, thunkAPI) => {
        const { id, updates } = payload; // 'updates' is now expected to be FormData

        if (!id) {
            return thunkAPI.rejectWithValue('Update failed: Project ID is missing.');
        }
        if (!(updates instanceof FormData)) {
            // Optional: Add a check or log a warning if not FormData,
            // though the modal should always send FormData now for updates.
            console.warn("updateProject expected FormData but received:", typeof updates);
            // Depending on your API, you might still allow JSON updates for non-file changes
            // return thunkAPI.rejectWithValue('Update failed: Invalid payload type.');
        }

        try {
            const response = await axios.put(`${Api_Url}/projects/updateProject/${id}`, updates);

            // *** CRITICAL STEP 1: Backend Response ***
            // What does your backend actually return here?
            // It MUST return the *complete, updated* project object for the reducer to work correctly.
            console.log("Backend update response data:", response.data); // <-- Add this log
            if (response.status === 200 && response.data) {
                return response.data; // Return the updated project
            } else {
                const message = response.data?.message || 'Failed to update project: Unexpected status code ' + response.status;
                return thunkAPI.rejectWithValue(message);
            }
        } catch (error) {
            console.error("Update project error:", error.response?.data || error.message); // Log more details
            const message = (error.response?.data?.message) || error.message || error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// --- Define the new Async Thunk ---
export const getProjectById = createAsyncThunk(
    'projects/getProjectById',
    async (projectId, { rejectWithValue }) => {
        try {
            // --- FIX HERE: Use the Api_Url constant ---
            const response = await axios.get(`${Api_Url}/projects/getSingleProject/${projectId}`); // Use the full base URL
            // It's good practice to check the response status too
            if (response.status === 200 && response.data) {
                return response.data; // Assuming the API returns the project object directly
            } else {
                 // Handle cases where the API returns a success status but no data, or an unexpected status
                 return rejectWithValue(`Failed to fetch project: Status ${response.status}`);
            }
        } catch (error) {
            // Handle network errors or errors thrown by the backend
            const message = error.response?.data?.message || error.message || 'Failed to fetch project';
            return rejectWithValue(message);
        }
    }
);


// create slice
const projectSlice = createSlice({
    name: 'projects',
    initialState,
    reducers: {
        // You could add simple reducers here if needed, e.g., to clear errors manually
        clearProjectError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // --- Get Projects ---
            .addCase(getProjects.pending, (state) => {
                state.status = 'loading'
                // state.projects = []; // Keep existing projects during refresh? Or clear? Decide based on UX.
                state.error = null;
            })
            .addCase(getProjects.fulfilled, (state, action) => {
                state.status = 'succeeded'
                state.projects = action.payload // Assumes payload is the array of projects
                state.error = null;
            })
            .addCase(getProjects.rejected, (state, action) => {
                state.status = 'failed'
                state.error = action.payload
                state.projects = []; // Clear projects on initial load failure
            })
            // --- Delete Project ---
            .addCase(deleteProject.pending, (state) => {
                state.status = 'loading'; // Or a specific 'deleting' status
                state.error = null; // Clear previous errors
            })
            .addCase(deleteProject.fulfilled, (state, action) => {
                state.status = 'succeeded';
                // action.payload is the projectId
                state.projects = state.projects.filter(project => project._id !== action.payload);
                state.error = null;
            })
            .addCase(deleteProject.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload; // Store the error message
            })
            // --- Create Project ---
            .addCase(createProject.pending, (state) => {
                state.status = 'loading'; // Or 'creating'
                state.error = null; // Clear previous errors
            })
            .addCase(createProject.fulfilled, (state, action) => {
                state.status = 'succeeded';
                // action.payload is the new project object
                // Add to the beginning for newest first, or end
                state.projects.unshift(action.payload);
                state.error = null;
            })
            .addCase(createProject.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload; // Store the error message
            })
            // *** ADD Update Project Cases ***
            .addCase(updateProject.pending, (state) => {
                state.status = 'loading'; // Or 'updating'
                state.error = null; // Clear previous errors
            })
            // In projectSlice.js
            .addCase(updateProject.fulfilled, (state, action) => {
                state.status = 'succeeded';
                const updatedProject = action.payload; // Payload from backend response
                console.log("projectSlice.js: Reducer received payload (updatedProject):", updatedProject);
                console.log("projectSlice.js: Current state.projects IDs:", state.projects.map(p => p._id));
            
                // *** The Check ***
                const index = state.projects.findIndex(project => project._id === updatedProject?._id);
                console.log(`Reducer: Found project at index: ${index} for ID: ${updatedProject?._id}`); // Debug log
            
                if (index !== -1) {
                    // Update successful in state
                    state.projects[index] = updatedProject;
                    console.log("Reducer: State updated successfully."); // Debug log
                } else {
                    // *** The Warning You're Seeing ***
                    // This means the project._id from the backend response payload
                    // was NOT found within the current state.projects array.
                    console.warn("Reducer: Project not found in state, update skipped. Check IDs."); // <-- THIS LINE
                }
                state.error = null;
            }) 
            .addCase(updateProject.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
                console.error("Reducer: Update project rejected:", action.payload); // <-- Good to log errors too
            })
             // --- Get Project By ID --- <<<< ADD THESE
             .addCase(getProjectById.fulfilled, (state, action) => {
                state.status = 'succeeded';
                // Make sure you are updating the 'project' property, not 'projects' array
                state.project = action.payload.project; // Assuming the API returns the project object directly
                state.error = null;
              })
              .addCase(getProjectById.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || 'Failed to fetch project';
                state.project = null; // Clear project details on error
              })
              .addCase(getProjectById.pending, (state) => {
                state.status = 'loading';
                state.error = null;
               // Optionally clear previous project details while loading new one
               // state.project = null;
              })
    }
})

// Export any new non-thunk reducers if added
// export const { clearProjectError } = projectSlice.actions;

export default projectSlice.reducer

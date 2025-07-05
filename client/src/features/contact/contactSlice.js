// src/features/contact/contactSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import emailjs from '@emailjs/browser';

// --- Configuration (Best Practice: Use Environment Variables) ---
// Store these in your .env file and access them via process.env.REACT_APP_*
const EMAILJS_SERVICE_ID ='service_pziu264';
const EMAILJS_TEMPLATE_ID = 'template_arn3quh';
const EMAILJS_PUBLIC_KEY = 'nOIzjjhblgq5BC3JF'; // Or User ID depending on your setup

// --- Initial State ---
const initialState = {
  status: 'idle', // 'idle' | 'sending' | 'succeeded' | 'failed'
  error: null,
};

// --- Async Thunk for Sending Email ---
export const sendContactEmail = createAsyncThunk(
  'contact/sendEmail',
  async (formData, { rejectWithValue }) => {
    // Basic validation
    if (!EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID || !EMAILJS_PUBLIC_KEY) {
        console.error("EmailJS environment variables are not set!");
        return rejectWithValue('Email configuration error. Please contact support.');
    }
    if (!formData || typeof formData !== 'object') {
        return rejectWithValue('Invalid form data provided.');
    }
     // Ensure required fields are present in formData (adjust based on your template)
     if (!formData. user_name || !formData. user_email || !formData.message) {
        return rejectWithValue('Please fill in all required fields (Name, Email, Message).');
    }
    

    try {
      console.log('Sending email with data:', formData); // Log data being sent
      // The third argument to emailjs.send should be the template parameters (your formData)
      // The fourth argument is your Public Key (or User ID)
      const result = await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        formData, // This object should match the variables in your EmailJS template
        EMAILJS_PUBLIC_KEY
      );

      console.log('EmailJS Success:', result.text);
      // You can return a success message or the result object if needed
      return { message: 'Your message has been sent successfully!' };

    } catch (error) {
      console.error('EmailJS Error:', error);
      // Provide a user-friendly error message
      const message = error.text || 'Failed to send message. Please try again later.';
      return rejectWithValue(message);
    }
  }
);

// --- Contact Slice Definition ---
const contactSlice = createSlice({
  name: 'contact',
  initialState,
  reducers: {
    // Optional: Reducer to reset the status if the user wants to send another message
    resetContactStatus: (state) => {
      state.status = 'idle';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendContactEmail.pending, (state) => {
        state.status = 'sending';
        state.error = null;
      })
      .addCase(sendContactEmail.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.error = null;
        // Optionally store the success message from action.payload.message
      })
      .addCase(sendContactEmail.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload; // Error message from rejectWithValue
      });
  },
});

// --- Export Actions and Reducer ---
export const { resetContactStatus } = contactSlice.actions;
export default contactSlice.reducer;

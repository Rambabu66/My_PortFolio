import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  token: localStorage.getItem("authToken") || null,
  isAuthenticated: !!localStorage.getItem("authToken"),
  isLoading: false,
  error: null,
};
// console.log('Initial token from localStorage:', initialState.token); // Log initial token


const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.token = action.payload;
      state.isAuthenticated = true;
      state.isLoading = false;
      state.error = null;
      localStorage.setItem('authToken', action.payload);
    },
    authStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    authError: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    registerSuccess: (state) => {
      state.isLoading = false;
      state.error = null;
    },
    forgotPasswordSuccess: (state) => {
      state.isLoading = false;
      state.error = null;
    },
    
    logout: (state) => {
      state.token = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.error = null;
      localStorage.removeItem('authToken');
    },
  },
});

export const {
  loginSuccess,
  logout,
  authStart,
  authError,
  registerSuccess,
  forgotPasswordSuccess,
} = authSlice.actions;
export default authSlice.reducer;
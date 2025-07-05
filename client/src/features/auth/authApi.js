import axios from 'axios'

const API = axios.create({
  // baseURL: "http://localhost:5004/api/auth"
  baseURL: "https://my-portfolio-5pkf.onrender.com/api/auth"

});

export const login = async (credentials) => {
    console.log('Data being sent to login:', credentials);
    try {
      const response = await API.post('/login', credentials);
      return response.data;
    } catch (error) {
      console.error('Error during login request:', error);
      throw error; // Re-throw the error to be handled in Login.js
    }
  };
  
export const register = async (credentials) => {
    console.log('Data being sent to register:', credentials);
    try {
      const response = await API.post('/register', credentials);
      return response.data;
    } catch (error) {
      console.error('Error during registration request:', error);
      throw error;
    }
  };
  
export const forgotPassword = async (email) => {
    console.log('Data being sent for password reset:', email);
    try {
      const response = await API.post('/forgot-password', email);
      return response.data;
    } catch (error) {
      console.error('Error during forgot password request:', error);
      throw error;
    }
  };
  
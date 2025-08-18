import { createSlice } from "@reduxjs/toolkit";

// Get initial auth state from localStorage
const getInitialAuthState = () => {
  const token = localStorage.getItem('authToken');
  const user = localStorage.getItem('user');
  
  return {
    isAuthenticated: !!token && !!user,
    user: user ? JSON.parse(user) : null,
    token: token || null,
    login: {
      email: "",
      password: "",
      isLoading: false,
    },
    signup: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      whatsappNumber: '',
      companyName: '',
      industry: '',
      companySize: '',
      city: '',
      state: '',
      role: '',
      isLoading: false,
    },
  };
};

const initialState = getInitialAuthState();

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setLoginField: (state, action) => {
      const { field, value } = action.payload;
      state.login[field] = value;
    },
    setLoginLoading: (state, action) => {
      state.login.isLoading = action.payload;
    },
    setSignupField: (state, action) => {
      const { field, value } = action.payload;
      state.signup[field] = value;
    },
    setSignupLoading: (state, action) => {
      state.signup.isLoading = action.payload;
    },
    setAuthenticated: (state, action) => {
      state.isAuthenticated = action.payload.isAuthenticated;
      state.user = action.payload.user || null;
      state.token = action.payload.token || null;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.login = { email: "", password: "", isLoading: false };
      state.signup = {
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        whatsappNumber: '',
        companyName: '',
        industry: '',
        companySize: '',
        city: '',
        state: '',
        role: '',
        isLoading: false,
      };
      // Clear localStorage
      localStorage.removeItem('user');
      localStorage.removeItem('authToken');
    },
  },
});

export const {
  setLoginField,
  setLoginLoading,
  setSignupField,
  setSignupLoading,
  setAuthenticated,
  logout,
} = authSlice.actions;

export default authSlice.reducer;


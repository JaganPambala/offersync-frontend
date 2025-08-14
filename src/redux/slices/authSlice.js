import { createSlice } from "@reduxjs/toolkit";


const initialState = {
  isAuthenticated: false,
  user: null,
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
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
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


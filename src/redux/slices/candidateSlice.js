import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    // Form data remains the same
    formData: {
        pan: '',
        aadhaar: '',
        email: '',
        phone: '',
    },
    // New structure aligned with API response
    duplicateCount: 0,
    candidates: [],
    recommendations: [],
    message: null,
    hasDuplicates: null
};

const candidateSlice = createSlice({
    name: "candidate",
    initialState,
    reducers: {
        setCandidateFormField(state, action) {
            const { field, value } = action.payload;
            state.formData[field] = value;
        },
        setCandidateCheckResult(state, action) {
            const { success, message, data, hasDuplicates } = action.payload;
            if (success && data) {
                state.duplicateCount = data.duplicateCount || 0;
                state.candidates = data.candidates || [];
                state.recommendations = data.recommendations || [];
            } else {
                state.duplicateCount = 0;
                state.candidates = [];
                state.recommendations = [];
            }
            state.message = message;
            state.hasDuplicates = hasDuplicates;
        },
        clearCandidateCheckResult(state) {
            state.duplicateCount = 0;
            state.candidates = [];
            state.recommendations = [];
            state.message = null;
            state.hasDuplicates = null;
        }
    }
});

export const { 
    setCandidateFormField, 
    setCandidateCheckResult,
    clearCandidateCheckResult 
} = candidateSlice.actions;

export default candidateSlice.reducer;  

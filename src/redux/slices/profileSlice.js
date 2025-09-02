import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  editMode: false,
  editedProfile: null,
};

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    startEditing: (state, action) => {
      state.editMode = true;
      state.editedProfile = action.payload;
    },
    cancelEditing: (state) => {
      state.editMode = false;
      state.editedProfile = null;
    },
    updateEditedProfile: (state, action) => {
      state.editedProfile = {
        ...state.editedProfile,
        ...action.payload
      };
    }
  }
});

export const { startEditing, cancelEditing, updateEditedProfile } = profileSlice.actions;

// Updated selectors with safe fallbacks
export const selectEditMode = (state) => state?.profile?.editMode ?? false;
export const selectEditedProfile = (state) => state?.profile?.editedProfile ?? null;

export default profileSlice.reducer; 
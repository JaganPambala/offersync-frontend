import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isLoading: false,
  error: null,
  communications: [],
  selectedCommunication: null
};

const communicationSlice = createSlice({
  name: 'communication',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setCommunications: (state, action) => {
      state.communications = action.payload;
    },
    updateCommunicationOutcome: (state, action) => {
      const { communicationId, outcome } = action.payload;
      state.communications = state.communications.map(comm => 
        comm.id === communicationId 
          ? { ...comm, outcome, status: 'RESOLVED' }
          : comm
      );
    }
  }
});

export const {
  setLoading,
  setError,
  setCommunications,
  updateCommunicationOutcome
} = communicationSlice.actions;

export default communicationSlice.reducer; 
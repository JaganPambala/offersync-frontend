import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import candidateReducer from "./slices/candidateSlice";
import offerReducer from "./slices/offerSlice";
import profileReducer from "./slices/profileSlice";

import { authApi } from "./api/authApiSlice";
import { candidateApi } from "./api/candidateApiSlice";
import { offerApi } from "./api/offerApiSlice";
import { communicationApi } from './api/communicationApiSlice';
import { dashboardApi } from './api/dashboard.apiSlice';
import { profileApi } from './api/profileApiSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    candidate: candidateReducer,
    offer: offerReducer,
    profile: profileReducer, // Add profile reducer
    [authApi.reducerPath]: authApi.reducer,
    [candidateApi.reducerPath]: candidateApi.reducer,
    [offerApi.reducerPath]: offerApi.reducer,
    [communicationApi.reducerPath]: communicationApi.reducer,
    [dashboardApi.reducerPath]: dashboardApi.reducer,
    [profileApi.reducerPath]: profileApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware, 
      candidateApi.middleware,
      offerApi.middleware,
      communicationApi.middleware,
      dashboardApi.middleware,
      profileApi.middleware
    ),
});

export default store;
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import candidateReducer from "./slices/candidateSlice";
import offerReducer from "./slices/offerSlice";

import { authApi } from "./api/authApiSlice";
import { candidateApi } from "./api/candidateApiSlice";
import { offerApi } from "./api/offerApiSlice";
import { communicationApi } from './api/communicationApiSlice';
import { dashboardApi } from './api/dashboard.apiSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    candidate: candidateReducer,
    offer: offerReducer,
  [authApi.reducerPath]: authApi.reducer,
  [candidateApi.reducerPath]: candidateApi.reducer,
  [offerApi.reducerPath]: offerApi.reducer,
  [communicationApi.reducerPath]: communicationApi.reducer,
  [dashboardApi.reducerPath]: dashboardApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware, 
      candidateApi.middleware,
      offerApi.middleware,
      communicationApi.middleware,
      dashboardApi.middleware
    ),
});

export default store;
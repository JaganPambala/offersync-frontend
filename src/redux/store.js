import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import candidateReducer from "./slices/candidateSlice";
import offerReducer from "./slices/offerSlice";
import { authApi } from "./api/authApiSlice";
import { candidateApi } from "./api/candidateApiSlice";
import { offerApi } from "./api/offerApiSlice";
import { communicationApi } from './api/communicationApiSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    candidate: candidateReducer,
    offer: offerReducer,
    [authApi.reducerPath]: authApi.reducer,
    [candidateApi.reducerPath]: candidateApi.reducer,
    [offerApi.reducerPath]: offerApi.reducer,
    [communicationApi.reducerPath]: communicationApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware, 
      candidateApi.middleware,
      offerApi.middleware,
      communicationApi.middleware
    ),
});

export default store;
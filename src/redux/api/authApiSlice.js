import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_URL, navigationLinks } from '../../utils/constants';

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({
    baseUrl: API_URL, // Set your API base URL if needed
    prepareHeaders: (headers) => {
      // Add auth headers if needed
        headers.set('Content-Type', 'application/json');
      return headers;
    },
  }),
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: navigationLinks.login.path,
        method: 'POST',
        body: credentials,
      }),
    }),
    signup: builder.mutation({
      query: (userData) => ({
        url: navigationLinks.register.path,
        method: 'POST',
        body: userData,
      }),
    }),
  }),
});

export const { useLoginMutation, useSignupMutation } = authApi;
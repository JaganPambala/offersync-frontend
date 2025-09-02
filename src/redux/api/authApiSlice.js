import { createApi } from '@reduxjs/toolkit/query/react';
import { createApiSlice } from './baseApiConfig';
import { navigationLinks } from '../../utils/constants';

export const authApi = createApi(
  createApiSlice({
    reducerPath: 'authApi',
    endpoints: (builder) => ({
      login: builder.mutation({
        query: (credentials) => ({
          url: navigationLinks.login.path,
          method: 'POST',
          body: credentials,
        }),
        invalidatesTags: ['Auth'],
      }),
      signup: builder.mutation({
        query: (userData) => ({
          url: navigationLinks.register.path,
          method: 'POST',
          body: userData,
        }),
        invalidatesTags: ['Auth'],
      }),
    }),
    extraConfig: {
      tagTypes: ['Auth'],
    },
  })
);

export const { useLoginMutation, useSignupMutation } = authApi;
import { createApi } from '@reduxjs/toolkit/query/react';
import { createApiSlice } from './baseApiConfig';

export const profileApi = createApi(
  createApiSlice({
    reducerPath: 'profileApi',
    endpoints: (builder) => ({
      getProfile: builder.query({
        query: () => '/auth/myProfile',
        providesTags: ['Profile'],
      }),
      updateProfile: builder.mutation({
        query: (profileData) => ({
          url: '/auth/updateProfile',
          method: 'PUT',
          body: profileData,
        }),
        invalidatesTags: ['Profile'],
      }),
    }),
    extraConfig: {
      tagTypes: ['Profile'],
    },
  })
);

export const { useGetProfileQuery, useUpdateProfileMutation } = profileApi; 
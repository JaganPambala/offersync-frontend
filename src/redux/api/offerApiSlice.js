import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_URL } from "../../utils/constants";
import { navigationLinks } from "../../utils/constants";

export const offerApi = createApi({
  reducerPath: "offerApi",
  baseQuery: fetchBaseQuery({
    baseUrl: API_URL,
    prepareHeaders: (headers, { getState }) => {
      // Set default headers
      headers.set("Content-Type", "application/json");

      // Try to get token from Redux state first
      const token = getState()?.auth?.token;

      // Fallback to localStorage if not in Redux state
      const localToken = localStorage.getItem("authToken");

      const finalToken = token || localToken;

      console.log("Token from Redux:", token);
      console.log("Token from localStorage:", localToken);
      console.log("Final token being used:", finalToken);

      if (finalToken) {
        headers.set("Authorization", `Bearer ${finalToken}`);
        console.log("Authorization header set:", `Bearer ${finalToken}`);
      } else {
        console.warn("No token found in Redux state or localStorage");
      }

      return headers;
    },
  }),
  endpoints: (builder) => ({
    createOffer: builder.mutation({
      query: (data) => {
        console.log("Creating offer with data:", data);
        return {
          url: navigationLinks.offerCreate.path,
          method: "POST",
          body: data,
        };
      },
    }),
    createCompetitiveOffer: builder.mutation({
      query: ({ candidateId, data }) => ({
        url: `/candidate/${candidateId}/offer`,
        method: "POST",
        body: {
          ...data,
          isCompetitive: true,
        },
      }),
      invalidatesTags: ["Offers"],
    }),
    updateOffer: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/offers/${id}/status`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Offers"],
    }),
    deleteOffer: builder.mutation({
      query: (id) => ({
        url: `/offers/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Offers"],
    }),
    getAllOffers: builder.query({
      query: () => ({
        url: "/offers",
        method: "GET",
      }),
      transformResponse: (response) => {
        console.log("Raw API response:", response);
        if (response?.success && Array.isArray(response.data)) {
          return response;
        }
        return {
          success: false,
          data: [],
          pagination: {
            total: 0,
            page: 1,
            limit: 10,
            pages: 0,
          },
        };
      },
      providesTags: ["Offers"],
    }),
  }),
});

export const {
  useCreateOfferMutation,
  useCreateCompetitiveOfferMutation,
  useUpdateOfferMutation,
  useGetAllOffersQuery,
  useDeleteOfferMutation,
} = offerApi;

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_URL } from "../../utils/constants";

export const communicationApi = createApi({
  reducerPath: "communicationApi",
  baseQuery: fetchBaseQuery({
    baseUrl: API_URL,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("authToken");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      headers.set("Content-Type", "application/json");
      return headers;
    },
  }),
  tagTypes: ["Communication"],
  endpoints: (builder) => ({
    // Get all communications
    getCommunications: builder.query({
      query: () => "/communication",
      providesTags: ["Communication"],
    }),

    // Get single communication
    getCommunicationById: builder.query({
      query: (id) => `/communication/${id}`,
      providesTags: (result, error, id) => [{ type: "Communication", id }],
    }),

    // Update communication outcome
    updateCommunicationOutcome: builder.mutation({
      query: ({ communicationId, outcomeData }) => ({
        url: `/communication/${communicationId}/outcome`,
        method: "POST",
        body: outcomeData,
      }),
      // Invalidate the cache to trigger a refetch
      invalidatesTags: ["Communication"],
    }),

    // Create new communication
    createCommunication: builder.mutation({
      query: (communicationData) => ({
        url: "/communication/initiate",
        method: "POST",
        body: communicationData,
      }),
      invalidatesTags: ["Communication"],
    }),

    // Get communications by candidate
    getCommunicationsByCandidate: builder.query({
      query: (candidateId) => `/communications/candidate/${candidateId}`,
      providesTags: (result, error, candidateId) => [
        { type: "Communication", id: `candidate-${candidateId}` },
      ],
    }),
  }),
});

// Export hooks for usage in components
export const {
  useGetCommunicationsQuery,
  useGetCommunicationByIdQuery,
  useUpdateCommunicationOutcomeMutation,
  useCreateCommunicationMutation,
  useGetCommunicationsByCandidateQuery,
} = communicationApi;

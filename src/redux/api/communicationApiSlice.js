import { createApi } from "@reduxjs/toolkit/query/react";
import { createApiSlice } from "./baseApiConfig";

export const communicationApi = createApi(
  createApiSlice({
    reducerPath: "communicationApi",
    endpoints: (builder) => ({
      getCommunications: builder.query({
        query: () => "/communication",
        providesTags: ["Communication"],
      }),

      getCommunicationById: builder.query({
        query: (id) => `/communication/${id}`,
        providesTags: (result, error, id) => [{ type: "Communication", id }],
      }),

      updateCommunicationOutcome: builder.mutation({
        query: ({ communicationId, outcomeData }) => ({
          url: `/communication/${communicationId}/outcome`,
          method: "POST",
          body: outcomeData,
        }),
        invalidatesTags: ["Communication"],
      }),

      createCommunication: builder.mutation({
        query: (communicationData) => ({
          url: "/communication/initiate",
          method: "POST",
          body: communicationData,
        }),
        invalidatesTags: ["Communication"],
      }),

      getCommunicationsByCandidate: builder.query({
        query: (candidateId) => `/communications/candidate/${candidateId}`,
        providesTags: (result, error, candidateId) => [
          { type: "Communication", id: `candidate-${candidateId}` },
        ],
      }),
    }),
    extraConfig: {
      tagTypes: ["Communication"],
    },
  })
);

export const {
  useGetCommunicationsQuery,
  useGetCommunicationByIdQuery,
  useUpdateCommunicationOutcomeMutation,
  useCreateCommunicationMutation,
  useGetCommunicationsByCandidateQuery,
} = communicationApi;

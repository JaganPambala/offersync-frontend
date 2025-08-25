import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_URL, navigationLinks } from "../../utils/constants";

export const candidateApi = createApi({
  reducerPath: "candidateApi",
  baseQuery: fetchBaseQuery({
    baseUrl: API_URL,
    prepareHeaders: (headers) => {
      headers.set("Content-Type", "application/json");
      const token = localStorage.getItem("authToken");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    // ✅ already in your code
    checkForCandidate: builder.mutation({
      query: (caninfo) => ({
        url: navigationLinks.candidateCheck.path,
        method: "POST",
        body: caninfo,
      }),
    }),

    // ✅ NEW: fetch candidate + offers
    getCandidateOffers: builder.query({
      query: (candidateId) => navigationLinks.manageOffer.path.replace(":candidateId", candidateId)  ,
    }),

    // ✅ NEW: delete offer
    deleteOffer: builder.mutation({
      query: (offerId) => ({
        url: `/offers/${offerId}`,
        method: "DELETE",
      }),
    }),
  }),
});

// export hooks
export const {
  useCheckForCandidateMutation,
  useGetCandidateOffersQuery,
  useDeleteOfferMutation,
} = candidateApi;

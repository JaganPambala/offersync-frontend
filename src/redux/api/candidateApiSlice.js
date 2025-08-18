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
    }
  }),
  endpoints: (builder) => ({
    checkForCandidate: builder.mutation({
      query: (caninfo) => ({
        url: navigationLinks.candidateCheck.path,
        method: "POST",
        body: caninfo,
      })
    }),
  }),
});

export const { useCheckForCandidateMutation } = candidateApi;




    
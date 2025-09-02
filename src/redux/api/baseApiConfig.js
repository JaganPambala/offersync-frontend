import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_URL } from "../../utils/constants";

export const baseApiConfig = {
  baseQuery: fetchBaseQuery({
    baseUrl: API_URL,
    prepareHeaders: (headers, { getState }) => {
      // Always set Content-Type
      headers.set("Content-Type", "application/json");

      // Get token from Redux state
      const token = getState()?.auth?.token;

      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }

      return headers;
    },
  }),
  tagTypes: ["Auth", "Profile", "Offer", "Communication", "Dashboard", "Candidate"],
};

export const createApiSlice = ({ reducerPath, endpoints, extraConfig = {} }) => {
  return {
    reducerPath,
    ...baseApiConfig,
    ...extraConfig,
    endpoints,
  };
}; 
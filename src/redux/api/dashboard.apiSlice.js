
import { createApi } from "@reduxjs/toolkit/query/react";
import { createApiSlice } from "./baseApiConfig";

export const dashboardApi = createApi(
  createApiSlice({
    reducerPath: "dashboardApi",
    endpoints: (builder) => ({
      getPublicDashboard: builder.query({
        query: () => "/dashboard/public",
        providesTags: ["Dashboard"],
      }),
      getHrDashboard: builder.query({
        query: () => "/dashboard",
        providesTags: ["Dashboard"],
      }),
    }),
    extraConfig: {
      tagTypes: ["Dashboard"],
    },
  })
);

export const {
  useGetPublicDashboardQuery,
  useGetHrDashboardQuery,
} = dashboardApi;

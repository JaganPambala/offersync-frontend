
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_URL } from "../../utils/constants";

export const dashboardApi = createApi({
	reducerPath: "dashboardApi",
	baseQuery: fetchBaseQuery({
		baseUrl: API_URL,
		prepareHeaders: (headers, { getState }) => {
			headers.set("Content-Type", "application/json");
			// For HR dashboard, set token if available
			const token = getState()?.auth?.token || localStorage.getItem("authToken");
			if (token) {
				headers.set("Authorization", `Bearer ${token}`);
			}
			return headers;
		},
	}),
	endpoints: (builder) => ({
		getPublicDashboard: builder.query({
			query: () => "/dashboard/public",
		}),
		getHrDashboard: builder.query({
			query: () => "/dashboard",
		}),
	}),
});

export const {
	useGetPublicDashboardQuery,
	useGetHrDashboardQuery,
} = dashboardApi;

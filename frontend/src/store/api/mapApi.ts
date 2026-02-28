import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { UserLocation, MapResponse } from "../slices/mapSlice";

export const mapApi = createApi({
  reducerPath: "mapApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:8000/api",
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as any).auth?.token;
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      headers.set("Content-Type", "application/json");
      return headers;
    },
  }),
  endpoints: (build) => ({
    submitLocation: build.query<MapResponse, UserLocation>({
      query: ({ latitude, longitude, radius }) => ({
        url: "/pois",
        method: "GET",
        params: {
          lat: latitude,
          lng: longitude,
          rad: radius,
        },
      }),
      transformResponse: (response: MapResponse, meta, arg) => response,
      transformErrorResponse: (
        response: { status: string | number },
        meta,
        arg,
      ) => response.status,
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          console.log("POIs received:", data);
        } catch (err) {
          console.warn("Failed to fetch POIs:", err);
        }
      },
    }),
  }),
});

export const { useLazySubmitLocationQuery } = mapApi;

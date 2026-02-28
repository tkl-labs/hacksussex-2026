import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { UserLocation, MapResponse } from "../slices/mapSlice";

export const mapApi = createApi({
  reducerPath: "mapApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:8000/api",
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
    submitLocation: build.mutation<MapResponse, UserLocation>({
      query: (body) => ({
        url: "/pois",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const { useSubmitLocationMutation } = mapApi;

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { UserLocation, MapResponse } from "../slices/mapSlice";

type getDescRequest = {
  name: string[];
};

export type descPlaces = {
  name: string;
  desc: string;
};

type getDescResponse = {
  places: descPlaces[];
};

export type MP3Request = {
  text: string;
};

export type MP3Response = Blob;

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
        url: "/pois/",
        method: "POST",
        body: {
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
    }),

    getPOIsDesc: build.query<getDescResponse, getDescRequest>({
      query: ({ name }) => ({
        url: "/desc/",
        method: "POST",
        body: {
          name: name,
        },
      }),
      transformResponse: (response: getDescResponse, meta, arg) => response,
      transformErrorResponse: (
        response: { status: string | number },
        meta,
        arg,
      ) => response.status,
    }),

    getMP3: build.query<MP3Response, MP3Request>({
      query: ({ text }) => ({
        url: "/tts/",
        method: "POST",
        body: { text },
        responseHandler: (response) => response.blob(),
      }),
      transformErrorResponse: (
        response: { status: string | number },
        meta,
        arg,
      ) => response.status,
    }),
  }),
});

export const {
  useLazySubmitLocationQuery,
  useLazyGetPOIsDescQuery,
  useLazyGetMP3Query,
} = mapApi;

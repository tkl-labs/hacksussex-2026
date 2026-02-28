import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type UserLocation = {
  latitude: number;
  longitude: number;
};

type POI = {
  lat: number;
  lng: number;
  radius: number;
};

export type MapResponse = {
  id: string;
  pois: POI[];
};

type MapState = {
  location: UserLocation | null;
};

const initialState: MapState = {
  location: null,
};

const mapSlice = createSlice({
  name: "map",
  initialState,
  reducers: {
    setLocation(state, action: PayloadAction<UserLocation>) {
      state.location = action.payload;
    },
    clearLocation(state) {
      state.location = null;
    },
  },
});

export const { setLocation, clearLocation } = mapSlice.actions;
export default mapSlice.reducer;

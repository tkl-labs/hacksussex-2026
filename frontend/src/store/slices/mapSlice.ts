import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type UserLocation = {
  latitude: number;
  longitude: number;
  radius: number;
};

type POI = {
  formattedAddress: string;
  displayName: string;
  latitude: number;
  longitude: number;
};

export type MapResponse = {
  places: POI[];
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

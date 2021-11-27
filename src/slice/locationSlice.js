import { createSlice } from "@reduxjs/toolkit";

const initialState = [];

const locationSlice = createSlice({
  name: "location",
  initialState,
  reducers: {
    setUserLocation: (state, action) => {
      state = action.payload;
      return state;
    },
  },
});
export const { setUserLocation } = locationSlice.actions;
export default locationSlice.reducer;

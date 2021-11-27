import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchBuyer = createAsyncThunk("buyerInfo/fetchBuyer", async (data) => {
  // const url = process.env.BUYER_ROUTE || 'http://localhost:8080/buyer';
  const url = '/buyer'
  const buyer = await axios.get(url+`/${data}`, {
    headers: JSON.parse(localStorage.getItem("eatable")),
  });
  return buyer.data[0];
});

const initialState = {};

const buyerInfoSlice = createSlice({
  name: "buyerInfo",
  initialState,
  reducers: {},
  extraReducers: {
    [fetchBuyer.fulfilled]: (state, action) => {
      return action.payload;
    }
  },
});

export default buyerInfoSlice.reducer;

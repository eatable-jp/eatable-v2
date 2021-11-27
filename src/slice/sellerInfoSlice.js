import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchSeller = createAsyncThunk("sellerInfo/fetchSeller", async (data) => {
  // const url = process.env.SELLER_ROUTE || 'http://localhost:8080/seller';
  const url = '/seller'
  const seller = await axios.get(url+`/${data}`, {
    headers: JSON.parse(localStorage.getItem("eatable")),
  });
  return seller.data[0];
});

const initialState = {};

const sellerInfoSlice = createSlice({
  name: "sellerInfo",
  initialState,
  reducers: {},
  extraReducers: {
    [fetchSeller.fulfilled]: (state, action) => {
      return action.payload;
    },
  },
});

export default sellerInfoSlice.reducer;

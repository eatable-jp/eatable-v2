import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  // original list of items
  items: [],
  // list of filtered items
  filteredItems: [],
};

export const fetchItems = createAsyncThunk(
  'items/fetchItems', async() => {
    try{
      // const url = process.env.ITEMS_ROUTE || 'http://localhost:8080/items'
      const url = '/items'
      const response = await axios.get(url, {
        headers: JSON.parse(localStorage.getItem("eatable")),
      });
      return response.data;
    }catch(error){
      console.log(error);
    }
  }
)

const itemsSlice = createSlice({
  name: "items",
  initialState,
  reducers: {
    // Filter by food type func
    filterByFoodType: (state, action) => {
      state.filteredItems =
        action.payload === "all"
          ? state.items
          : state.items.filter((item) => item.type === action.payload);
      return state;
    },
    //Filter by expiration func
    filterByExpiration: (state, action) => {
      if (action.payload === "") {
        state.filteredItems = state.items;
      } else if (action.payload === "Furthest From Expiration") {
        state.filteredItems = state.items.sort((a, b) => { return new Date(a.expiration_date) - new Date(b.expiration_date)});
      } else {
        state.filteredItems = state.items.sort((a, b) => { return new Date(b.expiration_date) - new Date(a.expiration_date)});
      }
      return state;
    }

  },
  extraReducers: {
    [fetchItems.fulfilled]: (state, action) => {
      const itemsForSale = action.payload.filter((item) => item.buyer_id === null);
      state.items = itemsForSale;
      state.filteredItems = itemsForSale;
    }
  },
});

export const { filterByFoodType, filterByExpiration } = itemsSlice.actions;
export default itemsSlice.reducer;

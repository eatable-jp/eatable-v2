import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = []

export const fetchSellers = createAsyncThunk("sellers/fetchSellers",async()=>{
    try{
        // const url = process.env.SELLERS_ROUTE || 'http://localhost:8080/sellers'
        const url = '/sellers'
        const response = await axios.get(url, {
            headers: JSON.parse(localStorage.getItem("eatable")),
          });
        return response.data;
      }catch(error){
        console.log(error);
    }
})

const sellersSlice = createSlice({
    name:'sellers',
    initialState,
    reducers: {
        
    }, 
    extraReducers: {
        [fetchSellers.fulfilled]:(state,action)=> {
        
            return action.payload;
        }
    }
})

export default sellersSlice.reducer

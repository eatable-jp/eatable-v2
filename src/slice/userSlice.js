import { createSlice  } from "@reduxjs/toolkit";


const initialState = {
    user_id: null
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, {payload}) => {
          state.user_id = payload;
        },
    resetUser: (state ) => {
        state.user_id = null;
      },
    
    },
});

const { reducer, actions } = userSlice;

export const { setUser, resetUser } = actions;

export default reducer;

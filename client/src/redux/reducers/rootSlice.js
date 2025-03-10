import { createSlice } from "@reduxjs/toolkit";
import jwtDecode from "jwt-decode";

export const rootReducer = createSlice({
  name: "root",
  initialState: {
    loading: true,
    userInfo: localStorage.getItem("das-token") ? jwtDecode(localStorage.getItem("das-token")) : null,
  },
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setUserInfo: (state, action) => {
      state.userInfo = action.payload;
    },
  },
});

export const { setLoading, setUserInfo } = rootReducer.actions;
export default rootReducer.reducer;

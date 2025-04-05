import { createSlice } from "@reduxjs/toolkit";
import jwtDecode from "jwt-decode";

export const rootSlice = createSlice({
  name: "root",
  initialState: {
    loading: true,
    userInfo: localStorage.getItem("das-token") ? jwtDecode(localStorage.getItem("das-token")) : null,
    error: null,
  },
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setUserInfo: (state, action) => {
      state.userInfo = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const { setLoading, setUserInfo, setError } = rootSlice.actions;
export default rootSlice.reducer;

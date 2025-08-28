import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../Config/Config";

const initialState = {
  singleUser: {},
  isLoading: false,
  isError: false,
  isSuccess: false,
};

export const fetchUser = createAsyncThunk("users/fetch", async () => {
  const userId = localStorage.getItem("uid");
  const docRef = doc(db, "users", userId);
  const docSnap = await getDoc(docRef);
  return docSnap.data();
});

const singleUserSlice = createSlice({
  name: "singleUser",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => {
        state.singleUser = {};
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.singleUser = action.payload || {};
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
      })
      .addCase(fetchUser.rejected, (state) => {
        state.singleUser = {};
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
      });
  },
});

export default singleUserSlice.reducer;

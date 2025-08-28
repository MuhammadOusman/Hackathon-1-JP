import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { collection, getDocs } from "firebase/firestore";

import { useEffect } from "react";
import { db } from "../../Config/Config";

const initialState = {
  authUsers: [],
  isLoading: false,
  isError: false,
  isSuccess: false,
  currentManager: null, // will hold logged-in manager info
};

const authSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    setCurrentManager: (state, action) => {
      state.currentManager = action.payload; // payload: { managerId, managerEmail, ... }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchUsers.pending, (state, action)=>{
        state.authUsers = [];
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
    })
    builder.addCase(fetchUsers.fulfilled, (state, action)=>{
        state.authUsers = action.payload;
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
    })
    builder.addCase(fetchUsers.rejected, (state, action)=>{
        state.authUsers = [];
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
    })
  },
});

export const fetchUsers = createAsyncThunk("users/fetch", async () => {
  const querySnapshot = await getDocs(collection(db, "users"));
  let usersArray = [];
  querySnapshot.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
    // console.log(doc.id, " => ", doc.data());
    usersArray.push(doc.data())
    
  });
  return usersArray
});


export const { setCurrentManager } = authSlice.actions;
const { reducer } = authSlice;
export default reducer;

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../Config/Config";


const initialState = {
  singleUser: {},
  isLoading: false,
  isError: false,
  isSuccess: false,
};

const singleUserSlice = createSlice({
  name: "singleUser",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchUser.pending, (state, action) => {
      state.singleUser = {};
      state.isLoading = true;
      state.isError = false;
      state.isSuccess = false;
    });
    builder.addCase(fetchUser.fulfilled, (state, action) => {
      state.singleUser = action.payload;
      state.isLoading = false;
      state.isError = false;
      state.isSuccess = true;
    });
    builder.addCase(fetchUser.rejected, (state, action) => {
      state.singleUser = {};
      state.isLoading = false;
      state.isError = true;
      state.isSuccess = false;
    });
  },
});

export const fetchUser = createAsyncThunk("users/fetch", async () => {
    const userId = localStorage.getItem('uid')
  const docRef = doc(db, "users", userId);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    console.log("Document data:", docSnap.data());
  } else {
    // docSnap.data() will be undefined in this case
    console.log("No such document!");
  }
  return docSnap.data();
});

const { actions, reducer } = singleUserSlice;
export default reducer;

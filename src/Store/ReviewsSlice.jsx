import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { listCollection, getDocument, updateDocument } from "../Config/firestoreApi";

// Fetch all branches (to get reviews per branch)
export const fetchBranchesForReviews = createAsyncThunk("reviews/fetchBranches", async () => {
  const data = await listCollection("branches");
  return data;
});

// Add review to branch
export const addReview = createAsyncThunk("reviews/add", async ({ branchId, review }) => {
  const branch = await getDocument("branches", branchId);
  const updatedReviews = [...(branch?.reviews || []), review];
  await updateDocument("branches", branchId, { reviews: updatedReviews });
  const list = await listCollection("branches");
  return list;
});

const reviewsSlice = createSlice({
  name: "reviews",
  initialState: { branches: [], loading: false },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBranchesForReviews.pending, (state) => { state.loading = true; })
      .addCase(fetchBranchesForReviews.fulfilled, (state, action) => {
        state.branches = action.payload;
        state.loading = false;
      })
      .addCase(fetchBranchesForReviews.rejected, (state) => { state.loading = false; })
      .addCase(addReview.pending, (state) => { state.loading = true; })
      .addCase(addReview.fulfilled, (state, action) => {
        state.branches = action.payload;
        state.loading = false;
      })
      .addCase(addReview.rejected, (state) => { state.loading = false; });
  },
});

export default reviewsSlice.reducer;

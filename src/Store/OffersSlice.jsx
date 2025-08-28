import { createSlice, createAsyncThunk, createEntityAdapter } from "@reduxjs/toolkit";
import { listCollection, createDocument, updateDocument, deleteDocument } from "../Config/firestoreApi";

const offersAdapter = createEntityAdapter({
  selectId: (o) => o.id || o.name,
});

export const fetchOffers = createAsyncThunk("offers/fetch", async () => {
  const data = await listCollection("offers");
  return data;
});

export const addOffer = createAsyncThunk("offers/add", async (offer) => {
  await createDocument("offers", offer, offer.id);
  const data = await listCollection("offers");
  return data;
});

export const updateOffer = createAsyncThunk("offers/update", async ({ id, data }) => {
  await updateDocument("offers", id, data);
  const list = await listCollection("offers");
  return list;
});

export const deleteOffer = createAsyncThunk("offers/delete", async (id) => {
  await deleteDocument("offers", id);
  const data = await listCollection("offers");
  return data;
});

const offersSlice = createSlice({
  name: "offers",
  initialState: offersAdapter.getInitialState({ offers: [], loading: false }),
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOffers.pending, (state) => { state.loading = true; })
      .addCase(fetchOffers.fulfilled, (state, action) => {
        offersAdapter.setAll(state, action.payload || []);
        state.offers = action.payload || [];
        state.loading = false;
      })
      .addCase(fetchOffers.rejected, (state) => { state.loading = false; })
      .addCase(addOffer.pending, (state) => { state.loading = true; })
      .addCase(addOffer.fulfilled, (state, action) => {
        offersAdapter.setAll(state, action.payload || []);
        state.offers = action.payload || [];
        state.loading = false;
      })
      .addCase(addOffer.rejected, (state) => { state.loading = false; })
      .addCase(updateOffer.pending, (state) => { state.loading = true; })
      .addCase(updateOffer.fulfilled, (state, action) => {
        offersAdapter.setAll(state, action.payload || []);
        state.offers = action.payload || [];
        state.loading = false;
      })
      .addCase(updateOffer.rejected, (state) => { state.loading = false; })
      .addCase(deleteOffer.pending, (state) => { state.loading = true; })
      .addCase(deleteOffer.fulfilled, (state, action) => {
        offersAdapter.setAll(state, action.payload || []);
        state.offers = action.payload || [];
        state.loading = false;
      })
      .addCase(deleteOffer.rejected, (state) => { state.loading = false; });
  },
});

export default offersSlice.reducer;
export const offersSelectors = offersAdapter.getSelectors((state) => state.offersReducer);

import { createSlice, createAsyncThunk, createEntityAdapter, createSelector } from "@reduxjs/toolkit";
import { listCollection, createDocument, deleteDocument } from "../Config/firestoreApi";

const orderAdapter = createEntityAdapter({
  selectId: (o) => o.id,
  sortComparer: (a, b) => (b.createdAt || 0) - (a.createdAt || 0),
});

export const fetchOrders = createAsyncThunk("orders/fetch", async () => {
  const data = await listCollection("orders");
  // Sort optional by createdAt desc if present
  data.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
  return data;
});

// Add order
export const addOrder = createAsyncThunk("orders/add", async (order) => {
  await createDocument("orders", { ...order, createdAt: Date.now() }, order.id);
  const data = await listCollection("orders");
  data.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
  return data;
});

// Delete order
export const deleteOrder = createAsyncThunk("orders/delete", async (id) => {
  await deleteDocument("orders", id);
  const data = await listCollection("orders");
  data.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
  return data;
});

const orderSlice = createSlice({
  name: "orders",
  initialState: orderAdapter.getInitialState({ orders: [], loading: false }),
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => { state.loading = true; })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        orderAdapter.setAll(state, action.payload || []);
        state.orders = action.payload || [];
        state.loading = false;
      })
      .addCase(fetchOrders.rejected, (state) => { state.loading = false; })
      .addCase(addOrder.pending, (state) => { state.loading = true; })
      .addCase(addOrder.fulfilled, (state, action) => {
        orderAdapter.setAll(state, action.payload || []);
        state.orders = action.payload || [];
        state.loading = false;
      })
      .addCase(addOrder.rejected, (state) => { state.loading = false; })
      .addCase(deleteOrder.pending, (state) => { state.loading = true; })
      .addCase(deleteOrder.fulfilled, (state, action) => {
        orderAdapter.setAll(state, action.payload || []);
        state.orders = action.payload || [];
        state.loading = false;
      })
      .addCase(deleteOrder.rejected, (state) => { state.loading = false; });
  },
});

export default orderSlice.reducer;
export const orderSelectors = orderAdapter.getSelectors((state) => state.orderReducer);
export const selectOrdersByBranch = (branchId) =>
  createSelector(orderSelectors.selectAll, (orders) => orders.filter((o) => String(o.branchId) === String(branchId)));

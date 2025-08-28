import { createSlice, createAsyncThunk, createEntityAdapter } from "@reduxjs/toolkit";
import { listCollection, createDocument, updateDocument, deleteDocument } from "../Config/firestoreApi";

const productAdapter = createEntityAdapter({
  selectId: (p) => p.id || p.name,
});

export const fetchProducts = createAsyncThunk("products/fetch", async () => {
  const data = await listCollection("products");
  return data;
});

// Add product
export const addProduct = createAsyncThunk("products/add", async (product) => {
  await createDocument("products", product, product.id);
  const data = await listCollection("products");
  return data;
});

// Update product
export const updateProduct = createAsyncThunk("products/update", async ({ id, data }) => {
  await updateDocument("products", id, data);
  const list = await listCollection("products");
  return list;
});

// Delete product
export const deleteProduct = createAsyncThunk("products/delete", async (id) => {
  await deleteDocument("products", id);
  const data = await listCollection("products");
  return data;
});

const productSlice = createSlice({
  name: "products",
  initialState: productAdapter.getInitialState({ products: [], loading: false }),
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => { state.loading = true; })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        productAdapter.setAll(state, action.payload || []);
        state.products = action.payload || [];
        state.loading = false;
      })
      .addCase(fetchProducts.rejected, (state) => { state.loading = false; })
      .addCase(addProduct.pending, (state) => { state.loading = true; })
      .addCase(addProduct.fulfilled, (state, action) => {
        productAdapter.setAll(state, action.payload || []);
        state.products = action.payload || [];
        state.loading = false;
      })
      .addCase(addProduct.rejected, (state) => { state.loading = false; })
      .addCase(updateProduct.pending, (state) => { state.loading = true; })
      .addCase(updateProduct.fulfilled, (state, action) => {
        productAdapter.setAll(state, action.payload || []);
        state.products = action.payload || [];
        state.loading = false;
      })
      .addCase(updateProduct.rejected, (state) => { state.loading = false; })
      .addCase(deleteProduct.pending, (state) => { state.loading = true; })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        productAdapter.setAll(state, action.payload || []);
        state.products = action.payload || [];
        state.loading = false;
      })
      .addCase(deleteProduct.rejected, (state) => { state.loading = false; });
  },
});

// Export adapter selectors if needed later
export const productSelectors = productAdapter.getSelectors((state) => state.productReducer);

export default productSlice.reducer;

import { createSlice } from "@reduxjs/toolkit";

// Ephemeral client-side cart to stage items before placing an order
const cartSlice = createSlice({
  name: "cart",
  initialState: { items: [] }, // {product, quantity}
  reducers: {
    addItem: (state, action) => {
      const { product, quantity = 1 } = action.payload || {};
      if (!product) return;
      const existing = state.items.find((i) => i.product === product);
      if (existing) existing.quantity += Number(quantity) || 1;
      else state.items.push({ product, quantity: Number(quantity) || 1 });
    },
    removeItem: (state, action) => {
      const idx = action.payload;
      state.items.splice(idx, 1);
    },
    clearCart: (state) => {
      state.items = [];
    },
  },
});

export const { addItem, removeItem, clearCart } = cartSlice.actions;
export default cartSlice.reducer;

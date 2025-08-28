import { createSlice, createAsyncThunk, createEntityAdapter } from "@reduxjs/toolkit";
import { listCollection, createDocument, updateDocument, deleteDocument, getDocument } from "../Config/firestoreApi";

const branchAdapter = createEntityAdapter({
  selectId: (b) => b.id,
});

export const fetchBranches = createAsyncThunk("branches/fetch", async () => {
  const data = await listCollection("branches");
  return data;
});

// Add branch
export const addBranch = createAsyncThunk("branches/add", async (branch) => {
  await createDocument("branches", branch, branch.id);
  const data = await listCollection("branches");
  return data;
});

// Update branch
export const updateBranch = createAsyncThunk("branches/update", async ({ id, data }) => {
  await updateDocument("branches", id, data);
  const list = await listCollection("branches");
  return list;
});

// Update inventory for branch
export const updateInventory = createAsyncThunk("branches/updateInventory", async ({ id, inventory }) => {
  await updateDocument("branches", id, { inventory });
  const list = await listCollection("branches");
  return list;
});

// Dedicated thunks for inventory lifecycle
export const fetchInventoryByBranch = createAsyncThunk("branches/fetchInventory", async (id) => {
  const branch = await getDocument("branches", id);
  return { id, inventory: branch?.inventory || {} };
});

export const decrementInventory = createAsyncThunk(
  "branches/decrementInventory",
  async ({ id, items }, { rejectWithValue }) => {
    const branch = await getDocument("branches", id);
    if (!branch) return rejectWithValue("Branch not found");
    const inv = { ...(branch.inventory || {}) };
    for (const it of items) {
      if (typeof inv[it.product] === "number") {
        inv[it.product] = Math.max(0, inv[it.product] - Number(it.quantity || 0));
      }
    }
    await updateDocument("branches", id, { inventory: inv });
    const updatedList = await listCollection("branches");
    return updatedList;
  }
);

// Delete branch
export const deleteBranch = createAsyncThunk("branches/delete", async (id) => {
  await deleteDocument("branches", id);
  const data = await listCollection("branches");
  return data;
});

// Add employee to branch
export const addEmployee = createAsyncThunk("branches/addEmployee", async ({ branchId, employee }) => {
  const branch = await getDocument("branches", branchId);
  const updatedEmployees = [...(branch?.employees || []), employee];
  await updateDocument("branches", branchId, { employees: updatedEmployees });
  const list = await listCollection("branches");
  return list;
});

// Delete employee from branch
export const deleteEmployee = createAsyncThunk("branches/deleteEmployee", async ({ branchId, employeeId }) => {
  const branch = await getDocument("branches", branchId);
  const updatedEmployees = (branch?.employees || []).filter(emp => emp.id !== employeeId);
  await updateDocument("branches", branchId, { employees: updatedEmployees });
  const list = await listCollection("branches");
  return list;
});

// Edit employee in branch
export const editEmployee = createAsyncThunk("branches/editEmployee", async ({ branchId, employeeId, employee }) => {
  const branch = await getDocument("branches", branchId);
  const updatedEmployees = (branch?.employees || []).map(emp =>
    emp.id === employeeId ? { ...emp, ...employee } : emp
  );
  await updateDocument("branches", branchId, { employees: updatedEmployees });
  const list = await listCollection("branches");
  return list;
});

const branchSlice = createSlice({
  name: "branches",
  initialState: branchAdapter.getInitialState({ branches: [], loading: false }),
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetchInventoryByBranch does not replace the list; it's for direct inventory get if needed
      .addCase(fetchInventoryByBranch.fulfilled, (state, action) => {
        const { id, inventory } = action.payload;
        const idx = state.branches.findIndex((b) => String(b.id) === String(id));
        if (idx >= 0) state.branches[idx].inventory = inventory;
      })
      .addCase(decrementInventory.pending, (state) => { state.loading = true; })
      .addCase(decrementInventory.fulfilled, (state, action) => {
        branchAdapter.setAll(state, action.payload || []);
        state.branches = action.payload || [];
        state.loading = false;
      })
      .addCase(decrementInventory.rejected, (state) => { state.loading = false; })
      .addCase(fetchBranches.pending, (state) => { state.loading = true; })
      .addCase(fetchBranches.fulfilled, (state, action) => {
        branchAdapter.setAll(state, action.payload || []);
        state.branches = action.payload || [];
        state.loading = false;
      })
      .addCase(fetchBranches.rejected, (state) => { state.loading = false; })
      .addCase(addBranch.pending, (state) => { state.loading = true; })
      .addCase(addBranch.fulfilled, (state, action) => {
        branchAdapter.setAll(state, action.payload || []);
        state.branches = action.payload || [];
        state.loading = false;
      })
      .addCase(addBranch.rejected, (state) => { state.loading = false; })
      .addCase(updateBranch.pending, (state) => { state.loading = true; })
      .addCase(updateBranch.fulfilled, (state, action) => {
        branchAdapter.setAll(state, action.payload || []);
        state.branches = action.payload || [];
        state.loading = false;
      })
      .addCase(updateBranch.rejected, (state) => { state.loading = false; })
      .addCase(updateInventory.pending, (state) => { state.loading = true; })
      .addCase(updateInventory.fulfilled, (state, action) => {
        branchAdapter.setAll(state, action.payload || []);
        state.branches = action.payload || [];
        state.loading = false;
      })
      .addCase(updateInventory.rejected, (state) => { state.loading = false; })
      .addCase(deleteBranch.pending, (state) => { state.loading = true; })
      .addCase(deleteBranch.fulfilled, (state, action) => {
        branchAdapter.setAll(state, action.payload || []);
        state.branches = action.payload || [];
        state.loading = false;
      })
      .addCase(deleteBranch.rejected, (state) => { state.loading = false; })
      .addCase(addEmployee.pending, (state) => { state.loading = true; })
      .addCase(addEmployee.fulfilled, (state, action) => {
        branchAdapter.setAll(state, action.payload || []);
        state.branches = action.payload || [];
        state.loading = false;
      })
      .addCase(addEmployee.rejected, (state) => { state.loading = false; })
      .addCase(deleteEmployee.pending, (state) => { state.loading = true; })
      .addCase(deleteEmployee.fulfilled, (state, action) => {
        branchAdapter.setAll(state, action.payload || []);
        state.branches = action.payload || [];
        state.loading = false;
      })
      .addCase(deleteEmployee.rejected, (state) => { state.loading = false; })
      .addCase(editEmployee.pending, (state) => { state.loading = true; })
      .addCase(editEmployee.fulfilled, (state, action) => {
        branchAdapter.setAll(state, action.payload || []);
        state.branches = action.payload || [];
        state.loading = false;
      })
      .addCase(editEmployee.rejected, (state) => { state.loading = false; });
  },
});

export default branchSlice.reducer;
export const branchSelectors = branchAdapter.getSelectors((state) => state.branchReducer);

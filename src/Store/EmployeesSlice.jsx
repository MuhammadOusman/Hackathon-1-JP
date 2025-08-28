import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { listCollection, getDocument, updateDocument } from "../Config/firestoreApi";

// Fetch all branches (to get employees per branch)
export const fetchBranchesForEmployees = createAsyncThunk("employees/fetchBranches", async () => {
  const data = await listCollection("branches");
  return data;
});

// Add employee to branch
export const addEmployee = createAsyncThunk("employees/add", async ({ branchId, employee }) => {
  const branch = await getDocument("branches", branchId);
  const updatedEmployees = [...(branch?.employees || []), employee];
  await updateDocument("branches", branchId, { employees: updatedEmployees });
  const list = await listCollection("branches");
  return list;
});

// Delete employee from branch
export const deleteEmployee = createAsyncThunk("employees/delete", async ({ branchId, employeeId }) => {
  const branch = await getDocument("branches", branchId);
  const updatedEmployees = (branch?.employees || []).filter(emp => emp.id !== employeeId);
  await updateDocument("branches", branchId, { employees: updatedEmployees });
  const list = await listCollection("branches");
  return list;
});

// Edit employee in branch
export const editEmployee = createAsyncThunk("employees/edit", async ({ branchId, employeeId, employee }) => {
  const branch = await getDocument("branches", branchId);
  const updatedEmployees = (branch?.employees || []).map(emp =>
    emp.id === employeeId ? { ...emp, ...employee } : emp
  );
  await updateDocument("branches", branchId, { employees: updatedEmployees });
  const list = await listCollection("branches");
  return list;
});

const employeesSlice = createSlice({
  name: "employees",
  initialState: { branches: [], loading: false },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBranchesForEmployees.pending, (state) => { state.loading = true; })
      .addCase(fetchBranchesForEmployees.fulfilled, (state, action) => {
        state.branches = action.payload;
        state.loading = false;
      })
      .addCase(fetchBranchesForEmployees.rejected, (state) => { state.loading = false; })
      .addCase(addEmployee.pending, (state) => { state.loading = true; })
      .addCase(addEmployee.fulfilled, (state, action) => {
        state.branches = action.payload;
        state.loading = false;
      })
      .addCase(addEmployee.rejected, (state) => { state.loading = false; })
      .addCase(deleteEmployee.pending, (state) => { state.loading = true; })
      .addCase(deleteEmployee.fulfilled, (state, action) => {
        state.branches = action.payload;
        state.loading = false;
      })
      .addCase(deleteEmployee.rejected, (state) => { state.loading = false; })
      .addCase(editEmployee.pending, (state) => { state.loading = true; })
      .addCase(editEmployee.fulfilled, (state, action) => {
        state.branches = action.payload;
        state.loading = false;
      })
      .addCase(editEmployee.rejected, (state) => { state.loading = false; });
  },
});

export default employeesSlice.reducer;

import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addEmployee, deleteEmployee, editEmployee, fetchBranches } from "../Store/BranchSlice";
import { inputCls, cardCls, btnPrimary, btnGhost, chipCls } from "../Components/ui/styles";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";

const ManagerEmployees = () => {
  const [newEmployee, setNewEmployee] = useState({ name: "", contact: "", email: "" });
  const [editingId, setEditingId] = useState(null);
  const [editEmployeeData, setEditEmployeeData] = useState({ name: "", contact: "", email: "" });
  const dispatch = useDispatch();
  const { branches, loading } = useSelector(state => state.branchReducer);
  const managerId = useSelector(state => state.userReducer?.currentManager?.managerId);
  const branch = branches.find(b => String(b.managerId) === String(managerId));
  const employees = branch ? branch.employees || [] : [];

  useEffect(() => {
    dispatch(fetchBranches());
  }, [dispatch]);

  const handleAddEmployee = (e) => {
    e.preventDefault();
    dispatch(addEmployee({ branchId: branch.id, employee: { ...newEmployee, id: Date.now() } }));
    setNewEmployee({ name: "", contact: "", email: "" });
  };

  const handleDeleteEmployee = (id) => {
    dispatch(deleteEmployee({ branchId: branch.id, employeeId: id }));
  };

  if (loading && branches.length === 0) return <div className="text-gray-400">Loading branch...</div>;
  if (!branch) return <div className="text-gray-400">No branch found for this manager.</div>;

  return (
    <section className="max-w-7xl mx-auto px-2 md:px-4">
      <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Employee Management</h2>

      {/* Add Employee */}
      <form onSubmit={handleAddEmployee} className={`${cardCls} mb-6`}>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-center">
          <input type="text" placeholder="Name" value={newEmployee.name} onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })} required className={inputCls} />
          <input type="text" placeholder="Contact" value={newEmployee.contact} onChange={(e) => setNewEmployee({ ...newEmployee, contact: e.target.value })} required className={inputCls} />
          <input type="email" placeholder="Email" value={newEmployee.email} onChange={(e) => setNewEmployee({ ...newEmployee, email: e.target.value })} required className={inputCls} />
          <button type="submit" disabled={loading} className={btnPrimary}>
            {loading ? "Adding..." : "Add Employee"}
          </button>
        </div>
      </form>

      {/* List */}
      <ul className="space-y-3">
        {employees.map((emp) => (
          <li key={emp.id} className={cardCls}>
            {editingId === emp.id ? (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-center">
                <input type="text" value={editEmployeeData.name} onChange={(e) => setEditEmployeeData({ ...editEmployeeData, name: e.target.value })} placeholder="Name" className={inputCls} />
                <input type="text" value={editEmployeeData.contact} onChange={(e) => setEditEmployeeData({ ...editEmployeeData, contact: e.target.value })} placeholder="Contact" className={inputCls} />
                <input type="email" value={editEmployeeData.email} onChange={(e) => setEditEmployeeData({ ...editEmployeeData, email: e.target.value })} placeholder="Email" className={inputCls} />
                <div className="flex items-center gap-2">
                  <button
                    onClick={async () => {
                      await dispatch(
                        editEmployee({ branchId: branch.id, employeeId: emp.id, employee: { ...editEmployeeData, id: emp.id } })
                      );
                      await dispatch(fetchBranches());
                      setEditingId(null);
                    }}
                    disabled={loading}
                    className={btnPrimary}
                    title="Save"
                  >
                    <SaveIcon fontSize="small" />
                  </button>
                  <button onClick={() => setEditingId(null)} disabled={loading} className={btnGhost} title="Cancel">
                    <CloseIcon fontSize="small" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between gap-3">
                <div className="text-gray-100 font-medium">
                  {emp.name}
                  <span className="ml-2 {chipCls}"></span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={chipCls}>{emp.email}</span>
                  <span className={chipCls}>{emp.contact}</span>
                  <button onClick={() => handleDeleteEmployee(emp.id)} disabled={loading} className="p-2 rounded-md bg-red-600 hover:bg-red-700 text-white disabled:opacity-60" title="Delete">
                    <DeleteIcon fontSize="small" />
                  </button>
                  <button
                    onClick={() => {
                      setEditingId(emp.id);
                      setEditEmployeeData({ name: emp.name, contact: emp.contact, email: emp.email });
                    }}
                    disabled={loading}
                    className="p-2 rounded-md bg-green-600 hover:bg-green-700 text-white disabled:opacity-60"
                    title="Edit"
                  >
                    <EditIcon fontSize="small" />
                  </button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
};

export default ManagerEmployees;

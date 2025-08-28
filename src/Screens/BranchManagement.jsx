import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchBranches, addBranch, deleteBranch, updateBranch } from "../Store/BranchSlice";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const BranchManagement = () => {
  const [newBranch, setNewBranch] = useState({ name: "", location: "", managerId: "", managerEmail: "", password: "" });
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ name: "", location: "", managerId: "", managerEmail: "", password: "" });
  const dispatch = useDispatch();
  const { branches, loading } = useSelector(state => state.branchReducer);

  useEffect(() => {
    dispatch(fetchBranches());
  }, [dispatch]);

  const handleAddBranch = (e) => {
    e.preventDefault();
    dispatch(addBranch({
      ...newBranch,
      inventory: {},
      employees: [],
      reviews: [],
    }));
    setNewBranch({ name: "", location: "", managerId: "", managerEmail: "", password: "" });
  };

  const startEdit = (branch) => {
    setEditingId(branch.id);
    setEditForm({
      name: branch.name || "",
      location: branch.location || "",
      managerId: branch.managerId || "",
      managerEmail: branch.managerEmail || "",
      password: branch.password || "",
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({ name: "", location: "", managerId: "", managerEmail: "", password: "" });
  };

  const saveEdit = async (id) => {
    await dispatch(updateBranch({ id, data: { ...editForm } }));
    cancelEdit();
  };

  const handleDeleteBranch = (id) => {
    dispatch(deleteBranch(id));
  };

  const inputCls = "w-full px-4 py-3 bg-gray-800 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none";
  const cardCls = "bg-gray-800/60 border border-white/10 rounded-xl p-5 shadow hover:shadow-xl transition-shadow duration-200";
  const btnBase = "px-4 py-2 rounded-md font-semibold transition-colors";

  return (
    <section className="max-w-7xl mx-auto px-2 md:px-4">
      <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Branch Management</h2>

      {/* Add Branch Form */}
      <form onSubmit={handleAddBranch} className={`${cardCls} mb-8`}>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
          <input
            type="text"
            placeholder="Branch Name"
            value={newBranch.name}
            onChange={e => setNewBranch({ ...newBranch, name: e.target.value })}
            required
            className={inputCls}
          />
          <input
            type="text"
            placeholder="Location"
            value={newBranch.location}
            onChange={e => setNewBranch({ ...newBranch, location: e.target.value })}
            required
            className={inputCls}
          />
          <input
            type="text"
            placeholder="Manager ID"
            value={newBranch.managerId}
            onChange={e => setNewBranch({ ...newBranch, managerId: e.target.value })}
            required
            className={inputCls}
          />
          <input
            type="email"
            placeholder="Manager Email"
            value={newBranch.managerEmail}
            onChange={e => setNewBranch({ ...newBranch, managerEmail: e.target.value })}
            required
            className={inputCls}
          />
          <input
            type="password"
            placeholder="Manager Password"
            value={newBranch.password}
            onChange={e => setNewBranch({ ...newBranch, password: e.target.value })}
            required
            className={`${inputCls} md:col-span-1 xl:col-span-3`}
          />
          <button
            type="submit"
            disabled={loading}
            className={`${btnBase} bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-60 md:col-span-1 xl:col-span-1 h-[48px] w-full md:w-auto`}
          >
            {loading ? "Adding..." : "Add Branch"}
          </button>
        </div>
      </form>

      {/* Branch Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-5">
        {branches && branches.length > 0 ? (
          branches.map((branch) => (
            <div key={branch.id} className={cardCls}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-1">{branch.name}</h3>
                  <p className="text-gray-300">Location: <span className="text-blue-300">{branch.location}</span></p>
                  <p className="text-gray-300">Manager ID: <span className="text-blue-300">{branch.managerId}</span></p>
                  {branch.managerEmail && (
                    <p className="text-gray-300">Manager Email: <span className="text-blue-300">{branch.managerEmail}</span></p>
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => startEdit(branch)}
                    aria-label="Edit branch"
                    title="Edit"
                    className="p-2 rounded-md bg-green-600 hover:bg-green-700 text-white shadow-sm"
                  >
                    <EditIcon fontSize="small" />
                  </button>
                  <button
                    onClick={() => handleDeleteBranch(branch.id)}
                    disabled={loading}
                    aria-label="Delete branch"
                    title="Delete"
                    className="p-2 rounded-md bg-red-600 hover:bg-red-700 text-white shadow-sm disabled:opacity-60"
                  >
                    <DeleteIcon fontSize="small" />
                  </button>
                </div>
              </div>

              {editingId === branch.id && (
                <div className="mt-4 pt-4 border-t border-white/10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <input
                      className={inputCls}
                      type="text"
                      placeholder="Branch Name"
                      value={editForm.name}
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    />
                    <input
                      className={inputCls}
                      type="text"
                      placeholder="Location"
                      value={editForm.location}
                      onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                    />
                    <input
                      className={inputCls}
                      type="text"
                      placeholder="Manager ID"
                      value={editForm.managerId}
                      onChange={(e) => setEditForm({ ...editForm, managerId: e.target.value })}
                    />
                    <input
                      className={inputCls}
                      type="email"
                      placeholder="Manager Email"
                      value={editForm.managerEmail}
                      onChange={(e) => setEditForm({ ...editForm, managerEmail: e.target.value })}
                    />
                    <input
                      className={`${inputCls} md:col-span-2`}
                      type="password"
                      placeholder="Manager Password"
                      value={editForm.password}
                      onChange={(e) => setEditForm({ ...editForm, password: e.target.value })}
                    />
                  </div>
                  <div className="flex items-center gap-3 mt-4">
                    <button
                      onClick={() => saveEdit(branch.id)}
                      aria-label="Save"
                      title="Save"
                      className="p-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      <SaveIcon fontSize="small" />
                    </button>
                    <button
                      onClick={cancelEdit}
                      aria-label="Cancel"
                      title="Cancel"
                      className="p-2 rounded-md bg-gray-700 hover:bg-gray-600 text-white"
                    >
                      <CloseIcon fontSize="small" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="col-span-full text-gray-400">No branches found.</div>
        )}
      </div>
    </section>
  );
};

export default BranchManagement;

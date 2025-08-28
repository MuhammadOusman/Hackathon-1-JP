import React, { useEffect, useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchBranches, updateInventory } from "../Store/BranchSlice";
import { inputCls, cardCls, btnPrimary, btnGhost } from "../Components/ui/styles";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import SaveIcon from "@mui/icons-material/Save";

const ManagerInventory = () => {
  const [inventory, setInventory] = useState({});
  const [originalInventory, setOriginalInventory] = useState({});
  const [search, setSearch] = useState("");
  const dispatch = useDispatch();
  const { branches, loading } = useSelector(state => state.branchReducer);
  const managerId = useSelector(state => state.userReducer?.currentManager?.managerId);
  const branch = branches.find(b => String(b.managerId) === String(managerId));

  useEffect(() => {
    dispatch(fetchBranches());
  }, [dispatch]);

  useEffect(() => {
    if (branch && branch.inventory) {
      setInventory(branch.inventory);
      setOriginalInventory(branch.inventory);
    }
  }, [branch]);

  const handleInventoryChange = (item, value) => {
    setInventory({ ...inventory, [item]: Number(value) });
  };

  const handleUpdateInventory = () => {
    if (!branch) return;
    dispatch(updateInventory({ id: branch.id, inventory }));
  };

  const inc = (name) => setInventory((prev) => ({ ...prev, [name]: Math.max(0, (prev[name] || 0) + 1) }));
  const dec = (name) => setInventory((prev) => ({ ...prev, [name]: Math.max(0, (prev[name] || 0) - 1) }));
  const reset = () => setInventory(originalInventory);

  const hasChanges = useMemo(() => {
    const a = originalInventory;
    const b = inventory;
    const keys = new Set([...Object.keys(a || {}), ...Object.keys(b || {})]);
    for (const k of keys) {
      if ((a?.[k] || 0) !== (b?.[k] || 0)) return true;
    }
    return false;
  }, [originalInventory, inventory]);

  if (loading && branches.length === 0) return <div>Loading branch...</div>;
  if (!branch) return <div>No branch found for this manager.</div>;

  return (
    <section className="max-w-7xl mx-auto px-2 md:px-4">
      <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Branch Inventory</h2>

      {/* Search */}
      <div className={`${cardCls} mb-6`}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-center">
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={`${inputCls} md:col-span-3`}
          />
        </div>
      </div>

      {/* Product Rows */}
      <div className="space-y-4">
        {Object.entries(inventory)
          .filter(([name]) => name.toLowerCase().includes(search.trim().toLowerCase()))
          .map(([name, value]) => (
            <div key={name} className={`${cardCls} flex items-center justify-between gap-4`}>
              <div className="flex items-center gap-4 flex-1">
                <div>
                  <div className="text-white text-lg font-semibold">{name}</div>
                  <div className={`text-sm ${value > 0 ? "text-emerald-300" : "text-red-300"}`}>{value > 0 ? "In stock" : "Out of stock"}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => dec(name)} className={btnGhost} aria-label={`Decrease ${name}`}>
                  <RemoveIcon fontSize="small" />
                </button>
                <input
                  type="number"
                  min={0}
                  value={value ?? 0}
                  onChange={(e) => handleInventoryChange(name, e.target.value)}
                  className="w-24 text-center px-3 py-2 bg-gray-900 border border-white/10 rounded-md text-white"
                />
                <button onClick={() => inc(name)} className={btnGhost} aria-label={`Increase ${name}`}>
                  <AddIcon fontSize="small" />
                </button>
              </div>
            </div>
          ))}
      </div>

      {/* Sticky Save Bar */}
      <div className="fixed bottom-6 right-6 flex gap-3">
        <button onClick={reset} disabled={!hasChanges || loading} className={btnGhost} title="Reset changes">
          <RestartAltIcon fontSize="small" /> Reset
        </button>
        <button onClick={handleUpdateInventory} disabled={!hasChanges || loading} className={btnPrimary} title="Save inventory">
          <SaveIcon fontSize="small" /> {loading ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </section>
  );
};

export default ManagerInventory;

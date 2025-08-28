import React, { useEffect, useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchBranches, updateInventory } from "../Store/BranchSlice";
import { fetchProducts } from "../Store/ProductSlice";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import SaveIcon from "@mui/icons-material/Save";

const InventoryManagement = () => {
  const [selectedBranch, setSelectedBranch] = useState("");
  const [inventory, setInventory] = useState({});
  const [originalInventory, setOriginalInventory] = useState({});
  const [search, setSearch] = useState("");
  const dispatch = useDispatch();
  const { branches, loading } = useSelector(state => state.branchReducer);
  const { products } = useSelector(state => state.productReducer);

  useEffect(() => {
  dispatch(fetchBranches());
  dispatch(fetchProducts());
  }, [dispatch]);

  useEffect(() => {
    if (selectedBranch) {
      const branch = branches.find(b => b.id === Number(selectedBranch) || b.id === selectedBranch);
      // Ensure all products are shown, even if not in inventory
      const allInventory = {};
      (products || []).forEach(product => {
        allInventory[product.name] = branch && branch.inventory && branch.inventory[product.name] ? branch.inventory[product.name] : 0;
      });
      setInventory(allInventory);
      setOriginalInventory(allInventory);
    } else {
      setInventory({});
      setOriginalInventory({});
    }
  }, [selectedBranch, branches, products]);

  const handleInventoryChange = (item, value) => {
    setInventory({ ...inventory, [item]: Number(value) });
  };

  const handleUpdateInventory = () => {
    dispatch(updateInventory({ id: selectedBranch, inventory }));
  };

  const inc = (name) => setInventory(prev => ({ ...prev, [name]: Math.max(0, (prev[name] || 0) + 1) }));
  const dec = (name) => setInventory(prev => ({ ...prev, [name]: Math.max(0, (prev[name] || 0) - 1) }));
  const reset = () => setInventory(originalInventory);

  const hasChanges = useMemo(() => {
    const a = originalInventory; const b = inventory;
    const keys = new Set([...Object.keys(a), ...Object.keys(b)]);
    for (const k of keys) { if ((a[k] || 0) !== (b[k] || 0)) return true; }
    return false;
  }, [originalInventory, inventory]);

  const inputCls = "w-full px-4 py-3 bg-gray-800 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none";
  const cardCls = "bg-gray-800/60 border border-white/10 rounded-xl p-5 shadow hover:shadow-xl transition-shadow duration-200";
  const chip = (val) => val > 0 ? "text-emerald-300" : "text-red-300";

  const filteredProducts = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return products || [];
    return (products || []).filter(p => p.name.toLowerCase().includes(term));
  }, [products, search]);

  return (
    <section className="max-w-7xl mx-auto px-2 md:px-4">
      <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Inventory Management</h2>

      {/* Branch Selector */}
      <div className={`${cardCls} mb-6`}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-center">
          <select
            value={selectedBranch}
            onChange={(e) => setSelectedBranch(e.target.value)}
            className={`${inputCls}`}
          >
            <option value="">Select Branch</option>
            {branches.map(branch => (
              <option key={branch.id} value={branch.id}>{branch.name}</option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={`${inputCls} md:col-span-2`}
          />
        </div>
      </div>

      {/* Product Rows */}
      {selectedBranch ? (
        <div className="space-y-4">
          {filteredProducts.map(product => (
            <div key={product.name} className={`${cardCls} flex items-center justify-between gap-4`}>
              <div className="flex items-center gap-4 flex-1">
                {product.image && (
                  <img src={product.image} alt={product.name} className="w-14 h-14 object-cover rounded" />
                )}
                <div>
                  <div className="text-white text-lg font-semibold">{product.name}</div>
                  <div className={`text-sm ${chip(inventory[product.name])}`}>{inventory[product.name] > 0 ? "In stock" : "Out of stock"}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => dec(product.name)}
                  className="p-2 rounded-md bg-gray-700 hover:bg-gray-600 text-white"
                  aria-label={`Decrease ${product.name}`}
                >
                  <RemoveIcon fontSize="small" />
                </button>
                <input
                  type="number"
                  min={0}
                  value={inventory[product.name] ?? 0}
                  onChange={(e) => handleInventoryChange(product.name, e.target.value)}
                  className="w-24 text-center px-3 py-2 bg-gray-900 border border-white/10 rounded-md text-white"
                />
                <button
                  onClick={() => inc(product.name)}
                  className="p-2 rounded-md bg-gray-700 hover:bg-gray-600 text-white"
                  aria-label={`Increase ${product.name}`}
                >
                  <AddIcon fontSize="small" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-gray-400">Select a branch to manage its inventory.</div>
      )}

      {/* Sticky Save Bar */}
      {selectedBranch && (
        <div className="fixed bottom-6 right-6 flex gap-3">
          <button
            onClick={reset}
            disabled={!hasChanges || loading}
            className={`px-4 py-2 rounded-md flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-white disabled:opacity-50`}
            title="Reset changes"
          >
            <RestartAltIcon fontSize="small" /> Reset
          </button>
          <button
            onClick={handleUpdateInventory}
            disabled={!hasChanges || loading}
            className={`px-4 py-2 rounded-md flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50`}
            title="Save inventory"
          >
            <SaveIcon fontSize="small" /> {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      )}
    </section>
  );
};

export default InventoryManagement;

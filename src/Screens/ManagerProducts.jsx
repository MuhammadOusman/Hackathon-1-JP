import React, { useMemo, useState } from "react";
import { useSelector } from "react-redux";

const cardCls = "bg-gray-800/60 border border-white/10 rounded-xl p-5 shadow hover:shadow-xl transition-shadow duration-200";

const ManagerProducts = () => {
  const managerId = useSelector((state) => state.userReducer?.currentManager?.managerId);
  const { branches } = useSelector((state) => state.branchReducer);
  const branch = branches.find((b) => b.managerId === managerId);
  const products = useSelector((state) => (state.productReducer?.products?.length ? state.productReducer.products : []));

  const [q, setQ] = useState("");
  const [stock, setStock] = useState("all"); // all | in | out
  const [sort, setSort] = useState("name-asc"); // name-asc | name-desc | price-asc | price-desc

  const list = useMemo(() => {
    const items = products.map((p) => {
      const qty = branch?.inventory?.[p.name] ?? 0;
      const inStock = qty > 0;
      return { ...p, qty, inStock };
    });
    let filtered = items.filter((it) => it.name.toLowerCase().includes(q.toLowerCase()));
    if (stock === "in") filtered = filtered.filter((it) => it.inStock);
    if (stock === "out") filtered = filtered.filter((it) => !it.inStock);
    const cmp = {
      "name-asc": (a, b) => a.name.localeCompare(b.name),
      "name-desc": (a, b) => b.name.localeCompare(a.name),
      "price-asc": (a, b) => Number(a.price || 0) - Number(b.price || 0),
      "price-desc": (a, b) => Number(b.price || 0) - Number(a.price || 0),
    }[sort];
    return filtered.sort(cmp);
  }, [products, branch, q, stock, sort]);

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-extrabold">Products</h2>

      {/* Controls */}
      <div className={`${cardCls} flex flex-col md:flex-row md:items-end gap-3`}> 
        <div className="flex-1">
          <label className="block text-sm text-gray-400 mb-1">Search</label>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search products..."
            className="w-full bg-gray-900/60 border border-white/10 rounded-lg px-3 py-2 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-1">Stock</label>
          <div className="flex gap-2">
            {[
              { k: "all", label: "All" },
              { k: "in", label: "In Stock" },
              { k: "out", label: "Out of Stock" },
            ].map((b) => (
              <button
                key={b.k}
                onClick={() => setStock(b.k)}
                className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                  stock === b.k ? "bg-blue-600 text-white" : "bg-gray-800 text-blue-300 hover:bg-blue-700/40 hover:text-white"
                }`}
              >
                {b.label}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-1">Sort by</label>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="bg-gray-900/60 border border-white/10 rounded-lg px-3 py-2 text-white"
          >
            <option value="name-asc">Name (A→Z)</option>
            <option value="name-desc">Name (Z→A)</option>
            <option value="price-asc">Price (Low→High)</option>
            <option value="price-desc">Price (High→Low)</option>
          </select>
        </div>
      </div>

      {/* List */}
      <div className={`${cardCls}`}>
        {list.length === 0 ? (
          <div className="text-gray-400">No products match your filters.</div>
        ) : (
          <div className="flex flex-wrap gap-4">
            {list.map((product) => {
              const badge = product.inStock ? "bg-green-500" : "bg-red-500";
              return (
                <div
                  key={product.id || product.name}
                  className="group flex items-center gap-3 pl-2 pr-3 py-2 rounded-full bg-gray-900/60 border border-white/10 text-white shadow-sm hover:shadow-md hover:border-white/20 transition"
                  title={typeof product.qty === 'number' ? `Qty: ${product.qty}` : undefined}
                >
                  {/* Avatar */}
                  {product.image ? (
                    <img src={product.image} alt={product.name} className="w-8 h-8 rounded-full object-cover" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gray-700 grid place-items-center text-sm font-bold">
                      {product.name?.[0] || "?"}
                    </div>
                  )}
                  <div className="font-semibold mr-1">{product.name}</div>
                  <div className="text-indigo-400">Rs {product.price}</div>
                  <span className={`ml-2 text-white text-xs font-bold px-2 py-0.5 rounded ${badge}`}>
                    {product.inStock ? "In Stock" : "Out of Stock"}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ManagerProducts;

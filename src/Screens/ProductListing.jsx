import React, { useEffect, useState } from "react";
import { listCollection, getDocument } from "../Config/firestoreApi";
import { useNavigate } from "react-router-dom";
import { cardCls } from "../Components/ui/styles";

const ProductListing = () => {
  const [products, setProducts] = useState([]);
  const [offers, setOffers] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));

  const [inventory, setInventory] = useState({});
  const navigate = useNavigate();
  useEffect(() => {
    (async () => {
      const [prods, offs] = await Promise.all([
        listCollection("products"),
        listCollection("offers"),
      ]);
      setProducts(prods);
      setOffers(offs);
      if (user && user.branchId) {
        const branch = await getDocument("branches", user.branchId);
        setInventory(branch?.inventory || {});
      }
    })();
  }, []);

  // Show original price only
  const getOriginalPrice = (price) => price;
  const handleAddToOrder = (name) => {
    // Navigate to the order screen and prefill a single item
    navigate("/user-dashboard/order", { state: { addItem: { product: name, quantity: 1 } } });
  };

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => {
          const stock = inventory[product.name];
          if (stock === undefined) return null; // Not in inventory for user's branch
          const inStock = Number(stock) > 0;
          const badgeCls = inStock
            ? "bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-400/30"
            : "bg-red-500/15 text-red-300 ring-1 ring-red-400/30";
          return (
            <div
              key={product.id}
              className={`${cardCls} p-0 overflow-hidden group transition transform hover:scale-[1.01] bg-gray-800/60`}
            >
              {/* Image (full-bleed) */}
              <div className="relative">
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-44 md:h-56 object-cover"
                  />
                ) : (
                  <div className="w-full h-44 md:h-56 bg-gray-700" />
                )}
                <div className="absolute top-3 left-3">
                  <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${badgeCls} shadow-sm backdrop-blur`}>{
                    inStock ? `In stock (${stock})` : "Out of stock"
                  }</span>
                </div>
              </div>

              {/* Details */}
              <div className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-white font-extrabold tracking-tight text-lg md:text-xl line-clamp-2" title={product.name}>
                    {product.name}
                  </h3>
                  <div className="text-blue-300 font-extrabold text-lg md:text-xl whitespace-nowrap">
                    Rs. {getOriginalPrice(product.price)}
                  </div>
                </div>
                {product.description ? (
                  <p className="mt-2 text-sm text-gray-300 line-clamp-2">{product.description}</p>
                ) : null}

                <div className="mt-4 flex items-center gap-2">
                  <button
                    onClick={() => handleAddToOrder(product.name)}
                    disabled={!inStock}
                    className={`px-4 py-2 rounded-md font-semibold transition focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-blue-500 ${
                      inStock
                        ? "bg-blue-600 hover:bg-blue-700 text-white"
                        : "bg-gray-700 text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    Add to order
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProductListing;

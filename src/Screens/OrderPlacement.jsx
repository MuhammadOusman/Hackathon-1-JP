import React, { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchBranches, decrementInventory } from "../Store/BranchSlice";
import { fetchProducts } from "../Store/ProductSlice";
import { fetchOffers } from "../Store/OffersSlice";
import { addOrder, fetchOrders } from "../Store/OrderSlice";
import { inputCls, cardCls, btnPrimary, btnGhost, chipCls } from "../Components/ui/styles";
import DeleteIcon from "@mui/icons-material/Delete";

const OrderPlacement = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const [form, setForm] = useState({ name: "", contact: "", branchId: user?.branchId || "" });
  const [items, setItems] = useState([]); // {product, quantity}
  const [currentItem, setCurrentItem] = useState({ product: "", quantity: 1 });
  const [discount, setDiscount] = useState(0);
  const location = useLocation();
  const dispatch = useDispatch();
  const { branches } = useSelector(state => state.branchReducer);
  const { products } = useSelector(state => state.productReducer);
  const { offers } = useSelector(state => state.offersReducer || { offers: [] });
  const [inventory, setInventory] = useState({});
  const { loading } = useSelector(state => state.orderReducer);

  useEffect(() => {
  dispatch(fetchBranches());
  dispatch(fetchProducts());
  dispatch(fetchOffers());
    if (user && user.branchId) {
      // derive inventory from store when branches load
      const b = (branches || []).find(b => String(b.id) === String(user.branchId));
      setInventory(b?.inventory || {});
    }
  }, [dispatch]);

  // Keep inventory in sync when branches change
  useEffect(() => {
    if (user && user.branchId) {
      const b = (branches || []).find(b => String(b.id) === String(user.branchId));
      setInventory(b?.inventory || {});
    }
  }, [branches, user?.branchId]);

  // If navigated with a preselected item, add it once
  useEffect(() => {
    const navItem = location.state && location.state.addItem;
    if (navItem && navItem.product) {
      const exists = items.some(i => i.product === navItem.product);
      if (!exists) {
        setItems(prev => [...prev, { product: navItem.product, quantity: Number(navItem.quantity) || 1 }]);
        setCurrentItem({ product: "", quantity: 1 });
      }
      // Clear history state so it doesn't add again on back/forward
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleItemChange = (e) => {
    setCurrentItem({ ...currentItem, [e.target.name]: e.target.value });
  };
  const handleAddItem = (e) => {
    e.preventDefault();
    if (!currentItem.product || !currentItem.quantity) return;
    setItems([...items, { ...currentItem }]);
    setCurrentItem({ product: "", quantity: 1 });
  };
  const handleRemoveItem = (idx) => {
    setItems(items.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.contact.trim()) {
      alert("Name and contact are required.");
      return;
    }
    if (items.length === 0) {
      alert("Add at least one item.");
      return;
    }
    // Send user's email from auth
    const orderData = {
      ...form,
      email: user?.email,
      items,
      discount
    };
    await dispatch(addOrder(orderData));

    // Decrement inventory in branch via Redux thunk
    if (user && user.branchId) {
      await dispatch(decrementInventory({ id: user.branchId, items }));
    }
    setForm({ name: "", contact: "", branchId: user?.branchId || "" });
    setItems([]);
    setDiscount(0);
    dispatch(fetchProducts());
    dispatch(fetchOrders());
    alert("Order placed!");
  };

  // Calculate total bill
  const getProductPrice = (name) => {
    const prod = products.find(p => p.name === name);
    return prod ? prod.price : 0;
  };
  const subtotal = useMemo(() => items.reduce((sum, item) => sum + getProductPrice(item.product) * item.quantity, 0), [items, products]);
  const total = useMemo(() => (discount ? subtotal - (subtotal * discount) / 100 : subtotal), [subtotal, discount]);
  const selectedOffer = useMemo(() => offers?.find(o => Number(o.discount) === Number(discount)), [offers, discount]);

  return (
    <div>
      {/* Customer info */}
      <form onSubmit={(e) => e.preventDefault()} className={`${cardCls} mb-4`}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input name="name" type="text" placeholder="Name" value={form.name} onChange={handleChange} required className={inputCls} />
          <input name="contact" type="text" placeholder="Contact" value={form.contact} onChange={handleChange} required className={inputCls} />
        </div>
      </form>

      {/* Add item */}
      <form onSubmit={handleAddItem} className={`${cardCls} mb-6`}>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 items-center">
          <select name="product" value={currentItem.product} onChange={handleItemChange} required className={`${inputCls} sm:col-span-2`}>
            <option value="">Select Product</option>
            {products.map((product) => {
              const stock = inventory[product.name];
              if (!stock || stock <= 0) return null;
              const addedQty = items.filter((i) => i.product === product.name).reduce((sum, i) => sum + Number(i.quantity), 0);
              const maxQty = stock - addedQty;
              if (maxQty <= 0) return null;
              return (
                <option key={product.id} value={product.name}>
                  {product.name} (In Stock)
                </option>
              );
            })}
          </select>
          <input name="quantity" type="number" min={1} max={currentItem.product ? inventory[currentItem.product] - items.filter((i) => i.product === currentItem.product).reduce((sum, i) => sum + Number(i.quantity), 0) : 1} value={currentItem.quantity} onChange={handleItemChange} required className={inputCls} />
          <button type="submit" className={btnPrimary}>Add Item</button>
        </div>
      </form>

      {/* Summary */}
      {items.length > 0 && (
        <div className={`${cardCls} mb-6`}>
          <h3 className="text-white font-semibold mb-3">Order Summary</h3>
          <ul className="space-y-2">
            {items.map((item, idx) => (
              <li key={idx} className="flex items-center justify-between bg-gray-900/40 border border-white/10 rounded-md p-3">
                <div className="text-gray-100">{item.product} x {item.quantity}</div>
                <div className="flex items-center gap-2">
                  <span className="text-blue-300 font-semibold">Rs. {getProductPrice(item.product) * item.quantity}</span>
                  <button type="button" onClick={() => handleRemoveItem(idx)} className="p-2 rounded-md bg-red-600 hover:bg-red-700 text-white" title="Remove">
                    <DeleteIcon fontSize="small" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-3 text-gray-300">Subtotal: Rs. {subtotal}</div>
        </div>
      )}

      {/* Discount */}
      <div className={`${cardCls} mb-6`}>
        <div className="flex items-center gap-3">
          <label htmlFor="discount" className="text-gray-200">Discount:</label>
          <select
            id="discount"
            value={discount}
            onChange={(e) => setDiscount(Number(e.target.value))}
            className={`${inputCls} w-56 sm:w-64`}
          >
            <option value={0}>None</option>
            {(offers || []).map((o) => (
              <option key={o.id} value={o.discount}>
                {o.name} — {o.discount}%
              </option>
            ))}
          </select>
          {selectedOffer ? (
            <span className={chipCls}>{selectedOffer.name} — {selectedOffer.discount}%</span>
          ) : null}
          <span className={chipCls}>Total: Rs. {total}</span>
        </div>
      </div>

      {/* Place order */}
      <form onSubmit={handleSubmit}>
        <button type="submit" disabled={loading || items.length === 0} className={btnPrimary}>
          {loading ? "Placing..." : "Place Order"}
        </button>
      </form>
    </div>
  );
};

export default OrderPlacement;

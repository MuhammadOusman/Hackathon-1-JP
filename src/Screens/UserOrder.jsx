import React, { useMemo, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import OrderPlacement from "./OrderPlacement";
import { fetchOrders } from "../Store/OrderSlice";

const UserOrder = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const dispatch = useDispatch();
  const { orders } = useSelector((state) => state.orderReducer || { orders: [] });
  const { products } = useSelector((state) => state.productReducer || { products: [] });

  const userOrders = useMemo(() => {
    if (!orders) return [];
    // Show only orders created by the logged-in user (by email)
    if (user?.email) {
      const email = String(user.email).toLowerCase();
      return orders.filter((o) => String(o.email || "").toLowerCase() === email);
    }
    return [];
  }, [orders, user?.email]);

  const getPrice = (name) => products.find((p) => p.name === name)?.price || 0;

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  return (
    <section className="max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-white">Place an Order</h2>
      <div className="bg-gray-800/60 border border-white/10 rounded-lg p-6 text-gray-100 mb-10">
        <OrderPlacement />
      </div>

      <h3 className="text-2xl font-semibold mb-4 text-white">Order History</h3>
      <div className="bg-gray-800/60 border border-white/10 rounded-lg p-6 text-gray-100 space-y-4">
        {userOrders.length === 0 && <p className="text-gray-400">No orders yet.</p>}
        {userOrders.slice().reverse().map((order, idx) => {
          const items = Array.isArray(order.items) && order.items.length > 0
            ? order.items
            : [{ product: order.product, quantity: order.quantity || 1 }];
          const subtotal = items.reduce((sum, it) => sum + getPrice(it.product) * Number(it.quantity), 0);
          const total = order.discount ? Math.round(subtotal * (1 - order.discount / 100)) : subtotal;
          return (
            <div key={order.id || idx} className="bg-gray-900/40 border border-white/10 rounded-md p-4">
              <div className="font-semibold text-white mb-2">Order No. {userOrders.length - idx}</div>
              <div className="text-gray-300">Name: {order.name || ""}</div>
              <div className="text-gray-300">Contact: {order.contact || ""}</div>
              <div className="text-gray-300 mt-2">Items:</div>
              <ul className="list-disc list-inside text-gray-200">
                {items.map((it, i) => (
                  <li key={i}>{it.product} : {it.quantity}</li>
                ))}
              </ul>
              <div className="mt-2 font-bold text-white">Total: Rs. {total}</div>
              {order.discount ? (
                <div className="text-lime-300 font-semibold">Discount Applied: {order.discount}%</div>
              ) : null}
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default UserOrder;

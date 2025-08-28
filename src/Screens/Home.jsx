import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers } from "../Store/AuthSlice/AuthSlice";
import Loader from "../Components/Loader/Loader";
import UserDetails from "../Components/UserDetails/UserDetails";
import Navbar from "../Components/Navbar/Navbar";
import { useNavigate } from "react-router-dom";
import ProductListing from "./ProductListing";
import OrderPlacement from "./OrderPlacement";
import ReviewSubmission from "./ReviewSubmission";
import { fetchOrders } from "../Store/OrderSlice";
import { fetchBranchesForReviews } from "../Store/ReviewsSlice";

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { authUsers, isLoading } = useSelector((state) => state.userReducer);
  const { orders } = useSelector(state => state.orderReducer);
  const { branches } = useSelector(state => state.reviewsReducer);
  const { products } = useSelector(state => state.productReducer);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
  dispatch(fetchUsers());
  dispatch(fetchOrders());
  dispatch(fetchBranchesForReviews());
  }, [dispatch]);

  // Filter orders and reviews by logged-in user
  const filteredOrders = user?.email
    ? orders.filter(order => String(order.email || "").toLowerCase() === String(user.email).toLowerCase())
    : [];
  let filteredReviews = [];
  if (user?.branchId && branches && branches.length > 0) {
    const branch = branches.find(b => String(b.id) === String(user.branchId));
    const all = branch && branch.reviews ? branch.reviews : [];
    filteredReviews = user?.email
      ? all.filter(r => String(r.email || "").toLowerCase() === String(user.email).toLowerCase())
      : user?.name
        ? all.filter(r => String(r.user || "").toLowerCase() === String(user.name).toLowerCase())
        : [];
  }

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };
  const handleProfileClick = undefined; // no-op retained for Navbar prop compatibility

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black">
      <div className="container mx-auto px-4 py-8">
        {isLoading ? (
          <div className="h-screen w-full flex justify-center items-center">
            <Loader />
          </div>
        ) : user && user.role === "admin" ? (
          <>
            <h2 className="text-2xl font-bold text-white mb-6">Admin Dashboard</h2>
            {/* Add your admin management components here */}
            {/* Example: <BranchManagement /> <ProductManagement /> <EmployeeList /> <OffersManagement /> */}
            <div style={{ marginTop: 24 }}>
              <p className="text-white">Admin features go here.</p>
            </div>
          </>
        ) : user && user.role === "manager" ? (
          <>
            <h2 className="text-2xl font-bold text-white mb-6">Manager Dashboard</h2>
            {/* Add your manager management components here */}
            <div style={{ marginTop: 24 }}>
              <p className="text-white">Manager features go here.</p>
            </div>
          </>
        ) : (
          <>
            <button onClick={handleLogout} style={{ padding: "8px 16px", background: "#2563eb", color: "#fff", border: "none", borderRadius: "6px", fontWeight: "bold", cursor: "pointer", marginBottom: "2rem" }}>Logout</button>
            {/* Product Listing */}
            <div style={{ marginTop: 24 }}>
              <ProductListing />
            </div>
            {/* Order Placement */}
            <div style={{ marginTop: 24 }}>
              <OrderPlacement />
            </div>
            {/* Review Submission */}
            <div style={{ marginTop: 24 }}>
              <ReviewSubmission />
            </div>
            {/* Filtered Orders and Reviews for user */}
            <h3>Your Orders</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {[...filteredOrders].reverse().map((order, idx) => {
                // Get products from Redux state
                const getProductPrice = (name) => {
                  const prod = products.find(p => p.name === name);
                  return prod ? prod.price : 0;
                };
                const subtotal = order.items && Array.isArray(order.items)
                  ? order.items.reduce((sum, item) => sum + getProductPrice(item.product) * item.quantity, 0)
                  : getProductPrice(order.product) * (order.quantity || 1);
                // Apply discount if present (discount is percent, e.g. 10 for 10%)
                let total = subtotal;
                if (order.discount) {
                  total = Math.round(subtotal * (1 - order.discount / 100));
                }
                return (
                  <div key={order.id} style={{ background: '#18181b', borderRadius: 8, padding: 16, color: '#fff', boxShadow: '0 2px 8px #0002' }}>
                    <div style={{ fontWeight: 'bold', marginBottom: 8 }}>Order No. {filteredOrders.length - idx}</div>
                    <div style={{ marginBottom: 4 }}>Name: {order.name || ''}</div>
                    <div style={{ marginBottom: 4 }}>Contact: {order.contact || ''}</div>
                    <div style={{ marginBottom: 8 }}>Items:</div>
                    <ul style={{ marginBottom: 8 }}>
                      {order.items && Array.isArray(order.items) ? (
                        order.items.map((item, i) => (
                          <li key={i} style={{ marginLeft: 16 }}>{item.product} : {item.quantity}</li>
                        ))
                      ) : (
                        <li style={{ marginLeft: 16 }}>{order.product} : {order.quantity}</li>
                      )}
                    </ul>
                    <div style={{ fontWeight: 'bold' }}>Total: Rs. {total}</div>
                    {order.discount ? (
                      <div style={{ color: '#a3e635', fontWeight: 'bold' }}>
                        Discount Applied: {order.discount}%
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>
            <h3>Your Reviews</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
              {filteredReviews.map(review => (
                <div key={review.id} style={{ background: '#18181b', borderRadius: 8, padding: 16, color: '#fff', boxShadow: '0 2px 8px #0002' }}>
                  {review.review}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Home;

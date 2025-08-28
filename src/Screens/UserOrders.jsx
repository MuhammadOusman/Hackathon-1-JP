import React from "react";

const UserOrders = () => {
  return (
    <div className="p-8 text-white">
      <h2 className="text-2xl font-bold mb-4">My Orders</h2>
      <div className="bg-gray-800 rounded-lg p-6 shadow-md">
        <p>No orders yet.</p>
        {/* List user's orders here */}
      </div>
    </div>
  );
};

export default UserOrders;

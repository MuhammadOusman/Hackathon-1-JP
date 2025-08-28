import React from "react";

const UserReviews = () => {
  return (
    <div className="p-8 text-white">
      <h2 className="text-2xl font-bold mb-4">My Reviews</h2>
      <div className="bg-gray-800 rounded-lg p-6 shadow-md">
        <p>No reviews yet.</p>
        {/* List user's reviews here */}
      </div>
    </div>
  );
};

export default UserReviews;

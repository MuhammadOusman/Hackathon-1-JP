import React from "react";

const UserProfile = () => {
  return (
    <div className="p-8 text-white">
      <h2 className="text-2xl font-bold mb-4">Profile</h2>
      <div className="bg-gray-800 rounded-lg p-6 shadow-md">
        <p>Name: John Doe</p>
        <p>Email: johndoe@example.com</p>
        <p>Contact: 123-456-7890</p>
        {/* Add edit profile functionality here */}
      </div>
    </div>
  );
};

export default UserProfile;

import React from "react";

const UserDetails = ({ name, email, uid }) => {
  return (
    <div className="w-full max-w-sm bg-gray-800 rounded-xl shadow-2xl border border-gray-700 p-6 text-white transform hover:scale-105 transition-transform duration-300 ease-in-out">
      <h2 className="text-3xl font-extrabold text-center mb-6 text-purple-400">
        {name}
      </h2>
      <div className="bg-gray-700 border border-gray-600 p-6 rounded-lg space-y-4">
        
        <div className="flex flex-col">
          <p className="text-gray-400 text-sm mb-1">Email:</p>
          <p className="text-lg font-semibold">{email}</p>
        </div>
        <div className="flex flex-col">
          <p className="text-gray-400 text-sm mb-1">UID:</p>
          <p className="text-sm font-mono break-all bg-gray-900 p-2 rounded-md">{uid}</p>
        </div>
      </div>
    </div>
  );
};

export default UserDetails;

import React from "react";
import ProductListing from "./ProductListing";

const UserCatalog = () => {
  return (
    <section className="max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-white">Product Catalog</h2>
      <div className="bg-gray-800/60 border border-white/10 rounded-lg p-6 text-gray-100">
        <ProductListing />
      </div>
    </section>
  );
};

export default UserCatalog;

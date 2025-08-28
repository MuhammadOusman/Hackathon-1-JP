import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchProducts, addProduct, updateProduct, deleteProduct } from "../Store/ProductSlice";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";

const ProductManagement = () => {
  const [newProduct, setNewProduct] = useState({ name: "", price: "", image: "" });
  const [editProductId, setEditProductId] = useState(null);
  const [editProduct, setEditProduct] = useState({ name: "", price: "", image: "" });
  const dispatch = useDispatch();
  const { products, loading } = useSelector(state => state.productReducer);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const handleAddProduct = (e) => {
    e.preventDefault();
    dispatch(addProduct({
      ...newProduct,
      price: Number(newProduct.price),
    }));
  setNewProduct({ name: "", price: "", image: "" });
  };

  const handleDeleteProduct = (id) => {
    dispatch(deleteProduct(id));
  };

  const startEditProduct = (product) => {
    setEditProductId(product.id);
  setEditProduct({ name: product.name, price: product.price, image: product.image || "" });
  };

  const handleEditProductChange = (e) => {
    const { name, value } = e.target;
    setEditProduct(prev => ({ ...prev, [name]: value }));
  };

  const saveEditProduct = (id) => {
  dispatch(updateProduct({ id, data: { name: editProduct.name, price: Number(editProduct.price), image: editProduct.image || "" } }));
    setEditProductId(null);
  setEditProduct({ name: "", price: "", image: "" });
  };

  const cancelEditProduct = () => {
    setEditProductId(null);
    setEditProduct({ name: "", price: "", image: "" });
  };

  // For URL-based images, just keep controlled string state.

  const inputCls = "w-full px-4 py-3 bg-gray-800 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none";
  const cardCls = "bg-gray-800/60 border border-white/10 rounded-xl p-5 shadow hover:shadow-xl transition-shadow duration-200";
  const btnBase = "px-4 py-2 rounded-md font-semibold transition-colors";

  return (
    <section className="max-w-7xl mx-auto px-2 md:px-4">
      <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Product Management</h2>

      {/* Add Product Form */}
      <form onSubmit={handleAddProduct} className={`${cardCls} mb-8`}>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3 items-center">
          <input
            type="text"
            placeholder="Product Name"
            value={newProduct.name}
            onChange={e => setNewProduct({ ...newProduct, name: e.target.value })}
            required
            className={inputCls}
          />
          <input
            type="number"
            placeholder="Price"
            value={newProduct.price}
            onChange={e => setNewProduct({ ...newProduct, price: e.target.value })}
            required
            className={inputCls}
          />
          <input
            type="url"
            placeholder="Image URL (optional)"
            value={newProduct.image}
            onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
            className={inputCls}
          />
          <div className="flex items-center gap-3">
            {newProduct.image && (
              <img src={newProduct.image} alt="Preview" className="w-12 h-12 object-cover rounded" onError={(e) => (e.currentTarget.style.display = 'none')} />
            )}
            <button type="submit" disabled={loading} className={`${btnBase} bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-60`}>
              {loading ? "Adding..." : "Add Product"}
            </button>
          </div>
        </div>
      </form>

      {/* Product List */}
      <ul className="space-y-5">
        {products.map(product => (
          <li key={product.id} className={cardCls}>
            {editProductId === product.id ? (
              <div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input
                    type="text"
                    name="name"
                    value={editProduct.name}
                    onChange={handleEditProductChange}
                    required
                    className={inputCls}
                  />
                  <input
                    type="number"
                    name="price"
                    value={editProduct.price}
                    onChange={handleEditProductChange}
                    required
                    className={inputCls}
                  />
                  <input
                    type="url"
                    name="image"
                    placeholder="Image URL (optional)"
                    value={editProduct.image}
                    onChange={handleEditProductChange}
                    className={inputCls}
                  />
                </div>
                <div className="flex items-center gap-3 mt-4">
                  {editProduct.image && (
                    <img src={editProduct.image} alt="Preview" className="w-14 h-14 object-cover rounded" onError={(e) => (e.currentTarget.style.display = 'none')} />
                  )}
                  <button
                    onClick={() => saveEditProduct(product.id)}
                    disabled={loading}
                    aria-label="Save"
                    title="Save"
                    className="p-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-60"
                  >
                    <SaveIcon fontSize="small" />
                  </button>
                  <button
                    onClick={cancelEditProduct}
                    disabled={loading}
                    aria-label="Cancel"
                    title="Cancel"
                    className="p-2 rounded-md bg-gray-700 hover:bg-gray-600 text-white disabled:opacity-60"
                  >
                    <CloseIcon fontSize="small" />
                  </button>
                </div>
              </div>
            ) : (
        <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3 flex-1">
                  {product.image && (
                    <img src={product.image} alt={product.name} className="w-14 h-14 object-cover rounded" />
                  )}
                  <div className="text-white text-lg font-medium">
                    {product.name} - <span className="text-blue-300">{product.price}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => startEditProduct(product)}
                    disabled={loading}
                    aria-label="Edit product"
                    title="Edit"
                    className="p-2 rounded-md bg-green-600 hover:bg-green-700 text-white disabled:opacity-60"
                  >
                    <EditIcon fontSize="small" />
                  </button>
                  <button
                    onClick={() => handleDeleteProduct(product.id)}
                    disabled={loading}
                    aria-label="Delete product"
                    title="Delete"
                    className="p-2 rounded-md bg-red-600 hover:bg-red-700 text-white disabled:opacity-60"
                  >
                    <DeleteIcon fontSize="small" />
                  </button>
                </div>
              </div>
            )}
      </li>
        ))}
    </ul>
    </section>
  );
};

export default ProductManagement;

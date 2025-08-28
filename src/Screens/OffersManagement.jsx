import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchOffers, addOffer, deleteOffer, updateOffer } from "../Store/OffersSlice";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";

const OffersManagement = () => {
  const [newOffer, setNewOffer] = useState({ name: "", discount: "" });
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ name: "", discount: "" });
  const dispatch = useDispatch();
  const { offers, loading } = useSelector(state => state.offersReducer);

  useEffect(() => {
    dispatch(fetchOffers());
  }, [dispatch]);

  const handleAddOffer = (e) => {
    e.preventDefault();
  dispatch(addOffer({ name: newOffer.name.trim(), discount: Number(newOffer.discount) }));
  setNewOffer({ name: "", discount: "" });
  };

  const handleDeleteOffer = (id) => {
    dispatch(deleteOffer(id));
  };

  const startEdit = (offer) => {
    setEditingId(offer.id);
    setEditForm({ name: offer.name || "", discount: offer.discount?.toString?.() || "" });
  };
  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({ name: "", discount: "" });
  };
  const saveEdit = (id) => {
    dispatch(updateOffer({ id, data: { name: editForm.name.trim(), discount: Number(editForm.discount) } }));
    cancelEdit();
  };

  const inputCls = "w-full px-4 py-3 bg-gray-800 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none";
  const cardCls = "bg-gray-800/60 border border-white/10 rounded-xl p-5 shadow hover:shadow-xl transition-shadow duration-200";
  const btnBase = "px-4 py-2 rounded-md font-semibold transition-colors";

  return (
    <section className="max-w-4xl mx-auto px-2 md:px-4">
      <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Offers & Discounts</h2>

      {/* Add Offer */}
      <form onSubmit={handleAddOffer} className={`${cardCls} mb-6`}>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-center">
          <input
            type="text"
            placeholder="Offer Name"
            value={newOffer.name}
            onChange={e => setNewOffer({ ...newOffer, name: e.target.value })}
            required
            className={inputCls}
          />
          <input
            type="number"
            placeholder="Discount (%)"
            value={newOffer.discount}
            onChange={e => setNewOffer({ ...newOffer, discount: e.target.value })}
            required
            className={inputCls}
          />
          <button type="submit" disabled={loading} className={`${btnBase} bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-60 w-full sm:w-auto`}>
            {loading ? "Adding..." : "Add Offer"}
          </button>
        </div>
      </form>

      {/* Offers list */}
      <ul className="space-y-3">
        {offers.map(offer => (
          <li key={offer.id} className={`${cardCls}`}>
            {editingId === offer.id ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-center">
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  placeholder="Offer Name"
                  className={inputCls}
                />
                <input
                  type="number"
                  value={editForm.discount}
                  onChange={(e) => setEditForm({ ...editForm, discount: e.target.value })}
                  placeholder="Discount (%)"
                  className={inputCls}
                />
                <div className="flex items-center gap-2">
                  <button onClick={() => saveEdit(offer.id)} className="p-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white" title="Save"><SaveIcon fontSize="small" /></button>
                  <button onClick={cancelEdit} className="p-2 rounded-md bg-gray-700 hover:bg-gray-600 text-white" title="Cancel"><CloseIcon fontSize="small" /></button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between gap-3">
                <div className="text-white text-lg font-medium">{offer.name ? `${offer.name} — ` : ""}<span className="text-blue-300">{offer.discount}%</span></div>
                <div className="flex items-center gap-2">
                  <button onClick={() => startEdit(offer)} className="p-2 rounded-md bg-green-600 hover:bg-green-700 text-white" title="Edit"><EditIcon fontSize="small" /></button>
                  <button
                    onClick={() => handleDeleteOffer(offer.id)}
                    disabled={loading}
                    aria-label="Delete offer"
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

export default OffersManagement;

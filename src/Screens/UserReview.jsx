import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import ReviewSubmission from "./ReviewSubmission";

const UserReview = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const { branches } = useSelector((state) => state.reviewsReducer || { branches: [] });

  const reviews = useMemo(() => {
    if (!user?.branchId || !Array.isArray(branches)) return [];
    const branch = branches.find((b) => String(b.id) === String(user.branchId));
    const all = branch?.reviews || [];
    // Filter to reviews authored by this user (match by email if present, fallback to name)
    if (user?.email) {
      const email = String(user.email).toLowerCase();
      return all.filter((r) => String(r.email || "").toLowerCase() === email);
    }
    if (user?.name) {
      return all.filter((r) => String(r.user || "").toLowerCase() === String(user.name).toLowerCase());
    }
    return [];
  }, [branches, user?.branchId, user?.email, user?.name]);

  return (
    <section className="max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-white">Submit a Review</h2>
      <div className="bg-gray-800/60 border border-white/10 rounded-lg p-6 text-gray-100 mb-10">
        <ReviewSubmission />
      </div>

      <h3 className="text-2xl font-semibold mb-4 text-white">Your Reviews</h3>
      <div className="bg-gray-800/60 border border-white/10 rounded-lg p-6 text-gray-100 space-y-3">
        {reviews.length === 0 && <p className="text-gray-400">No reviews yet.</p>}
        {reviews.slice().reverse().map((r) => (
          <div key={r.id} className="bg-gray-900/40 border border-white/10 rounded-md p-4 text-gray-100">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-white font-semibold">{r.user || "You"}</span>
              {r.rating ? (
                <span className="px-2 py-0.5 rounded-md text-xs bg-gray-900 border border-white/10 text-gray-200">★ {r.rating}</span>
              ) : null}
            </div>
            <div>{r.review}</div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default UserReview;

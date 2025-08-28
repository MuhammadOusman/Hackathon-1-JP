import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchBranches } from "../Store/BranchSlice";
import { cardCls, chipCls } from "../Components/ui/styles";

const ManagerReviews = () => {
  const dispatch = useDispatch();
  const { branches, loading } = useSelector(state => state.branchReducer);
  const managerId = useSelector(state => state.userReducer?.currentManager?.managerId);
  const branch = branches.find(b => String(b.managerId) === String(managerId));
  // Only show reviews with a valid user name (not empty, not branch name)
  const reviews = branch ? (branch.reviews || []).filter(r => r.user && !r.user.toLowerCase().includes('branch')) : [];

  useEffect(() => {
    dispatch(fetchBranches());
  }, [dispatch]);

  if (loading && branches.length === 0) return <div className="text-gray-400">Loading branch...</div>;
  if (!branch) return <div className="text-gray-400">No branch found for this manager.</div>;

  return (
    <section className="max-w-6xl mx-auto px-2 md:px-4">
      <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Customer Reviews</h2>
      <div className={cardCls}>
        {reviews.length > 0 ? (
          <ul className="divide-y divide-white/10">
            {reviews.map((review) => (
              <li key={review.id} className="py-3 flex items-start gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-white font-semibold">{review.user}</span>
                    {review.rating ? <span className={chipCls}>★ {review.rating}</span> : null}
                  </div>
                  <div className="text-gray-300">{review.review}</div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-gray-400">No reviews yet.</div>
        )}
      </div>
    </section>
  );
};

export default ManagerReviews;

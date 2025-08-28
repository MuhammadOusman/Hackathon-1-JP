import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchBranchesForReviews, addReview } from "../Store/ReviewsSlice";
import { inputCls, cardCls, btnPrimary } from "../Components/ui/styles";

const ReviewSubmission = () => {
  const dispatch = useDispatch();
  const { branches, loading } = useSelector(state => state.reviewsReducer);
  const user = JSON.parse(localStorage.getItem("user"));
  const [form, setForm] = useState({ branchId: user?.branchId || "", review: "" });
  const [rating, setRating] = useState(0); // can be 0.5 steps
  const [hoverRating, setHoverRating] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    dispatch(fetchBranchesForReviews());
  }, [dispatch]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const branch = branches.find(b => b.id === form.branchId);
    if (branch) {
      // Always include user's name from localStorage
  const review = { id: Date.now(), user: user?.name || "Anonymous", email: user?.email || "", review: form.review, rating };
      await dispatch(addReview({ branchId: branch.id, review }));
      await dispatch(fetchBranchesForReviews()); // Refetch reviews to update UI
      setForm({ branchId: "", review: "" });
      setRating(0);
      setSubmitting(false);
      alert("Review submitted!");
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className={cardCls}>
        <div className="space-y-3">
          {/* Star rating */}
          <div className="flex items-center gap-2 select-none">
            <span className="text-gray-200">Rating:</span>
            {[1, 2, 3, 4, 5].map((star) => {
              const display = hoverRating ?? rating;
              const full = display >= star;
              const half = !full && display >= star - 0.5;
              const onSet = (e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const ratio = (e.clientX - rect.left) / rect.width;
                const val = (star - 1) + (ratio < 0.5 ? 0.5 : 1);
                setRating(val);
              };
              const onMove = (e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const ratio = (e.clientX - rect.left) / rect.width;
                const val = (star - 1) + (ratio < 0.5 ? 0.5 : 1);
                setHoverRating(val);
              };
              return (
                <button
                  key={star}
                  type="button"
                  onMouseMove={onMove}
                  onMouseLeave={() => setHoverRating(null)}
                  onClick={onSet}
                  className="relative text-2xl leading-none w-7 h-7 flex items-center justify-center"
                  aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
                  title={`${star} star${star > 1 ? "s" : ""}`}
                >
                  {/* base star */}
                  <span className="absolute inset-0 flex items-center justify-center text-gray-600">★</span>
                  {full ? (
                    <span className="absolute inset-0 flex items-center justify-center text-yellow-400">★</span>
                  ) : half ? (
                    <span
                      className="absolute inset-0 flex items-center justify-center"
                      style={{
                        background: "linear-gradient(90deg, #f59e0b 50%, transparent 50%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        color: "transparent",
                      }}
                    >
                      ★
                    </span>
                  ) : null}
                </button>
              );
            })}
          </div>
          <textarea name="review" placeholder="Your review" value={form.review} onChange={handleChange} required className={`${inputCls} h-28`} />
          <button type="submit" disabled={submitting || loading || rating === 0} className={btnPrimary}>
            {submitting || loading ? "Submitting..." : "Submit Review"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReviewSubmission;

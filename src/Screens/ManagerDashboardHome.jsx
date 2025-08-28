import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchBranches } from "../Store/BranchSlice";
import { fetchProducts } from "../Store/ProductSlice";
import { fetchOrders } from "../Store/OrderSlice";
import { fetchOffers } from "../Store/OffersSlice";
import {
  selectManagerBranch,
  makeSelectOrdersByBranch,
  makeSelectBranchRevenueTotals,
  makeSelectBranchRevenueTrend,
  makeSelectTopProductsByBranch,
  makeSelectLowStockForBranch,
  selectAvgRatingForManagerBranch,
} from "../Store/selectors";
import { lazy, Suspense } from "react";
const LineChart = lazy(() => import("../Components/Charts/LineChart"));
const BarChart = lazy(() => import("../Components/Charts/BarChart"));

const cardCls = "bg-gray-800/60 border border-white/10 rounded-xl p-5 shadow hover:shadow-xl transition-shadow duration-200";

const ManagerDashboardHome = () => {
  const dispatch = useDispatch();
  const branch = useSelector(selectManagerBranch);

  useEffect(() => {
    dispatch(fetchBranches());
    dispatch(fetchProducts());
    dispatch(fetchOrders());
    dispatch(fetchOffers());
  }, [dispatch]);

  // derive memoized selectors for this branch id
  const branchId = branch?.id;
  const selectOrdersForBranch = useMemo(() => (branchId ? makeSelectOrdersByBranch(branchId) : () => []), [branchId]);
  const selectTotalsForBranch = useMemo(() => (branchId ? makeSelectBranchRevenueTotals(branchId) : () => ({ totalProducts: 0, totalOrders: 0, revenue: 0 })), [branchId]);
  const selectTrendForBranch = useMemo(() => (branchId ? makeSelectBranchRevenueTrend(branchId, 10) : () => ({ labels: [], points: [] })), [branchId]);
  const selectTopForBranch = useMemo(() => (branchId ? makeSelectTopProductsByBranch(branchId) : () => ({ labels: [], data: [] })), [branchId]);
  const selectLowStockForBranch = useMemo(() => (branchId ? makeSelectLowStockForBranch(branchId) : () => []), [branchId]);

  const branchOrders = useSelector(selectOrdersForBranch);
  const totals = useSelector(selectTotalsForBranch);

  // Revenue trend (last 10 branch orders)
  const revenueTrend = useSelector(selectTrendForBranch);

  // Top products within branch orders
  const topProducts = useSelector(selectTopForBranch);

  const lowStock = useSelector(selectLowStockForBranch);

  const avgRating = useSelector(selectAvgRatingForManagerBranch);

  if (!branch) {
    return (
      <div className={cardCls}>No branch linked to this manager account.</div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-extrabold mb-6">Dashboard — {branch.name}</h1>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className={cardCls}>
          <div className="text-gray-400">Products</div>
          <div className="text-3xl font-bold text-white">{totals.totalProducts}</div>
        </div>
        <div className={cardCls}>
          <div className="text-gray-400">Orders</div>
          <div className="text-3xl font-bold text-white">{totals.totalOrders}</div>
        </div>
        <div className={cardCls}>
          <div className="text-gray-400">Revenue (est.)</div>
          <div className="text-3xl font-bold text-emerald-300">Rs. {totals.revenue}</div>
        </div>
        {avgRating !== null && (
          <div className={cardCls}>
            <div className="text-gray-400">Avg. Rating</div>
            <div className="text-3xl font-bold text-yellow-300">★ {avgRating}</div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className={`${cardCls} lg:col-span-2`}>
          <div className="text-white font-semibold mb-3">Revenue Trend (last 10 orders)</div>
          <Suspense fallback={<div className="text-gray-400 text-sm">Loading chart…</div>}>
          <LineChart
            data={{
              labels: revenueTrend.labels,
              datasets: [
                {
                  label: "Revenue",
                  data: revenueTrend.points,
                  fill: false,
                  borderColor: "#60a5fa",
                  backgroundColor: "#60a5fa",
                  tension: 0.3,
                },
              ],
            }}
            options={{ plugins: { legend: { display: false } } }}
          />
          </Suspense>
        </div>
        <div className={`${cardCls} lg:col-span-1`}>
          <div className="text-white font-semibold mb-3">Top Products</div>
          <Suspense fallback={<div className="text-gray-400 text-sm">Loading chart…</div>}>
          <BarChart
            data={{
              labels: topProducts.labels,
              datasets: [
                {
                  label: "Qty",
                  data: topProducts.data,
                  backgroundColor: "#34d399",
                },
              ],
            }}
            options={{ plugins: { legend: { display: false } } }}
          />
          </Suspense>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <div className={cardCls}>
          <div className="text-white font-semibold mb-2">Low Stock (&lt;= 5)</div>
          <div className="rounded-lg bg-slate-900/30 border border-white/5 p-2 pr-1 max-h-48 overflow-auto thin-scrollbar">
            {lowStock.length === 0 ? (
              <div className="text-gray-400 text-sm px-1 py-2">No low stock items.</div>
            ) : (
              <ul className="divide-y divide-white/5">
                {lowStock.map((row) => {
                  const badgeCls =
                    row.qty === 0
                      ? "bg-red-500/20 text-red-300 ring-1 ring-red-400/40"
                      : row.qty <= 2
                      ? "bg-orange-500/20 text-orange-300 ring-1 ring-orange-400/40"
                      : "bg-yellow-500/20 text-yellow-300 ring-1 ring-yellow-400/40";
                  return (
                    <li key={row.product} className="flex items-center justify-between gap-3 py-2 px-2">
                      <span className="text-gray-200 truncate">{row.product}</span>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${badgeCls}`}>{row.qty}</span>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
        <div className={cardCls}>
          <div className="text-white font-semibold mb-2">At a Glance</div>
          <div className="text-gray-300">Branch: {branch.name}</div>
          <div className="text-gray-300">Products: {totals.totalProducts}</div>
          <div className="text-gray-300">Orders: {totals.totalOrders}</div>
          <div className="text-gray-300">Revenue: Rs. {totals.revenue}</div>
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboardHome;

import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchBranches } from "../Store/BranchSlice";
import { fetchProducts } from "../Store/ProductSlice";
import { fetchOrders } from "../Store/OrderSlice";
import { fetchOffers } from "../Store/OffersSlice";
import {
  selectBranches,
  selectProducts,
  selectOrders,
  selectTotals,
  selectOrdersPerBranchChart,
  makeSelectRevenueTrend,
  selectTopProducts,
  selectLowStockRows,
  selectBranchRatings,
} from "../Store/selectors";
import { lazy, Suspense } from "react";
const PieChart = lazy(() => import("../Components/Charts/PieChart"));
const LineChart = lazy(() => import("../Components/Charts/LineChart"));
const BarChart = lazy(() => import("../Components/Charts/BarChart"));

const cardCls = "bg-gray-800/60 border border-white/10 rounded-xl p-5 shadow hover:shadow-xl transition-shadow duration-200";

const DashboardHome = () => {
  const dispatch = useDispatch();
  const branches = useSelector(selectBranches);
  const products = useSelector(selectProducts);
  const orders = useSelector(selectOrders);
  const offers = useSelector((s) => s.offersReducer?.offers || []);

  useEffect(() => {
    dispatch(fetchBranches());
    dispatch(fetchProducts());
    dispatch(fetchOrders());
    dispatch(fetchOffers());
  }, [dispatch]);

  // Metrics
  const totals = useSelector(selectTotals);

  // Orders per branch (pie)
  const ordersPerBranch = useSelector(selectOrdersPerBranchChart);

  // Revenue trend by last N orders (line)
  const revenueTrend = useSelector(makeSelectRevenueTrend(10));

  // Top products by frequency (bar)
  const topProducts = useSelector(selectTopProducts);

  // Low stock list (<=5) precomputed for cleaner render
  const lowStock = useSelector(selectLowStockRows);

  // Average rating per branch
  const branchRatings = useSelector(selectBranchRatings);

  return (
    <div>
      <h1 className="text-4xl font-extrabold mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className={cardCls}>
          <div className="text-gray-400">Branches</div>
          <div className="text-3xl font-bold text-white">{totals.totalBranches}</div>
        </div>
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
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className={`${cardCls} lg:col-span-1`}>
          <div className="text-white font-semibold mb-3">Orders by Branch</div>
          <Suspense fallback={<div className="text-gray-400 text-sm">Loading chart…</div>}>
          <PieChart
            data={{
              labels: ordersPerBranch.labels,
              datasets: [
                {
                  data: ordersPerBranch.data,
                  backgroundColor: ["#60a5fa", "#34d399", "#fbbf24", "#f87171", "#a78bfa", "#fb7185"],
                },
              ],
            }}
          />
          </Suspense>
        </div>
        <div className={`${cardCls} lg:col-span-1`}>
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
          <div className="text-white font-semibold mb-2">Active Offers</div>
          <ul className="text-gray-300 list-disc ml-5">
            {(offers || []).map((o) => (
              <li key={o.id}>{o.name ? `${o.name} — ` : ''}{o.discount}%</li>
            ))}
          </ul>
        </div>
        <div className={cardCls}>
          <div className="text-white font-semibold mb-2">Low Stock (&lt;= 5)</div>
          <div className="rounded-lg bg-slate-900/30 border border-white/5 p-2 pr-1 max-h-48 overflow-auto thin-scrollbar">
            {lowStock.length === 0 ? (
              <div className="text-gray-400 text-sm px-1 py-2">All good — no items at or below threshold.</div>
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
                    <li key={row.key} className="flex items-center justify-between gap-3 py-2 px-2">
                      <span className="text-gray-200 truncate" title={`${row.branch}: ${row.product}`}>
                        {row.branch}: {row.product}
                      </span>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${badgeCls}`}>{row.qty}</span>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
        <div className={cardCls}>
          <div className="text-white font-semibold mb-2">Branch Ratings</div>
          <div className="rounded-lg bg-slate-900/30 border border-white/5 p-2 pr-1 max-h-48 overflow-auto thin-scrollbar">
            {branchRatings.length === 0 ? (
              <div className="text-gray-400 text-sm px-1 py-2">No branches found.</div>
            ) : (
              <ul className="divide-y divide-white/5">
                {branchRatings.map((br) => (
                  <li key={br.id} className="flex items-center justify-between gap-3 py-2 px-2">
                    <span className="text-gray-200 truncate" title={br.name}>{br.name}</span>
                    {br.avg === null ? (
                      <span className="text-xs text-gray-400">No reviews</span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <span className="text-yellow-300 font-semibold">★ {br.avg}</span>
                        <span className="text-xs text-gray-400">({br.count})</span>
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
        <div className={cardCls}>
          <div className="text-white font-semibold mb-2">At a Glance</div>
          <div className="text-gray-300">Branches: {totals.totalBranches}</div>
          <div className="text-gray-300">Products: {totals.totalProducts}</div>
          <div className="text-gray-300">Orders: {totals.totalOrders}</div>
          <div className="text-gray-300">Revenue: Rs. {totals.revenue}</div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;

import { createSelector } from '@reduxjs/toolkit';
import { branchSelectors } from './BranchSlice';
import { orderSelectors } from './OrderSlice';
import { productSelectors } from './ProductSlice';

// Basic slices
export const selectBranches = branchSelectors.selectAll;
export const selectOrders = orderSelectors.selectAll;
export const selectProducts = productSelectors.selectAll;
export const selectCurrentManager = (state) => state.userReducer?.currentManager;

// Derived maps
export const selectProductPriceMap = createSelector(selectProducts, (products) => {
  const map = new Map();
  products.forEach((p) => map.set(p.name, Number(p.price || 0)));
  return map;
});

// Helpers
const computeOrderRevenue = (order, priceMap) => {
  const total = (order.items || []).reduce((s, it) => s + (priceMap.get(it.product) || 0) * Number(it.quantity || 0), 0);
  return order.discount ? total - (total * order.discount) / 100 : total;
};

// Global metrics
export const selectTotals = createSelector(
  [selectBranches, selectProducts, selectOrders, selectProductPriceMap],
  (branches, products, orders, priceMap) => {
    const revenue = orders.reduce((sum, o) => sum + computeOrderRevenue(o, priceMap), 0);
    return {
      totalBranches: branches.length,
      totalProducts: products.length,
      totalOrders: orders.length,
      revenue,
    };
  }
);

export const selectOrdersPerBranchChart = createSelector(
  [selectBranches, selectOrders],
  (branches, orders) => {
    const map = new Map();
    orders.forEach((o) => {
      const bid = String(o.branchId);
      map.set(bid, (map.get(bid) || 0) + 1);
    });
    const labels = branches.map((b) => b.name);
    const data = branches.map((b) => map.get(String(b.id)) || 0);
    return { labels, data };
  }
);

export const makeSelectRevenueTrend = (n = 10) =>
  createSelector([selectOrders, selectProductPriceMap], (orders, priceMap) => {
    const last = orders.slice(-n);
    const base = Math.max(0, orders.length - n);
    return {
      labels: last.map((_, i) => `#${base + i + 1}`),
      points: last.map((o) => computeOrderRevenue(o, priceMap)),
    };
  });

export const selectTopProducts = createSelector([selectOrders], (orders) => {
  const count = new Map();
  orders.forEach((o) => (o.items || []).forEach((it) => count.set(it.product, (count.get(it.product) || 0) + Number(it.quantity || 0))));
  const entries = Array.from(count.entries()).sort((a, b) => b[1] - a[1]).slice(0, 5);
  return {
    labels: entries.map((e) => e[0]),
    data: entries.map((e) => e[1]),
  };
});

export const selectLowStockRows = createSelector([selectBranches], (branches) => {
  const rows = [];
  branches.forEach((b) => {
    Object.entries(b.inventory || {})
      .filter(([, v]) => (v || 0) <= 5)
      .forEach(([name, qty]) => {
        rows.push({ key: `${b.id}-${name}`, branch: b.name, product: name, qty: Number(qty || 0) });
      });
  });
  return rows.sort((a, b) => a.qty - b.qty || a.branch.localeCompare(b.branch) || a.product.localeCompare(b.product));
});

export const selectBranchRatings = createSelector([selectBranches], (branches) =>
  branches.map((b) => {
    const ratings = (b.reviews || []).map((r) => Number(r.rating)).filter((n) => !isNaN(n));
    if (ratings.length === 0) return { id: b.id, name: b.name, avg: null, count: 0 };
    const avg = ratings.reduce((a, c) => a + c, 0) / ratings.length;
    return { id: b.id, name: b.name, avg: Math.round(avg * 10) / 10, count: ratings.length };
  })
);

// Manager-focused selectors
export const selectManagerBranch = createSelector([selectBranches, selectCurrentManager], (branches, mgr) => {
  if (!mgr) return undefined;
  return branches.find((b) => String(b.managerId) === String(mgr.managerId));
});

export const makeSelectOrdersByBranch = (branchId) =>
  createSelector([selectOrders], (orders) => orders.filter((o) => String(o.branchId) === String(branchId)));

export const makeSelectBranchRevenueTotals = (branchId) =>
  createSelector([makeSelectOrdersByBranch(branchId), selectProducts, selectProductPriceMap], (orders, products, priceMap) => {
    const revenue = orders.reduce((sum, o) => sum + computeOrderRevenue(o, priceMap), 0);
    return { totalProducts: products.length, totalOrders: orders.length, revenue };
  });

export const makeSelectBranchRevenueTrend = (branchId, n = 10) =>
  createSelector([makeSelectOrdersByBranch(branchId), selectProductPriceMap], (orders, priceMap) => {
    const last = orders.slice(-n);
    const base = Math.max(0, orders.length - n);
    return {
      labels: last.map((_, i) => `#${base + i + 1}`),
      points: last.map((o) => computeOrderRevenue(o, priceMap)),
    };
  });

export const makeSelectTopProductsByBranch = (branchId) =>
  createSelector([makeSelectOrdersByBranch(branchId)], (orders) => {
    const count = new Map();
    orders.forEach((o) => (o.items || []).forEach((it) => count.set(it.product, (count.get(it.product) || 0) + Number(it.quantity || 0))));
    const entries = Array.from(count.entries()).sort((a, b) => b[1] - a[1]).slice(0, 5);
    return { labels: entries.map((e) => e[0]), data: entries.map((e) => e[1]) };
  });

export const makeSelectLowStockForBranch = (branchId) =>
  createSelector([selectBranches], (branches) => {
    const b = branches.find((x) => String(x.id) === String(branchId));
    if (!b) return [];
    const rows = Object.entries(b.inventory || {})
      .filter(([, v]) => (v || 0) <= 5)
      .map(([product, qty]) => ({ product, qty: Number(qty || 0) }));
    return rows.sort((a, b) => a.qty - b.qty || a.product.localeCompare(b.product));
  });

export const selectAvgRatingForManagerBranch = createSelector([selectManagerBranch], (b) => {
  if (!b) return null;
  const ratings = (b.reviews || []).map((r) => Number(r.rating)).filter((n) => !isNaN(n));
  if (ratings.length === 0) return null;
  const avg = ratings.reduce((a, c) => a + c, 0) / ratings.length;
  return Math.round(avg * 10) / 10;
});

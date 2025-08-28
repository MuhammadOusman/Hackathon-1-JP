import { describe, it, expect } from 'vitest';
import { selectTotals, selectOrdersPerBranchChart } from '../selectors';

const makeState = ({ branches = [], products = [], orders = [] } = {}) => ({
  branchReducer: { ids: branches.map(b=>b.id), entities: Object.fromEntries(branches.map(b=>[b.id,b])) },
  productReducer: { ids: products.map(p=>p.id), entities: Object.fromEntries(products.map(p=>[p.id,p])) },
  orderReducer: { ids: orders.map(o=>o.id), entities: Object.fromEntries(orders.map(o=>[o.id,o])) },
});

describe('selectors', () => {
  it('computes totals with revenue', () => {
    const state = makeState({
      branches: [{ id: 'b1', name: 'A' }],
      products: [{ id: 'p1', name: 'Tea', price: 10 }],
      orders: [{ id: 'o1', branchId: 'b1', items: [{ product: 'Tea', quantity: 2 }], discount: 10 }],
    });
    const totals = selectTotals(state);
    expect(totals.totalBranches).toBe(1);
    expect(totals.totalProducts).toBe(1);
    expect(totals.totalOrders).toBe(1);
    expect(totals.revenue).toBe(18); // 2*10 = 20, minus 10% = 18
  });

  it('orders per branch chart', () => {
    const state = makeState({
      branches: [{ id: 'b1', name: 'A' }, { id: 'b2', name: 'B' }],
      orders: [{ id: 'o1', branchId: 'b1' }, { id: 'o2', branchId: 'b1' }],
    });
    const res = selectOrdersPerBranchChart(state);
    expect(res.labels).toEqual(['A', 'B']);
    expect(res.data).toEqual([2, 0]);
  });
});

import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchBranchesForEmployees } from "../Store/EmployeesSlice";

const EmployeeList = () => {
  const dispatch = useDispatch();
  const { branches, loading } = useSelector(state => state.employeesReducer);

  useEffect(() => {
    dispatch(fetchBranchesForEmployees());
  }, [dispatch]);

  const cardCls = "bg-gray-800/60 border border-white/10 rounded-xl p-5 shadow hover:shadow-xl transition-shadow duration-200";
  const chipCls = "px-2 py-1 rounded-md text-xs bg-gray-900 border border-white/10 text-gray-200";

  return (
    <section className="max-w-7xl mx-auto px-2 md:px-4">
      <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Employee List (All Branches)</h2>
      {loading ? (
        <div className="text-gray-400">Loading...</div>
      ) : (
        <div className="space-y-5">
          {branches.map(branch => (
            <div key={branch.id} className={cardCls}>
              <div className="mb-3 text-white text-lg font-semibold">
                {branch.name} <span className="text-gray-400">({branch.location})</span>
              </div>
              {branch.employees && branch.employees.length > 0 ? (
                <ul className="space-y-2">
                  {branch.employees.map(emp => (
                    <li key={emp.id} className="flex items-center justify-between gap-3 bg-gray-900/50 border border-white/5 rounded-lg px-3 py-2">
                      <div className="text-gray-100 font-medium">{emp.name}</div>
                      <div className="flex items-center gap-2">
                        <span className={chipCls}>{emp.email}</span>
                        <span className={chipCls}>{emp.contact}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-gray-400">No employees</div>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default EmployeeList;

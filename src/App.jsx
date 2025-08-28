import React, { useEffect, lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import { useDispatch } from "react-redux";
import Loader from "./Components/Loader/Loader";
import { setCurrentManager } from "./Store/AuthSlice/AuthSlice";
import "./App.css";
const Signup = lazy(() => import("./Screens/Signup"));
const Login = lazy(() => import("./Screens/Login"));
import { ToastContainer } from "react-toastify";
const Home = lazy(() => import("./Screens/Home"));
const Profile = lazy(() => import("./Screens/Profile"));
const AuthProtector = lazy(() => import("./Screens/AuthProtector"));
const HomeProtector = lazy(() => import("./Screens/HomeProtector"));
const AdminDashboard = lazy(() => import("./Screens/AdminDashboard"));
const ManagerDashboard = lazy(() => import("./Screens/ManagerDashboard"));
const RoleProtector = lazy(() => import("./Screens/RoleProtector"));
const UserDashboard = lazy(() => import("./Screens/UserDashboard"));
const Landing = lazy(() => import("./Screens/Landing"));

const App = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    // Rehydrate manager info from localStorage if present
    const user = localStorage.getItem("user");
    const role = localStorage.getItem("role");
    if (user && role === "manager") {
      try {
        const manager = JSON.parse(user);
        if (manager.managerId) {
          dispatch(
            setCurrentManager({
              managerId: manager.managerId,
              managerEmail: manager.managerEmail,
              branchId: manager.id,
              name: manager.name,
            })
          );
        }
      } catch {}
    }
  }, [dispatch]);
  return (
    <>
      <Suspense fallback={<div className="min-h-screen grid place-items-center"><Loader /></div>}>
      <Routes>
        {/* Public landing page at root. If already logged-in, Landing will redirect to /home */}
        <Route path="/" element={<Landing />} />
        <Route element={<AuthProtector />}>
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
        </Route>
        <Route element={<HomeProtector />}>
          <Route path="/home" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/user-dashboard/*" element={<UserDashboard />} />
        </Route>
        <Route element={<RoleProtector role="admin" />}>
          <Route path="/admin-dashboard/*" element={<AdminDashboard />} />
        </Route>
        <Route element={<RoleProtector role="manager" />}>
          <Route path="/manager-dashboard/*" element={<ManagerDashboard />} />
        </Route>
      </Routes>
      </Suspense>

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  );
};

export default App;

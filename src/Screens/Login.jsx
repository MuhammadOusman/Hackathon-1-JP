import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setCurrentManager } from "../Store/AuthSlice/AuthSlice";
import { db } from "../Config/Config";
import { doc, getDoc, collection, getDocs, query, where, limit } from "firebase/firestore";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../Config/Config";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
// Removed adornment icons; keep a simple text toggle instead
// Removed adornment icons; keep a simple text toggle instead

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const loginHandler = async (e) => {
    e.preventDefault();
    try {
      // Try Firebase login first
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      setUserId(user.uid);
      toast.success("Welcome!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      localStorage.setItem("uid", user.uid);
      // Fetch user role from Firestore
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const role = userData.role;
        localStorage.setItem("role", role);
        localStorage.setItem("user", JSON.stringify({ ...userData, uid: user.uid }));
        if (role === "admin") {
          navigate("/admin-dashboard");
        } else if (role === "manager") {
          navigate("/manager-dashboard");
        } else {
          navigate("/user-dashboard");
        }
        // remember me persistence
        if (remember) {
          localStorage.setItem("rememberEmail", email);
          localStorage.setItem("rememberMe", "true");
        } else {
          localStorage.removeItem("rememberEmail");
          localStorage.removeItem("rememberMe");
        }
      } else {
        localStorage.setItem("role", "user");
        localStorage.setItem("user", JSON.stringify({ uid: user.uid }));
        navigate("/user-dashboard");
        if (remember) {
          localStorage.setItem("rememberEmail", email);
          localStorage.setItem("rememberMe", "true");
        } else {
          localStorage.removeItem("rememberEmail");
          localStorage.removeItem("rememberMe");
        }
      }
    } catch (error) {
      // If Firebase login fails, try manager login via JSON server
      try {
          const q = query(collection(db, "branches"), where("managerEmail", "==", email), where("password", "==", password), limit(1));
          const snap = await getDocs(q);
          if (!snap.empty) {
            const branch = { id: snap.docs[0].id, ...snap.docs[0].data() };
          toast.success("Manager login successful!", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
          dispatch(setCurrentManager({
            managerId: branch.managerId,
            managerEmail: branch.managerEmail,
            branchId: branch.id,
            name: branch.name,
            // add other branch info if needed
          }));
          localStorage.setItem("role", "manager");
          localStorage.setItem("user", JSON.stringify(branch));
          navigate("/manager-dashboard");
          if (remember) {
            localStorage.setItem("rememberEmail", email);
            localStorage.setItem("rememberMe", "true");
          } else {
            localStorage.removeItem("rememberEmail");
            localStorage.removeItem("rememberMe");
          }
        } else {
          toast.error("Invalid credentials", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
        }
      } catch (err) {
        toast.error("Login failed", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      }
    }
  };

  // Prefill remembered email
  useEffect(() => {
    try {
      const remembered = localStorage.getItem("rememberEmail");
      const isRemember = localStorage.getItem("rememberMe") === "true";
      if (remembered) setEmail(remembered);
      setRemember(isRemember);
    } catch {}
  }, []);

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 via-gray-900 to-black p-4">
      <div className="w-full max-w-md rounded-2xl shadow-2xl border border-white/10 bg-gray-900/70 backdrop-blur-xl">
        <div className="p-8">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl shadow-lg mb-3 overflow-hidden">
              <img src="/logo.svg" alt="FranchiseMS" className="w-14 h-14" />
            </div>
            <h1 className="text-3xl font-extrabold text-white">Welcome back</h1>
            <p className="text-gray-400 text-sm mt-1">Sign in to continue</p>
          </div>

          <form onSubmit={loginHandler} className="space-y-5">
            <div>
              <label htmlFor="email" className="sr-only">Email</label>
              <div className="relative">
                <input
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  name="email"
                  id="email"
                  value={email}
                  className="w-full px-4 h-12 bg-gray-800/80 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition duration-200"
                  placeholder="your@example.com"
                  autoComplete="email"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <div className="relative">
                <input
                  onChange={(e) => setPassword(e.target.value)}
                  type={showPassword ? "text" : "password"}
                  name="password"
                  id="password"
                  placeholder="••••••••"
                  className="w-full pl-4 pr-20 h-12 bg-gray-800/80 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition duration-200"
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute inset-y-0 right-0 px-3 flex items-center text-purple-300 hover:text-white bg-transparent hover:bg-transparent focus:bg-transparent active:bg-transparent outline-none focus:outline-none ring-0 focus:ring-0"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
              <div className="flex items-center justify-between mt-2">
                <label className="flex items-center gap-2 text-xs text-gray-300 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                    className="h-4 w-4 accent-purple-600 cursor-pointer"
                  />
                  Remember me
                </label>
                <Link to="/signup" className="text-xs text-purple-400 hover:text-purple-300">Create account</Link>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 rounded-lg text-white text-lg font-semibold shadow-lg transition-transform duration-200 active:scale-[0.99]"
            >
              Sign In
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Login;

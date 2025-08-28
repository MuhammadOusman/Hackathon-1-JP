import React, { useState, useEffect } from "react";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../Config/Config";
import { doc, setDoc } from "firebase/firestore";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { useSelector, useDispatch } from "react-redux";
import { fetchBranches } from "../Store/BranchSlice";
// Removed adornment icons; use a simple text toggle for password

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  // Only user signup allowed, so role is always 'user'
  const [role] = useState("user");
  const [branchId, setBranchId] = useState("");
  const dispatch = useDispatch();
  const { branches } = useSelector(state => state.branchReducer);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchBranches());
  }, [dispatch]);

  const submitHandler = (e) => {
    e.preventDefault();
    try {
      const authInstance = getAuth();
      createUserWithEmailAndPassword(authInstance, email, password)
        .then(async (userCredential) => {
          const user = userCredential.user;
          const uid = user.uid;
          toast.success("Signed up successfully!", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
          await setDoc(doc(db, "users", uid), {
            name: name,
            email: email,
            uid: uid,
            role: "user",
            branchId: branchId,
          });
          navigate("/home");
        })
        .catch((error) => {
          const errorMessage = error.message;
          toast.error(errorMessage, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
        });
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 via-gray-900 to-black p-4">
      <div className="w-full max-w-md rounded-2xl shadow-2xl border border-white/10 bg-gray-900/70 backdrop-blur-xl">
        <div className="p-8">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl shadow-lg mb-3 overflow-hidden">
              <img src="/logo.svg" alt="FranchiseMS" className="w-14 h-14" />
            </div>
            <h1 className="text-3xl font-extrabold text-white">Create an account</h1>
            <p className="text-gray-400 text-sm mt-1">Join and start ordering</p>
          </div>

          <form onSubmit={submitHandler} className="space-y-5">
            <div>
              <label htmlFor="name" className="sr-only">Name</label>
              <div className="relative">
                <input
                  onChange={(e) => setName(e.target.value)}
                  type="text"
                  name="name"
                  id="name"
                  className="w-full px-4 h-12 bg-gray-800/80 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition duration-200"
                  placeholder="Your Name"
                  autoComplete="name"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="sr-only">Email</label>
              <div className="relative">
                <input
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  name="email"
                  id="email"
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
                  autoComplete="new-password"
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
            </div>

            <div>
              <label htmlFor="branch" className="block text-sm font-medium text-gray-300 mb-2">Select Branch</label>
              <select
                id="branch"
                value={branchId}
                onChange={e => setBranchId(e.target.value)}
                required
                className="w-full px-4 py-3 bg-gray-800/80 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
              >
                <option value="">Select Branch</option>
                {branches.map(branch => (
                  <option key={branch.id} value={branch.id}>{branch.name} ({branch.location})</option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 rounded-lg text-white text-lg font-semibold shadow-lg transition-transform duration-200 active:scale-[0.99]"
            >
              Create Account
            </button>
            <p className="text-sm text-gray-400 text-center">Already have an account? <Link to={"/login"} className="font-semibold text-purple-400 hover:text-purple-300">Sign in</Link></p>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Signup;

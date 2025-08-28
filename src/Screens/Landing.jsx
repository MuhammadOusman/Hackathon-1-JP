import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Insights,
  Inventory2,
  AdminPanelSettings,
  Lock,
  Bolt,
  RocketLaunch,
} from "@mui/icons-material";

const Landing = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const uid = localStorage.getItem("uid");
    if (uid) navigate("/home", { replace: true });
  }, [navigate]);

  return (
    <div className="min-h-screen relative overflow-hidden bg-slate-950 text-white">
      {/* Animated gradient orbs */}
      <div className="pointer-events-none absolute -top-40 -left-40 h-[40rem] w-[40rem] rounded-full bg-gradient-to-tr from-fuchsia-500/40 to-indigo-500/40 blur-3xl animate-pulse" />
      <div className="pointer-events-none absolute -bottom-40 -right-40 h-[40rem] w-[40rem] rounded-full bg-gradient-to-tr from-cyan-500/40 to-emerald-500/40 blur-3xl animate-pulse [animation-delay:800ms]" />

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-6 sm:px-10 py-6">
        <div className="flex items-center gap-3">
          <img src="/logo.svg" alt="FranchiseMS" className="h-9 w-9 rounded-lg" />
          <span className="text-xl sm:text-2xl font-extrabold tracking-tight">FranchiseMS</span>
        </div>
        <nav className="flex items-center gap-2 sm:gap-4">
          <Link
            to="/login"
            className="hidden sm:inline-flex px-4 py-2 text-sm font-medium text-white/90 hover:text-white transition-colors"
          >
            Log in
          </Link>
          <Link
            to="/signup"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white text-slate-900 text-sm font-semibold hover:bg-slate-100 transition-colors shadow"
          >
            Get started
            <span aria-hidden>→</span>
          </Link>
        </nav>
      </header>

      {/* Hero */}
      <main className="relative z-10 px-6 sm:px-10">
        <section className="mx-auto max-w-6xl pt-10 sm:pt-16 lg:pt-24 text-center">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-tight">
            Run your franchise like a
            <span className="block bg-gradient-to-r from-fuchsia-400 via-indigo-400 to-cyan-400 bg-clip-text text-transparent">
              world‑class operation
            </span>
          </h1>
          <p className="mt-5 sm:mt-6 text-base sm:text-lg text-white/70 max-w-2xl mx-auto">
            Real‑time dashboards, lightning‑fast inventory, smarter orders, and reviews that actually help you grow—all in one beautiful system.
          </p>

          <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <Link
              to="/login"
              className="group inline-flex items-center gap-2 rounded-full px-6 py-3 bg-gradient-to-r from-indigo-500 to-fuchsia-500 text-white font-semibold shadow-lg shadow-indigo-900/30 hover:opacity-95 transition"
            >
              Log in
              <span className="transition-transform group-hover:translate-x-0.5" aria-hidden>
                →
              </span>
            </Link>
            <a
              href="#features"
              className="inline-flex items-center gap-2 rounded-full px-6 py-3 bg-white/10 ring-1 ring-white/20 backdrop-blur text-white hover:bg-white/15 transition"
            >
              Explore features
            </a>
          </div>

          {/* Glass preview panel */}
          <div className="relative mt-12 sm:mt-16">
            <div className="mx-auto max-w-5xl rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-white/10">
                <div className="p-6 sm:p-8">
                  <h3 className="text-lg font-bold">Unified Dashboard</h3>
                  <p className="mt-2 text-white/70 text-sm">
                    Bird’s‑eye view of sales, stock and reviews across branches with gorgeous charts.
                  </p>
                </div>
                <div className="p-6 sm:p-8">
                  <h3 className="text-lg font-bold">One‑click Orders</h3>
                  <p className="mt-2 text-white/70 text-sm">
                    Frictionless checkout with instant inventory sync and branch routing.
                  </p>
                </div>
                <div className="p-6 sm:p-8">
                  <h3 className="text-lg font-bold">Insightful Reviews</h3>
                  <p className="mt-2 text-white/70 text-sm">
                    Auto‑aggregated ratings help managers act fast and keep customers delighted.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features grid */}
        <section id="features" className="mx-auto max-w-6xl py-14 sm:py-20">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {[
              {
                title: "Realtime Analytics",
                desc: "Track KPIs live with zero refresh and sensible defaults.",
                Icon: Insights,
              },
              {
                title: "Inventory Superpowers",
                desc: "Low‑stock alerts, fast adjustments, and painless audits.",
                Icon: Inventory2,
              },
              {
                title: "Role‑based Access",
                desc: "Admin, Manager, and User flows that just work.",
                Icon: AdminPanelSettings,
              },
              {
                title: "Secure by Default",
                desc: "Firebase Auth + rules keep your data locked down.",
                Icon: Lock,
              },
              {
                title: "Blazing Performance",
                desc: "Code‑split routes and lazy charts for speed.",
                Icon: Bolt,
              },
              {
                title: "Deploy Anywhere",
                desc: "Zero‑config Netlify hosting with SPA routing.",
                Icon: RocketLaunch,
              },
            ].map(({ title, desc, Icon }, i) => (
              <div
                key={i}
                className="rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition-colors backdrop-blur-xl p-6 shadow-xl"
              >
                <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-indigo-400 to-fuchsia-500 mb-4 grid place-items-center text-white">
                  <Icon fontSize="small" />
                </div>
                <h4 className="text-lg font-bold">{title}</h4>
                <p className="mt-2 text-sm text-white/70">{desc}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 py-8 px-6 sm:px-10 flex flex-col sm:flex-row items-center justify-between gap-3 text-white/70">
        <p>© {new Date().getFullYear()} FranchiseMS. All rights reserved.</p>
        <div className="flex items-center gap-3">
          <span>Ready to scale?</span>
          <Link to="/login" className="underline decoration-white/40 hover:decoration-white">
            Log in
          </Link>
        </div>
      </footer>
    </div>
  );
};

export default Landing;

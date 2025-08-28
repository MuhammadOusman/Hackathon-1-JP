# FranchiseMS

Quick login (copy/paste)

- Admin
  - Email: admin@demo.com
  - Password: Admin@12345

- Branch Manager (any one of these)
  - Main Branch: manager@example.com / manager123
  - East Side: east.manager@example.com / 123
  - West End: west.manager@example.com / westpass

- User (any)
  - Create an account from the Signup page with any email/password, then log in.

What is this?

FranchiseMS is a Vite + React + Redux Toolkit app backed by Firebase (Auth + Firestore) for running a simple multi-branch franchise: products, inventory, orders, offers, reviews, and role-based dashboards (Admin, Manager, User).

Key features

- Modern landing page with brand logo, CTA to Login/Signup
- Role-protected dashboards (admin/manager/user)
- Orders, inventory, offers, and reviews managed via Redux thunks and Firestore
- Per-user order history and reviews (customers only see their own)
- Performance: route-level code splitting and lazy charts

Local setup

- Node.js 18+
- Install deps and run dev server:

```
# install
npm install

# dev
npm run dev

# build
npm run build

# preview prod build
npm run preview
```

Optional: seed Firestore

- A helper script seeds products, offers, branches (with the manager credentials above), sample orders, and an Admin user.
- Run (with Node):

```
node scripts/seedFirestore.mjs
```

Notes

- Manager login authenticates against Firestore branches by managerEmail/password.
- User accounts authenticate via Firebase Auth. If none exist, use Signup to create one.
- The public landing page links to Login; logged-in users are redirected to Home.

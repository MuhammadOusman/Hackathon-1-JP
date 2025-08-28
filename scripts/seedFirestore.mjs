import { initializeApp } from "firebase/app";
import { getFirestore, setDoc, doc } from "firebase/firestore";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";

// Using the same config as src/Config/Config.jsx
const firebaseConfig = {
  apiKey: "AIzaSyDc4bOW9clWcN7Cy1gUJUe0Qs8oFhXQba0",
  authDomain: "redux-template-cc72e.firebaseapp.com",
  projectId: "redux-template-cc72e",
  storageBucket: "redux-template-cc72e.firebasestorage.app",
  messagingSenderId: "1076391608103",
  appId: "1:1076391608103:web:7db242a0983fc9c2773302",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

async function seed() {
  console.log("Seeding Firestore with sample data...");

  // Products (expanded)
  const products = [
    { id: "prod-burger", name: "Classic Burger", price: 250, image: "" },
    { id: "prod-fries", name: "Crispy Fries", price: 120, image: "" },
    { id: "prod-pizza", name: "Margherita Pizza", price: 900, image: "" },
    { id: "prod-soda", name: "Soda", price: 80, image: "" },
    { id: "prod-wrap", name: "Chicken Wrap", price: 350, image: "" },
    { id: "prod-vegburger", name: "Veggie Burger", price: 230, image: "" },
    { id: "prod-icecream", name: "Ice Cream", price: 150, image: "" },
    { id: "prod-coffee", name: "Coffee", price: 180, image: "" },
    { id: "prod-tea", name: "Tea", price: 120, image: "" },
    { id: "prod-salad", name: "Caesar Salad", price: 400, image: "" },
  ];
  for (const p of products) {
    await setDoc(doc(db, "products", p.id), { name: p.name, price: p.price, image: p.image });
  }
  console.log(`Seeded ${products.length} products`);

  // Offers (expanded)
  const offers = [
    { id: "offer-10", name: "Festive 10%", discount: 10 },
    { id: "offer-12", name: "Midweek 12%", discount: 12 },
    { id: "offer-15", name: "Weekend 15%", discount: 15 },
    { id: "offer-18", name: "Combo 18%", discount: 18 },
    { id: "offer-20", name: "Mega 20%", discount: 20 },
  ];
  for (const o of offers) {
    await setDoc(doc(db, "offers", o.id), { name: o.name, discount: o.discount });
  }
  console.log(`Seeded ${offers.length} offers`);

  // Branches with inventory and reviews
  const branches = [
    {
      id: "branch-main",
      name: "Main Branch",
      managerId: "mgr-001",
      managerEmail: "manager@example.com",
      password: "manager123",
      inventory: {
        "Classic Burger": 25,
        "Crispy Fries": 60,
        "Margherita Pizza": 10,
        "Soda": 100,
        "Chicken Wrap": 18,
        "Veggie Burger": 12,
        "Ice Cream": 40,
        "Coffee": 80,
        "Tea": 70,
        "Caesar Salad": 8,
      },
      employees: [
        { id: "emp-m-1", name: "M-Ayesha", role: "Cashier" },
        { id: "emp-m-2", name: "M-Omar", role: "Chef" },
      ],
      reviews: [
        { user: "Alice", rating: 4.5, comment: "Great taste!", createdAt: Date.now() - 86400000 },
        { user: "Bob", rating: 4.0, comment: "Quick service.", createdAt: Date.now() - 43200000 },
      ],
    },
    {
      id: "branch-east",
      name: "East Side",
      managerId: "mgr-002",
      managerEmail: "east.manager@example.com",
      password: "eastpass",
      inventory: {
        "Classic Burger": 15,
        "Crispy Fries": 30,
        "Margherita Pizza": 5,
        "Soda": 50,
        "Chicken Wrap": 9,
        "Veggie Burger": 6,
        "Ice Cream": 20,
        "Coffee": 40,
        "Tea": 30,
        "Caesar Salad": 4,
      },
      employees: [
        { id: "emp-e-1", name: "E-Liu", role: "Waiter" },
        { id: "emp-e-2", name: "E-Sara", role: "Chef" },
      ],
      reviews: [
        { user: "Chris", rating: 3.5, comment: "Could be hotter.", createdAt: Date.now() - 7200000 },
      ],
    },
    {
      id: "branch-west",
      name: "West End",
      managerId: "mgr-003",
      managerEmail: "west.manager@example.com",
      password: "westpass",
      inventory: {
        "Classic Burger": 20,
        "Crispy Fries": 50,
        "Margherita Pizza": 12,
        "Soda": 70,
        "Chicken Wrap": 14,
        "Veggie Burger": 10,
        "Ice Cream": 35,
        "Coffee": 55,
        "Tea": 40,
        "Caesar Salad": 6,
      },
      employees: [
        { id: "emp-w-1", name: "W-Noah", role: "Cashier" },
        { id: "emp-w-2", name: "W-Mia", role: "Waiter" },
      ],
      reviews: [
        { user: "Dana", rating: 4.2, comment: "Nice ambience.", createdAt: Date.now() - 6500000 },
        { user: "Evan", rating: 4.8, comment: "Loved the fries!", createdAt: Date.now() - 2100000 },
      ],
    },
  ];
  for (const b of branches) {
    const { id, ...rest } = b;
    await setDoc(doc(db, "branches", id), rest);
  }
  console.log(`Seeded ${branches.length} branches`);

  // Sample orders across branches
  const orders = [
    {
      id: "order-001",
      name: "Customer A",
      contact: "0123456789",
      email: "customer@example.com",
      branchId: "branch-main",
      items: [
        { product: "Classic Burger", quantity: 2 },
        { product: "Crispy Fries", quantity: 1 },
      ],
      discount: 10,
      createdAt: Date.now() - 3600000,
    },
    {
      id: "order-002",
      name: "Customer B",
      contact: "0987654321",
      email: "someone@example.com",
      branchId: "branch-main",
      items: [
        { product: "Margherita Pizza", quantity: 1 },
        { product: "Soda", quantity: 3 },
      ],
      discount: 0,
      createdAt: Date.now() - 1800000,
    },
    {
      id: "order-003",
      name: "Customer C",
      contact: "0111111111",
      email: "c@example.com",
      branchId: "branch-east",
      items: [
        { product: "Chicken Wrap", quantity: 2 },
        { product: "Coffee", quantity: 2 },
      ],
      discount: 12,
      createdAt: Date.now() - 5400000,
    },
    {
      id: "order-004",
      name: "Customer D",
      contact: "0222222222",
      email: "d@example.com",
      branchId: "branch-west",
      items: [
        { product: "Veggie Burger", quantity: 3 },
        { product: "Tea", quantity: 2 },
      ],
      discount: 15,
      createdAt: Date.now() - 4000000,
    },
    {
      id: "order-005",
      name: "Customer E",
      contact: "0333333333",
      email: "e@example.com",
      branchId: "branch-west",
      items: [
        { product: "Ice Cream", quantity: 4 },
        { product: "Crispy Fries", quantity: 1 },
      ],
      discount: 0,
      createdAt: Date.now() - 2500000,
    },
  ];
  for (const o of orders) {
    const { id, ...rest } = o;
    await setDoc(doc(db, "orders", id), rest);
  }
  console.log(`Seeded ${orders.length} orders`);

  console.log("Seeding complete ✔");

  // Create an admin auth user and profile (idempotent)
  const adminEmail = process.env.ADMIN_EMAIL || "admin@demo.com";
  const adminPassword = process.env.ADMIN_PASSWORD || "Admin@12345";
  let adminUser;
  try {
    const cred = await createUserWithEmailAndPassword(auth, adminEmail, adminPassword);
    adminUser = cred.user;
    console.log(`Created admin user: ${adminEmail}`);
  } catch (e) {
    if (e && e.code === "auth/email-already-in-use") {
      const cred = await signInWithEmailAndPassword(auth, adminEmail, adminPassword);
      adminUser = cred.user;
      console.log(`Admin user already exists: ${adminEmail}`);
    } else {
      console.warn("Skipping admin auth creation:", e?.code || e);
    }
  }
  if (adminUser) {
    await setDoc(doc(db, "users", adminUser.uid), {
      email: adminEmail,
      role: "admin",
      name: "Demo Admin",
      createdAt: Date.now(),
    }, { merge: true });
    console.log("Admin profile upserted in Firestore.");
  }
}

seed()
  .then(() => {
    process.exit(0);
  })
  .catch((e) => {
    console.error("Seeding failed:", e);
    process.exit(1);
  });

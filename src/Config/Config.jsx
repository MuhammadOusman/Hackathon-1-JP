// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDc4bOW9clWcN7Cy1gUJUe0Qs8oFhXQba0",
  authDomain: "redux-template-cc72e.firebaseapp.com",
  projectId: "redux-template-cc72e",
  storageBucket: "redux-template-cc72e.firebasestorage.app",
  messagingSenderId: "1076391608103",
  appId: "1:1076391608103:web:7db242a0983fc9c2773302"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

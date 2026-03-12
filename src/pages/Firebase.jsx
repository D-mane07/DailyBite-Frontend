// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import{getAuth} from "firebase/auth"
const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: import.meta.env.VITE_AUTH_DOMAIN || "vingo-81cb8.firebaseapp.com",
  projectId: "vingo-81cb8",
  storageBucket: "vingo-81cb8.firebasestorage.app",
  messagingSenderId: "877312964639",
  appId: "1:877312964639:web:9dae6a722f05e129af3d2a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const Auth=getAuth(app)
export {app,Auth}

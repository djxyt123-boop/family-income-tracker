import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBMN6sv-RWO3J_vuPa2g2aaqgTSWQRTjeg",
  authDomain: "family-income-90ab5.firebaseapp.com",
  projectId: "family-income-90ab5",
  storageBucket: "family-income-90ab5.firebasestorage.app",
  messagingSenderId: "1084547631169",
  appId: "1:1084547631169:web:81e95cef8cd2ea02f11ec0"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
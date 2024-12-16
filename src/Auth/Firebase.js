// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCktDIQunEqOzAdE4eFzvZW9RXQy-ppDZ4",
  authDomain: "react-firebase-auth-29165.firebaseapp.com",
  projectId: "react-firebase-auth-29165",
  storageBucket: "react-firebase-auth-29165.appspot.com",
  messagingSenderId: "68457674177",
  appId: "1:68457674177:web:e21405b7547d4259bceb40"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };

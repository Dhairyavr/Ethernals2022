// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: `${process.env.REACT_APP_FIREBASE_APIKEY}`,
  authDomain: `${process.env.REACT_APP_FIREBASE_AUTHDOMAIN}`,
  projectId: `${process.env.REACT_APP_FIREBASE_APIKEY}`,
  storageBucket: `${process.env.REACT_APP_FIREBASE_PROJECTID}`,
  messagingSenderId: "579010004242",
  appId: `${process.env.REACT_APP_FIREBASE_STORAGEBUCKET}`,
  measurementId: "G-TPH2YZ0VN0",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

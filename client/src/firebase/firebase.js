// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: `${process.env.REACT_APP_FIREBASE_APIKEY}`,
  authDomain: "be-project-99156.firebaseapp.com",
  projectId: "be-project-99156",
  storageBucket: "be-project-99156.appspot.com",
  messagingSenderId: "579010004242",
  appId: `${process.env.REACT_APP_FIREBASE_APPID}`,
  measurementId: "G-TPH2YZ0VN0",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

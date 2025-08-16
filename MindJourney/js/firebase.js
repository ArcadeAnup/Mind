// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-analytics.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCP7pYXooAz9fPOk9sY7JJC4Y1br3nppGk",
  authDomain: "mindjourney-f3bb1.firebaseapp.com",
  projectId: "mindjourney-f3bb1",
  storageBucket: "mindjourney-f3bb1.firebasestorage.app",
  messagingSenderId: "981434592350",
  appId: "1:981434592350:web:3675b9902af84430bd18cf",
  measurementId: "G-DLCWD97CW6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const analytics = getAnalytics(app);

export { app, auth, analytics };

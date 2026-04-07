
// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

// Your real Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD_FgoO1hwBrdvGUIEYkc3CKR9rq4RpWPk",
  authDomain: "e-waste-app-da0fb.firebaseapp.com",
  projectId: "e-waste-app-da0fb",
  storageBucket: "e-waste-app-da0fb.appspot.com",
  messagingSenderId: "578000949945",
  appId: "1:578000949945:web:212c80952bef5e6ef38168",
  measurementId: "G-45E9T0HZPB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const analytics = getAnalytics(app);

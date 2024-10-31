import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import firebase from 'firebase/app';
import { getFirestore } from "firebase/firestore"
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

const apiKey = import.meta.env.VITE_API_KEY;
const senderId = import.meta.env.VITE_SENDER_ID;
const appId = import.meta.env.VITE_APP_ID;
const measurementId = import.meta.env.VITE_MEASUREMENT_ID;

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: apiKey,
  authDomain: "modul-vapp.firebaseapp.com",
  projectId: "modul-vapp",
  storageBucket: "modul-vapp.appspot.com",
  messagingSenderId: senderId,
  appId: appId,
  measurementId: measurementId
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };

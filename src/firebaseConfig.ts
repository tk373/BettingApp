import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import firebase from 'firebase/app';
import { getFirestore } from "firebase/firestore"
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAheB7Xi0WDTJYMsJ7l8EqBPtKiBkzhZIM",
  authDomain: "modul-vapp.firebaseapp.com",
  projectId: "modul-vapp",
  storageBucket: "modul-vapp.appspot.com",
  messagingSenderId: "720725084594",
  appId: "1:720725084594:web:8e2f83162bc180b19f7cab",
  measurementId: "G-098K24ZERS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };

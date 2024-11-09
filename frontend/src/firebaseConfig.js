// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBPJ3OuIG_Fid2NlPLutGJPikGow2aObz4",
  authDomain: "sistema-de-inventarios-f616c.firebaseapp.com",
  projectId: "sistema-de-inventarios-f616c",
  storageBucket: "sistema-de-inventarios-f616c.appspot.com",
  messagingSenderId: "193984194369",
  appId: "1:193984194369:web:bb7ec9251ed7d4aa8c23c0",
  measurementId: "G-W8V83Z7E4F"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Inicializa Firebase Authentication y Firestore
const auth = getAuth(app);
const db = getFirestore(app); // Inicializa Firestore

export { auth, db }; // Exporta tanto auth como db

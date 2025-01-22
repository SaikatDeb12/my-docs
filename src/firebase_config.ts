// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDTQPTqnW53xR5y-AVd9n9V4CQcGn8I8ak",
  authDomain: "my-docs-8e6f7.firebaseapp.com",
  projectId: "my-docs-8e6f7",
  storageBucket: "my-docs-8e6f7.firebasestorage.app",
  messagingSenderId: "642735492081",
  appId: "1:642735492081:web:eee87a686bf784b0589250",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

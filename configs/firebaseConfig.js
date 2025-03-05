// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getStorage} from 'firebase/storage';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: "voiceflow-e24c0.firebaseapp.com",
  projectId: "voiceflow-e24c0",
  storageBucket: "voiceflow-e24c0.firebasestorage.app",
  messagingSenderId: "713642949857",
  appId: "1:713642949857:web:9bb9da65ed47526af18ba0",
  measurementId: "G-NLM8EQ5BBG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
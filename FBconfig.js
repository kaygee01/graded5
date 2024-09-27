// Import necessary Firebase modules
import { initializeApp } from 'firebase/app'; 
import { getFirestore } from 'firebase/firestore'; 
import { getAuth } from 'firebase/auth'; 
import 'firebase/firestore';

// Firebase configuration
const firebaseConfig = {
  
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore(app); // Use getFirestore to initialize Firestore
const auth = getAuth(app);

export { db, auth };

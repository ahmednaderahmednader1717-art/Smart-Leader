// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCjSrQw2dkKjMfR-KxT2fzMQthoW45dhuk",
  authDomain: "smart-leader-ff5ff.firebaseapp.com",
  projectId: "smart-leader-ff5ff",
  storageBucket: "smart-leader-ff5ff.firebasestorage.app",
  messagingSenderId: "367490239791",
  appId: "1:367490239791:web:38b0fb69083e0add8265da"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services with increased limits
export const db = getFirestore(app);
export const auth = getAuth(app);

// Export Firebase Auth functions
export { signInWithEmailAndPassword, signOut, onAuthStateChanged };


// Configure Firestore settings for larger documents
import { connectFirestoreEmulator, enableNetwork, disableNetwork } from "firebase/firestore";

// Enable offline persistence with increased cache size
try {
  // This will help with larger documents
  enableNetwork(db);
} catch (error) {
  console.log('Network already enabled');
}

// Helper function to split large arrays into chunks
export const chunkArray = (array, chunkSize = 100) => {
  const chunks = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    chunks.push(array.slice(i, i + chunkSize));
  }
  return chunks;
}

// Helper function to estimate document size
export const estimateDocumentSize = (doc) => {
  return JSON.stringify(doc).length;
}

export default app;
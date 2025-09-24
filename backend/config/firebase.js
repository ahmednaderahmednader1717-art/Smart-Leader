
const { initializeApp } = require('firebase/app');
const { getFirestore } = require('firebase/firestore');

const firebaseConfig = {
  apiKey: "AIzaSyCjSrQw2dkKjMfR-KxT2fzMQthoW45dhuk",
  authDomain: "smart-leader-ff5ff.firebaseapp.com",
  projectId: "smart-leader-ff5ff",
  storageBucket: "smart-leader-ff5ff.firebasestorage.app",
  messagingSenderId: "367490239791",
  appId: "1:367490239791:web:38b0fb69083e0add8265da"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

module.exports = { db };

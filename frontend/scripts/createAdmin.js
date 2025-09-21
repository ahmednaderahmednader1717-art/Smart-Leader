// Script to create admin user in Firebase
import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';

// Your Firebase config
const firebaseConfig = {
  // Add your Firebase config here
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-app-id"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

async function createAdminUser() {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth, 
      'admin@smartleader.com', 
      'admin123'
    );
    
    console.log('Admin user created successfully:', userCredential.user.uid);
    console.log('Email:', userCredential.user.email);
    
  } catch (error) {
    console.error('Error creating admin user:', error.message);
  }
}

createAdminUser();

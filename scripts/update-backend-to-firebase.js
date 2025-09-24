#!/usr/bin/env node

/**
 * Backend Update Script: MongoDB to Firebase
 * This script updates the backend to use Firebase instead of MongoDB
 */

const fs = require('fs');
const path = require('path');

console.log('🔄 Updating backend to use Firebase...');

// Update server.js to remove MongoDB connection
const serverPath = path.join(__dirname, '../backend/server.js');
if (fs.existsSync(serverPath)) {
  let serverContent = fs.readFileSync(serverPath, 'utf8');
  
  // Remove MongoDB connection code
  serverContent = serverContent.replace(/\/\/ MongoDB connection[\s\S]*?\.catch\(err => console\.error\('MongoDB connection error:', err\)\);/, '');
  serverContent = serverContent.replace(/mongoose\.connect\([^)]+\)[\s\S]*?\.catch\([^)]+\);/, '');
  
  // Add Firebase initialization
  const firebaseInit = `
// Firebase initialization
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

console.log('Firebase initialized successfully');
`;

  // Insert Firebase initialization after express setup
  serverContent = serverContent.replace(
    /app\.use\(express\.urlencoded\(\{ extended: true, limit: '10mb' \}\)\);/,
    `app.use(express.urlencoded({ extended: true, limit: '10mb' }));

${firebaseInit}`
  );
  
  fs.writeFileSync(serverPath, serverContent);
  console.log('✅ Updated server.js');
}

// Update package.json to remove MongoDB dependencies
const backendPackagePath = path.join(__dirname, '../backend/package.json');
if (fs.existsSync(backendPackagePath)) {
  const packageContent = JSON.parse(fs.readFileSync(backendPackagePath, 'utf8'));
  
  // Remove MongoDB dependencies
  if (packageContent.dependencies) {
    delete packageContent.dependencies.mongoose;
    delete packageContent.dependencies['mongodb'];
  }
  
  // Add Firebase dependencies
  packageContent.dependencies = {
    ...packageContent.dependencies,
    'firebase': '^10.7.0',
    'express': '^4.18.2',
    'cors': '^2.8.5',
    'helmet': '^7.1.0',
    'morgan': '^1.10.0',
    'dotenv': '^16.3.1'
  };
  
  fs.writeFileSync(backendPackagePath, JSON.stringify(packageContent, null, 2));
  console.log('✅ Updated backend package.json');
}

// Create Firebase service files
const servicesDir = path.join(__dirname, '../backend/services');
if (!fs.existsSync(servicesDir)) {
  fs.mkdirSync(servicesDir, { recursive: true });
}

// Create Firebase service for projects
const projectsServiceContent = `
const { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, orderBy, where } = require('firebase/firestore');
const { db } = require('../config/firebase');

class ProjectsService {
  async getAllProjects() {
    try {
      const projectsRef = collection(db, 'projects');
      const q = query(projectsRef, orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      
      const projects = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      return { success: true, data: projects };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async getProjectById(id) {
    try {
      const projectsRef = collection(db, 'projects');
      const snapshot = await getDocs(projectsRef);
      const project = snapshot.docs.find(doc => doc.id === id);
      
      if (project) {
        return { success: true, data: { id: project.id, ...project.data() } };
      } else {
        return { success: false, error: 'Project not found' };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async createProject(projectData) {
    try {
      const docRef = await addDoc(collection(db, 'projects'), {
        ...projectData,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      return { success: true, id: docRef.id };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async updateProject(id, projectData) {
    try {
      const projectRef = doc(db, 'projects', id);
      await updateDoc(projectRef, {
        ...projectData,
        updatedAt: new Date()
      });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async deleteProject(id) {
    try {
      const projectRef = doc(db, 'projects', id);
      await deleteDoc(projectRef);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

module.exports = new ProjectsService();
`;

fs.writeFileSync(path.join(servicesDir, 'projectsService.js'), projectsServiceContent);
console.log('✅ Created projects service');

// Create Firebase service for contacts
const contactsServiceContent = `
const { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, orderBy } = require('firebase/firestore');
const { db } = require('../config/firebase');

class ContactsService {
  async getAllContacts() {
    try {
      const contactsRef = collection(db, 'contacts');
      const q = query(contactsRef, orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      
      const contacts = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      return { success: true, data: contacts };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async createContact(contactData) {
    try {
      const docRef = await addDoc(collection(db, 'contacts'), {
        ...contactData,
        status: 'New',
        createdAt: new Date()
      });
      return { success: true, id: docRef.id };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async updateContactStatus(id, status) {
    try {
      const contactRef = doc(db, 'contacts', id);
      await updateDoc(contactRef, { 
        status,
        updatedAt: new Date()
      });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async deleteContact(id) {
    try {
      const contactRef = doc(db, 'contacts', id);
      await deleteDoc(contactRef);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

module.exports = new ContactsService();
`;

fs.writeFileSync(path.join(servicesDir, 'contactsService.js'), contactsServiceContent);
console.log('✅ Created contacts service');

// Create Firebase config file
const configDir = path.join(__dirname, '../backend/config');
if (!fs.existsSync(configDir)) {
  fs.mkdirSync(configDir, { recursive: true });
}

const firebaseConfigContent = `
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
`;

fs.writeFileSync(path.join(configDir, 'firebase.js'), firebaseConfigContent);
console.log('✅ Created Firebase config');

console.log('🎉 Backend update completed successfully!');
console.log('📝 Next steps:');
console.log('1. Run: npm install (in backend directory)');
console.log('2. Update your routes to use the new services');
console.log('3. Test the updated backend');

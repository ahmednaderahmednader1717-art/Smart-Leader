import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy,
  where 
} from 'firebase/firestore';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut 
} from 'firebase/auth';
import { db, auth } from './firebase';

// Authentication Services
export const authService = {
  // Admin Login
  async adminLogin(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return { success: true, user: userCredential.user };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // User Registration
  async registerUser(email, password, name) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      // Save user data to Firestore
      await addDoc(collection(db, 'users'), {
        uid: userCredential.user.uid,
        name,
        email,
        role: 'user',
        createdAt: new Date()
      });
      return { success: true, user: userCredential.user };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Logout
  async logout() {
    try {
      await signOut(auth);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
};

// Projects Services
export const projectsService = {
  // Get all projects
  async getProjects() {
    try {
      const projectsRef = collection(db, 'projects');
      const q = query(projectsRef, orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      const projects = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      return { success: true, data: projects };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Get single project
  async getProject(id) {
    try {
      const projectRef = doc(db, 'projects', id);
      const snapshot = await getDocs(collection(db, 'projects'));
      const project = snapshot.docs.find(doc => doc.id === id);
      if (project) {
        return { success: true, data: { id: project.id, ...project.data() } };
      } else {
        return { success: false, error: 'Project not found' };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Create project (Admin only)
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
  },

  // Update project (Admin only)
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
  },

  // Delete project (Admin only)
  async deleteProject(id) {
    try {
      await deleteDoc(doc(db, 'projects', id));
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
};

// Contacts Services
export const contactsService = {
  // Submit contact form
  async submitContact(contactData) {
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
  },

  // Get all contacts (Admin only)
  async getContacts() {
    try {
      const contactsRef = collection(db, 'contacts');
      const q = query(contactsRef, orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      const contacts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      return { success: true, data: contacts };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Update contact status (Admin only)
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
  },

  // Delete contact (Admin only)
  async deleteContact(id) {
    try {
      await deleteDoc(doc(db, 'contacts', id));
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
};

// Admin Services
export const adminService = {
  // Get dashboard stats
  async getStats() {
    try {
      const [projectsSnapshot, contactsSnapshot] = await Promise.all([
        getDocs(collection(db, 'projects')),
        getDocs(collection(db, 'contacts'))
      ]);

      const newContacts = contactsSnapshot.docs.filter(
        doc => doc.data().status === 'New'
      ).length;

      return {
        success: true,
        data: {
          projects: {
            total: projectsSnapshot.size
          },
          contacts: {
            total: contactsSnapshot.size,
            new: newContacts
          }
        }
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
};

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
      const projects = snapshot.docs.map((doc, index) => {
        const data = doc.data();
        return {
          id: data.id || (index + 1), // Use custom ID or fallback to index
          title: data.title || '',
          description: data.description || '',
          longDescription: data.longDescription || '',
          location: data.location || '',
          price: data.price || '', // Keep as string
          area: data.area || '',
          completionDate: data.completionDate || '',
          status: data.status || '',
          specifications: data.specifications || {
            bedrooms: '',
            bathrooms: '',
            parking: '',
            floor: '',
            type: ''
          },
          features: data.features || [],
          images: data.images || [],
          createdAt: data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
          views: data.views || 0
        };
      });
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
      // Generate unique ID
      const uniqueId = Date.now();
      const docRef = await addDoc(collection(db, 'projects'), {
        ...projectData,
        id: uniqueId, // Store custom ID
        price: projectData.price, // Keep as string
        createdAt: new Date(),
        updatedAt: new Date()
      });
      return { success: true, id: uniqueId };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Update project (Admin only)
  async updateProject(id, projectData) {
    try {
      // Find document by custom ID
      const projectsRef = collection(db, 'projects');
      const snapshot = await getDocs(projectsRef);
      const projectDoc = snapshot.docs.find(doc => doc.data().id === id);
      
      if (!projectDoc) {
        return { success: false, error: 'Project not found' };
      }
      
      await updateDoc(projectDoc.ref, {
        ...projectData,
        price: projectData.price, // Keep as string
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
      // Find document by custom ID
      const projectsRef = collection(db, 'projects');
      const snapshot = await getDocs(projectsRef);
      const projectDoc = snapshot.docs.find(doc => doc.data().id === id);
      
      if (!projectDoc) {
        return { success: false, error: 'Project not found' };
      }
      
      await deleteDoc(projectDoc.ref);
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
      // Generate unique ID
      const uniqueId = Date.now();
      const docRef = await addDoc(collection(db, 'contacts'), {
        ...contactData,
        id: uniqueId, // Store custom ID
        status: 'New',
        createdAt: new Date()
      });
      return { success: true, id: uniqueId };
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
      const contacts = snapshot.docs.map((doc, index) => {
        const data = doc.data();
        return {
          id: data.id || (index + 1), // Use custom ID or fallback to index
          name: data.name || '',
          email: data.email || '',
          phone: data.phone || '',
          message: data.message || '',
          status: data.status || 'New',
          createdAt: data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString()
        };
      });
      return { success: true, data: contacts };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Update contact status (Admin only)
  async updateContactStatus(id, status) {
    try {
      // Find document by custom ID
      const contactsRef = collection(db, 'contacts');
      const snapshot = await getDocs(contactsRef);
      const contactDoc = snapshot.docs.find(doc => doc.data().id === id);
      
      if (!contactDoc) {
        return { success: false, error: 'Contact not found' };
      }
      
      await updateDoc(contactDoc.ref, { 
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
      // Find document by custom ID
      const contactsRef = collection(db, 'contacts');
      const snapshot = await getDocs(contactsRef);
      const contactDoc = snapshot.docs.find(doc => doc.data().id === id);
      
      if (!contactDoc) {
        return { success: false, error: 'Contact not found' };
      }
      
      await deleteDoc(contactDoc.ref);
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

      const resolvedContacts = contactsSnapshot.docs.filter(
        doc => doc.data().status === 'Resolved'
      ).length;

      const availableProjects = projectsSnapshot.docs.filter(
        doc => doc.data().status === 'Available'
      ).length;

      const completedProjects = projectsSnapshot.docs.filter(
        doc => doc.data().status === 'Completed'
      ).length;

      return {
        success: true,
        data: {
          projects: {
            total: projectsSnapshot.size,
            available: availableProjects,
            completed: completedProjects,
            featured: Math.min(3, projectsSnapshot.size)
          },
          contacts: {
            total: contactsSnapshot.size,
            new: newContacts,
            resolved: resolvedContacts
          }
        }
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
};

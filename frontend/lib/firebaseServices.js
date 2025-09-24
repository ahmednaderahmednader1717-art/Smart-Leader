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
import { db, auth, chunkArray, estimateDocumentSize } from './firebase';

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
      
      const projects = await Promise.all(snapshot.docs.map(async (doc, index) => {
        const data = doc.data();
        
        // Get all images including chunks
        let allImages = data.images || [];
        
        // If project has image chunks, fetch them
        if (data.imageChunks && data.imageChunks > 1) {
          try {
            const imageChunksRef = collection(db, 'projectImages');
            const imageChunksSnapshot = await getDocs(imageChunksRef);
            const projectImageChunks = imageChunksSnapshot.docs
              .filter(chunkDoc => chunkDoc.data().projectId === data.id)
              .sort((a, b) => a.data().chunkIndex - b.data().chunkIndex);
            
            // Combine all image chunks
            for (const chunkDoc of projectImageChunks) {
              allImages = [...allImages, ...(chunkDoc.data().images || [])];
            }
          } catch (error) {
            console.error('Error fetching image chunks:', error);
          }
        }
        
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
          images: allImages, // All images including chunks
          createdAt: data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
          views: data.views || 0
        };
      }));
      
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
      
      // Prepare document data
      const docData = {
        ...projectData,
        id: uniqueId, // Store custom ID
        price: projectData.price, // Keep as string
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      // Check document size
      const docSize = estimateDocumentSize(docData);
      console.log('Document size:', docSize, 'bytes');
      
      // If document is too large, split images array
      if (docSize > 500000) { // 500KB limit (reduced for better performance)
        console.log('Document too large, splitting images array');
        
        // Split images into chunks and store separately
        if (projectData.images && projectData.images.length > 0) {
          const imageChunks = chunkArray(projectData.images, 3); // 3 images per chunk (reduced)
          
          // Store main document with first chunk
          docData.images = imageChunks[0] || [];
          docData.imageChunks = imageChunks.length;
          docData.imageChunkIndex = 0;
          
          // Store additional chunks as separate documents
          for (let i = 1; i < imageChunks.length; i++) {
            await addDoc(collection(db, 'projectImages'), {
              projectId: uniqueId,
              chunkIndex: i,
              images: imageChunks[i],
              createdAt: new Date()
            });
          }
        }
      }
      
      const docRef = await addDoc(collection(db, 'projects'), docData);
      return { success: true, id: uniqueId };
    } catch (error) {
      console.error('Error creating project:', error);
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
  },

  // Increment project views
  async incrementViews(id) {
    try {
      // Find document by custom ID
      const projectsRef = collection(db, 'projects');
      const snapshot = await getDocs(projectsRef);
      const projectDoc = snapshot.docs.find(doc => doc.data().id === id);
      
      if (!projectDoc) {
        return { success: false, error: 'Project not found' };
      }
      
      const currentViews = projectDoc.data().views || 0;
      await updateDoc(projectDoc.ref, {
        views: currentViews + 1,
        lastViewedAt: new Date()
      });
      
      return { success: true, views: currentViews + 1 };
    } catch (error) {
      console.error('Error incrementing views:', error);
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
  },

  // Save company settings
  async saveSettings(settings) {
    try {
      // For now, save to localStorage
      localStorage.setItem('companySettings', JSON.stringify(settings));
      return { success: true, data: settings };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Get company settings
  async getSettings() {
    try {
      const settings = localStorage.getItem('companySettings');
      if (settings) {
        return { success: true, data: JSON.parse(settings) };
      }
      return { 
        success: true, 
        data: {
          companyName: 'Smart Leader Real Estate',
          email: 'info@smartleader.com',
          phone: '+20 123 456 7890',
          location: '123 Business District, New Cairo, Egypt'
        }
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
};

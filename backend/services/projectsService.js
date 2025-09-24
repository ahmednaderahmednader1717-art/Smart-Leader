
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

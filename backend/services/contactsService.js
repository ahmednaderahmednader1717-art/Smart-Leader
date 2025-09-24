
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

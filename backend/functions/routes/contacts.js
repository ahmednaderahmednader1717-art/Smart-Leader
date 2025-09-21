const express = require('express');
const admin = require('firebase-admin');
const router = express.Router();

// Create contact
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;

    // Validate required fields
    if (!name || !email || !message) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const contactData = {
      name,
      email,
      phone: phone || '',
      message,
      status: 'New',
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    };

    const docRef = await admin.firestore()
      .collection('contacts')
      .add(contactData);

    res.status(201).json({
      message: 'Contact form submitted successfully',
      id: docRef.id
    });
  } catch (error) {
    console.error('Error creating contact:', error);
    res.status(500).json({ message: 'Error submitting contact form' });
  }
});

// Get all contacts (Admin only)
router.get('/', async (req, res) => {
  try {
    const contactsSnapshot = await admin.firestore()
      .collection('contacts')
      .orderBy('createdAt', 'desc')
      .get();

    const contacts = [];
    contactsSnapshot.forEach(doc => {
      contacts.push({
        id: doc.id,
        ...doc.data()
      });
    });

    res.json(contacts);
  } catch (error) {
    console.error('Error fetching contacts:', error);
    res.status(500).json({ message: 'Error fetching contacts' });
  }
});

// Update contact status (Admin only)
router.put('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;

    await admin.firestore()
      .collection('contacts')
      .doc(req.params.id)
      .update({
        status,
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });

    res.json({ message: 'Contact status updated successfully' });
  } catch (error) {
    console.error('Error updating contact status:', error);
    res.status(500).json({ message: 'Error updating contact status' });
  }
});

module.exports = router;

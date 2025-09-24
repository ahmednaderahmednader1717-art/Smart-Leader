const express = require('express');
const { body, validationResult } = require('express-validator');
const { db } = require('../config/firebase');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/contacts
// @desc    Create new contact submission
// @access  Public
router.post('/', [
  body('name').notEmpty().trim(),
  body('email').isEmail().normalizeEmail(),
  body('message').notEmpty().trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, phone, message } = req.body;

    // Create contact submission
    const contactData = {
      name,
      email,
      phone: phone || '',
      message,
      status: 'New',
      isRead: false,
      ipAddress: req.ip,
      userAgent: req.get('User-Agent'),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const docRef = await db.collection('contacts').add(contactData);

    res.status(201).json({ 
      message: 'Contact form submitted successfully',
      id: docRef.id
    });
  } catch (error) {
    console.error('Contact submission error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/contacts
// @desc    Get all contact submissions
// @access  Private (Admin only)
router.get('/', adminAuth, async (req, res) => {
  try {
    const { status, page = 1, limit = 10, search } = req.query;
    
    let query = db.collection('contacts');
    
    // Filter by status
    if (status) {
      query = query.where('status', '==', status);
    }
    
    const snapshot = await query
      .orderBy('createdAt', 'desc')
      .limit(parseInt(limit))
      .offset((parseInt(page) - 1) * parseInt(limit))
      .get();
    
    const contacts = [];
    snapshot.forEach(doc => {
      const data = doc.data();
      contacts.push({
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
        updatedAt: data.updatedAt?.toDate?.()?.toISOString() || new Date().toISOString()
      });
    });
    
    // Apply search filter client-side (for better performance, consider using Algolia)
    let filteredContacts = contacts;
    if (search) {
      const searchLower = search.toLowerCase();
      filteredContacts = contacts.filter(contact => 
        contact.name.toLowerCase().includes(searchLower) ||
        contact.email.toLowerCase().includes(searchLower) ||
        contact.message.toLowerCase().includes(searchLower)
      );
    }
    
    // Get total count
    const totalSnapshot = await db.collection('contacts').get();
    const total = totalSnapshot.size;
    
    res.json({
      contacts: filteredContacts,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      total
    });
  } catch (error) {
    console.error('Get contacts error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/contacts/:id
// @desc    Get single contact submission
// @access  Private (Admin only)
router.get('/:id', adminAuth, async (req, res) => {
  try {
    const contactDoc = await db.collection('contacts').doc(req.params.id).get();
    
    if (!contactDoc.exists) {
      return res.status(404).json({ message: 'Contact not found' });
    }
    
    const contact = contactDoc.data();
    
    // Mark as read
    if (!contact.isRead) {
      await db.collection('contacts').doc(req.params.id).update({
        isRead: true,
        updatedAt: new Date()
      });
      contact.isRead = true;
    }
    
    res.json({
      id: contactDoc.id,
      ...contact,
      createdAt: contact.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
      updatedAt: contact.updatedAt?.toDate?.()?.toISOString() || new Date().toISOString()
    });
  } catch (error) {
    console.error('Get contact error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/contacts/:id/status
// @desc    Update contact status
// @access  Private (Admin only)
router.put('/:id/status', [
  adminAuth,
  body('status').isIn(['New', 'Contacted', 'In Progress', 'Resolved'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const contactRef = db.collection('contacts').doc(req.params.id);
    const contactDoc = await contactRef.get();
    
    if (!contactDoc.exists) {
      return res.status(404).json({ message: 'Contact not found' });
    }

    await contactRef.update({
      status: req.body.status,
      updatedAt: new Date()
    });
    
    const updatedDoc = await contactRef.get();
    const updatedContact = updatedDoc.data();
    
    res.json({
      id: updatedDoc.id,
      ...updatedContact,
      createdAt: updatedContact.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
      updatedAt: updatedContact.updatedAt?.toDate?.()?.toISOString() || new Date().toISOString()
    });
  } catch (error) {
    console.error('Update contact status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/contacts/:id/notes
// @desc    Add note to contact
// @access  Private (Admin only)
router.post('/:id/notes', [
  adminAuth,
  body('note').notEmpty().trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const contactRef = db.collection('contacts').doc(req.params.id);
    const contactDoc = await contactRef.get();
    
    if (!contactDoc.exists) {
      return res.status(404).json({ message: 'Contact not found' });
    }
    
    const currentData = contactDoc.data();
    const notes = currentData.notes || [];
    
    notes.push({
      note: req.body.note,
      addedBy: req.user.email,
      addedAt: new Date()
    });
    
    await contactRef.update({
      notes: notes,
      updatedAt: new Date()
    });
    
    const updatedDoc = await contactRef.get();
    const updatedContact = updatedDoc.data();
    
    res.json({
      id: updatedDoc.id,
      ...updatedContact,
      createdAt: updatedContact.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
      updatedAt: updatedContact.updatedAt?.toDate?.()?.toISOString() || new Date().toISOString()
    });
  } catch (error) {
    console.error('Add note error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/contacts/:id
// @desc    Delete contact submission
// @access  Private (Admin only)
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const contactRef = db.collection('contacts').doc(req.params.id);
    const contactDoc = await contactRef.get();
    
    if (!contactDoc.exists) {
      return res.status(404).json({ message: 'Contact not found' });
    }

    await contactRef.delete();
    
    res.json({ message: 'Contact deleted successfully' });
  } catch (error) {
    console.error('Delete contact error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/contacts/stats/summary
// @desc    Get contact statistics
// @access  Private (Admin only)
router.get('/stats/summary', adminAuth, async (req, res) => {
  try {
    const contactsSnapshot = await db.collection('contacts').get();
    const contacts = [];
    
    contactsSnapshot.forEach(doc => {
      contacts.push(doc.data());
    });
    
    const total = contacts.length;
    const newContacts = contacts.filter(c => c.status === 'New').length;
    const contacted = contacts.filter(c => c.status === 'Contacted').length;
    const inProgress = contacts.filter(c => c.status === 'In Progress').length;
    const resolved = contacts.filter(c => c.status === 'Resolved').length;
    
    // Get recent contacts (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentContacts = contacts.filter(c => {
      const createdAt = c.createdAt?.toDate?.() || new Date();
      return createdAt >= sevenDaysAgo;
    }).length;
    
    res.json({
      total,
      new: newContacts,
      contacted,
      inProgress,
      resolved,
      recent: recentContacts
    });
  } catch (error) {
    console.error('Get contact stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
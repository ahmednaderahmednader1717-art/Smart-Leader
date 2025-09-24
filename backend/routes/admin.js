const express = require('express');
const { body, validationResult } = require('express-validator');
const { db } = require('../config/firebase');
const { adminAuth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/admin/dashboard
// @desc    Get admin dashboard statistics
// @access  Private (Admin only)
router.get('/dashboard', adminAuth, async (req, res) => {
  try {
    // Get all projects
    const projectsSnapshot = await db.collection('projects').get();
    const projects = [];
    projectsSnapshot.forEach(doc => {
      projects.push(doc.data());
    });

    // Get all contacts
    const contactsSnapshot = await db.collection('contacts').get();
    const contacts = [];
    contactsSnapshot.forEach(doc => {
      contacts.push(doc.data());
    });

    // Project statistics
    const totalProjects = projects.length;
    const availableProjects = projects.filter(p => p.status === 'Available').length;
    const completedProjects = projects.filter(p => p.status === 'Completed').length;
    const featuredProjects = projects.filter(p => p.isFeatured === true).length;

    // Contact statistics
    const totalContacts = contacts.length;
    const newContacts = contacts.filter(c => c.status === 'New').length;
    const resolvedContacts = contacts.filter(c => c.status === 'Resolved').length;

    // Recent activity
    const recentProjects = projects
      .sort((a, b) => new Date(b.createdAt?.toDate?.() || 0) - new Date(a.createdAt?.toDate?.() || 0))
      .slice(0, 5)
      .map(p => ({
        id: p.id,
        title: p.title,
        status: p.status,
        createdAt: p.createdAt?.toDate?.()?.toISOString() || new Date().toISOString()
      }));

    const recentContacts = contacts
      .sort((a, b) => new Date(b.createdAt?.toDate?.() || 0) - new Date(a.createdAt?.toDate?.() || 0))
      .slice(0, 5)
      .map(c => ({
        id: c.id,
        name: c.name,
        email: c.email,
        status: c.status,
        createdAt: c.createdAt?.toDate?.()?.toISOString() || new Date().toISOString()
      }));

    // Monthly statistics (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyProjects = [];
    const monthlyContacts = [];

    // Group projects by month
    const projectMonths = {};
    projects.forEach(project => {
      const createdAt = project.createdAt?.toDate?.() || new Date();
      if (createdAt >= sixMonthsAgo) {
        const monthKey = `${createdAt.getFullYear()}-${createdAt.getMonth() + 1}`;
        projectMonths[monthKey] = (projectMonths[monthKey] || 0) + 1;
      }
    });

    Object.entries(projectMonths).forEach(([month, count]) => {
      const [year, monthNum] = month.split('-');
      monthlyProjects.push({
        _id: { year: parseInt(year), month: parseInt(monthNum) },
        count
      });
    });

    // Group contacts by month
    const contactMonths = {};
    contacts.forEach(contact => {
      const createdAt = contact.createdAt?.toDate?.() || new Date();
      if (createdAt >= sixMonthsAgo) {
        const monthKey = `${createdAt.getFullYear()}-${createdAt.getMonth() + 1}`;
        contactMonths[monthKey] = (contactMonths[monthKey] || 0) + 1;
      }
    });

    Object.entries(contactMonths).forEach(([month, count]) => {
      const [year, monthNum] = month.split('-');
      monthlyContacts.push({
        _id: { year: parseInt(year), month: parseInt(monthNum) },
        count
      });
    });

    res.json({
      projects: {
        total: totalProjects,
        available: availableProjects,
        completed: completedProjects,
        featured: featuredProjects
      },
      contacts: {
        total: totalContacts,
        new: newContacts,
        resolved: resolvedContacts
      },
      recent: {
        projects: recentProjects,
        contacts: recentContacts
      },
      analytics: {
        monthlyProjects,
        monthlyContacts
      }
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/admin/projects
// @desc    Get all projects for admin (including inactive)
// @access  Private (Admin only)
router.get('/projects', adminAuth, async (req, res) => {
  try {
    const { page = 1, limit = 10, status, search } = req.query;
    
    let query = db.collection('projects');
    
    if (status) {
      query = query.where('status', '==', status);
    }
    
    const snapshot = await query
      .orderBy('createdAt', 'desc')
      .limit(parseInt(limit))
      .offset((parseInt(page) - 1) * parseInt(limit))
      .get();
    
    const projects = [];
    snapshot.forEach(doc => {
      const data = doc.data();
      projects.push({
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
        updatedAt: data.updatedAt?.toDate?.()?.toISOString() || new Date().toISOString()
      });
    });
    
    // Apply search filter client-side
    let filteredProjects = projects;
    if (search) {
      const searchLower = search.toLowerCase();
      filteredProjects = projects.filter(project => 
        project.title.toLowerCase().includes(searchLower) ||
        project.location.toLowerCase().includes(searchLower)
      );
    }
    
    // Get total count
    const totalSnapshot = await db.collection('projects').get();
    const total = totalSnapshot.size;
    
    res.json({
      projects: filteredProjects,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      total
    });
  } catch (error) {
    console.error('Get admin projects error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/admin/contacts
// @desc    Get all contacts for admin
// @access  Private (Admin only)
router.get('/contacts', adminAuth, async (req, res) => {
  try {
    const { page = 1, limit = 10, status, search } = req.query;
    
    let query = db.collection('contacts');
    
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
    
    // Apply search filter client-side
    let filteredContacts = contacts;
    if (search) {
      const searchLower = search.toLowerCase();
      filteredContacts = contacts.filter(contact => 
        contact.name.toLowerCase().includes(searchLower) ||
        contact.email.toLowerCase().includes(searchLower)
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
    console.error('Get admin contacts error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/admin/contacts/export
// @desc    Export contacts to CSV
// @access  Private (Admin only)
router.post('/contacts/export', adminAuth, async (req, res) => {
  try {
    const { startDate, endDate, status } = req.body;
    
    let query = db.collection('contacts');
    
    if (status) {
      query = query.where('status', '==', status);
    }
    
    const snapshot = await query.orderBy('createdAt', 'desc').get();
    const contacts = [];
    
    snapshot.forEach(doc => {
      const data = doc.data();
      const createdAt = data.createdAt?.toDate?.() || new Date();
      
      // Apply date filter
      if (startDate && endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        if (createdAt >= start && createdAt <= end) {
          contacts.push({
            id: doc.id,
            ...data,
            createdAt: createdAt.toISOString()
          });
        }
      } else {
        contacts.push({
          id: doc.id,
          ...data,
          createdAt: createdAt.toISOString()
        });
      }
    });
    
    // Convert to CSV format
    const csvHeader = 'Name,Email,Phone,Message,Status,Created At\n';
    const csvData = contacts.map(contact => {
      return [
        `"${contact.name}"`,
        `"${contact.email}"`,
        `"${contact.phone || ''}"`,
        `"${contact.message.replace(/"/g, '""')}"`,
        `"${contact.status}"`,
        `"${contact.createdAt}"`
      ].join(',');
    }).join('\n');
    
    const csv = csvHeader + csvData;
    
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=contacts-export.csv');
    res.send(csv);
  } catch (error) {
    console.error('Export contacts error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/admin/users
// @desc    Get all users
// @access  Private (Admin only)
router.get('/users', adminAuth, async (req, res) => {
  try {
    const usersSnapshot = await db.collection('users').get();
    const users = [];
    
    usersSnapshot.forEach(doc => {
      const data = doc.data();
      users.push({
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
        updatedAt: data.updatedAt?.toDate?.()?.toISOString() || new Date().toISOString()
      });
    });
    
    res.json(users);
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/admin/users/:uid/status
// @desc    Toggle user active status
// @access  Private (Admin only)
router.put('/users/:uid/status', adminAuth, async (req, res) => {
  try {
    const { uid } = req.params;
    const userRef = db.collection('users').doc(uid);
    const userDoc = await userRef.get();
    
    if (!userDoc.exists) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const currentData = userDoc.data();
    const newStatus = !currentData.isActive;
    
    await userRef.update({
      isActive: newStatus,
      updatedAt: new Date()
    });
    
    const updatedDoc = await userRef.get();
    const updatedUser = updatedDoc.data();
    
    res.json({
      id: updatedDoc.id,
      ...updatedUser,
      createdAt: updatedUser.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
      updatedAt: updatedUser.updatedAt?.toDate?.()?.toISOString() || new Date().toISOString()
    });
  } catch (error) {
    console.error('Toggle user status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/admin/users/:uid
// @desc    Delete user
// @access  Private (Admin only)
router.delete('/users/:uid', adminAuth, async (req, res) => {
  try {
    const { uid } = req.params;
    const userRef = db.collection('users').doc(uid);
    const userDoc = await userRef.get();
    
    if (!userDoc.exists) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const userData = userDoc.data();
    
    // Prevent deleting the last admin
    if (userData.role === 'admin') {
      const adminSnapshot = await db.collection('users')
        .where('role', '==', 'admin')
        .where('isActive', '==', true)
        .get();
      
      if (adminSnapshot.size <= 1) {
        return res.status(400).json({ message: 'Cannot delete the last admin user' });
      }
    }
    
    await userRef.delete();
    
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
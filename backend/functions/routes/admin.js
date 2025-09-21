const express = require('express');
const admin = require('firebase-admin');
const router = express.Router();

// Get dashboard stats
router.get('/stats', async (req, res) => {
  try {
    // Get projects count
    const projectsSnapshot = await admin.firestore()
      .collection('projects')
      .get();

    // Get contacts count
    const contactsSnapshot = await admin.firestore()
      .collection('contacts')
      .get();

    // Get users count
    const usersSnapshot = await admin.firestore()
      .collection('users')
      .get();

    const stats = {
      projects: {
        total: projectsSnapshot.size,
        available: 0,
        completed: 0,
        featured: 0
      },
      contacts: {
        total: contactsSnapshot.size,
        new: 0,
        resolved: 0
      },
      users: {
        total: usersSnapshot.size
      }
    };

    // Count project statuses
    projectsSnapshot.forEach(doc => {
      const data = doc.data();
      if (data.status === 'Available') stats.projects.available++;
      if (data.status === 'Completed') stats.projects.completed++;
      if (data.featured) stats.projects.featured++;
    });

    // Count contact statuses
    contactsSnapshot.forEach(doc => {
      const data = doc.data();
      if (data.status === 'New') stats.contacts.new++;
      if (data.status === 'Resolved') stats.contacts.resolved++;
    });

    res.json(stats);
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ message: 'Error fetching dashboard stats' });
  }
});

// Get all users (Admin only)
router.get('/users', async (req, res) => {
  try {
    const usersSnapshot = await admin.firestore()
      .collection('users')
      .orderBy('createdAt', 'desc')
      .get();

    const users = [];
    usersSnapshot.forEach(doc => {
      users.push({
        id: doc.id,
        ...doc.data()
      });
    });

    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Error fetching users' });
  }
});

module.exports = router;

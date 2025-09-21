const express = require('express');
const admin = require('firebase-admin');
const router = express.Router();

// Get all projects
router.get('/', async (req, res) => {
  try {
    const projectsSnapshot = await admin.firestore()
      .collection('projects')
      .orderBy('createdAt', 'desc')
      .get();

    const projects = [];
    projectsSnapshot.forEach(doc => {
      projects.push({
        id: doc.id,
        ...doc.data()
      });
    });

    res.json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ message: 'Error fetching projects' });
  }
});

// Get single project
router.get('/:id', async (req, res) => {
  try {
    const projectDoc = await admin.firestore()
      .collection('projects')
      .doc(req.params.id)
      .get();

    if (!projectDoc.exists) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.json({
      id: projectDoc.id,
      ...projectDoc.data()
    });
  } catch (error) {
    console.error('Error fetching project:', error);
    res.status(500).json({ message: 'Error fetching project' });
  }
});

// Create project (Admin only)
router.post('/', async (req, res) => {
  try {
    const projectData = {
      ...req.body,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    };

    const docRef = await admin.firestore()
      .collection('projects')
      .add(projectData);

    res.status(201).json({
      message: 'Project created successfully',
      id: docRef.id
    });
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ message: 'Error creating project' });
  }
});

// Update project (Admin only)
router.put('/:id', async (req, res) => {
  try {
    const projectData = {
      ...req.body,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    };

    await admin.firestore()
      .collection('projects')
      .doc(req.params.id)
      .update(projectData);

    res.json({ message: 'Project updated successfully' });
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).json({ message: 'Error updating project' });
  }
});

// Delete project (Admin only)
router.delete('/:id', async (req, res) => {
  try {
    await admin.firestore()
      .collection('projects')
      .doc(req.params.id)
      .delete();

    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({ message: 'Error deleting project' });
  }
});

module.exports = router;

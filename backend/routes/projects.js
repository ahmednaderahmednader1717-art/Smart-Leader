const express = require('express');
const { body, validationResult } = require('express-validator');
const { db } = require('../config/firebase');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/projects
// @desc    Get all projects
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { status, featured, search, page = 1, limit = 10 } = req.query;
    
    let query = db.collection('projects');
    
    // Filter by status
    if (status) {
      query = query.where('status', '==', status);
    }
    
    // Filter featured projects
    if (featured === 'true') {
      query = query.where('isFeatured', '==', true);
    }
    
    // Search functionality
    if (search) {
      // Firestore doesn't support full-text search, so we'll filter client-side
      // For better performance, consider using Algolia or Elasticsearch
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
    
    // Get total count
    const totalSnapshot = await db.collection('projects').get();
    const total = totalSnapshot.size;
    
    res.json({
      projects,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      total
    });
  } catch (error) {
    console.error('Get projects error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/projects/:id
// @desc    Get single project
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const projectDoc = await db.collection('projects').doc(req.params.id).get();
    
    if (!projectDoc.exists) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    const project = projectDoc.data();
    
    // Increment view count
    await db.collection('projects').doc(req.params.id).update({
      views: (project.views || 0) + 1,
      lastViewedAt: new Date()
    });
    
    res.json({
      id: projectDoc.id,
      ...project,
      views: (project.views || 0) + 1,
      createdAt: project.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
      updatedAt: project.updatedAt?.toDate?.()?.toISOString() || new Date().toISOString()
    });
  } catch (error) {
    console.error('Get project error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/projects
// @desc    Create new project
// @access  Private (Admin only)
router.post('/', [
  adminAuth,
  body('title').notEmpty().trim(),
  body('description').notEmpty(),
  body('longDescription').notEmpty(),
  body('location').notEmpty().trim(),
  body('price').notEmpty(),
  body('area').notEmpty(),
  body('completionDate').notEmpty(),
  body('specifications.bedrooms').notEmpty(),
  body('specifications.bathrooms').notEmpty(),
  body('specifications.parking').notEmpty(),
  body('specifications.floor').notEmpty(),
  body('specifications.type').notEmpty()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const projectData = {
      ...req.body,
      createdAt: new Date(),
      updatedAt: new Date(),
      views: 0,
      isActive: true,
      isFeatured: false
    };

    const docRef = await db.collection('projects').add(projectData);
    
    res.status(201).json({
      id: docRef.id,
      ...projectData,
      createdAt: projectData.createdAt.toISOString(),
      updatedAt: projectData.updatedAt.toISOString()
    });
  } catch (error) {
    console.error('Create project error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/projects/:id
// @desc    Update project
// @access  Private (Admin only)
router.put('/:id', [
  adminAuth,
  body('title').optional().notEmpty().trim(),
  body('description').optional().notEmpty(),
  body('longDescription').optional().notEmpty(),
  body('location').optional().notEmpty().trim(),
  body('price').optional().notEmpty(),
  body('area').optional().notEmpty(),
  body('completionDate').optional().notEmpty()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const projectRef = db.collection('projects').doc(req.params.id);
    const projectDoc = await projectRef.get();
    
    if (!projectDoc.exists) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const updateData = {
      ...req.body,
      updatedAt: new Date()
    };

    await projectRef.update(updateData);
    
    const updatedDoc = await projectRef.get();
    const updatedProject = updatedDoc.data();
    
    res.json({
      id: updatedDoc.id,
      ...updatedProject,
      createdAt: updatedProject.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
      updatedAt: updatedProject.updatedAt?.toDate?.()?.toISOString() || new Date().toISOString()
    });
  } catch (error) {
    console.error('Update project error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/projects/:id
// @desc    Delete project
// @access  Private (Admin only)
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const projectRef = db.collection('projects').doc(req.params.id);
    const projectDoc = await projectRef.get();
    
    if (!projectDoc.exists) {
      return res.status(404).json({ message: 'Project not found' });
    }

    await projectRef.update({
      isActive: false,
      updatedAt: new Date()
    });
    
    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Delete project error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/projects/:id/feature
// @desc    Toggle featured status
// @access  Private (Admin only)
router.put('/:id/feature', adminAuth, async (req, res) => {
  try {
    const projectRef = db.collection('projects').doc(req.params.id);
    const projectDoc = await projectRef.get();
    
    if (!projectDoc.exists) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    const currentData = projectDoc.data();
    const newFeaturedStatus = !currentData.isFeatured;
    
    await projectRef.update({
      isFeatured: newFeaturedStatus,
      updatedAt: new Date()
    });
    
    const updatedDoc = await projectRef.get();
    const updatedProject = updatedDoc.data();
    
    res.json({
      id: updatedDoc.id,
      ...updatedProject,
      createdAt: updatedProject.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
      updatedAt: updatedProject.updatedAt?.toDate?.()?.toISOString() || new Date().toISOString()
    });
  } catch (error) {
    console.error('Toggle feature error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
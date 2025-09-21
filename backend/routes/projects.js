const express = require('express');
const { body, validationResult } = require('express-validator');
const Project = require('../models/Project');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/projects
// @desc    Get all projects
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { status, featured, search, page = 1, limit = 10 } = req.query;
    
    let query = { isActive: true };
    
    // Filter by status
    if (status) {
      query.status = status;
    }
    
    // Filter featured projects
    if (featured === 'true') {
      query.isFeatured = true;
    }
    
    // Search functionality
    if (search) {
      query.$text = { $search: search };
    }
    
    const projects = await Project.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select('-__v');
    
    const total = await Project.countDocuments(query);
    
    res.json({
      projects,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
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
    const project = await Project.findById(req.params.id);
    
    if (!project || !project.isActive) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    // Increment view count
    project.views += 1;
    await project.save();
    
    res.json(project);
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

    const project = new Project(req.body);
    await project.save();
    
    res.status(201).json(project);
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

    const project = await Project.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    res.json(project);
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
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
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
    const project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    project.isFeatured = !project.isFeatured;
    await project.save();
    
    res.json(project);
  } catch (error) {
    console.error('Toggle feature error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;


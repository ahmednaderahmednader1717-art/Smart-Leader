#!/usr/bin/env node

/**
 * Migration Script: MongoDB to Firebase
 * This script migrates all data from MongoDB to Firebase Firestore
 */

const mongoose = require('mongoose');
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc, doc, setDoc } = require('firebase/firestore');
require('dotenv').config({ path: '../env.migration' });

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCjSrQw2dkKjMfR-KxT2fzMQthoW45dhuk",
  authDomain: "smart-leader-ff5ff.firebaseapp.com",
  projectId: "smart-leader-ff5ff",
  storageBucket: "smart-leader-ff5ff.firebasestorage.app",
  messagingSenderId: "367490239791",
  appId: "1:367490239791:web:38b0fb69083e0add8265da"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// MongoDB Models (simplified for migration)
const projectSchema = new mongoose.Schema({
  title: String,
  description: String,
  longDescription: String,
  location: String,
  status: String,
  price: String,
  area: String,
  completionDate: String,
  images: [{
    url: String,
    alt: String
  }],
  features: [String],
  specifications: {
    bedrooms: String,
    bathrooms: String,
    parking: String,
    floor: String,
    type: String
  },
  isFeatured: Boolean,
  isActive: Boolean,
  views: Number,
  rating: Number
}, { timestamps: true });

const contactSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  message: String,
  status: String,
  source: String,
  ipAddress: String,
  userAgent: String,
  isRead: Boolean,
  notes: [{
    note: String,
    addedBy: String,
    addedAt: Date
  }]
}, { timestamps: true });

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  role: String,
  isActive: Boolean,
  lastLogin: Date
}, { timestamps: true });

const Project = mongoose.model('Project', projectSchema);
const Contact = mongoose.model('Contact', contactSchema);
const User = mongoose.model('User', userSchema);

// Migration functions
async function migrateProjects() {
  console.log('🔄 Starting projects migration...');
  
  try {
    const projects = await Project.find({});
    console.log(`📊 Found ${projects.length} projects to migrate`);
    
    let successCount = 0;
    let errorCount = 0;
    
    for (const project of projects) {
      try {
        // Convert MongoDB document to Firebase format
        const firebaseProject = {
          id: project._id.toString(),
          title: project.title || '',
          description: project.description || '',
          longDescription: project.longDescription || '',
          location: project.location || '',
          status: project.status || 'Available',
          price: project.price || '',
          area: project.area || '',
          completionDate: project.completionDate || '',
          images: project.images || [],
          features: project.features || [],
          specifications: project.specifications || {
            bedrooms: '',
            bathrooms: '',
            parking: '',
            floor: '',
            type: ''
          },
          isFeatured: project.isFeatured || false,
          isActive: project.isActive !== false,
          views: project.views || 0,
          rating: project.rating || 0,
          createdAt: project.createdAt || new Date(),
          updatedAt: project.updatedAt || new Date()
        };
        
        // Add to Firebase
        await addDoc(collection(db, 'projects'), firebaseProject);
        successCount++;
        console.log(`✅ Migrated project: ${project.title}`);
        
      } catch (error) {
        errorCount++;
        console.error(`❌ Error migrating project ${project.title}:`, error.message);
      }
    }
    
    console.log(`🎉 Projects migration completed: ${successCount} success, ${errorCount} errors`);
    return { success: successCount, errors: errorCount };
    
  } catch (error) {
    console.error('❌ Projects migration failed:', error);
    return { success: 0, errors: 1 };
  }
}

async function migrateContacts() {
  console.log('🔄 Starting contacts migration...');
  
  try {
    const contacts = await Contact.find({});
    console.log(`📊 Found ${contacts.length} contacts to migrate`);
    
    let successCount = 0;
    let errorCount = 0;
    
    for (const contact of contacts) {
      try {
        // Convert MongoDB document to Firebase format
        const firebaseContact = {
          id: contact._id.toString(),
          name: contact.name || '',
          email: contact.email || '',
          phone: contact.phone || '',
          message: contact.message || '',
          status: contact.status || 'New',
          source: contact.source || 'website',
          ipAddress: contact.ipAddress || '',
          userAgent: contact.userAgent || '',
          isRead: contact.isRead || false,
          notes: contact.notes || [],
          createdAt: contact.createdAt || new Date(),
          updatedAt: contact.updatedAt || new Date()
        };
        
        // Add to Firebase
        await addDoc(collection(db, 'contacts'), firebaseContact);
        successCount++;
        console.log(`✅ Migrated contact: ${contact.name}`);
        
      } catch (error) {
        errorCount++;
        console.error(`❌ Error migrating contact ${contact.name}:`, error.message);
      }
    }
    
    console.log(`🎉 Contacts migration completed: ${successCount} success, ${errorCount} errors`);
    return { success: successCount, errors: errorCount };
    
  } catch (error) {
    console.error('❌ Contacts migration failed:', error);
    return { success: 0, errors: 1 };
  }
}

async function migrateUsers() {
  console.log('🔄 Starting users migration...');
  
  try {
    const users = await User.find({});
    console.log(`📊 Found ${users.length} users to migrate`);
    
    let successCount = 0;
    let errorCount = 0;
    
    for (const user of users) {
      try {
        // Convert MongoDB document to Firebase format
        const firebaseUser = {
          id: user._id.toString(),
          email: user.email || '',
          password: user.password || '', // Note: This should be handled differently in production
          role: user.role || 'user',
          isActive: user.isActive !== false,
          lastLogin: user.lastLogin || null,
          createdAt: user.createdAt || new Date(),
          updatedAt: user.updatedAt || new Date()
        };
        
        // Add to Firebase
        await addDoc(collection(db, 'users'), firebaseUser);
        successCount++;
        console.log(`✅ Migrated user: ${user.email}`);
        
      } catch (error) {
        errorCount++;
        console.error(`❌ Error migrating user ${user.email}:`, error.message);
      }
    }
    
    console.log(`🎉 Users migration completed: ${successCount} success, ${errorCount} errors`);
    return { success: successCount, errors: errorCount };
    
  } catch (error) {
    console.error('❌ Users migration failed:', error);
    return { success: 0, errors: 1 };
  }
}

async function setupDefaultSettings() {
  console.log('🔄 Setting up default company settings...');
  
  try {
    const defaultSettings = {
      companyName: 'Smart Leader Real Estate',
      email: 'info@smartleader.com',
      phone: '+20 123 456 7890',
      location: '123 Business District, New Cairo, Egypt'
    };
    
    await setDoc(doc(db, 'settings', 'company'), defaultSettings);
    console.log('✅ Default settings created successfully');
    
  } catch (error) {
    console.error('❌ Error setting up default settings:', error);
  }
}

// Main migration function
async function runMigration() {
  console.log('🚀 Starting MongoDB to Firebase migration...');
  console.log('=====================================');
  
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/smart-leader-real-estate';
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');
    
    // Run migrations
    const projectsResult = await migrateProjects();
    const contactsResult = await migrateContacts();
    const usersResult = await migrateUsers();
    await setupDefaultSettings();
    
    // Summary
    console.log('\n📊 Migration Summary:');
    console.log('====================');
    console.log(`Projects: ${projectsResult.success} migrated, ${projectsResult.errors} errors`);
    console.log(`Contacts: ${contactsResult.success} migrated, ${contactsResult.errors} errors`);
    console.log(`Users: ${usersResult.success} migrated, ${usersResult.errors} errors`);
    
    const totalSuccess = projectsResult.success + contactsResult.success + usersResult.success;
    const totalErrors = projectsResult.errors + contactsResult.errors + usersResult.errors;
    
    console.log(`\n🎉 Total: ${totalSuccess} documents migrated successfully`);
    if (totalErrors > 0) {
      console.log(`⚠️  ${totalErrors} documents had errors`);
    }
    
    console.log('\n✅ Migration completed successfully!');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
  } finally {
    // Close MongoDB connection
    await mongoose.connection.close();
    console.log('🔌 MongoDB connection closed');
    process.exit(0);
  }
}

// Run migration if this file is executed directly
if (require.main === module) {
  runMigration();
}

module.exports = {
  migrateProjects,
  migrateContacts,
  migrateUsers,
  setupDefaultSettings,
  runMigration
};

#!/usr/bin/env node

/**
 * Migration Script: Mock Data to Firebase
 * This script migrates mock data from the codebase to Firebase Firestore
 */

const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc, doc, setDoc } = require('firebase/firestore');

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

// Mock data from the codebase
const mockProjects = [
  {
    id: 1,
    title: 'Luxury Apartments in New Cairo',
    description: 'Modern luxury apartments with premium amenities and stunning city views.',
    longDescription: 'Experience the epitome of luxury living in our state-of-the-art apartment complex in New Cairo. Each unit features premium finishes, smart home technology, and breathtaking views of the city skyline. Our development includes world-class amenities including a rooftop infinity pool, fitness center, spa, and 24/7 concierge service.',
    location: 'New Cairo, Egypt',
    status: 'Available',
    price: 'Starting from $150,000',
    area: '120-200 sqm',
    completionDate: 'Q2 2024',
    images: [
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
    ],
    features: [
      'Smart Home Technology',
      'Rooftop Infinity Pool',
      'Fitness Center',
      '24/7 Concierge Service',
      'Underground Parking',
      'Green Spaces'
    ],
    specifications: {
      bedrooms: '2-4',
      bathrooms: '2-3',
      parking: '1-2',
      floor: '1-15',
      type: 'Apartment'
    },
    isFeatured: true,
    isActive: true,
    views: 1250,
    rating: 4.8
  },
  {
    id: 2,
    title: 'Villa Complex in North Coast',
    description: 'Exclusive beachfront villas with private pools and direct beach access.',
    longDescription: 'Discover the ultimate beachfront living experience in our exclusive villa complex on the North Coast. Each villa features a private pool, direct beach access, and stunning Mediterranean views. Our gated community offers privacy, security, and world-class amenities including a private beach club, marina, and championship golf course.',
    location: 'North Coast, Egypt',
    status: 'Available',
    price: 'Starting from $200,000',
    area: '250-400 sqm',
    completionDate: 'Q3 2024',
    images: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
    ],
    features: [
      'Private Pool',
      'Direct Beach Access',
      'Private Beach Club',
      'Marina Access',
      'Golf Course',
      'Gated Community'
    ],
    specifications: {
      bedrooms: '3-5',
      bathrooms: '3-4',
      parking: '2-3',
      floor: '1-2',
      type: 'Villa'
    },
    isFeatured: true,
    isActive: true,
    views: 980,
    rating: 4.9
  },
  {
    id: 3,
    title: 'Commercial Tower in Downtown',
    description: 'State-of-the-art commercial tower with modern office spaces.',
    longDescription: 'Invest in the future of business with our cutting-edge commercial tower in Downtown Cairo. Featuring flexible office spaces, modern amenities, and prime location, this development is perfect for businesses looking to establish their presence in Egypt\'s financial district.',
    location: 'Downtown Cairo, Egypt',
    status: 'Completed',
    price: 'Contact for pricing',
    area: '50-500 sqm',
    completionDate: 'Q1 2024',
    images: [
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
    ],
    features: [
      'Flexible Office Spaces',
      'Modern Amenities',
      'Prime Location',
      'Parking Facilities',
      'Security System',
      'High-Speed Internet'
    ],
    specifications: {
      bedrooms: 'N/A',
      bathrooms: 'Shared',
      parking: 'Available',
      floor: '1-20',
      type: 'Commercial'
    },
    isFeatured: false,
    isActive: true,
    views: 750,
    rating: 4.6
  },
  {
    id: 4,
    title: 'Residential Complex in Sheikh Zayed',
    description: 'Family-friendly residential complex with modern amenities.',
    longDescription: 'Perfect for families seeking comfort and convenience, our residential complex in Sheikh Zayed offers spacious apartments with modern amenities. The development includes playgrounds, swimming pools, and green spaces, creating an ideal environment for family living.',
    location: 'Sheikh Zayed, Egypt',
    status: 'Under Construction',
    price: 'Starting from $120,000',
    area: '100-180 sqm',
    completionDate: 'Q4 2024',
    images: [
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
    ],
    features: [
      'Family-Friendly Design',
      'Playgrounds',
      'Swimming Pools',
      'Green Spaces',
      'Security System',
      'Parking'
    ],
    specifications: {
      bedrooms: '2-3',
      bathrooms: '2',
      parking: '1',
      floor: '1-10',
      type: 'Apartment'
    },
    isFeatured: false,
    isActive: true,
    views: 650,
    rating: 4.5
  },
  {
    id: 5,
    title: 'Luxury Penthouse in Zamalek',
    description: 'Exclusive penthouse with panoramic Nile views.',
    longDescription: 'Experience luxury living at its finest in our exclusive penthouse overlooking the Nile River. This stunning property features premium finishes, private terrace, and breathtaking views of Cairo\'s skyline. Perfect for those seeking the ultimate in urban luxury.',
    location: 'Zamalek, Cairo',
    status: 'Sold Out',
    price: 'Sold Out',
    area: '300 sqm',
    completionDate: 'Q2 2023',
    images: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
    ],
    features: [
      'Panoramic Nile Views',
      'Private Terrace',
      'Premium Finishes',
      'Smart Home Technology',
      'Private Elevator',
      'Concierge Service'
    ],
    specifications: {
      bedrooms: '4',
      bathrooms: '4',
      parking: '2',
      floor: '25',
      type: 'Penthouse'
    },
    isFeatured: true,
    isActive: true,
    views: 2100,
    rating: 5.0
  }
];

const mockContacts = [
  {
    id: 1,
    name: 'Ahmed Hassan',
    email: 'ahmed.hassan@email.com',
    phone: '+20 123 456 7890',
    message: 'I am interested in the luxury apartments in New Cairo. Could you please provide more information about the payment plans and available units?',
    status: 'New',
    source: 'website',
    isRead: false,
    createdAt: new Date('2024-01-15T10:30:00Z')
  },
  {
    id: 2,
    name: 'Sarah Mohamed',
    email: 'sarah.mohamed@email.com',
    phone: '+20 987 654 3210',
    message: 'Hello, I would like to schedule a visit to the villa complex in North Coast. What are the available viewing times?',
    status: 'Contacted',
    source: 'website',
    isRead: true,
    createdAt: new Date('2024-01-14T14:20:00Z')
  },
  {
    id: 3,
    name: 'Omar Ali',
    email: 'omar.ali@email.com',
    phone: '+20 555 123 4567',
    message: 'I am looking for commercial office space in Downtown Cairo. Do you have any available units in the commercial tower?',
    status: 'In Progress',
    source: 'website',
    isRead: true,
    createdAt: new Date('2024-01-13T09:15:00Z')
  }
];

const mockUsers = [
  {
    id: 1,
    email: 'admin@smartleader.com',
    role: 'admin',
    isActive: true,
    lastLogin: new Date('2024-01-15T08:00:00Z'),
    createdAt: new Date('2024-01-01T00:00:00Z')
  }
];

// Migration functions
async function migrateProjects() {
  console.log('🔄 Starting projects migration...');
  
  try {
    let successCount = 0;
    let errorCount = 0;
    
    for (const project of mockProjects) {
      try {
        // Convert to Firebase format
        const firebaseProject = {
          id: project.id,
          title: project.title,
          description: project.description,
          longDescription: project.longDescription,
          location: project.location,
          status: project.status,
          price: project.price,
          area: project.area,
          completionDate: project.completionDate,
          images: project.images,
          features: project.features,
          specifications: project.specifications,
          isFeatured: project.isFeatured,
          isActive: project.isActive,
          views: project.views,
          rating: project.rating,
          createdAt: new Date(),
          updatedAt: new Date()
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
    let successCount = 0;
    let errorCount = 0;
    
    for (const contact of mockContacts) {
      try {
        // Convert to Firebase format
        const firebaseContact = {
          id: contact.id,
          name: contact.name,
          email: contact.email,
          phone: contact.phone,
          message: contact.message,
          status: contact.status,
          source: contact.source,
          isRead: contact.isRead,
          createdAt: contact.createdAt,
          updatedAt: new Date()
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
    let successCount = 0;
    let errorCount = 0;
    
    for (const user of mockUsers) {
      try {
        // Convert to Firebase format
        const firebaseUser = {
          id: user.id,
          email: user.email,
          role: user.role,
          isActive: user.isActive,
          lastLogin: user.lastLogin,
          createdAt: user.createdAt,
          updatedAt: new Date()
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
  console.log('🚀 Starting Mock Data to Firebase migration...');
  console.log('===============================================');
  
  try {
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
    console.log('🌐 Check your Firebase Console to see the migrated data');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
  } finally {
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

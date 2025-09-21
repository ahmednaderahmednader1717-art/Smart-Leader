const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('../models/User');
const Project = require('../models/Project');
const Contact = require('../models/Contact');

const seedData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/smart-leader-real-estate');
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Project.deleteMany({});
    await Contact.deleteMany({});
    console.log('Cleared existing data');

    // Create admin user
    const adminUser = new User({
      email: process.env.ADMIN_EMAIL || 'admin@smartleader.com',
      password: process.env.ADMIN_PASSWORD || 'admin123456',
      role: 'admin'
    });
    await adminUser.save();
    console.log('Created admin user');

    // Create sample projects
    const projects = [
      {
        title: 'Luxury Apartments in New Cairo',
        description: 'Modern luxury apartments with premium amenities and stunning city views.',
        longDescription: 'Located in the heart of New Cairo, this prestigious development represents the pinnacle of modern living. Each apartment is meticulously designed to maximize space, light, and comfort, featuring premium finishes and state-of-the-art appliances.',
        location: 'New Cairo, Egypt',
        status: 'Available',
        price: 'Starting from $150,000',
        area: '120-200 sqm',
        completionDate: 'Q2 2024',
        images: [
          {
            url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
            alt: 'Luxury Apartments in New Cairo'
          }
        ],
        features: [
          'Premium finishes and fixtures',
          'Fully equipped kitchen with modern appliances',
          'Spacious balconies with city views',
          'Central air conditioning',
          'High-speed internet ready',
          'Underground parking',
          '24/7 security and concierge service',
          'Swimming pool and fitness center',
          'Children\'s playground',
          'Landscaped gardens'
        ],
        specifications: {
          bedrooms: '2-3',
          bathrooms: '2-3',
          parking: '1-2',
          floor: '3-15',
          type: 'Apartment'
        },
        isFeatured: true
      },
      {
        title: 'Villa Complex in North Coast',
        description: 'Exclusive beachfront villas with private pools and direct beach access.',
        longDescription: 'Experience the ultimate in coastal living with our exclusive villa complex on the North Coast. Each villa offers direct beach access, private pools, and breathtaking sea views.',
        location: 'North Coast, Egypt',
        status: 'Available',
        price: 'Starting from $200,000',
        area: '250-400 sqm',
        completionDate: 'Q3 2024',
        images: [
          {
            url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
            alt: 'Villa Complex in North Coast'
          }
        ],
        features: [
          'Direct beach access',
          'Private swimming pools',
          'Spacious terraces with sea views',
          'Premium beachfront location',
          'Modern kitchen with island',
          'Master suite with walk-in closet',
          'Guest bedrooms with en-suite bathrooms',
          'Private garden area',
          'Two-car garage',
          '24/7 security'
        ],
        specifications: {
          bedrooms: '4-5',
          bathrooms: '4-5',
          parking: '2',
          floor: '2-3',
          type: 'Villa'
        },
        isFeatured: true
      },
      {
        title: 'Commercial Tower in Downtown',
        description: 'State-of-the-art commercial tower with modern office spaces.',
        longDescription: 'Located in the heart of downtown Cairo, this modern commercial tower offers premium office spaces with cutting-edge technology and amenities.',
        location: 'Downtown Cairo, Egypt',
        status: 'Completed',
        price: 'Contact for pricing',
        area: '50-500 sqm',
        completionDate: 'Q4 2023',
        images: [
          {
            url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
            alt: 'Commercial Tower in Downtown'
          }
        ],
        features: [
          'Modern office spaces',
          'High-speed elevators',
          'Central air conditioning',
          'Fiber optic internet',
          'Underground parking',
          '24/7 security',
          'Conference rooms',
          'Cafeteria and dining area',
          'Fitness center',
          'Business center'
        ],
        specifications: {
          bedrooms: 'N/A',
          bathrooms: 'Shared',
          parking: 'Available',
          floor: '1-20',
          type: 'Commercial'
        },
        isFeatured: false
      }
    ];

    for (const projectData of projects) {
      const project = new Project(projectData);
      await project.save();
    }
    console.log('Created sample projects');

    // Create sample contacts
    const contacts = [
      {
        name: 'Ahmed Hassan',
        email: 'ahmed.hassan@example.com',
        phone: '+20 123 456 7890',
        message: 'I am interested in the luxury apartments in New Cairo. Could you please provide more information about the available units and pricing?',
        status: 'new'
      },
      {
        name: 'Sarah Mohamed',
        email: 'sarah.mohamed@example.com',
        phone: '+20 123 456 7891',
        message: 'I would like to schedule a visit to the villa complex in North Coast. What are the available viewing times?',
        status: 'contacted'
      },
      {
        name: 'Omar Ali',
        email: 'omar.ali@example.com',
        phone: '+20 123 456 7892',
        message: 'I am looking for commercial office space in downtown Cairo. Please send me the floor plans and pricing details.',
        status: 'resolved'
      }
    ];

    for (const contactData of contacts) {
      const contact = new Contact(contactData);
      await contact.save();
    }
    console.log('Created sample contacts');

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedData();

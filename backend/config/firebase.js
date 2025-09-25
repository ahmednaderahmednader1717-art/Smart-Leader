
const admin = require('firebase-admin');

// Initialize Firebase Admin SDK
let db, adminInstance;

try {
  // Check if environment variables are available
  if (process.env.FIREBASE_PRIVATE_KEY && process.env.FIREBASE_CLIENT_EMAIL) {
    const serviceAccount = {
      type: "service_account",
      project_id: "smart-leader-ff5ff",
      private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
      private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      client_email: process.env.FIREBASE_CLIENT_EMAIL,
      client_id: process.env.FIREBASE_CLIENT_ID,
      auth_uri: "https://accounts.google.com/o/oauth2/auth",
      token_uri: "https://oauth2.googleapis.com/token",
      auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
      client_x509_cert_url: `https://www.googleapis.com/robot/v1/metadata/x509/${process.env.FIREBASE_CLIENT_EMAIL}`
    };

    // Initialize Firebase Admin
    if (!admin.apps.length) {
      adminInstance = admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        projectId: "smart-leader-ff5ff"
      });
    }
    
    db = admin.firestore();
    console.log('Firebase Admin initialized successfully');
  } else {
    console.log('Firebase credentials not found, using mock mode');
    // Mock Firebase for development
    db = {
      collection: () => ({
        doc: () => ({
          set: () => Promise.resolve(),
          get: () => Promise.resolve({ exists: false }),
          update: () => Promise.resolve(),
          delete: () => Promise.resolve()
        }),
        get: () => Promise.resolve({ docs: [] }),
        add: () => Promise.resolve({ id: 'mock-id' })
      })
    };
    adminInstance = { auth: () => ({ verifyIdToken: () => Promise.resolve({ uid: 'mock-uid' }) }) };
  }
} catch (error) {
  console.log('Firebase initialization failed, using mock mode:', error.message);
  // Mock Firebase for development
  db = {
    collection: () => ({
      doc: () => ({
        set: () => Promise.resolve(),
        get: () => Promise.resolve({ exists: false }),
        update: () => Promise.resolve(),
        delete: () => Promise.resolve()
      }),
      get: () => Promise.resolve({ docs: [] }),
      add: () => Promise.resolve({ id: 'mock-id' })
    })
  };
  adminInstance = { auth: () => ({ verifyIdToken: () => Promise.resolve({ uid: 'mock-uid' }) }) };
}

module.exports = { db, admin: adminInstance };

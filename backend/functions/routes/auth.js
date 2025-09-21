const express = require('express');
const admin = require('firebase-admin');
const router = express.Router();

// Register route
router.post('/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;

    // Create user in Firebase Auth
    const userRecord = await admin.auth().createUser({
      email,
      password,
      displayName: name
    });

    // Save additional user data to Firestore
    await admin.firestore().collection('users').doc(userRecord.uid).set({
      name,
      email,
      role: 'user',
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });

    res.status(201).json({
      message: 'User created successfully',
      uid: userRecord.uid
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(400).json({ message: error.message });
  }
});

// Login route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Get user from Firestore
    const userSnapshot = await admin.firestore()
      .collection('users')
      .where('email', '==', email)
      .limit(1)
      .get();

    if (userSnapshot.empty) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const userDoc = userSnapshot.docs[0];
    const userData = userDoc.data();

    // Create custom token
    const customToken = await admin.auth().createCustomToken(userDoc.id);

    res.json({
      message: 'Login successful',
      token: customToken,
      user: {
        uid: userDoc.id,
        name: userData.name,
        email: userData.email,
        role: userData.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

module.exports = router;

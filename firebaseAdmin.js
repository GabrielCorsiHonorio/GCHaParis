// firebaseAdmin.js
const admin = require('firebase-admin');
require('dotenv').config();

let serviceAccount;
try {
  serviceAccount = JSON.parse(process.env.FIREBASE_CONFIG);
} catch (error) {
  console.error('Error parsing FIREBASE_CONFIG:', error);
  throw new Error('Invalid FIREBASE_CONFIG environment variable');
}

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: 'gchaparis.appspot.com'
  });
}

const storage = admin.storage();
const db = admin.firestore();

module.exports = { storage, db };

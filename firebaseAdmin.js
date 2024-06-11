// firebaseAdmin.js
const admin = require('firebase-admin');
require('dotenv').config();
const serviceAccount = JSON.parse(process.env.FIREBASE_CONFIG);

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: 'gchaparis.appspot.com'
  });
}

const storage = admin.storage();
const db = admin.firestore();

module.exports = { storage, db };

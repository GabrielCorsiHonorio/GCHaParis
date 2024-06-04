// firebaseAdmin.js
const admin = require('firebase-admin');
const serviceAccount = require('./gchaparis-firebase-adminsdk-3o6zw-2498d1e4cf.json');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: 'gchaparis.appspot.com'
  });
}

const storage = admin.storage();
const db = admin.firestore();

module.exports = { storage, db };

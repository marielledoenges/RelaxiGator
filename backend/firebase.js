const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");

// Ensure Firebase Admin SDK is initialized only once
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://(default).firebaseio.com", // Replace with your database URL
  });
}

const db = admin.firestore();

module.exports = { admin, db }; // Export both admin and db

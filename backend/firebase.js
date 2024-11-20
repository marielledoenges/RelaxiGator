const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://(default).firebaseio.com", // Replace with your database URL
});

const db = admin.firestore();

module.exports = db;
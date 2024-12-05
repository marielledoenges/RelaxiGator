const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");

// init the app and get creds
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://(default).firebaseio.com", 
  });
}
const db = admin.firestore();

module.exports = { admin, db }; 

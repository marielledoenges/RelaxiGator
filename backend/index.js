const express = require("express");
const cors = require("cors");
require("dotenv").config();
//const bodyParser = require('body-parser');
//const admin = require('firebase-admin');

//const serviceAccount = require('./path-to-your-serviceAccountKey.json');
//const db = admin.firestore();

const app = express();
app.use(cors());
app.use(express.json());
//app.use(bodyParser.json());

// define routes here

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

app.post('/saveUserData', async (req, res) => {
  const { mentalState, productivity, nutrition, userId } = req.body;
  console.log(mentalState,productivity,nutrition,userId);
  /*try {
    // Create a reference to the user's document in Firestore
    const userDoc = db.collection('users').doc(userId);
    
    // Add data for the current user
    await userDoc.set({
      mentalState,
      productivity,
      nutrition,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    });

    res.status(200).send('Data saved successfully');
  } catch (error) {
    console.error('Error saving data:', error);
    res.status(500).send('Error saving data');
  }*/
});
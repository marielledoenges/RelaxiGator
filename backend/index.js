const express = require("express");
const cors = require("cors");
require("dotenv").config();
const db = require("./firebase");
const admin = require("firebase-admin");
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

app.post("/saveUserData", async (req, res) => {
  const { mentalState, productivity, nutrition} = req.body;
  console.log("hello")
  // Validate required fields
  if (!mentalState || !productivity || !nutrition) {
    return res.status(400).send({ error: "All fields are required, including 'day'." });
  }

  // Use a specific user ID (replace this with actual user authentication in production)
  const userId = "p7L1YfzTHouiVaG1VRuj";

  try {
    // Create the DailyLog entry
    const dailyLogData = {
      Mood: mentalState,
      Productivity: productivity,
      Calories: nutrition,
      Timestamp: new Date().toISOString(), // Optional timestamp for logging
    };

    // Reference to the user's document in the `userData` collection
    const userDocRef = db.collection("userData").doc(userId);

    // Firestore update payload
    const updateData = {};
    const dailyLogKey = `DailyLog${1}`; // Construct the key dynamically
    

    // Update the specific field within the MonthlyLog map
    await userDocRef.update({
      [`MonthlyLog.${dailyLogKey}`]: dailyLogData,
    });

    // Update the Firestore document with the new DailyLog
    await userDocRef.set(updateData, { merge: true }); // Use merge to avoid overwriting existing data

    console.log(`User data saved for DailyLog${1}:`, dailyLogData);
    res.status(200).send({ message: `DailyLog${1} added successfully!` });
  } catch (error) {
    console.error("Error saving user data:", error);
    res.status(500).send({ error: "Failed to save user data." });
  }
});
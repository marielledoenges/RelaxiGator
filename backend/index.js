const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { admin, db } = require("./firebase"); // Import admin and db from firebase.js

const app = express();
app.use(cors());
app.use(express.json());

// Middleware to verify Firebase token and get user ID
const verifyToken = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Extract Bearer token
  if (!token) {
    return res.status(401).send({ error: "Authorization token is required." });
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = { uid: decodedToken.uid, email: decodedToken.email }; // Attach user info to request
    next();
  } catch (error) {
    console.error("Token verification error:", error);
    res.status(403).send({ error: "Unauthorized access." });
  }
};

// Save user data (write/update into Firestore)
app.post("/saveUserData", verifyToken, async (req, res) => {
  const { mentalState, productivity, nutrition } = req.body;
  const userId = req.user.uid; // Retrieve userId from token verification

  if (!mentalState || !productivity || !nutrition) {
    return res.status(400).send({ error: "All fields are required." });
  }

  try {
    const dailyLogData = {
      Mood: mentalState,
      Productivity: productivity,
      Nutrition: nutrition,
      Timestamp: new Date().toISOString(),
    };

    const userDocRef = db.collection("userData").doc(userId); // Reference user's document
    const dailyLogKey = `DailyLog.${new Date().toISOString()}`; // Dynamic key for logs

    // Update Firestore with new data
    await userDocRef.set(
      { MonthlyLog: { [dailyLogKey]: dailyLogData } }, // Add/update the MonthlyLog field
      { merge: true }
    );

    console.log(`User data saved for ${userId}:`, dailyLogData);
    res.status(200).send({ message: "User data saved successfully!" });
  } catch (error) {
    console.error("Error saving user data:", error);
    res.status(500).send({ error: "Failed to save user data." });
  }
});

app.get("/getUserData", verifyToken, async (req, res) => {
  const userId = req.user.uid;

  try {
    const userDocRef = db.collection("userData").doc(userId);
    const userDoc = await userDocRef.get();

    if (!userDoc.exists) {
      // If user document does not exist, create one
      const timestamp = new Date().toISOString();
      const newUserData = {
        createdAt: timestamp,
        MonthlyLog: {
          DailyLog1: {
            Calories: "",
            Food: "",
            Mood: "",
            Productivity: "",
            Timestamp: timestamp,
          },
        },
      };

      console.log(`Creating new document for user ${userId}`);
      await userDocRef.set(newUserData); // Create the document
      console.log(`Initialized user document for ${userId}`);
      return res.status(200).send(newUserData);
    }

    // If document exists, return its data
    console.log("Retrieved user data:", userDoc.data());
    res.status(200).send(userDoc.data());
  } catch (error) {
    console.error("Error retrieving or initializing user data:", error);
    res.status(500).send({ error: "Failed to retrieve or initialize user data." });
  }
});


// Initialize user data explicitly (optional endpoint)
app.post("/initializeUser", verifyToken, async (req, res) => {
  const userId = req.user.uid;

  try {
    const userDocRef = db.collection("userData").doc(userId);

    const userDoc = await userDocRef.get();
    if (!userDoc.exists) {
      await userDocRef.set({
        createdAt: new Date().toISOString(),
        MonthlyLog: {},
      });
      console.log(`Initialized user document for ${userId}`);
    }

    res.status(200).send({ message: "User initialized successfully!" });
  } catch (error) {
    console.error("Error initializing user:", error);
    res.status(500).send({ error: "Failed to initialize user." });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

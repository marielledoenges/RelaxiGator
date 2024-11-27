const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { admin, db } = require("./firebase");

const app = express();
app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  console.log(`Incoming Request: ${req.method} ${req.url}`);
  console.log("Request Headers:", req.headers);
  console.log("Request Body:", req.body);
  next();
});

// Middleware to verify Firebase token and get user ID
const verifyToken = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).send({ error: "Authorization token is required." });
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = { uid: decodedToken.uid, email: decodedToken.email };
    next();
  } catch (error) {
    console.error("Token verification error:", error);
    res.status(403).send({ error: "Unauthorized access." });
  }
};

// Save or update user data
app.post("/saveUserData", verifyToken, async (req, res) => {
  const { mentalState, productivity, food_items, submitted, submission_date } = req.body;
  const userId = req.user?.uid;
 
  if (!mentalState || !productivity || !food_items) {
    console.error("Missing required fields in request body:", req.body);
    return res.status(400).send({ error: "All fields are required." });
  }
 
  try {
    const userDocRef = db.collection("userData").doc(userId);
    const submissionDate = new Date(submission_date);
    const monthKey = `${submissionDate.getFullYear()}${submissionDate.getMonth() + 1}Log`;
    const dayKey = `Day${submissionDate.getDate()}`;
 
    const dailyLogData = {
      Mood: mentalState,
      Productivity: productivity,
      FoodItems: food_items.split(',').map(item => item.trim()),
      Submitted: submitted,
      SubmissionDate: submission_date,
      Timestamp: new Date().toISOString(),
    };
 
    const userDoc = await userDocRef.get();
    console.log(`User data updated successfully for ${userId}`);
    if (!userDoc.exists) {
      await userDocRef.set({
        createdAt: new Date().toISOString(),
        [monthKey]: {
          [dayKey]: dailyLogData
        },
      });
 
      return res.status(200).send({ message: "User data initialized and log saved!" });
    }
 
    await userDocRef.update({
      [`${monthKey}.${dayKey}`]: dailyLogData,
    });
 
    console.log(`User data updated successfully for ${userId}`);
    res.status(200).send({ message: "User data saved successfully!" });
  } catch (error) {
    console.error("Error saving user data:", error);
    res.status(500).send({ error: "Failed to save user data." });
  }
 });
// Get user data
app.get("/getUserData", verifyToken, async (req, res) => {
  const userId = req.user.uid;

  try {
    const userDocRef = db.collection("userData").doc(userId);
    const userDoc = await userDocRef.get();

    if (!userDoc.exists) {
      console.log("No data found for this user. Initializing document...");
      const timestamp = new Date().toISOString();
      const newUserData = {
        createdAt: timestamp,
        MonthlyLog: {},
      };

      await userDocRef.set(newUserData); // Initialize the document
      console.log(`Initialized user document for ${userId}`);
      return res.status(200).send(newUserData);
    }

    console.log("Retrieved user data:", userDoc.data());
    res.status(200).send(userDoc.data());
  } catch (error) {
    console.error("Error retrieving user data:", error);
    res.status(500).send({ error: "Failed to retrieve user data." });
  }
});
app.get("/checkDailyLog", verifyToken, async (req, res) => {
  const userId = req.user.uid;

  try {
    const userDocRef = db.collection("userData").doc(userId);
    const userDoc = await userDocRef.get();

    if (!userDoc.exists) {
      console.log("No data found for this user.");
      return res.status(200).send({ logExists: false, data: null });
    }


    const userData = userDoc.data();
    const currentDate = new Date();
    const monthKey = `${currentDate.getFullYear()}${currentDate.getMonth() + 1}Log`;
    const dayKey = `Day${currentDate.getDate()}`;

    // Check for today's log
    const dailyLog = userData[monthKey]?.[dayKey];
    console.log(dailyLog)
    if (dailyLog) {
      console.log("Daily log found:", dailyLog);
      return res.status(200).send({ logExists: true, data: dailyLog });
    } else {
      console.log("No daily log found for today.");
      return res.status(200).send({ logExists: false, data: null });
    }
  } catch (error) {
    console.error("Error checking daily log:", error);
    res.status(500).send({ error: "Failed to check daily log." });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

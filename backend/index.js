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
  const { Mood, Productivity, JournalEntry, FoodItems, Submitted, SubmissionDate } = req.body;
  const userId = req.user?.uid;

  if (!Mood || !Productivity) {
    console.error("Validation Error: Mood and Productivity are required.");
    return res.status(400).send({ error: "Mental state and productivity are required." });
  }

  try {
    const userDocRef = db.collection("userData").doc(userId);
    const submissionDate = new Date(SubmissionDate);
    const monthKey = `${submissionDate.getFullYear()}${submissionDate.getMonth() + 1}Log`;
    const dayKey = `Day${submissionDate.getDate()}`;

    const userDoc = await userDocRef.get();
    const existingData = userDoc.exists ? userDoc.data()[monthKey]?.[dayKey] : {};

    const dailyLogData = {
      Mood,
      Productivity,
      JournalEntry: JournalEntry || existingData?.JournalEntry || "",
      FoodItems: existingData?.FoodItems || [], // Retain existing food items
      Submitted,
      SubmissionDate,
      Timestamp: new Date().toISOString(),
    };

    if (!userDoc.exists) {
      console.log(`Creating new document for user: ${userId}`);
      await userDocRef.set({
        createdAt: new Date().toISOString(),
        [monthKey]: {
          [dayKey]: dailyLogData,
        },
      });
    } else {
      console.log(`Updating existing document for user: ${userId}`);
      await userDocRef.update({
        [`${monthKey}.${dayKey}`]: dailyLogData,
      });
    }

    console.log(`Daily log saved successfully for user: ${userId}`);
    res.status(200).send({ message: "Daily log saved successfully!" });
  } catch (error) {
    console.error("Error saving daily log:", error);
    res.status(500).send({ error: "Failed to save daily log." });
  }
});


// Add food to daily log
app.post("/addFoodToDailyLog", verifyToken, async (req, res) => {
  const { Food, Calories = "N/A", Protein = "N/A" } = req.body;
  const userId = req.user?.uid;

  if (!Food) {
    return res.status(400).send({ error: "Food name is required." });
  }

  try {
    const userDocRef = db.collection("userData").doc(userId);
    const currentDate = new Date();
    const monthKey = `${currentDate.getFullYear()}${currentDate.getMonth() + 1}Log`;
    const dayKey = `Day${currentDate.getDate()}`;
    const foodEntry = { Food, Calories, Protein };

    const userDoc = await userDocRef.get();
    if (!userDoc.exists) {
      // Initialize the daily log if it doesn't exist
      await userDocRef.set({
        [monthKey]: {
          [dayKey]: {
            FoodItems: [foodEntry],
          },
        },
      });
    } else {
      // Update the FoodItems array
      await userDocRef.update({
        [`${monthKey}.${dayKey}.FoodItems`]: admin.firestore.FieldValue.arrayUnion(foodEntry),
      });
    }

    res.status(200).send({ message: "Food item added to daily log!" });
  } catch (error) {
    console.error("Error adding food to daily log:", error);
    res.status(500).send({ error: "Failed to add food to daily log." });
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
      return res.status(200).send(newUserData);
    }

    res.status(200).send(userDoc.data());
  } catch (error) {
    console.error("Error retrieving user data:", error);
    res.status(500).send({ error: "Failed to retrieve user data." });
  }
});

// Fetch all goals for a user
app.get("/getGoals", verifyToken, async (req, res) => {
  const userId = req.user?.uid;

  try {
    const userDocRef = db.collection("userData").doc(userId);
    const userDoc = await userDocRef.get();

    if (!userDoc.exists) {
      return res.status(200).send({ goals: {} });
    }

    const data = userDoc.data();
    const goals = data?.goals || {};
    res.status(200).send({ goals });
  } catch (error) {
    console.error("Error fetching goals:", error);
    res.status(500).send({ error: "Failed to fetch goals." });
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

    const currentDate = new Date();
    const monthKey = `${currentDate.getFullYear()}${currentDate.getMonth() + 1}Log`;
    const dayKey = `Day${currentDate.getDate()}`;

    const userData = userDoc.data();
    const dailyLog = userData[monthKey]?.[dayKey];
    if (dailyLog) {
      return res.status(200).send({ logExists: true, data: dailyLog });
    }

    res.status(200).send({ logExists: false, data: null });
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

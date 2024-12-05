const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { admin, db } = require("./firebase");
const app = express();
app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
  next();
});

 // so this is supposed to get the token needed for all backedn function and gets the required info from it
 // referenced from: https://dev.to/earthcomfy/build-authentication-using-firebase-react-express-28ig?comments_sort=oldest
 // to understand mechanism for firebase auth
const checktoken = async (req, res, next) => {
  const userkey = req.headers.authorization?.split(" ")[1];
  try {
    const recievedtoken = await admin.auth().verifyIdToken(userkey);
    req.user = { uid: recievedtoken.uid, email: recievedtoken.email };
    next();
  } catch (error) {
    console.error("cant verify token", error);
    res.status(403).send({ error: "cant verify token" });
  }
};

// major function that saves the data to db based on current month/data and gets relevant data
app.post("/dbdatasave", checktoken, async (req, res) => {
  const { Mood, Productivity, JournalEntry, Submitted, SubmissionDate } = req.body;
  const dbID = req.user?.uid;

  if (!Mood || !Productivity) {
    console.error("Mood and Productivity needed to save log");
    return res.status(400).send({ error: "Mood and Productivity needed to save log" });
  }

  try {
    const docreference = db.collection("userData").doc(dbID);
    const submissionDate = new Date(SubmissionDate || new Date());
    const monthKey = `${submissionDate.getFullYear()}${submissionDate.getMonth() + 1}Log`;
    const dayKey = `Day${submissionDate.getDate()}`;

    const getDBdoc = await docreference.get();
    const existingData = getDBdoc.exists ? getDBdoc.data()[monthKey]?.[dayKey] : {};

    const updatedData = {
      Mood,
      Productivity,
      JournalEntry: JournalEntry || existingData?.JournalEntry || "",
      FoodItems: existingData?.FoodItems || [],
      Submitted: Submitted || false,
      SubmissionDate: SubmissionDate || new Date().toISOString(),
      Timestamp: new Date().toISOString(),
    };

    if (!getDBdoc.exists) {
      await docreference.set({
        createdAt: new Date().toISOString(),
        [monthKey]: {
          [dayKey]: updatedData,
        },
      });
    } else {
      await docreference.update({
        [`${monthKey}.${dayKey}`]: updatedData,
      });
    }
    res.status(200).send({ message: "Logged Successfuly" });
  } catch (error) {
    console.error("Can't save info", error);
    res.status(500).send({ error: "Can't save info" });
  }
});

app.post("/dbaddfood", checktoken, async (req, res) => {
  const { Food, Calories = 0, Protein = "N/A" } = req.body;
  const dbID = req.user?.uid;

  if (!Food) {
    return res.status(400).send({ error: "No food name" });
  }

  const sanitizedFoodEntry = {
    Food,
    Calories: isNaN(Number(Calories)) ? 0 : Number(Calories),
    Protein: isNaN(Number(Protein)) ? "N/A" : Number(Protein),
  };

  try {
    const docreference = db.collection("userData").doc(dbID);
    const getdate = new Date();
    const monthKey = `${getdate.getFullYear()}${getdate.getMonth() + 1}Log`;
    const dayKey = `Day${getdate.getDate()}`;

    const getDBdoc = await docreference.get();
    const existingData = getDBdoc.exists ? getDBdoc.data() : {};
    const monthData = existingData[monthKey] || {};
    const dayData = monthData[dayKey] || {};
    // daily update for food
    const updatedFoodItems = dayData.FoodItems
      ? [...dayData.FoodItems, sanitizedFoodEntry]
      : [sanitizedFoodEntry];

    //  get daily cals
    const totalDailyCals = updatedFoodItems.reduce(
      (sum, item) => sum + (isNaN(Number(item.Calories)) ? 0 : Number(item.Calories)),
      0
    );

    //get monthly cals
    const totalMonthlyCals = Object.entries(monthData).reduce((sum, [key, value]) => {
      if (key.startsWith("Day") && value?.totalDailyCals) {
        return sum + value.totalDailyCals;
      }
      return sum;
    }, totalDailyCals);

    //  updates db
    await docreference.set(
      {
        [monthKey]: {
          ...monthData,
          totalMonthlyCals,
          [dayKey]: {
            ...dayData,
            FoodItems: updatedFoodItems,
            totalDailyCals, 
          },
        },
      },
      { merge: true }
    );

    res.status(200).send({ message: "Food items updated" });
  } catch (error) {
    console.error("Couldnt add food", error);
    res.status(500).send({ error: "Couldn't add food" });
  }
});

// used to see if submitted to make sure no double render
app.get("/dbchecklog", checktoken, async (req, res) => {
  const dbID = req.user.uid;

  try {
    const docreference = db.collection("userData").doc(dbID);
    const getDBdoc = await docreference.get();

    if (!getDBdoc.exists) {
      return res.status(200).send({ logExists: false, data: null });
    }

    const getdate = new Date();
    const monthKey = `${getdate.getFullYear()}${getdate.getMonth() + 1}Log`;
    const dayKey = `Day${getdate.getDate()}`;

    const userData = getDBdoc.data();
    const dailyLog = userData[monthKey]?.[dayKey];
    if (dailyLog) {
      return res.status(200).send({ logExists: true, data: dailyLog });
    }

    res.status(200).send({ logExists: false, data: null });
  } catch (error) {
    res.status(500).send({ error: "Couldn't see daily log" });
  }
});

// function that helps the ui see the log
app.get("/dbuserdata", checktoken, async (req, res) => {
  const dbID = req.user.uid;

  try {
    const docreference = db.collection("userData").doc(dbID);
    const getDBdoc = await docreference.get();

    if (!getDBdoc.exists) {
      const timestamp = new Date().toISOString();
      const newUserData = {
        createdAt: timestamp,
        MonthlyLog: {},
      };

      await docreference.set(newUserData);
      return res.status(200).send(newUserData);
    }

    res.status(200).send(getDBdoc.data());
  } catch (error) {
    res.status(500).send({ error: "Couldn't get user data" });
  }
});

// needed to display goals on UI
app.get("/dbgoals", checktoken, async (req, res) => {
  const dbID = req.user?.uid;

  try {
    const docreference = db.collection("userData").doc(dbID);
    const getDBdoc = await docreference.get();

    if (!getDBdoc.exists) {
      return res.status(200).send({ goals: {} });
    }

    const data = getDBdoc.data();
    const goals = data?.goals || {};
    res.status(200).send({ goals });
  } catch (error) {
    res.status(500).send({ error: "Can't find goals" });
  }
});
// Add a goal to the database
app.post("/addGoal", verifyToken, async (req, res) => {
  const { goalText, goalDate, category, goalValue } = req.body;
  const userId = req.user?.uid;

  if (!goalText || !goalDate || !category) {
    return res.status(400).send({ error: "All fields are required." });
  }

  try {
    const userDocRef = db.collection("userData").doc(userId);
    const userDoc = await userDocRef.get();

    const goalData = {
      goalText,
      goalDate,
      category, // Work or Nutrition
      goalValue: goalValue || null, // Numeric value if provided
      timestamp: new Date().toISOString(), // Optional metadata
    };

    let goalKey;
    if (userDoc.exists) {
      const userData = userDoc.data();
      const goals = userData.goals || {};
      const goalCount = Object.keys(goals).length;
      goalKey = `goal${goalCount + 1}`; // Next sequential goal key
    } else {
      goalKey = "goal1"; // First goal if no goals exist
    }

    await userDocRef.set(
      {
        goals: {
          [goalKey]: goalData,
        },
      },
      { merge: true }
    );

    console.log(`Goal added successfully for user ${userId}`);
    res.status(200).send({ message: "Goal added successfully!" });
  } catch (error) {
    console.error("Error adding goal:", error);
    res.status(500).send({ error: "Failed to add goal." });
  }
});

// this is used to see if goals met
app.post("/goalevaluator", checktoken, async (req, res) => {
  const dbID = req.user?.uid;

  try { 
    // basic code to get the user data, load in for each backend func
    const docreference = db.collection("userData").doc(dbID);
    const getDBdoc = await docreference.get();

    if (!getDBdoc.exists) {
      return res.status(404).send({ error: "failed to load data" });
    }

    const userData = getDBdoc.data();
    const getdate = new Date();
    const monthKey = `${getdate.getFullYear()}${getdate.getMonth() + 1}Log`;
    // same as save data backend to access the monthly thing
    const totalMonthlyCals = userData[monthKey]?.totalMonthlyCals;

    if (!totalMonthlyCals || !userData.goals) {
      return res.status(400).send({ error: "Missing data for goal evaluation." });
    }
    const updatedGoals = {};
    for (const [goalId, goal] of Object.entries(userData.goals)) {
      const { category, goalValue } = goal;
      // so this updates goals based on nutiriton met
      if (category === "Nutrition" && totalMonthlyCals >= goalValue) {
        updatedGoals[goalId] = { ...goal, goalAchieved: true };
      } else {
        updatedGoals[goalId] = { ...goal, goalAchieved: false };
      }
    }

    await docreference.update({ goals: updatedGoals });

    res.status(200).send({ message: "Should work for goals", updatedGoals });
  } catch (error) {
    res.status(500).send({ error: "error failed, check logs" });
  }
});

app.post("/dbaddgoal", checktoken, async (req, res) => {
  const { goalText, goalDate, category, goalValue } = req.body;
  const dbID = req.user?.uid;

  if (!goalText || !goalDate || !category) {
    return res.status(400).send({ error: "All fields need to be filled." });
  }

  try {
    const docreference = db.collection("userData").doc(dbID);
    const getDBdoc = await docreference.get();

    const goalData = {
      goalText,
      goalDate,
      category, 
      goalValue: goalValue || null, 
      timestamp: new Date().toISOString(), 
      goalAchieved: false,
    };

    let goalKey;
    if (getDBdoc.exists) {
      const userData = getDBdoc.data();
      const goals = userData.goals || {};
      const goalCount = Object.keys(goals).length;
      goalKey = `goal${goalCount + 1}`;
    } else {
      goalKey = "goal1"; 
    }

    await docreference.set(
      {
        goals: {
          [goalKey]: goalData,
        },
      },
      { merge: true }
    );
    res.status(200).send({ message: "Goal added" });
  } catch (error) {
    res.status(500).send({ error: "See logs goal failed" });
  }
});
app.get("/dbfoodinfo", checktoken, async (req, res) => {
  const dbID = req.user.uid;

  try {
// usual data getter
    const docreference = db.collection("userData").doc(dbID);
    const getDBdoc = await docreference.get();

    if (!getDBdoc.exists) {
      return res.status(200).send({ logExists: false, data: [] });
    }

    const getdate = new Date();
    const monthKey = `${getdate.getFullYear()}${getdate.getMonth() + 1}Log`;
    const dayKey = `Day${getdate.getDate()}`;

    const userData = getDBdoc.data();
    const dailyLog = userData[monthKey]?.[dayKey]?.FoodItems || [];

    if (!dailyLog.length) {
      return res.status(200).send({ logExists: false, data: [] });
    }

    res.status(200).send({ logExists: true, data: dailyLog });
  } catch (error) {
    res.status(500).send({ error: "no food log" });
  }
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend Server ${PORT}`);
});

const firebase = require('firebase/app');
require('firebase/firestore');

const db = firebase.firestore();

async function getUserData(userId) {
  const userDoc = await db.collection('userLogs').doc(userId).get();
  return userDoc.exists ? userDoc.data() : null;
}

async function getFoodRecommendations() {
  const foodQuery = await db.collection('foodRecommendations').get();
  return foodQuery.docs.map(doc => doc.data());
}

async function getMentalHealthTips() {
  const tipsQuery = await db.collection('mentalHealthTips').get();
  return tipsQuery.docs.map(doc => doc.data());
}

async function getMonthlyGoals(userId) {
  const goalsDoc = await db.collection('monthlyGoals').doc(userId).get();
  return goalsDoc.exists ? goalsDoc.data() : null;
}

async function generateRecommendations(userId) {
  const userData = await getUserData(userId);
  if (!userData) return null;

  const [foodItems, mentalHealthTips] = await Promise.all([
    getFoodRecommendations(),
    getMentalHealthTips()
  ]);

  const monthlyGoals = await getMonthlyGoals(userId);

  const selectedFoods = foodItems.filter(item => item.nutritionalValue >= userData.nutritionTarget);
  const selectedTips = mentalHealthTips.slice(0, 3);

  const reminders = [];
  if (monthlyGoals) {
    if (userData.steps < monthlyGoals.stepsTarget) {
      reminders.push("You're behind on your step count. Try a short walk!");
    }
    if (userData.waterIntake < monthlyGoals.waterTarget) {
      reminders.push("Remember to drink more water today.");
    }
    if (userData.meditationMinutes < monthlyGoals.meditationTarget) {
      reminders.push("A quick meditation session might help you reach your goal.");
    }
  }

  return {
    foodItems: selectedFoods,
    mentalHealthTips: selectedTips,
    reminders: reminders
  };
}

generateRecommendations('someUserId')
  .then(recommendations => {
    if (recommendations) {
      console.log('Food Suggestions:', recommendations.foodItems);
      console.log('Mental Health Tips:', recommendations.mentalHealthTips);
      console.log('Reminders:', recommendations.reminders);
    } else {
      console.log('User data not found');
    }
  })
  .catch(error => {
    console.error('Error generating recommendations:', error);
  });

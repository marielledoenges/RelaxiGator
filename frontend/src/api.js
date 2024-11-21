import { getAuth } from "firebase/auth";

const fetchWithAuth = async (url, options = {}) => {
  const auth = getAuth();
  const user = auth.currentUser;

  if (!user) {
    throw new Error("User is not authenticated");
  }

  const idToken = await user.getIdToken(); // Get the user's ID token

  return fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${idToken}`, // Include the token in the Authorization header
      "Content-Type": "application/json",
    },
  });
};

export const saveUserData = async (data) => {
  const response = await fetchWithAuth("http://localhost:5000/saveUserData", {
    method: "POST",
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to save user data");
  }

  return response.json();
};

export const getUserData = async (userID) => {
  const response = await fetchWithAuth(`http://localhost:5000/getUserData/${userID}`);

  if (!response.ok) {
    throw new Error("Failed to fetch user data");
  }

  return response.json();
};

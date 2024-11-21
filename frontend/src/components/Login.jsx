import React, { useState, useEffect } from "react";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { auth, googleProvider } from "../firebase/firebase";
import { useNavigate } from "react-router-dom";

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isCreatingAccount, setIsCreatingAccount] = useState(false);

  const navigate = useNavigate(); // Initialize navigation

  useEffect(() => {
    setError("");
  }, [isCreatingAccount]);

  // Password validation function
  const validatePassword = (password) => {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  };

  // Function to send token to backend
  const sendTokenToBackend = async (token) => {
    try {
      const response = await fetch("http://localhost:5000/getUserData", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Pass the Firebase ID token
        },
      });

      if (!response.ok) {
        const backendError = await response.json();
        throw new Error(
          backendError.error || "Failed to authenticate with the backend"
        );
      }

      const data = await response.json();
      console.log("User data from backend:", data);

      onLogin(data.userId);
      navigate("/home"); // Navigate to the HomePage
    } catch (err) {
      console.error("Error sending token to backend:", err);
      setError(err.message || "Failed to authenticate. Please try again.");
    }
  };

  // Handle Email/Password login or account creation
  const handleLogin = async (e) => {
    e.preventDefault();

    if (isCreatingAccount && !validatePassword(password)) {
      setError(
        "Password must be at least 8 characters long and contain a capital letter, lowercase letter, number, and symbol."
      );
      return;
    }

    try {
      let userCredential;

      if (isCreatingAccount) {
        userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        console.log("Account created successfully:", userCredential.user);
      } else {
        userCredential = await signInWithEmailAndPassword(auth, email, password);
        console.log("Logged in successfully:", userCredential.user);
      }

      const token = await userCredential.user.getIdToken();
      await sendTokenToBackend(token);
    } catch (err) {
      console.error("Authentication error:", err.code, err.message);
      setError(
        `Error: ${err.code || "unknown"} - ${err.message || "An error occurred"}`
      );
    }
  };

  // Handle Google login
  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const token = await result.user.getIdToken();
      console.log("Logged in with Google successfully:", result.user);
      await sendTokenToBackend(token);
    } catch (err) {
      console.error("Google login error:", err.code, err.message);
      setError(
        `Google Login Error: ${err.code || "unknown"} - ${
          err.message || "An error occurred"
        }`
      );
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen font-mono text-slate-300">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-sm p-8 bg-gradient-to-br from-gray-800 via-gray-700 to-gray-900 rounded-lg shadow-2xl"
      >
        <h2 className="text-2xl mb-6">
          {isCreatingAccount ? "Create Account" : "Login"}
        </h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <div className="mb-4">
          <label className="block text-slate-400">Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border rounded w-full py-2 px-3"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-slate-400">Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border rounded w-full py-2 px-3"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 transition ease-in duration-100 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          {isCreatingAccount ? "Create Account" : "Login"}
        </button>

        <div className="mt-4">
          <button
            type="button"
            onClick={() => {
              setIsCreatingAccount(!isCreatingAccount);
              setError("");
            }}
            className="text-blue-500 hover:underline"
          >
            {isCreatingAccount
              ? "Already have an account? Login"
              : "Create an Account"}
          </button>
        </div>

        <div className="mt-4 flex justify-center">
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="flex items-center justify-center bg-white shadow-sm rounded-lg p-2 transition ease-in duration-100 hover:bg-slate-400"
          >
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg"
              alt="Google logo"
              className="h-6 w-6"
            />
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;

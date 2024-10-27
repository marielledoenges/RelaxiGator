import React, { useState, useEffect } from "react";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { auth, googleProvider } from "../firebase/firebase";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isCreatingAccount, setIsCreatingAccount] = useState(false); // Track account creation mode

  const navigate = useNavigate(); // Initialize navigate

  // Clear error when toggling between login and account creation modes
  useEffect(() => {
    setError("");
  }, [isCreatingAccount]);

  // Password validation function
  const validatePassword = (password) => {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  };

  // Handle Email/Password login or account creation
  const handleLogin = async (e) => {
    e.preventDefault();

    // Check password requirements if creating an account
    if (isCreatingAccount && !validatePassword(password)) {
      setError(
        "Password must be at least 8 characters long and contain a capital letter, lowercase letter, number, and symbol."
      );
      return;
    }

    try {
      if (isCreatingAccount) {
        await createUserWithEmailAndPassword(auth, email, password);
        console.log("Account created successfully");
        navigate("/home"); // Redirect to HomePage after successful account creation
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        console.log("Logged in successfully");
        navigate("/home"); // Redirect to HomePage after successful login
      }
    } catch (err) {
      if (isCreatingAccount) {
        if (err.code === "auth/email-already-in-use") {
          setError(
            "An account with this email already exists. Please log in instead."
          );
        } else if (err.code === "auth/weak-password") {
          setError("Password should be at least 6 characters.");
        } else {
          setError("Failed to create account. Check your email and password.");
        }
      } else {
        if (err.code === "auth/user-not-found") {
          setError(
            "No account found with this email. Please create an account."
          );
        } else if (err.code === "auth/wrong-password") {
          setError("Incorrect password. Please try again.");
        } else {
          setError("Failed to log in. Check your email and password.");
        }
      }
    }
  };

  // Handle Google login
  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      console.log("Logged in with Google successfully");
      navigate("/home"); // Redirect to HomePage after Google login
    } catch (err) {
      setError("Failed to log in with Google.");
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

        {/* Toggle between Login and Create Account */}
        <div className="mt-4">
          <button
            type="button"
            onClick={() => setIsCreatingAccount(!isCreatingAccount)}
            className="text-blue-500 hover:underline"
          >
            {isCreatingAccount
              ? "Already have an account? Login"
              : "Create an Account"}
          </button>
        </div>

        {/* Google login button with Google logo */}
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

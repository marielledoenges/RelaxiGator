import React, { useState } from "react";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { auth, googleProvider } from "../firebase/firebase";

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isCreatingAccount, setIsCreatingAccount] = useState(false); // Track account creation mode

  // Handle Email/Password login or account creation
  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors
    try {
      if (isCreatingAccount) {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        console.log("Account created successfully:", userCredential.user);
        onLogin(); // Trigger onLogin to set isAuthenticated in App
      } else {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        console.log("Logged in successfully:", userCredential.user);
        onLogin(); // Trigger onLogin to set isAuthenticated in App
      }
    } catch (err) {
      console.error("Error Code:", err.code);
      console.error("Error Message:", err.message);
      setError(
        isCreatingAccount
          ? `Failed to create account: ${err.message}`
          : `Failed to log in: ${err.message}`
      );
    }
  };

  // Handle Google login
  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      console.log("Logged in with Google successfully:", result.user);
      onLogin(); // Trigger onLogin to set isAuthenticated in App
    } catch (err) {
      console.error("Google login error - Code:", err.code);
      console.error("Google login error - Message:", err.message);
      setError(`Failed to log in with Google: ${err.message}`);
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
            onClick={() => {
              setIsCreatingAccount(!isCreatingAccount);
              setError(""); // Clear error when toggling modes
            }}
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

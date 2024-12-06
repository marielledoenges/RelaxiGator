import React, { useState, useEffect } from "react";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { auth, googleProvider } from "../firebase/firebase";
import { useNavigate } from "react-router-dom";

const Login = ({ checklogin }) => {
  const [email, emailhook] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isCreatingAccount, setIsCreatingAccount] = useState(false);

  const navigate = useNavigate(); 

  useEffect(() => {
    setError("");
  }, [isCreatingAccount]);

  const correctpassword = (password) => {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  };

 // gets token and send backend, needed for user
  const backendToken = async (token) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/dbuserdata`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const backendError = await response.json();
        throw new Error(
          backendError.error || "Failed"
        );
      }

      const data = await response.json();

      checklogin(data.userId);
      navigate("/home");
    } catch (err) {
      setError(err.message || "Failed to authenticate. Please try again.");
    }
  };

  // Handle Email/Password login or account creation
  const handleLogin = async (e) => {
    e.preventDefault();

    if (isCreatingAccount && !correctpassword(password)) {
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
      } else {
        userCredential = await signInWithEmailAndPassword(auth, email, password);
      }

      const token = await userCredential.user.getIdToken();
      await backendToken(token);
    } catch (err) {
     
      setError(
        `Error: ${err.code || "unknown"} - ${err.message || "error"}`
      );
    }
  };

  // logs the google acc
  const googleAccAuthenticate = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const token = await result.user.getIdToken();
      await backendToken(token);
    } catch (err) {
      setError(
        `Google Login Error: ${err.code || "unknown"} - ${
          err.message || "error"
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
        <h2 className="text-2xl mb-6 text-center text-gray-300">
          {isCreatingAccount ? "Create Account" : "Login"}
        </h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <div className="mb-4">
          <label className="block text-gray-400 mb-2">Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => emailhook(e.target.value)}
            placeholder="Enter your email"
            className="w-full px-4 py-2 border rounded-lg bg-gray-900 text-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-400 mb-2">Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            className="w-full px-4 py-2 border rounded-lg bg-gray-900 text-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 transition ease-in duration-100 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          {isCreatingAccount ? "Create Account" : "Login"}
        </button>

        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={() => {
              setIsCreatingAccount(!isCreatingAccount);
              setError("");
            }}
            className="text-blue-400 hover:underline"
          >
            {isCreatingAccount
              ? "Already have an account? Login"
              : "Create an Account"}
          </button>
        </div>

        <div className="mt-4 flex justify-center">
          <button
            type="button"
            onClick={googleAccAuthenticate}
            className="flex items-center justify-center bg-slate-600 shadow-sm rounded-lg p-2 transition ease-in duration-100 hover:bg-slate-500"
          >
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg"
              alt="Google logo"

            />
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;

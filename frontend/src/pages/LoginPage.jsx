import React from "react";
import Login from "../components/Login"; // Importing the Login component

const LoginPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500">
      <Login /> {/* Render the Login component here */}
    </div>
  );
};

export default LoginPage;

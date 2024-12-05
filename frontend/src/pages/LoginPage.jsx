import React from "react";
import Login from "../components/Login";

const LoginPage = ({ checklogin }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500">
      <Login checklogin={checklogin} />
    </div>
  );
};

export default LoginPage;
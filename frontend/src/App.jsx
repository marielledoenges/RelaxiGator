import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { useState } from "react";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import NutritionPage from "./pages/NutritionPage";
import NavBar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import CalendarPage from "./pages/CalendarPage";
import GoalsPage from "./pages/GoalsPage";

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userID, setUserID] = useState(null); // State to store userID

    // Function to handle login, setting isAuthenticated to true and storing userID
    const handleLogin = (retrievedUserID) => {
        setIsAuthenticated(true);
        setUserID(retrievedUserID); // Store the userID after successful login
    };

    // Function to handle logout, clearing userID and setting isAuthenticated to false
    const handleLogout = () => {
        setIsAuthenticated(false);
        setUserID(null); // Clear the userID on logout
    };

    return (
        <Router>
            <div className="flex">
                {/* Render NavBar only when authenticated */}
                {isAuthenticated && <NavBar onLogout={handleLogout} />}

                {/* Main content area */}
                <div className="flex-grow">
                    <Routes>
                        {/* Route for login page; redirect to home if already authenticated */}
                        <Route
                            path="/login"
                            element={
                                isAuthenticated ? (
                                    <Navigate to="/home" />
                                ) : (
                                    <LoginPage onLogin={(userID) => handleLogin(userID)} /> // Pass handleLogin to retrieve userID
                                )
                            }
                        />
                        {/* Protected Nutrition page */}
                        <Route
                            path="/nutrition"
                            element={
                                <ProtectedRoute isAuthenticated={isAuthenticated}>
                                    <NutritionPage userID={userID} /> {/* Pass userID to NutritionPage */}
                                </ProtectedRoute>
                            }
                        />
                        {/* Protected Calendar page */}
                        <Route
                            path="/calendar"
                            element={
                                <ProtectedRoute isAuthenticated={isAuthenticated}>
                                    <CalendarPage userID={userID} /> {/* Pass userID to CalendarPage */}
                                </ProtectedRoute>
                            }
                        />
                        {/* Protected Goals page */}
                        <Route
                            path="/goals"
                            element={
                                <ProtectedRoute isAuthenticated={isAuthenticated}>
                                    <GoalsPage userID={userID} /> {/* Pass userID to GoalsPage */}
                                </ProtectedRoute>
                            }
                        />
                        {/* Protected Home page */}
                        <Route
                            path="/home"
                            element={
                                isAuthenticated ? (
                                    <HomePage userID={userID} /> // Pass userID to HomePage
                                ) : (
                                    <Navigate to="/login" />
                                )
                            }
                        />
                        {/* Default route redirects to login */}
                        <Route
                            path="/"
                            element={<Navigate to={isAuthenticated ? "/home" : "/login"} />}
                        />
                    </Routes>
                </div>
            </div>
        </Router>
    );
}

export default App;
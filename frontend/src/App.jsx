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
    const [userID, setUserID] = useState(null); 
    // this is where the user Id token is passed to backend
   
    const handleLogin = (retrievedUserID) => {
        setIsAuthenticated(true);
        setUserID(retrievedUserID);
    };

    // to remove cookies
    const handleLogout = () => {
        setIsAuthenticated(false);
        setUserID(null); 
    };

    return (
        <Router>
            <div className="flex">
             
                {isAuthenticated && <NavBar onLogout={handleLogout} />}

                <div className="flex-grow">
                    <Routes>
                       
                        <Route
                            path="/login"
                            element={
                                isAuthenticated ? (
                                    <Navigate to="/home" />
                                ) : (
                                    <LoginPage onLogin={(userID) => handleLogin(userID)} />
                                )
                            }
                        />
                        
                        <Route
                            path="/nutrition"
                            element={
                                <ProtectedRoute isAuthenticated={isAuthenticated}>
                                    <NutritionPage userID={userID} /> 
                                </ProtectedRoute>
                            }
                        />
                      
                        <Route
                            path="/calendar"
                            element={
                                <ProtectedRoute isAuthenticated={isAuthenticated}>
                                    <CalendarPage userID={userID} /> 
                                </ProtectedRoute>
                            }
                        />
                       
                        <Route
                            path="/goals"
                            element={
                                <ProtectedRoute isAuthenticated={isAuthenticated}>
                                    <GoalsPage userID={userID} /> 
                                </ProtectedRoute>
                            }
                        />
                    
                        <Route
                            path="/home"
                            element={
                                isAuthenticated ? (
                                    <HomePage userID={userID} /> 
                                ) : (
                                    <Navigate to="/login" />
                                )
                            }
                        />
             
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
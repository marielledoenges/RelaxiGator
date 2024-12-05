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
    const [authVar, authHook] = useState(false);
    const [userID, setUserID] = useState(null); 
    // this is where the user Id token is passed to backend
   
    const handleLogin = (retrievedUserID) => {
        authHook(true);
        setUserID(retrievedUserID);
    };

    // to remove cookies
    const handleLogout = () => {
        authHook(false);
        setUserID(null); 
    };

    return (
        <Router>
            <div className="flex">
             
                {authVar && <NavBar onLogout={handleLogout} />}

                <div className="flex-grow">
                    <Routes>
                       
                        <Route
                            path="/login"
                            element={
                                authVar ? (
                                    <Navigate to="/home" />
                                ) : (
                                    <LoginPage onLogin={(userID) => handleLogin(userID)} />
                                )
                            }
                        />
                        
                        <Route
                            path="/nutrition"
                            element={
                                <ProtectedRoute authVar={authVar}>
                                    <NutritionPage userID={userID} /> 
                                </ProtectedRoute>
                            }
                        />
                      
                        <Route
                            path="/calendar"
                            element={
                                <ProtectedRoute authVar={authVar}>
                                    <CalendarPage userID={userID} /> 
                                </ProtectedRoute>
                            }
                        />
                       
                        <Route
                            path="/goals"
                            element={
                                <ProtectedRoute authVar={authVar}>
                                    <GoalsPage userID={userID} /> 
                                </ProtectedRoute>
                            }
                        />
                    
                        <Route
                            path="/home"
                            element={
                                authVar ? (
                                    <HomePage userID={userID} /> 
                                ) : (
                                    <Navigate to="/login" />
                                )
                            }
                        />
             
                        <Route
                            path="/"
                            element={<Navigate to={authVar ? "/home" : "/login"} />}
                        />
                    </Routes>
                </div>
            </div>
        </Router>
    );
}

export default App;
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { useState } from 'react';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import NavBar from './components/Navbar';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Function to handle login, setting isAuthenticated to true
  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  // Function to handle logout, setting isAuthenticated to false
  const handleLogout = () => {
    setIsAuthenticated(false);
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
                isAuthenticated ? <Navigate to="/home" /> : <LoginPage onLogin={handleLogin} />
              }
            />
            {/* Protected home page; redirect to login if not authenticated */}
            <Route
              path="/home"
              element={
                isAuthenticated ? (
                  <HomePage />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
            {/* Default route redirects to login */}
            <Route path="/" element={<Navigate to={isAuthenticated ? "/home" : "/login"} />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;

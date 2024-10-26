import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import NutritionPage from './pages/NutritionPage';
import ProtectedRoute from './components/ProtectedRoute'; // Import the ProtectedRoute

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/nutrition" element={<NutritionPage />} />
        <Route path="/login" element={<LoginPage />} />
        {/* Protect the /home route */}
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />
        {/* Redirect to login if no other route is matched */}
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;

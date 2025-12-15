/**
 * Main App Component
 * Root component that handles routing and layout
 */

import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { useStudy } from './context/StudyContext';

// Components
import Navbar from './components/Navbar';
import LoginPage from './pages/LoginPage';
import StudyPage from './pages/StudyPage';
import LoadingSpinner from './components/LoadingSpinner';
import Toast from './components/Toast';

function App() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { error, clearError } = useStudy();

  // Show loading spinner while checking auth
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Error Toast */}
      {error && (
        <Toast
          message={error}
          type="error"
          onClose={clearError}
        />
      )}

      <Routes>
        {/* Public route - Login */}
        <Route
          path="/login"
          element={
            isAuthenticated ? <Navigate to="/" replace /> : <LoginPage />
          }
        />

        {/* Protected routes */}
        <Route
          path="/*"
          element={
            isAuthenticated ? (
              <>
                <Navbar />
                <main className="container mx-auto px-4 py-8 max-w-5xl">
                  <StudyPage />
                </main>
              </>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
      </Routes>
    </div>
  );
}

export default App;

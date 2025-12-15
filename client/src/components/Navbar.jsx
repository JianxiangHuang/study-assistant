/**
 * Navbar Component
 * Navigation bar with user info and logout
 */

import { BookOpen, LogOut, User, History } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useStudy } from '../context/StudyContext';

function Navbar() {
  const { user, logout } = useAuth();
  const { resetToStudy, showHistory, currentView } = useStudy();

  const handleLogout = async () => {
    await logout();
  };

  const handleLogoClick = () => {
    resetToStudy();
  };

  const handleHistoryClick = () => {
    showHistory();
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-100">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button
            onClick={handleLogoClick}
            className="flex items-center gap-2 text-primary-600 hover:text-primary-700 transition-colors"
          >
            <BookOpen className="w-8 h-8" />
            <span className="text-xl font-bold">Study Assistant</span>
          </button>

          {/* Center navigation */}
          <div className="hidden sm:flex items-center gap-1">
            <button
              onClick={handleLogoClick}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentView === 'study' 
                  ? 'bg-primary-100 text-primary-700' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              New Study
            </button>
            <button
              onClick={handleHistoryClick}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                currentView === 'history' 
                  ? 'bg-primary-100 text-primary-700' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <History className="w-4 h-4" />
              My History
            </button>
          </div>

          {/* User menu */}
          <div className="flex items-center gap-4">
            {/* Mobile history button */}
            <button
              onClick={handleHistoryClick}
              className="sm:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              title="My History"
            >
              <History className="w-5 h-5" />
            </button>

            {/* User info */}
            <div className="flex items-center gap-3">
              {user?.profileImage ? (
                <img
                  src={user.profileImage}
                  alt={user.name || 'User'}
                  className="w-8 h-8 rounded-full"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
                  <User className="w-5 h-5 text-primary-600" />
                </div>
              )}
              <span className="text-sm font-medium text-gray-700 hidden sm:block">
                {user?.name || user?.email}
              </span>
            </div>

            {/* Logout button */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 
                         hover:bg-gray-100 rounded-lg transition-colors"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;

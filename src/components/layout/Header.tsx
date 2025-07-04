import React from 'react';
import { useAuth } from '../../contexts/AuthContext';

interface HeaderProps {
  onOpenAuth: (mode: 'login' | 'register') => void;
}

const Header: React.FC<HeaderProps> = ({ onOpenAuth }) => {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <header className="header">
      <div className="container mx-auto px-4">
        <div className="header-content">
          <div className="header-brand">
            <h1 className="brand-title">HackathonHub</h1>
          </div>
          
          <nav className="header-nav">
            {isAuthenticated ? (
              <div className="user-menu">
                <div className="user-info">
                  <div className="user-avatar">
                    {user?.firstName?.[0]}{user?.lastName?.[0]}
                  </div>
                  <div className="user-details">
                    <span className="user-name">
                      {user?.firstName} {user?.lastName}
                    </span>
                    <span className="user-role">
                      {user?.role}
                    </span>
                  </div>
                </div>
                <button 
                  onClick={logout}
                  className="btn btn-outline"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="auth-buttons">
                <button 
                  onClick={() => onOpenAuth('login')}
                  className="btn btn-outline"
                >
                  Sign In
                </button>
                <button 
                  onClick={() => onOpenAuth('register')}
                  className="btn btn-primary"
                >
                  Sign Up
                </button>
              </div>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;

import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  User, 
  LogIn, 
  LogOut, 
  UserPlus, 
  Sparkles, 
  Clock, 
  Database 
} from 'lucide-react';

export default function Navbar({ user, onOpenAuth, onLogout, onQuickDemo }) {
  const [currentTime, setCurrentTime] = useState(new Date());

  // Real-time live clock
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedTime = currentTime.toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit', 
    second: '2-digit', 
    hour12: true 
  });
  
  const formattedDate = currentTime.toLocaleDateString([], { 
    weekday: 'short', 
    month: 'short', 
    day: 'numeric' 
  });

  return (
    <header className="navbar-container glass-panel">
      <div className="navbar-left">
        <div className="brand-logo-wrapper">
          <div className="brand-icon-box">
            <ShieldCheck size={26} className="brand-icon" />
          </div>
          <div>
            <div className="brand-title-row">
              <span className="brand-title">SecurePass</span>
              <span className="brand-tag">v1.0 • MERN</span>
            </div>
            <p className="brand-subtitle">IBM Industrial Visit • Employee Visitor Management</p>
          </div>
        </div>
      </div>

      <div className="navbar-center">
        {/* Live Clock Card */}
        <div className="live-clock-badge">
          <Clock size={14} className="clock-icon" />
          <span className="clock-date">{formattedDate}</span>
          <span className="clock-divider">|</span>
          <span className="clock-time">{formattedTime}</span>
        </div>

        {/* Database Live Status */}
        <div className="db-status-badge">
          <span className="pulse-dot"></span>
          <Database size={13} style={{ color: '#34d399' }} />
          <span>Atlas Cloud Connected</span>
        </div>
      </div>

      <div className="navbar-right">
        {user ? (
          <div className="user-profile-bar">
            <div className="user-avatar-badge">
              <User size={16} />
              <span>{user.name.charAt(0).toUpperCase()}</span>
            </div>
            <div className="user-info-text">
              <span className="user-name">{user.name}</span>
              <span className="user-role-pill">{user.role || 'Receptionist'}</span>
            </div>
            <button 
              className="btn btn-secondary btn-sm" 
              onClick={onLogout}
              title="Sign Out"
            >
              <LogOut size={15} />
              <span>Logout</span>
            </button>
          </div>
        ) : (
          <div className="auth-buttons-bar">
            <button 
              className="btn btn-outline btn-sm"
              onClick={onQuickDemo}
              title="Click to instantly authenticate as Demo Admin"
            >
              <Sparkles size={14} />
              <span>Demo Login</span>
            </button>
            <button 
              className="btn btn-secondary btn-sm" 
              onClick={() => onOpenAuth('login')}
            >
              <LogIn size={15} />
              <span>Sign In</span>
            </button>
            <button 
              className="btn btn-primary btn-sm" 
              onClick={() => onOpenAuth('signup')}
            >
              <UserPlus size={15} />
              <span>Sign Up</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

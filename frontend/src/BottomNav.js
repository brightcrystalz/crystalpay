import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Wallet, FileText, User } from 'lucide-react';

function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <div className="bottom-nav">
      <button
        className={`bottom-nav-item ${isActive('/dashboard') ? 'active' : ''}`}
        onClick={() => navigate('/dashboard')}
      >
        <Home size={22} />
        <span>Home</span>
      </button>

      <button
        className={`bottom-nav-item ${isActive('/wallet') ? 'active' : ''}`}
        onClick={() => navigate('/wallet')}
      >
        <Wallet size={22} />
        <span>Wallet</span>
      </button>

      <button
        className={`bottom-nav-item ${isActive('/transactions') ? 'active' : ''}`}
        onClick={() => navigate('/transactions')}
      >
        <FileText size={22} />
        <span>History</span>
      </button>

      <button
        className={`bottom-nav-item ${isActive('/profile') ? 'active' : ''}`}
        onClick={() => navigate('/profile')}
      >
        <User size={22} />
        <span>Profile</span>
      </button>
    </div>
  );
}

export default BottomNav;
import React from 'react';
import { useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('session');
    navigate('/');
  };

  return (
    <div style={{
      background: '#1a3a8f',
      color: 'white',
      padding: '12px 20px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      position: 'sticky',
      top: 0,
      zIndex: 100,
    }}>
      <span
        onClick={() => navigate('/dashboard')}
        style={{ fontWeight: 'bold', fontSize: '18px', cursor: 'pointer' }}
      >
        💳 CrystalPay
      </span>

      <div style={{ display: 'flex', gap: '15px', fontSize: '14px' }}>
        <span onClick={() => navigate('/airtime')} style={{ cursor: 'pointer', color: 'silver' }}>Airtime</span>
        <span onClick={() => navigate('/data')} style={{ cursor: 'pointer', color: 'silver' }}>Data</span>
        <span onClick={() => navigate('/electricity')} style={{ cursor: 'pointer', color: 'silver' }}>Bills</span>
        <span onClick={() => navigate('/wallet')} style={{ cursor: 'pointer', color: 'silver' }}>Wallet</span>
        <span onClick={handleLogout} style={{ cursor: 'pointer', color: '#ff6b6b' }}>Logout</span>
      </div>
    </div>
  );
}

export default Navbar;
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { supabase } from '../supabaseClient';

function Navbar() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  return (
    <div style={{
      background: '#1a3a8f',
      color: 'white',
      padding: '14px 20px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      position: 'sticky',
      top: 0,
      zIndex: 100,
    }}>
      <span
        onClick={() => navigate('/dashboard')}
        style={{ fontWeight: 'bold', fontSize: '18px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
      >
        💳 CrystalPay
      </span>

      <button
        onClick={handleLogout}
        style={{
          width: 'auto',
          background: 'rgba(255,255,255,0.15)',
          border: 'none',
          color: 'white',
          padding: '8px 10px',
          borderRadius: '10px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          fontSize: '13px',
        }}
      >
        <LogOut size={16} /> Logout
      </button>
    </div>
  );
}

export default Navbar;
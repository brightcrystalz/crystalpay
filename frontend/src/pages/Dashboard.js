import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { supabase } from '../supabaseClient';

function Dashboard() {
  const navigate = useNavigate();

  const [showBalance, setShowBalance] = useState(false);
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;
        const res = await axios.get('http://localhost:5000/wallet/balance', {
          headers: { Authorization: `Bearer ${session.access_token}` },
        });
        setBalance(res.data.balance);
      } catch (err) {
        setBalance(0);
      }
    };
    fetchBalance();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  return (
    <div className="page-container">
      <div className="card">
        <div className="dashboard-header">
          <h2>👋 Welcome Back!</h2>
          <p>Choose a service below to continue.</p>
        </div>
        

        <div className="wallet-card">
          <p>Wallet Balance</p>
          <div className="balance-section">
            <h1>{showBalance ? `₦${balance.toLocaleString()}` : '********'}</h1>
            <button className="eye-btn" onClick={() => setShowBalance(!showBalance)}>
              {showBalance ? '🙈 Hide Balance' : '👁 Show Balance'}
              </button>
              <button className="fund-btn" onClick={() => navigate('/wallet')}>
                + Fund Wallet
              </button>
          </div>
        </div>
        <div className="dashboard-grid">

          
          <button
            className="service-btn"
            onClick={() => navigate('/airtime')}
          >
            📱 Buy Airtime
          </button>

          <button
            className="service-btn"
            onClick={() => navigate('/data')}
             >
            🌐 Buy Data
          </button>

          <button
            className="service-btn"
            onClick={() => navigate('/electricity')}
            >
            ⚡ Pay Electricity
          </button>

          <button
            className="service-btn"
            onClick={() => navigate('/wallet')}
          >
            👛 My Wallet
          </button>

          <button
            className="service-btn"
            onClick={() => navigate('/transactions')}
            style={{ gridColumn: '1 / -1' }}
          >
            📝 Transaction History
          </button>
        </div>

        <button className="btn-danger" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
}

export default Dashboard;
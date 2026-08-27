import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNav from '../BottomNav';
import axios from 'axios';
import { supabase } from '../supabaseClient';
import { Smartphone, Wifi, Zap, Wallet, FileText, Plus, Eye, EyeOff } from 'lucide-react';

function Dashboard() {
  const navigate = useNavigate();

  const [showBalance, setShowBalance] = useState(false);
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;
        const res = await axios.get('https://crystalpay-backend.onrender.com/wallet/balance', {
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
          <h1>{showBalance ? `₦${balance.toLocaleString()}` : '••••••••'}</h1>

          <button className="eye-btn" onClick={() => setShowBalance(!showBalance)}>
            {showBalance ? <EyeOff size={14} /> : <Eye size={14} />}
            {showBalance ? ' Hide Balance' : ' Show Balance'}
          </button>

          <div className="quick-actions">
            <button className="quick-action-btn" onClick={() => navigate('/wallet')}>
              <Plus size={18} />
              <span>Fund</span>
            </button>
            <button className="quick-action-btn" onClick={() => navigate('/transactions')}>
              <FileText size={18} />
              <span>History</span>
            </button>
            <button className="quick-action-btn" onClick={() => navigate('/wallet')}>
              <Wallet size={18} />
              <span>Wallet</span>
            </button>
          </div>
        </div>

        <div className="dashboard-grid">
          <button className="service-btn" onClick={() => navigate('/airtime')}>
            <Smartphone size={26} className="service-icon" />
            <span>Buy Airtime</span>
          </button>

          <button className="service-btn" onClick={() => navigate('/data')}>
            <Wifi size={26} className="service-icon" />
            <span>Buy Data</span>
          </button>

          <button className="service-btn" onClick={() => navigate('/electricity')}>
            <Zap size={26} className="service-icon" />
            <span>Pay Electricity</span>
          </button>

          <button className="service-btn" onClick={() => navigate('/wallet')}>
            <Wallet size={26} className="service-icon" />
            <span>My Wallet</span>
          </button>

          <button
            className="service-btn"
            onClick={() => navigate('/transactions')}
            style={{ gridColumn: '1 / -1' }}
          >
            <FileText size={26} className="service-icon" />
            <span>Transaction History</span>
          </button>
        </div>

        <button className="btn-danger" onClick={handleLogout}>
          Logout
        </button>
      </div>
      <BottomNav />
    </div>
  );
}

export default Dashboard;
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
  const [loadingBalance, setLoadingBalance] = useState(true);
  const [userName, setUserName] = useState('');
  const [recentTx, setRecentTx] = useState([]);

  useEffect(() => {
  const fetchDashboardData = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      setUserName(session.user.email.split('@')[0]);

      const balanceRes = await axios.get('https://crystalpay-backend.onrender.com/wallet/balance', {
        headers: { Authorization: `Bearer ${session.access_token}` },
      });
      setBalance(balanceRes.data.balance);

      const txRes = await axios.get('https://crystalpay-backend.onrender.com/wallet/transactions', {
        headers: { Authorization: `Bearer ${session.access_token}` },
      });
      setRecentTx(txRes.data.transactions.slice(0, 3));
    } catch (err) {
      setBalance(0);
    } finally {
      setLoadingBalance(false);
    }
  };
  fetchDashboardData();
}, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
};

  return (
    <div className="page-container">
      <div className="card">
        <div className="dashboard-header">
        <h2>👋 {getGreeting()}, {userName || 'there'}!</h2>
        <p>Choose a service below to continue.</p>
        </div>

        <div className="wallet-card">
          <p>Wallet Balance</p>
          {loadingBalance ? (
            <div className="skeleton skeleton-balance" />
          ) : (
            <h1>{showBalance ? `₦${balance.toLocaleString()}` : '********'}</h1>
          )}

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

        {recentTx.length > 0 && (
  <div className="recent-activity">
    <div className="recent-activity-header">
      <h3>Recent Activity</h3>
      <span onClick={() => navigate('/transactions')} className="view-all-link">View All</span>
    </div>
    {recentTx.map((tx, i) => (
      <div key={i} className="recent-tx-row">
        <div>
          <p className="recent-tx-type">{tx.type}</p>
          <p className="recent-tx-date">{new Date(tx.created_at).toLocaleDateString()}</p>
        </div>
        <span className="recent-tx-amount">₦{tx.amount}</span>
      </div>
    ))}
  </div>
)}

        <button className="btn-danger" onClick={handleLogout}>
          Logout
        </button>
      </div>
      <BottomNav />
    </div>
  );
}

export default Dashboard;
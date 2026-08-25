import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from './Navbar';

function Data() {
  const [network, setNetwork] = useState('');
  const [phone, setPhone] = useState('');
  const [plan, setPlan] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const dataPlans = {
    mtn: [
      { label: '500MB - ₦150', code: 'mtn-10mb-100', amount: 150 },
      { label: '1GB - ₦300', code: 'mtn-1gb-1000', amount: 300 },
      { label: '2GB - ₦500', code: 'mtn-2gb-1000', amount: 500 },
      { label: '5GB - ₦1500', code: 'mtn-5gb-1500', amount: 1500 },
    ],
    airtel: [
      { label: '500MB - ₦200', code: 'airtel-500mb', amount: 200 },
      { label: '1GB - ₦350', code: 'airtel-1gb', amount: 350 },
      { label: '2GB - ₦600', code: 'airtel-2gb', amount: 600 },
      { label: '5GB - ₦1500', code: 'airtel-5gb', amount: 1500 },
    ],
    glo: [
      { label: '500MB - ₦100', code: 'glo-500mb', amount: 100 },
      { label: '1GB - ₦200', code: 'glo-1gb', amount: 200 },
      { label: '2GB - ₦400', code: 'glo-2gb', amount: 400 },
      { label: '5GB - ₦1200', code: 'glo-5gb', amount: 1200 },
    ],
    etisalat: [
      { label: '500MB - ₦150', code: '9mobile-500mb', amount: 150 },
      { label: '1GB - ₦300', code: '9mobile-1gb', amount: 300 },
      { label: '2GB - ₦500', code: '9mobile-2gb', amount: 500 },
      { label: '5GB - ₦1500', code: '9mobile-5gb', amount: 1500 },
    ],
  };

  const selectedPlan = network && plan
    ? dataPlans[network].find(p => p.code === plan)
    : null;

  const handleBuyData = async () => {
    if (!network || !phone || !plan) {
      setMessage('Please fill in all fields');
      return;
    }
    try {
      setLoading(true);
      setMessage('');
      const session = JSON.parse(localStorage.getItem('session'));
      const res = await axios.post('http://localhost:5000/vtpass/data', {
        network,
        phone,
        planCode: plan,
        amount: selectedPlan.amount,
      }, {
        headers: { Authorization: `Bearer ${session.access_token}` }
      });
      setMessage(res.data.message);
    } catch (err) {
      setMessage(err.response?.data?.error || 'Purchase failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="page-container">
        <div className="card">
          <button
            onClick={() => navigate('/dashboard')}
            style={{ background: 'none', border: 'none', color: '#1a3a8f', fontSize: '16px', cursor: 'pointer', marginBottom: '15px', padding: '0' }}
          >
            ← Back
          </button>
          <h2>Buy Data</h2>

          <select value={network} onChange={(e) => { setNetwork(e.target.value); setPlan(''); }}>
            <option value="">Select Network</option>
            <option value="mtn">MTN</option>
            <option value="airtel">Airtel</option>
            <option value="glo">Glo</option>
            <option value="etisalat">9mobile</option>
          </select>

          <input
            type="text"
            placeholder="Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />

          <select value={plan} onChange={(e) => setPlan(e.target.value)}>
            <option value="">Select Data Plan</option>
            {network && dataPlans[network].map((p, i) => (
              <option key={i} value={p.code}>{p.label}</option>
            ))}
          </select>

          <button className="btn-primary" onClick={handleBuyData} disabled={loading}>
            {loading ? 'Processing...' : 'Buy Data'}
          </button>
          {message && <p style={{ color: message.includes('successful') ? 'green' : 'red' }}>{message}</p>}
        </div>
      </div>
    </>
  );
}

export default Data;
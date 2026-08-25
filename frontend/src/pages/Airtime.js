import { supabase } from '../supabaseClient';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from './Navbar';

function Airtime() {
  const [network, setNetwork] = useState('');
  const [phone, setPhone] = useState('');
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleBuyAirtime = async () => {
    if (!network || !phone || !amount) {
      setMessage('Please fill in all fields');
      return;
    }
    try {
      setLoading(true);
      setMessage('');
      const { data: { session } } = await supabase.auth.getSession();
const res = await axios.post('http://localhost:5000/vtpass/airtime', {
        network,
        phone,
        amount,
        
      }, {
        headers: { Authorization: `Bearer ${session.access_token}`}
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
          <h2>Buy Airtime</h2>

          <select value={network} onChange={(e) => setNetwork(e.target.value)}>
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

          <input
            type="number"
            placeholder="Amount (₦)"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />

          <button className="btn-primary" onClick={handleBuyAirtime} disabled={loading}>
            {loading ? 'Processing...' : 'Buy Airtime'}
          </button>
          {message && <p style={{ color: message.includes('successful') ? 'green' : 'red' }}>{message}</p>}
        </div>
      </div>
    </>
  );
}

export default Airtime;
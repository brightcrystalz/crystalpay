import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from './Navbar';

function Electricity() {
  const [disco, setDisco] = useState('');
  const [meterNumber, setMeterNumber] = useState('');
  const [meterType, setMeterType] = useState('');
  const [amount, setAmount] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handlePayElectricity = async () => {
    if (!disco || !meterNumber || !meterType || !amount || !phone) {
      setMessage('Please fill in all fields');
      return;
    }
    try {
      setLoading(true);
      setMessage('');
      const session = JSON.parse(localStorage.getItem('session'));
      const res = await axios.post('http://localhost:5000/vtpass/electricity', {
        disco,
        meterNumber,
        meterType,
        amount,
        phone,
      }, {
        headers: { Authorization: `Bearer ${session.access_token}` }
      });
      setMessage(res.data.message);
    } catch (err) {
      setMessage(err.response?.data?.error || 'Payment failed');
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
          <h2>Pay Electricity Bill</h2>

          <select value={disco} onChange={(e) => setDisco(e.target.value)}>
            <option value="">Select Electricity Provider</option>
            <option value="ikeja-electric">Ikeja Electric (IKEDC)</option>
            <option value="eko-electric">Eko Electric (EKEDC)</option>
            <option value="abuja-electric">Abuja Electric (AEDC)</option>
            <option value="kano-electric">Kano Electric (KAEDCO)</option>
            <option value="portharcourt-electric">Port Harcourt Electric (PHEDC)</option>
            <option value="jos-electric">Jos Electric (JED)</option>
            <option value="ibadan-electric">Ibadan Electric (IBEDC)</option>
            <option value="enugu-electric">Enugu Electric (EEDC)</option>
          </select>

          <select value={meterType} onChange={(e) => setMeterType(e.target.value)}>
            <option value="">Select Meter Type</option>
            <option value="prepaid">Prepaid</option>
            <option value="postpaid">Postpaid</option>
          </select>

          <input
            type="text"
            placeholder="Meter Number"
            value={meterNumber}
            onChange={(e) => setMeterNumber(e.target.value)}
          />

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

          <button className="btn-primary" onClick={handlePayElectricity} disabled={loading}>
            {loading ? 'Processing...' : 'Pay Now'}
          </button>
          {message && <p style={{ color: message.includes('successful') ? 'green' : 'red' }}>{message}</p>}
        </div>
      </div>
    </>
  );
}

export default Electricity;
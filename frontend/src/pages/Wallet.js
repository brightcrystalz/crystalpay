import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { usePaystackPayment } from 'react-paystack';
import Navbar from './Navbar';
import { supabase } from '../supabaseClient';

function Wallet() {
  const [balance, setBalance] = useState(0);
  const [amount, setAmount] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;
        setEmail(session.user.email);
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

  const config = {
    reference: new Date().getTime().toString(),
    email: email,
    amount: amount * 100,
    publicKey: 'pk_test_466c2f62febc94a1f4df0c94fc2ad297c32a6c71',
  };

  const onSuccess = async (reference) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const res = await axios.get(`http://localhost:5000/paystack/verify/${reference.reference}`, {
        headers: { Authorization: `Bearer ${session.access_token}` },
      });
      setBalance(res.data.newBalance);
      setMessage('Wallet funded successfully!');
    } catch (err) {
      setMessage('Payment verification failed');
    }
  };

  const onClose = () => {
    setMessage('Payment cancelled');
  };

  const initializePayment = usePaystackPayment(config);

  const handleFundWallet = () => {
    if (!amount) {
      setMessage('Please enter an amount');
      return;
    }
    if (!email) {
      setMessage('Please log in again to fund your wallet');
      return;
    }
    initializePayment({ onSuccess, onClose });
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
          <h2>My Wallet</h2>

          <div style={{ background: '#1a3a8f', color: 'white', borderRadius: '10px', padding: '20px', textAlign: 'center', marginBottom: '20px' }}>
            <p style={{ color: 'silver', fontSize: '14px', marginTop: '0' }}>Available Balance</p>
            <h1 style={{ fontSize: '36px', marginTop: '8px' }}>₦{balance.toLocaleString()}</h1>
          </div>

          <input
            type="number"
            placeholder="Enter amount to fund (₦)"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />

          <button className="btn-primary" onClick={handleFundWallet}>
            Fund Wallet
          </button>
          {message && <p style={{ color: message.includes('success') ? 'green' : 'red' }}>{message}</p>}
        </div>
      </div>
    </>
  );
}

export default Wallet;
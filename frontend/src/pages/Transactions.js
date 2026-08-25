import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from './Navbar';
import { supabase } from '../supabaseClient';

function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          setLoading(false);
          return;
        }
        const res = await axios.get('http://localhost:5000/wallet/transactions', {
          headers: { Authorization: `Bearer ${session.access_token}` },
        });
        setTransactions(res.data.transactions);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, []);

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
          <h2>Transaction History</h2>

          {loading && <p>Loading...</p>}

          {!loading && transactions.length === 0 && (
            <p style={{ textAlign: 'center', color: '#888' }}>No transactions yet.</p>
          )}

          {!loading && transactions.map((tx, i) => (
            <div key={i} style={{
              border: '1px solid #e0e8ff',
              borderRadius: '8px',
              padding: '12px',
              marginBottom: '10px',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontWeight: 'bold', color: '#1a3a8f' }}>{tx.type}</span>
                <span style={{ fontWeight: 'bold' }}>₦{tx.amount}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '5px' }}>
                <span style={{ color: '#888', fontSize: '13px' }}>{tx.details}</span>
                <span style={{
                  fontSize: '12px',
                  color: tx.status === 'success' ? 'green' : 'red',
                  fontWeight: 'bold'
                }}>
                  {tx.status}
                </span>
              </div>
              <p style={{ fontSize: '12px', color: '#aaa', marginTop: '5px' }}>
                {new Date(tx.created_at).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default Transactions;
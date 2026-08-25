const express = require('express');
const router = express.Router();
const axios = require('axios');
const supabase = require('./supabase');

const getUser = async (req) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return null;
  const { data: { user } } = await supabase.auth.getUser(token);
  return user;
};

// Initialize payment
router.post('/initialize', async (req, res) => {
  try {
    const { amount, email } = req.body;
    const user = await getUser(req);

    if (!user) return res.status(401).json({ error: 'Unauthorized' });
    if (!amount || !email) return res.status(400).json({ error: 'Amount and email required' });

    const response = await axios.post(
      'https://api.paystack.co/transaction/initialize',
      {
        email: email,
        amount: amount * 100,
        metadata: { user_id: user.id },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: err.response?.data?.message || err.message });
  }
});

// Verify payment
router.get('/verify/:reference', async (req, res) => {
  console.log('=== VERIFY ROUTE HIT ===');
  const { reference } = req.params;
  console.log('Reference:', reference);

  try {
    const user = await getUser(req);
    console.log('User:', user ? user.id : 'NULL');

    if (!user) return res.status(401).json({ error: 'Unauthorized' });

    console.log('About to call Paystack API...');

    axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      }
    ).then(async (response) => {
      console.log('Paystack responded! Status:', response.data.data.status);
      const paymentData = response.data.data;

      if (paymentData.status === 'success') {
        const amount = paymentData.amount / 100;

        const { data: wallet } = await supabase
          .from('wallets')
          .select('balance')
          .eq('user_id', user.id)
          .single();

        const newBalance = (wallet?.balance || 0) + amount;

        await supabase
          .from('wallets')
          .update({ balance: newBalance })
          .eq('user_id', user.id);

        await supabase.from('transactions').insert([{
          user_id: user.id,
          type: 'Wallet Funding',
          amount: amount,
          status: 'success',
          details: `Wallet funded via Paystack - Ref: ${reference}`,
        }]);

        return res.json({ message: 'Wallet funded successfully!', newBalance });
      }
      res.status(400).json({ error: 'Payment verification failed' });
    }).catch((err) => {
      console.log('AXIOS ERROR CAUGHT:', err.message);
      console.log('AXIOS ERROR CODE:', err.code);
      res.status(500).json({ error: err.message });
    });

  } catch (err) {
    console.log('OUTER CATCH ERROR:', err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
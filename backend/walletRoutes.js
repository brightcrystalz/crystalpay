const express = require('express');
const router = express.Router();
const supabase = require('./supabase');

// Get wallet balance
router.get('/balance', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error) return res.status(401).json({ error: 'Unauthorized' });

    const { data, error: walletError } = await supabase
      .from('wallets')
      .select('balance')
      .eq('user_id', user.id)
      .single();

    if (walletError) return res.status(400).json({ error: walletError.message });
    res.json({ balance: data.balance });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get transaction history
router.get('/transactions', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error) return res.status(401).json({ error: 'Unauthorized' });

    const { data, error: txError } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (txError) return res.status(400).json({ error: txError.message });
    res.json({ transactions: data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
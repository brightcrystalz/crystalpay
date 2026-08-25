const express = require('express');
const router = express.Router();
const { buyAirtime, buyData, payElectricity } = require('./vtpass');
const supabase = require('./supabase');

const getUser = async (req) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return null;
  const { data: { user } } = await supabase.auth.getUser(token);
  return user;
};

// Buy Airtime
router.post('/airtime', async (req, res) => {
  try {
    const { network, phone, amount } = req.body;

    if (!network || !phone || !amount) {
      return res.status(400).json({ error: 'Please fill in all fields' });
    }

    const result = await buyAirtime(network, phone, amount);
    const user = await getUser(req);

    console.log('User found:', user ? user.id : 'NULL');

    if (user) {
      const { error } = await supabase.from('transactions').insert([{
        user_id: user.id,
        type: 'Airtime',
        amount: amount,
        status: result.code === '000' ? 'success' : 'failed',
        details: `${network.toUpperCase()} airtime to ${phone}`,
      }]);
      console.log('Transaction insert error:', error ? error.message : 'NONE');
    }

    res.json({ message: 'Airtime purchase successful!', data: result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Buy Data
router.post('/data', async (req, res) => {
  try {
    const { network, phone, planCode, amount } = req.body;

    if (!network || !phone || !planCode || !amount) {
      return res.status(400).json({ error: 'Please fill in all fields' });
    }

    const result = await buyData(network, phone, planCode, amount);
    const user = await getUser(req);

    if (user) {
      await supabase.from('transactions').insert([{
        user_id: user.id,
        type: 'Data',
        amount: amount,
        status: result.code === '000' ? 'success' : 'failed',
        details: `${network.toUpperCase()} data to ${phone}`,
      }]);
    }

    res.json({ message: 'Data purchase successful!', data: result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Pay Electricity
router.post('/electricity', async (req, res) => {
  try {
    const { disco, meterNumber, meterType, amount, phone } = req.body;

    if (!disco || !meterNumber || !meterType || !amount || !phone) {
      return res.status(400).json({ error: 'Please fill in all fields' });
    }

    const result = await payElectricity(disco, meterNumber, meterType, amount, phone);
    const user = await getUser(req);

    if (user) {
      await supabase.from('transactions').insert([{
        user_id: user.id,
        type: 'Electricity',
        amount: amount,
        status: result.code === '000' ? 'success' : 'failed',
        details: `${disco} meter ${meterNumber}`,
      }]);
    }

    res.json({ message: 'Electricity payment successful!', data: result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
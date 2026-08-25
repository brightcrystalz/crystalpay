const express = require('express');
const router = express.Router();
const supabase = require('./supabase');

router.post('/signup', async (req, res) => {
  try {
    const { email, password, full_name, phone } = req.body;

    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
    });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    await supabase.from('users').insert([{
      id: data.user.id,
      email: email,
      full_name: full_name,
      phone: phone,
    }]);

    await supabase.from('wallets').insert([{
      user_id: data.user.id,
      balance: 0,
    }]);

    return res.status(200).json({ message: 'Signup successful!' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    return res.status(200).json({ message: 'Login successful!', session: data.session });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

module.exports = router;
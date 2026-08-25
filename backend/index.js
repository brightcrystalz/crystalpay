const express = require('express');
const cors = require('cors');
require('dotenv').config();
const supabase = require('./supabase');
const authRoutes = require('./authRoutes');
const vtpassRoutes = require('./vtpassRoutes');
const walletRoutes = require('./walletRoutes');
const paystackRoutes = require('./paystackRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/vtpass', vtpassRoutes);
app.use('/wallet', walletRoutes);
app.use('/paystack', paystackRoutes);

app.get('/', (req, res) => {
  res.send('VTU App Backend is running!');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log('Server running on port ' + PORT);
});
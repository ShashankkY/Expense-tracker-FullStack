const express = require('express');
const cors = require('cors');
const path = require('path');

const db = require('./models'); // ✅ Centralized models + sequelize
const authRoutes = require('./routes/authRoutes');
const expenseRoutes = require('./routes/expenseRoutes');
const paymentRoutes = require('./routes/paymentRoutes');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/payment', paymentRoutes);

// Serve login page at root
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'paymentsuccess.html'));
});

// ✅ DB Initialization
async function initializeDatabase() {
  try {
    await db.sequelize.authenticate(); // ✅ use from db object
    console.log('✅ Database connected.');

    await db.sequelize.sync({ force: false }); // or force: true if you want to reset
    console.log('✅ Models synced.');

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('❌ Database error:', err);
  }
}

initializeDatabase();

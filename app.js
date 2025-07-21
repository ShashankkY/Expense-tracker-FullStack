const express = require('express');
const cors = require('cors');
const path = require('path');
const { sequelize } = require('./models');
const authRoutes = require('./routes/authRoutes');
const expenseRoutes = require('./routes/expenseRoutes');

const app = express();

const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/expenses', expenseRoutes);


// ✅ Force root URL to return login.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});


// DB Connection
async function initializeDatabase() {
  try {
    await db.sequelize.authenticate();
    console.log('✅ Database connected.');

    await db.sequelize.sync({ force: false });
    console.log('✅ Models synced.');

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('❌ Database error:', err);
  }
}

initializeDatabase();

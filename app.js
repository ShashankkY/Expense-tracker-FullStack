const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();

const db = require('./models');
const authRoutes = require('./routes/authRoutes');

const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// ✅ Serve static files from "public"
app.use(express.static(path.join(__dirname, 'public')));

// ✅ Force root URL to return login.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// Routes
app.use('/api/auth', authRoutes);

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

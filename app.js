const express = require('express');
const cors = require('cors'); // Import cors
const app = express();

const db = require('./models');
const authRoutes = require('./routes/authRoutes');

app.use(cors()); //  Enable CORS (allows frontend to talk to backend)
app.use(express.json());

app.use('/api/auth', authRoutes);

// DB Connection
db.sequelize.sync().then(() => {
  app.listen(3000, () => {
    console.log('Server running on port 3000');
  });
});
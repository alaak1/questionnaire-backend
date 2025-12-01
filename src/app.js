const express = require('express');
const cors = require('cors');
const adminRoutes = require('./routes/adminRoutes');
const publicRoutes = require('./routes/publicRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/admin', adminRoutes);
app.use('/', publicRoutes);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: 'Internal server error' });
});

module.exports = app;

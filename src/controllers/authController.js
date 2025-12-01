const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Admin } = require('../models');
const jwtConfig = require('../config/jwt');

function generateTokens(admin) {
  const accessToken = jwt.sign({ id: admin.id, email: admin.email }, jwtConfig.secret, {
    expiresIn: jwtConfig.expiresIn
  });
  const refreshToken = jwt.sign({ id: admin.id, email: admin.email }, jwtConfig.refreshSecret, {
    expiresIn: jwtConfig.refreshExpiresIn
  });
  return { accessToken, refreshToken };
}

async function login(req, res) {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'Email and password required' });

  const admin = await Admin.findOne({ where: { email } });
  if (!admin) return res.status(401).json({ message: 'Invalid credentials' });

  const valid = await bcrypt.compare(password, admin.password);
  if (!valid) return res.status(401).json({ message: 'Invalid credentials' });

  const tokens = generateTokens(admin);
  return res.json({ ...tokens, expiresIn: jwtConfig.expiresIn });
}

async function refresh(req, res) {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.status(400).json({ message: 'Refresh token required' });

  try {
    const payload = jwt.verify(refreshToken, jwtConfig.refreshSecret);
    const admin = await Admin.findByPk(payload.id);
    if (!admin) return res.status(401).json({ message: 'Invalid refresh token' });
    const tokens = generateTokens(admin);
    return res.json({ ...tokens, expiresIn: jwtConfig.expiresIn });
  } catch (err) {
    return res.status(401).json({ message: 'Invalid refresh token' });
  }
}

module.exports = {
  login,
  refresh
};

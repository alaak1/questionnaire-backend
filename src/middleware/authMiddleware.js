const jwt = require('jsonwebtoken');
const { Admin } = require('../models');
const jwtConfig = require('../config/jwt');

module.exports = async function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Missing token' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, jwtConfig.secret);
    const admin = await Admin.findByPk(decoded.id);
    if (!admin) {
      return res.status(401).json({ message: 'Invalid token' });
    }
    req.admin = admin;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

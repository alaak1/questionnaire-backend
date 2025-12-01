module.exports = {
  secret: process.env.JWT_SECRET || 'supersecretjwtkey',
  expiresIn: '2h',
  refreshSecret: process.env.JWT_REFRESH_SECRET || 'supersecretrefreshkey',
  refreshExpiresIn: '30d'
};

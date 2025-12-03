const serverless = require('serverless-http');
const app = require('../src/app');
const { sequelize } = require('../src/models');

let synced = false;

async function ensureDb() {
  if (synced) return;
  await sequelize.sync({ alter: true });
  synced = true;
}

module.exports = async function handler(req, res) {
  await ensureDb();
  return serverless(app)(req, res);
};

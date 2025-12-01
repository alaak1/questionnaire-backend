const { Sequelize } = require('sequelize');
const mysql2 = require('mysql2');
const dotenv = require('dotenv');

dotenv.config();

console.log('Connecting to DB:', process.env.DB_HOST, process.env.DB_PORT, process.env.DB_DATABASE);

const sequelize = new Sequelize(
  process.env.DB_DATABASE || 'railway',
  process.env.DB_USERNAME || 'root',
  process.env.DB_PASSWORD || '',
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql',
    dialectModule: mysql2,
    logging: false,
    pool: {
      max: Number(process.env.DB_POOL_MAX || 10),
      min: Number(process.env.DB_POOL_MIN || 0),
      idle: Number(process.env.DB_POOL_IDLE || 10000),
      acquire: Number(process.env.DB_POOL_ACQUIRE || 30000)
    },
    dialectOptions: {
      connectTimeout: 60000
    }
  }
);

(async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully!');
  } catch (error) {
    console.error('❌ Unable to connect to the database:', error.message);
  }
})();

module.exports = sequelize;

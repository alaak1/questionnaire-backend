const app = require('./app');
const { sequelize, Admin } = require('./models');
const bcrypt = require('bcryptjs');

const PORT = process.env.PORT || 4000;

async function bootstrap() {
  await sequelize.sync();

  const adminCount = await Admin.count();
  if (adminCount === 0) {
    const passwordHash = await bcrypt.hash('admin123', 10);
    await Admin.create({ email: 'admin@example.com', password: passwordHash });
    console.log('Seeded default admin: admin@example.com / admin123');
  }

  // Ensure demo admin exists
  const demoAdmin = await Admin.findOne({ where: { email: 'demo@demo.com' } });
  if (!demoAdmin) {
    const demoPass = await bcrypt.hash('demodemo', 10);
    await Admin.create({ email: 'demo@demo.com', password: demoPass });
    console.log('Seeded demo admin: demo@demo.com / demodemo');
  }

  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
}

bootstrap().catch((err) => {
  console.error('Failed to start server', err);
  process.exit(1);
});

const { User, sequelize } = require('./src/models');

async function test() {
  const users = await User.findAll({ attributes: ['email', 'password', 'role'] });
  console.log(users.map(u => u.toJSON()));
  process.exit(0);
}

test();

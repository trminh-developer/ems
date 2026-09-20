import { User, sequelize } from './src/models';

async function test() {
  const users = await User.findAll({ attributes: ['email', 'password', 'role'] });
  console.log(users.map((u: any) => u.toJSON()));
  process.exit(0);
}

test();

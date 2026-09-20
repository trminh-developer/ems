import { User, sequelize } from './src/models';

async function seedAdmin() {
  try {
    await sequelize.sync({ alter: true });
    const adminEmail = 'admin@heartconnect.com';
    let admin = await User.findOne({ where: { email: adminEmail } });
    
    if (!admin) {
      admin = await User.create({
        email: adminEmail,
        password: 'adminpassword',
        username: 'hc_admin',
        first_name: 'System',
        last_name: 'Admin',
        role: 'ADMIN',
        status: 'ACTIVE',
        is_verified: true
      });
      console.log('Admin account created successfully.');
    } else {
      admin.role = 'ADMIN';
      await admin.save();
      console.log('Admin account already exists, ensured role is ADMIN.');
    }
  } catch (error) {
    console.error('Failed to seed admin:', error);
  } finally {
    process.exit(0);
  }
}

seedAdmin();

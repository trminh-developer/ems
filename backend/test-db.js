require('dotenv').config();
const { Sequelize, DataTypes, Model } = require('sequelize');

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  logging: false,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  }
});

class User extends Model {}
User.init({
  id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
  email: { type: DataTypes.STRING, unique: true, allowNull: false },
  password: { type: DataTypes.STRING, allowNull: false },
  username: { type: DataTypes.STRING, unique: true, allowNull: false },
  first_name: { type: DataTypes.STRING },
  last_name: { type: DataTypes.STRING },
  role: { type: DataTypes.ENUM('ADMIN', 'CENSOR', 'USER'), defaultValue: 'USER' },
  status: { type: DataTypes.ENUM('ACTIVE', 'BANNED', 'DELETED'), defaultValue: 'ACTIVE' },
  is_verified: { type: DataTypes.BOOLEAN, defaultValue: false }
}, { sequelize, modelName: 'User', tableName: 'users', timestamps: true });

(async () => {
  try {
    await sequelize.authenticate();
    console.log('Connected to Aiven!');
    // Wait for Render to finish syncing tables first
    await new Promise(r => setTimeout(r, 5000)); 
    
    // Just force create the table if not exists
    await sequelize.sync();
    
    const adminEmail = 'admin@heartconnect.com';
    const [admin, created] = await User.findOrCreate({
      where: { email: adminEmail },
      defaults: {
        password: 'adminpassword',
        username: 'hc_admin_live',
        first_name: 'System',
        last_name: 'Admin',
        role: 'ADMIN',
        status: 'ACTIVE',
        is_verified: true
      }
    });
    
    if (!created) {
      admin.role = 'ADMIN';
      await admin.save();
      console.log('Admin already existed. Ensured role = ADMIN');
    } else {
      console.log('Admin account created!');
    }
  } catch(e) {
    console.error(e);
  } finally {
    process.exit();
  }
})();

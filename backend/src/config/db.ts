import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

// Use DATABASE_URL from .env if available, otherwise fallback to localhost for development
const dbUrl = process.env.DATABASE_URL || 'mysql://root:@localhost:3306/dating_app';

const isProduction = process.env.NODE_ENV === 'production' || dbUrl.includes('aivencloud') || dbUrl.includes('render');

const sequelize = new Sequelize(dbUrl, {
  logging: false,
  dialectOptions: isProduction ? {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  } : {}
});

export default sequelize;

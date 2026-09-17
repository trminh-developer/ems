import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

// Use DATABASE_URL from .env if available, otherwise fallback to localhost for development
const dbUrl = process.env.DATABASE_URL || 'mysql://root:@localhost:3306/dating_app';

const sequelize = new Sequelize(dbUrl, {
  logging: false,
});

export default sequelize;

import { Sequelize } from "sequelize";
import dotenv from "dotenv";
import path from "path";

dotenv.config();

const isProduction = process.env.NODE_ENV === "production";

const useMockDb =
  !isProduction &&
  (process.env.USE_MOCK_DB === "true" ||
    process.env.DATABASE_TYPE === "mock" ||
    !process.env.DATABASE_URL ||
    process.env.DATABASE_URL.startsWith("sqlite"));

let sequelize: Sequelize;

if (useMockDb) {
  const sqlitePath = path.resolve(
    __dirname,
    "../../Database/dating_app.sqlite",
  );
  console.log(`[Database] Using Mock Database (SQLite) at: ${sqlitePath}`);
  sequelize = new Sequelize({
    dialect: "sqlite",
    storage: sqlitePath,
    logging: false,
  });
} else {
  const dbUrl = process.env.DATABASE_URL!;
  const needsSsl =
    isProduction ||
    dbUrl.includes("aivencloud") ||
    dbUrl.includes("render");

  sequelize = new Sequelize(dbUrl, {
    logging: false,
    pool: {
      max: 10,
      min: 2,
      acquire: 30000,
      idle: 10000,
    },
    dialectOptions: needsSsl
      ? {
          ssl: {
            require: true,
            rejectUnauthorized: false,
          },
        }
      : {},
  });
}

export default sequelize;

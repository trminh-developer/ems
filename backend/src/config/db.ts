import { Sequelize } from "sequelize";
import dotenv from "dotenv";
import path from "path";
import os from "os";

dotenv.config();

const isProduction = process.env.NODE_ENV === "production";
const dbUrl = process.env.DATABASE_URL?.trim();

// Default to the demo database, including after a deploy without the local .env.
// A stale DATABASE_URL must not silently reconnect the demo to a deleted MySQL host.
const externalDbRequested =
  process.env.USE_MOCK_DB === "false" || process.env.DATABASE_TYPE === "mysql";
const useMockDb =
  process.env.USE_MOCK_DB === "true" ||
  process.env.DATABASE_TYPE === "mock" ||
  !externalDbRequested ||
  !dbUrl ||
  dbUrl.startsWith("sqlite");

let sequelize: Sequelize;

if (useMockDb) {
  const sqlitePath = process.env.SQLITE_STORAGE || (isProduction
    ? path.join(os.tmpdir(), "heartconnect.sqlite")
    : path.resolve(__dirname, "../../Database/dating_app.sqlite"));
  console.log(`[Database] Using Mock Database (SQLite) at: ${sqlitePath}`);
  sequelize = new Sequelize({
    dialect: "sqlite",
    storage: sqlitePath,
    logging: false,
  });
} else {
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

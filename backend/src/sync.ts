import sequelize from "./config/db";
import "./models/index";

sequelize
  .sync({ alter: true })
  .then(() => {
    console.log("Database synced");
    process.exit(0);
  })
  .catch((err) => {
    console.error("Error syncing database:", err);
    process.exit(1);
  });

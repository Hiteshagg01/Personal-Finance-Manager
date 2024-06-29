import { Sequelize } from "sequelize";
import "dotenv/config";

const sequelize = new Sequelize(
  process.env.PG_DB,
  process.env.PG_USER,
  process.env.PG_PASSWORD,
  {
    host: process.env.PG_HOST,
    dialect: process.env.DIALECT,
  }
);

sequelize
  .authenticate()
  .then(() => {
    console.log(" ✅ connection has been established successfully.");
  })
  .catch((err) => {
    console.error(" ❌ unable to connect to the database:", err);
  });

export default sequelize;

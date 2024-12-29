import { DataSource } from "typeorm";
import { Customer } from "../entities/customer";
import { Media } from "../entities/media";

const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || ""),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: [Customer, Media],
  synchronize: true,
  logging: false,
});

export { AppDataSource };

import dotenv from "dotenv";
dotenv.config();

import express, { Express, Request, Response } from "express";
import cors from "cors";
import authRouter from "./routes/auth";
import "reflect-metadata";
import mediaRouter from "./routes/media";
import { AppDataSource } from "./config/db";
import { errorMiddleware } from "./middlewares/error";
import logger from "./helper/logger";
import puppeteer, { Browser } from "puppeteer";
import { consume } from "./services/kafka";
import { MEDIA_TOPIC } from "./config/kafka";

const app: Express = express();
const port = process.env.PORT || 8080;
export let browser: Browser;

app.use(cors());
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({ message: "Server is running" });
});

app.use("/auth", authRouter);
app.use("/media", mediaRouter);
app.use(errorMiddleware);

async function start() {
  try {
    await AppDataSource.initialize();
    browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox"],
    });
    app.listen(port, () => {
      logger.info(`Server is running at http://localhost:${port}`);
    });
  } catch (error) {
    logger.error(error);
    if (browser) {
      await browser.close();
    }
    process.exit(1);
  }
}

start();
consume(MEDIA_TOPIC);

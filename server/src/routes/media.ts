import express from "express";
import { dtoValidationMiddleware } from "../middlewares/dto";
import { importSchema } from "../dto/media";
import { authMiddleware } from "../middlewares/auth";
import { findMedias } from "../services/media";
import { MediaType } from "../entities/media";
import { produce } from "../services/kafka";
import { MEDIA_TOPIC } from "../config/kafka";

const mediaRouter = express.Router();

mediaRouter.post(
  "/import",
  authMiddleware,
  dtoValidationMiddleware(importSchema),
  async (req, res, next) => {
    try {
      const { userId, urls } = req.body;
      for (const url of urls) {
        await produce(userId, MEDIA_TOPIC, url);
      }
      res.status(200).json({ urls });
    } catch (error) {
      next(error);
    }
  }
);

mediaRouter.get("/", async (req, res, next) => {
  try {
    const { page, limit, type, search } = req.query;
    const pageNum = page ? parseInt(page.toString()) : undefined;
    const limitNum = limit ? parseInt(limit.toString()) : undefined;
    let typeEnum = undefined;
    if (
      typeof type == "string" &&
      Object.values(MediaType).includes(type as MediaType)
    ) {
      typeEnum = type as MediaType;
    }
    let searchString = undefined;
    if (typeof search == "string") {
      searchString = search;
    }
    const [medias, count] = await findMedias(
      pageNum,
      limitNum,
      typeEnum,
      searchString
    );
    res.status(200).json({ medias, count });
  } catch (error) {
    next(error);
  }
});

export default mediaRouter;

import logger from "../helper/logger";
import { HttpException } from "../exceptions/exception";
import { Media, MediaType } from "../entities/media";
import { AppDataSource } from "../config/db";
import { browser } from "..";
import { getDomain } from "../helper/url";

async function scrape(url: string, customerId: number) {
  try {
    logger.info(`Begin scraping from url ${url} for customer ${customerId}`);
    const page = await browser.newPage();

    await page.setRequestInterception(true);

    page.on("request", (req) => {
      if (
        req.resourceType() == "stylesheet" ||
        req.resourceType() == "font" ||
        req.resourceType() == "image"
      ) {
        req.abort();
      } else {
        req.continue();
      }
    });

    await page.goto(url, { waitUntil: "networkidle2" });

    const medias = await page.evaluate(() => {
      // Get all images' src starting with https://
      const images = Array.from(document.getElementsByTagName("img"))
        .map((image) => ({
          url: image.src,
          type: "image",
        }))
        .filter((image) => image.url.startsWith("https://"));

      // Get all videos' and their sources' src starting with https://
      let videos: { url: string; type: string }[] = [];
      const videoElements = document.getElementsByTagName("video");
      for (const video of videoElements) {
        if (video.src.startsWith("https://")) {
          videos.push({ url: video.src, type: "video" });
        }
        const sources = Array.from(video.getElementsByTagName("source"))
          .map((source) => ({
            url: source.src,
            type: "video",
          }))
          .filter((source) => source.url.startsWith("https://"));
        videos = [...videos, ...sources];
      }
      return images.concat(videos);
    });

    await page.close();

    const records: Partial<Media>[] = medias
      .filter((media) => media.url.length > 0)
      .map((media) => ({
        customerId,
        website: getDomain(url),
        url: media.url,
        type: media.type as MediaType,
      }));

    const result = await AppDataSource.createQueryBuilder()
      .insert()
      .into(Media)
      .values(records)
      .execute();

    logger.info(`Finish scraping from url ${url} for customer ${customerId}`);

    return result.identifiers;
  } catch (error: any) {
    throw new HttpException(500, "Internal server error", error);
  }
}

export { scrape };

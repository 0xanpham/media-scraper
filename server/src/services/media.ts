import { Media, MediaType } from "../entities/media";
import { AppDataSource } from "../config/db";
import logger from "../helper/logger";

async function findMedias(
  page = 1,
  limit = 10,
  type?: MediaType,
  searchText?: string
) {
  limit = Math.max(limit, 1);
  page = Math.max(page, 1);
  logger.info(
    `Getting medias with page = ${page}, limit = ${limit}, type = ${type} and searchText = ${searchText}`
  );
  const query = AppDataSource.getRepository(Media)
    .createQueryBuilder()
    .limit(limit)
    .offset((page - 1) * limit);

  type && query.andWhere("type=:type", { type });
  searchText &&
    query.andWhere("website like :search", { search: `${searchText}%` });
  return query.getManyAndCount();
}

export { findMedias };

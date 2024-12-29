import { Kafka } from "kafkajs";
import { scrape } from "./scrape";
import { MEDIA_TOPIC_FAIL } from "../config/kafka";
import logger from "../helper/logger";

const kafka = new Kafka({
  clientId: "media-scraper-server",
  brokers: [process.env.KAFKA_BROKER || "localhost:9092"],
  logLevel: 1, // Error
});

async function produce(customerId: number, topic: string, url: string) {
  logger.info(`Producing message to topic ${topic} with url ${url}`);
  const producer = kafka.producer();
  await producer.connect();
  await producer.send({
    topic,
    messages: [{ key: customerId.toString(), value: url }],
  });
  await producer.disconnect();
}

async function consume(topic: string) {
  const consumer = kafka.consumer({
    groupId: "media-scraper-group",
    sessionTimeout: 90000,
  });

  await consumer.connect();
  await consumer.subscribe({ topic, fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      try {
        logger.info(`Start consuming message:\n ${JSON.stringify(message)}`);
        if (message.key) {
          const url = message.value?.toString();
          if (url) {
            await scrape(url, parseInt(message.key.toString()));
          }
        }
      } catch {
        logger.info(`Failed consuming message:\n ${JSON.stringify(message)}`);
        if (message.key) {
          const url = message.value?.toString();
          if (url) {
            await produce(
              parseInt(message.key.toString()),
              MEDIA_TOPIC_FAIL,
              url
            );
          }
        }
      }
    },
  });
}

export { consume, produce };

import Redis from "ioredis";

let redisClient: Redis | null = null;

export const getRedis = () => {
  if (redisClient) {
    return redisClient;
  }

  const redisUrl = process.env.REDIS_URL;
  if (!redisUrl) {
    return null;
  }

  redisClient = new Redis(redisUrl, {
    maxRetriesPerRequest: 2,
    lazyConnect: true,
    enableReadyCheck: true,
  });

  redisClient.on("error", () => {
    // Fallback store covers runtime when Redis is unavailable.
  });

  return redisClient;
};

export const redisAvailable = async () => {
  const redis = getRedis();
  if (!redis) {
    return false;
  }

  try {
    await redis.connect();
    await redis.ping();
    return true;
  } catch {
    return false;
  }
};

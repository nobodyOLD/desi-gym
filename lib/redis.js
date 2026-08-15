import { Redis } from '@upstash/redis';
import { Ratelimit } from '@upstash/ratelimit';

// Initialize Upstash Redis client
export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || '',
  token: process.env.UPSTASH_REDIS_REST_TOKEN || '',
});

// Create rate limiter: 10 requests per user per 24 hours (86400 seconds)
export const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, '86400 s'),
  analytics: true,
  prefix: '@upstash/ratelimit',
});

/**
 * Get cached data from Redis
 * @param {string} key - Redis key
 * @returns {Promise<any | null>} Parsed cached data or null
 */
export async function getCached(key) {
  try {
    const data = await redis.get(key);
    if (!data) return null;
    // Upstash client can return parsed JSON automatically depending on config,
    // but parsing manually ensures consistency.
    return typeof data === 'string' ? JSON.parse(data) : data;
  } catch (error) {
    console.error(`Redis Get Error for key ${key}:`, error);
    return null;
  }
}

/**
 * Save data to Redis cache with expiration
 * @param {string} key - Redis key
 * @param {any} data - Data to cache
 * @param {number} expireSeconds - TTL in seconds
 * @returns {Promise<boolean>} Success indicator
 */
export async function setCached(key, data, expireSeconds = 604800) {
  try {
    const serialized = JSON.stringify(data);
    await redis.set(key, serialized, { ex: expireSeconds });
    return true;
  } catch (error) {
    console.error(`Redis Set Error for key ${key}:`, error);
    return false;
  }
}

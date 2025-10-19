import { Redis } from '@upstash/redis';
import dotenv from 'dotenv';

dotenv.config();

if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
  console.warn('⚠️  WARNING: Missing Redis credentials in .env file');
  console.warn('   Redis features will not work without: UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN');
}

export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || 'https://dummy-url.upstash.io',
  token: process.env.UPSTASH_REDIS_REST_TOKEN || 'dummy-token',
});

export const isRedisEnabled = !!(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN);

export default redis;
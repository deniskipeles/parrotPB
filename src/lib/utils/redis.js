import { PUBLIC_REDIS_URL } from '$env/static/public';
///import { env } from '$env/dynamic/private';
import { createClient } from 'redis'

export const redis = createClient({ url: PUBLIC_REDIS_URL })
redis.on('error', err => console.log('Redis Client Error', err));


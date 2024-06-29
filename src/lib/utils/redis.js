import { env } from '$env/dynamic/private';
import { createClient } from 'redis'

export const redis = createClient({ url: env.REDIS_URL })


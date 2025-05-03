import { getMongoURI } from '@/utils/MongoUtils';

export default {
  NodeEnv: (process.env.NODE_ENV ?? ''),
  Port: (process.env.PORT ?? 0),
  host_url: (process.env.HOST_URL ?? ''),
  DB: {
    host: (process.env.DB_HOST ?? ''),
    password: (process.env.DB_PASSWD ?? ''),
    user: (process.env.DB_USER ?? ''),
    URI: getMongoURI((process.env.DB_USER ?? ''), (process.env.DB_PASSWD ?? ''), (process.env.DB_HOST ?? '')),
  },
  judge0: {
    host: (process.env.JUDGE0_HOST ?? ''),
    callback_url: (process.env.JUDGE0_CALLBACK_URL ?? ''),
  },
  session: {
    secret: (process.env.AUTH_SECRET ?? ''),
    maxAge: (process.env.SESSION_MAX_AGE ?? ''),
    updateAge: (process.env.SESSION_UPDATE_AGE ?? ''),
  }
} as const;

/**
 * Environments variables declared here.
 */

/* eslint-disable node/no-process-env */

import { getMongoURI } from '@/utils/MongoUtils';

export default {
  NodeEnv: (process.env.NODE_ENV ?? ''),
  Port: (process.env.PORT ?? 0),
  DB: {
    host: (process.env.DB_HOST ?? ''),
    password: (process.env.DB_PASSWD ?? ''),
    user: (process.env.DB_USER ?? ''),
    URI: getMongoURI((process.env.DB_USER ?? ''), (process.env.DB_PASSWD ?? ''), (process.env.DB_HOST ?? '')),
  },
  judge0: {
    host: (process.env.JUDGE0_HOST ?? ''),
  },
  session: {
    secret: (process.env.SESSION_SECRET ?? ''),
    maxAge: (process.env.SESSION_MAX_AGE ?? ''),
    updateAge: (process.env.SESSION_UPDATE_AGE ?? ''),
  }
} as const;

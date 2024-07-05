/**
 * Environments variables declared here.
 */

/* eslint-disable node/no-process-env */

import { getMongoURI } from '@/utils/MongoUtils';

export default {
  NodeEnv: (process.env.NODE_ENV ?? ''),
  Port: (process.env.PORT ?? 0),
  CookieProps: {
    Key: 'ExpressGeneratorTs',
    Secret: (process.env.COOKIE_SECRET ?? ''),
    // Casing to match express cookie options
    Options: {
      httpOnly: true,
      signed: true,
      path: (process.env.COOKIE_PATH ?? ''),
      maxAge: Number(process.env.COOKIE_EXP ?? 0),
      domain: (process.env.COOKIE_DOMAIN ?? ''),
      secure: (process.env.SECURE_COOKIE === 'true'),
    },
  },
  Jwt: {
    Secret: (process.env.JWT_SECRET ??  ''),
    Exp: (process.env.COOKIE_EXP ?? ''), // exp at the same time as the cookie
  },
  DB: {
    host: (process.env.DB_HOST ?? ''),
    password: (process.env.DB_PASSWD ?? ''),
    user: (process.env.DB_USER ?? ''),
    URI: getMongoURI((process.env.DB_USER ?? ''), (process.env.DB_PASSWD ?? ''), (process.env.DB_HOST ?? '')),
  },
  judge0: {
    host: (process.env.JUDGE0_HOST ?? ''),
  },
  judge: {
    TasksPath: (process.env.PROBLEM_TASK_PATH ?? ''),
  },
} as const;

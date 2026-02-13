const path = require('path');

module.exports = ({ env }) => {
  const client = env('DATABASE_CLIENT', 'sqlite');
  const isProduction = env('NODE_ENV') === 'production';

  // Railway and most managed Postgres have limited connections (often 20).
  // Use a small pool to avoid exhausting the database connection limit.
  // Longer timeouts for production: Railway/other hosts may put DBs to sleep;
  // the first connection can take 60–90+ seconds while the DB wakes up.
  const postgresPool = isProduction
    ? {
        min: 0,
        max: 5,
        acquireTimeoutMillis: 120000,
        createTimeoutMillis: 90000,
        idleTimeoutMillis: 30000,
      }
    : { min: 0, max: 10 };

  const connections = {
    mysql: {
      connection: env('DATABASE_URL') 
        ? { connectionString: env('DATABASE_URL'), ssl: { rejectUnauthorized: false } }
        : {
        host: env('DATABASE_HOST', 'localhost'),
        port: env.int('DATABASE_PORT', 3306),
        database: env('DATABASE_NAME', 'strapi'),
        user: env('DATABASE_USERNAME', 'strapi'),
        password: env('DATABASE_PASSWORD', 'strapi'),
        ssl: env.bool('DATABASE_SSL', false) && {
          key: env('DATABASE_SSL_KEY', undefined),
          cert: env('DATABASE_SSL_CERT', undefined),
          ca: env('DATABASE_SSL_CA', undefined),
          capath: env('DATABASE_SSL_CAPATH', undefined),
          cipher: env('DATABASE_SSL_CIPHER', undefined),
          rejectUnauthorized: env.bool('DATABASE_SSL_REJECT_UNAUTHORIZED', true),
        },
      },
      pool: { min: 0, max: 50 },
    },
    postgres: {
      connection: env('DATABASE_URL') 
        ? { connectionString: env('DATABASE_URL'), ssl: { rejectUnauthorized: false } }
        : {
            host: env('DATABASE_HOST', 'localhost'),
            port: env.int('DATABASE_PORT', 5432),
            database: env('DATABASE_NAME', 'strapi'),
            user: env('DATABASE_USERNAME', 'strapi'),
            password: env('DATABASE_PASSWORD', 'strapi'),
            ssl: env.bool('DATABASE_SSL', false) && {
              key: env('DATABASE_SSL_KEY', undefined),
              cert: env('DATABASE_SSL_CERT', undefined),
              ca: env('DATABASE_SSL_CA', undefined),
              capath: env('DATABASE_SSL_CAPATH', undefined),
              cipher: env('DATABASE_SSL_CIPHER', undefined),
              rejectUnauthorized: env.bool('DATABASE_SSL_REJECT_UNAUTHORIZED', true),
            },
            schema: env('DATABASE_SCHEMA', 'public'),
          },
      pool: postgresPool,
    },
    sqlite: {
      connection: {
        filename: path.join(__dirname, '..', '.tmp/data.db'),
      },
      useNullAsDefault: true,
      pool: { min: 0, max: 1 },
    },
  };

  return {
    connection: {
      client,
      ...connections[client],
      acquireConnectionTimeout: 120000,
    },
  };
};

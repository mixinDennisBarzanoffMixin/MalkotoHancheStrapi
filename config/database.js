const path = require('path');

module.exports = ({ env }) => {
  const client = env('DATABASE_CLIENT', 'postgres');

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
      pool: { min: 0, max: 50 },
    },
    sqlite: {
      connection: {
        filename: path.join(__dirname, '..', env('DATABASE_FILENAME', '.tmp/data.db')),
      },
      useNullAsDefault: true,
      pool: { min: 0, max: 1 },
    },
  };

  return {
    connection: {
      client,
      ...connections[client],
      acquireConnectionTimeout: 300000,
    },
  };
};

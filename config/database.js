const path = require('path');

module.exports = ({ env }) => {
  const client = env('DATABASE_CLIENT', 'sqlite');
  const isProduction = env('NODE_ENV') === 'production';
  const databaseUrl = env('DATABASE_URL');
  const databasePublicUrl = env('DATABASE_PUBLIC_URL');

  const isValidPostgresUrl = (url) =>
    url &&
    !url.includes('${{') &&
    (url.startsWith('postgresql://') || url.startsWith('postgres://'));

  // Railway: DATABASE_URL = private (in-Railway only). DATABASE_PUBLIC_URL = works from local.
  // Template vars (${{...}}) aren't substituted locally → use DATABASE_PUBLIC_URL for local dev.
  const effectiveDatabaseUrl = isValidPostgresUrl(databaseUrl)
    ? databaseUrl
    : isValidPostgresUrl(databasePublicUrl)
      ? databasePublicUrl
      : null;

  const hasValidPostgresUrl = !!effectiveDatabaseUrl;
  const usePostgres = client === 'postgres' && hasValidPostgresUrl;
  const effectiveClient = usePostgres ? 'postgres' : client === 'postgres' ? 'sqlite' : client;

  if (client === 'postgres' && !usePostgres && !isProduction) {
    console.log(
      '[database] No valid Postgres URL (DATABASE_URL or DATABASE_PUBLIC_URL). Using SQLite. ' +
      'To use Railway DB locally: set DATABASE_PUBLIC_URL in .env to the public URL from Railway dashboard.'
    );
  }

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
      connection: hasValidPostgresUrl
        ? { connectionString: effectiveDatabaseUrl, ssl: { rejectUnauthorized: false } }
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
      client: effectiveClient,
      ...connections[effectiveClient],
      acquireConnectionTimeout: 120000,
    },
  };
};

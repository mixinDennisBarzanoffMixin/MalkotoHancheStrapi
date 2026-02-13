module.exports = ({ env }) => {
  // Railway: PUBLIC_URL or RAILWAY_STATIC_URL (https://xxx.railway.app) or custom domain
  const publicUrl =
    env('PUBLIC_URL') ||
    (env('RAILWAY_PUBLIC_DOMAIN') ? `https://${env('RAILWAY_PUBLIC_DOMAIN')}` : null);

  return {
    host: env('HOST', '0.0.0.0'),
    port: env.int('PORT', 1337),
    app: {
      keys: env.array('APP_KEYS'),
    },
    webhooks: {
      populateRelations: env.bool('WEBHOOKS_POPULATE_RELATIONS', false),
    },
    url: publicUrl,
    proxy: true,
    cors: {
      enabled: true,
      origin: [publicUrl].filter(Boolean),
      credentials: true,
    },
  };
};

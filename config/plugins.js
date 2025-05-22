module.exports = () => ({
  'documentation': {
    enabled: true,
    config: {
      openapi: '3.0.0',
      info: {
        version: '1.0.0',
        title: 'Strapi API Documentation',
        description: 'Documentation for the Strapi API',
      },
      servers: [
        {
          url: 'http://localhost:1337',
          description: 'Development server',
        },
      ],
    },
  },
});

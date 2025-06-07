module.exports = ({ env }) => ({
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
  email: {
    config: {
      provider: '@strapi/provider-email-amazon-ses',
      providerOptions: {
        key: env('AWS_SES_KEY'),
        secret: env('AWS_SES_SECRET'),
        amazon: `https://email.${env('AWS_SES_REGION', 'eu-west-1')}.amazonaws.com`,
      },
      settings: {
        defaultFrom: env('AWS_SES_FROM'),
        defaultReplyTo: env('AWS_SES_REPLY_TO'),
      },
    },
  },
});

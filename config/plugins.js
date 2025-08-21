module.exports = ({ env }) => ({
  upload: {
    config: {
      provider: '@strapi/provider-upload-aws-s3',
      providerOptions: {
        s3Options: {
          credentials: {
            accessKeyId: env('S3_ACCESS_KEY'),
            secretAccessKey: env('S3_ACCESS_SECRET'),
          },
          endpoint: env('S3_ENDPOINT'),
          region: env('S3_REGION'),
          params: {
            Bucket: env('S3_BUCKET'),
          },
          forcePathStyle: true
        }
      },
      actionOptions: {
        upload: {},
        uploadStream: {},
        delete: {},
      }
    },
  },
  email: {
    config: {
      provider: '@strapi/provider-email-amazon-ses',
      providerOptions: {
        key: env('AWS_SES_KEY'),
        secret: env('AWS_SES_SECRET'),
        amazon: `https://email.${env('AWS_SES_REGION')}.amazonaws.com`,
      },
      settings: {
        defaultFrom: env('AWS_SES_FROM'),
        defaultReplyTo: env('AWS_SES_FROM'),
      },
    },
  },
});

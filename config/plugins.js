module.exports = ({ env }) => ({
  upload: {
    config: {
      provider: 'strapi-provider-upload-aws-s3',
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
          forcePathStyle: true // Wichtig für S3-kompatible Dienste
        }
      },
    },
  },
});

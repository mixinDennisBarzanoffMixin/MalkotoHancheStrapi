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
          // Use private endpoint for backend operations (no egress fees)
          endpoint: env('S3_ENDPOINT_PRIVATE'),
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
});

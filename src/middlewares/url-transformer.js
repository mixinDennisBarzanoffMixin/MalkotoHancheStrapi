'use strict';

/**
 * URL Transformer Middleware
 * Transforms internal Railway URLs to public URLs in responses
 * This avoids egress fees while maintaining browser accessibility
 */

module.exports = (config, { strapi }) => {
  return async (ctx, next) => {
    strapi.log.debug('URL transformer middleware starting');
    
    await next();

    // Only transform for successful responses with JSON content
    if (ctx.status < 200 || ctx.status >= 300 || !ctx.body) {
      strapi.log.debug('Skipping transformation - invalid response status or empty body');
      return;
    }

    const privateEndpoint = process.env.S3_ENDPOINT_PRIVATE;
    const publicEndpoint = process.env.FILE_SERVER_PUBLIC_URL;

    // Skip transformation if endpoints are not configured
    if (!privateEndpoint || !publicEndpoint) {
      strapi.log.warn('URL transformation skipped - endpoints not configured');
      return;
    }

    try {
      strapi.log.debug('Transforming URLs in response body');
      // Transform URLs in the response body
      const transformedBody = transformUrls(ctx.body, privateEndpoint, publicEndpoint);
      ctx.body = transformedBody;
      strapi.log.debug('URL transformation completed successfully');
    } catch (error) {
      strapi.log.error('URL transformation error:', error);
      strapi.log.error('Original body:', ctx.body);
    }
  };
};

/**
 * Recursively transforms URLs in objects/arrays
 */
function transformUrls(obj, privateEndpoint, publicEndpoint) {
  if (typeof obj === 'string') {
    // Transform URLs in strings
    const transformed = obj.replace(privateEndpoint, publicEndpoint);
    if (transformed !== obj) {
      strapi.log.debug(`Transformed URL from ${obj} to ${transformed}`);
    }
    return transformed;
  }

  if (Array.isArray(obj)) {
    // Transform URLs in arrays
    strapi.log.debug('Processing array of length:', obj.length);
    return obj.map(item => transformUrls(item, privateEndpoint, publicEndpoint));
  }

  if (obj && typeof obj === 'object') {
    // Transform URLs in objects
    strapi.log.debug('Processing object with keys:', Object.keys(obj));
    const transformed = {};
    for (const [key, value] of Object.entries(obj)) {
      transformed[key] = transformUrls(value, privateEndpoint, publicEndpoint);
    }
    return transformed;
  }

  return obj;
} 
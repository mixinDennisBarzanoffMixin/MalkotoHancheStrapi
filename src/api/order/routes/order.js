'use strict';

/**
 * order router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/orders',
      handler: 'api::order.order.create',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'GET',
      path: '/orders',
      handler: 'api::order.order.find',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'GET',
      path: '/orders/:id',
      handler: 'api::order.order.findOne',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
}; 
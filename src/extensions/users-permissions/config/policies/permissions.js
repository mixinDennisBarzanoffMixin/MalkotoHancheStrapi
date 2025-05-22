'use strict';

module.exports = async (ctx, next) => {
  // Set default permissions for public role
  const publicRole = await strapi.query('plugin::users-permissions.role').findOne({
    where: { type: 'public' },
  });

  if (publicRole) {
    const permissions = await strapi.query('plugin::users-permissions.permission').findMany({
      where: { role: publicRole.id },
    });

    // Add product permissions if they don't exist
    const productPermissions = permissions.filter(p => p.controller === 'product');
    if (productPermissions.length === 0) {
      await strapi.query('plugin::users-permissions.permission').create({
        data: {
          action: 'api::product.product.find',
          role: publicRole.id,
        },
      });
      await strapi.query('plugin::users-permissions.permission').create({
        data: {
          action: 'api::product.product.findOne',
          role: publicRole.id,
        },
      });
    }
  }

  return next();
}; 
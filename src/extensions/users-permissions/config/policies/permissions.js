'use strict';

module.exports = async (ctx, next) => {
  // Set default permissions for public role
  const publicRole = await strapi.query('plugin::users-permissions.role').findOne({
    where: { type: 'public' },
  });

  if (publicRole) {
    // Explicitly check for specific permissions
    const requiredPermissions = [
      'api::product.product.find',
      'api::product.product.findOne',
      'api::category.category.find',
      'api::category.category.findOne'
    ];

    const existingPermissions = await strapi.query('plugin::users-permissions.permission').findMany({
      where: { 
        role: publicRole.id,
        action: { $in: requiredPermissions }
      },
    });

    // Create missing permissions
    const existingActions = existingPermissions.map(p => p.action);
    console.log(existingActions);
    const missingPermissions = requiredPermissions.filter(action => !existingActions.includes(action));
    console.log(missingPermissions);

    for (const action of missingPermissions) {
      await strapi.query('plugin::users-permissions.permission').create({
        data: {
          action,
          role: publicRole.id,
        },
      });
    }
  }

  return next();
}; 
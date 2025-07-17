'use strict';

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::order.order', ({ strapi }) => ({
  async create(ctx) {
    const { data } = ctx.request.body;
    
    // Validiere die Eingabedaten
    if (!data || !data.items || !Array.isArray(data.items)) {
      return ctx.badRequest('Invalid request structure');
    }

    // Berechne Gesamtbetrag und Versandkosten
    let totalAmount = 0;

    // Hole aktuelle Produktpreise und berechne Gesamtsumme
    for (const item of data.items) {
      console.log(item);
      const product = await strapi.entityService.findOne('api::product.product', item.product);
      console.log(product);
      if (!product) {
        return ctx.badRequest(`Product with ID ${item.id} not found`);
      }
      totalAmount += product.price * item.quantity;
      item.priceAtTime = product.price;
    }
    const shippingCost = totalAmount > 80 ? 0 : 4; // Basis-Versandkosten

    // Generiere eindeutige Bestellnummer
    const orderNumber = 'ORD-' + Date.now();
    const deliveryNotes = data.deliveryNotes;

    // Erstelle die Bestellung
    const order = await strapi.entityService.create('api::order.order', {
      data: {
        orderNumber,
        items: data.items,
        shippingAddress: data.shippingAddress,
        totalAmount: totalAmount + shippingCost,
        shippingCost,
        status: 'pending',
        customer: ctx.state.user?.id,
        customerEmail: data.customerEmail,
        phoneNumber: data.phoneNumber,
        publishedAt: new Date(),
        deliveryNotes: deliveryNotes
      },
      populate: {
        items: {
          populate: {
            product: {
              populate: ['image']
            }
          }
        },
        shippingAddress: true
      }
    });

    // Sende Benachrichtigungen
    await strapi.service('api::order.order').sendNotifications(order);

    return { data: order };
  }
})); 
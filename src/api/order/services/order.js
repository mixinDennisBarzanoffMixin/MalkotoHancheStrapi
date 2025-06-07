'use strict';

const { createCoreService } = require('@strapi/strapi').factories;
const sendOwnerEmail = require('./emails/send_owner_email');
const sendCustomerEmail = require('./emails/send_customer_email');
const sendTwillio = require('./twillio');

module.exports = createCoreService('api::order.order', ({ strapi }) => ({
  async sendNotifications(order) {
    console.log(order);
    // E-Mail an den Kunden und Besitzer senden
    await sendOwnerEmail(order, 'denis.barzanov2002@gmail.com');
    await sendOwnerEmail(order, 'ivankageorgievablagoeva@abv.bg');
    if (order.customerEmail) {
      await sendCustomerEmail(order);
    }
    await sendTwillio(order, '+35979399088');
  }
})); 
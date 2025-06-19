'use strict';

const { createCoreService } = require('@strapi/strapi').factories;
const sendOwnerEmail = require('./emails/send_owner_email');
const sendCustomerEmail = require('./emails/send_customer_email');
const sendTwillio = require('./twillio');

module.exports = createCoreService('api::order.order', ({ strapi }) => ({
  async sendNotifications(order) {
    strapi.log.info('Sending notifications for order:', order);
    
    try {
      // E-Mail an den Kunden und Besitzer senden
      strapi.log.debug('Sending owner email to denis.barzanov2002@gmail.com');
      await sendOwnerEmail(order, 'denis.barzanov2002@gmail.com');
      
      strapi.log.debug('Sending owner email to ivankageorgievablagoeva@abv.bg'); 
      await sendOwnerEmail(order, 'ivankageorgievablagoeva@abv.bg');

      if (order.customerEmail) {
        strapi.log.debug('Sending customer email to', order.customerEmail);
        await sendCustomerEmail(order);
      } else {
        strapi.log.debug('No customer email provided, skipping customer notification');
      }

      strapi.log.debug('Sending SMS notification to +35979399088');
      await sendTwillio(order, '+35979399088');
      
      strapi.log.info('Successfully sent all notifications for order');
    } catch (error) {
      strapi.log.error('Error sending notifications:', error);
      throw error;
    }
  }
}));
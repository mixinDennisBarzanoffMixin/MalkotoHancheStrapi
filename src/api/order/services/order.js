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
      console.log('Sending owner email to', process.env.OWNER_EMAIL_1);
      await sendOwnerEmail(order, process.env.OWNER_EMAIL_1);
      
      console.log('Sending owner email to', process.env.OWNER_EMAIL_2); 
      await sendOwnerEmail(order, process.env.OWNER_EMAIL_2);

      console.log('Sending owner email to', process.env.OWNER_EMAIL_3);
      await sendOwnerEmail(order, process.env.OWNER_EMAIL_3);

      if (order.customerEmail) {
        console.log('Sending customer email to', order.customerEmail);
        await sendCustomerEmail(order);
      } else {
        console.log('No customer email provided, skipping customer notification');
      }

      console.log('Sending SMS notification to', process.env.TWILIO_TO_PHONE_NUMBER);
      await sendTwillio(order, process.env.TWILIO_TO_PHONE_NUMBER);
      
      strapi.log.info('Successfully sent all notifications for order');
    } catch (error) {
      strapi.log.error('Error sending notifications:', error);
      throw error;
    }
  }
}));
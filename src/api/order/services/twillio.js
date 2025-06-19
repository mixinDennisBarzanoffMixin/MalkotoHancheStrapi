async function sendTwillio(order, toNumber) {
    // Twilio Integration
    try {
      const accountSid = process.env.TWILIO_ACCOUNT_SID;
      const authToken = process.env.TWILIO_AUTH_TOKEN;
      const fromNumber = process.env.TWILIO_PHONE_NUMBER;
      
      strapi.log.debug('Twilio credentials:', {
        accountSid,
        fromNumber
      });
      
      if (!accountSid || !authToken || !fromNumber) {
        throw new Error('Missing required Twilio environment variables');
      }

      const client = require('twilio')(accountSid, authToken);

      // Erstelle TwiML für den Anruf
      const twiml = `
        <Response>
          <Say loop="3" voice="Google.bg-BG-Standard-A" language="bg-BG">
            <break time="1s"/>
            Поръчка номер <say-as interpret-as="digits">${order.orderNumber}</say-as>
            общо ${order.totalAmount.toFixed(2)} лева до ${order.shippingAddress.city}
          </Say>
        </Response>
      `;

      // Anruf tätigen
      try {
        const call = await client.calls.create({
          twiml: twiml,
          from: fromNumber,
          to: toNumber
        });
        strapi.log.info('Call initiated successfully:', call.sid);
      } catch (error) {
        strapi.log.error('Failed to make call:', error.message);
        // Wir lassen den Prozess weiterlaufen, auch wenn der Anruf fehlschlägt
      }
    } catch (error) {
      strapi.log.error('Twilio notification error:', error);
      // Wir werfen den Fehler nicht weiter, damit die E-Mail-Benachrichtigung nicht beeinträchtigt wird
    }
}

module.exports = sendTwillio;
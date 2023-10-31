addEventListener('fetch', event => {
    event.respondWith(handleRequest(event.request))
  })
  
  const TWILIO_ACCOUNT_SID = 'ID';
  const TWILIO_AUTH_TOKEN = 'ID';
  const TWILIO_PHONE_NUMBER = '+61412476171';
  
  async function handleRequest(request) {
    if (request.method === 'POST') {
      const data = await request.json();
  
      // Extract email data. The structure can vary based on your email provider's data format.
      const senderEmail = data.sender; 
      const messageBody = data.body;
  
      // Map sender email to phone number (customize this mapping based on your needs)
      const phoneMappings = {
        'support@aatroxcommunications.com.au': '+6142345678'  // Replace with actual phone number
        // Add other mappings as needed
      };
  
      const recipientPhoneNumber = phoneMappings[senderEmail];
      if (recipientPhoneNumber) {
        await sendSMS(recipientPhoneNumber, messageBody);
        return new Response('SMS sent', {status: 200});
      } else {
        return new Response('No mapping found for email', {status: 400});
      }
    } else {
      return new Response('Invalid request method', {status: 405});
    }
  }
  
  async function sendSMS(to, body) {
    const url = `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`;
  
    const formData = new URLSearchParams();
    formData.append('From', TWILIO_PHONE_NUMBER);
    formData.append('To', to);
    formData.append('Body', body);
  
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': 'Basic ' + btoa(TWILIO_ACCOUNT_SID + ':' + TWILIO_AUTH_TOKEN),
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: formData.toString()
    });
  
    return response;
  }
  
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

const TWILIO_ACCOUNT_SID = 'ID';
const TWILIO_AUTH_TOKEN = 'ID';
const TWILIO_PHONE_NUMBER = '+61XXXXXXXX'; //Add Your Twilio Number you will send SMS with

async function handleRequest(request) {
  if (request.method === 'POST') {
    try {
      const data = await request.json();
      const senderEmail = data.sender;
      const messageBody = data.body;

      const phoneMappings = {
        'support@aatroxcommunications.com.au': '+61XXXXXXXX'  // Replace with actual phone number
        // Add other mappings as needed
      };

      const recipientPhoneNumber = phoneMappings[senderEmail];
      if (recipientPhoneNumber) {
        const response = await sendSMS(recipientPhoneNumber, messageBody);
        if (response.ok) {
          return new Response('SMS sent', { status: 200 });
        } else {
          console.error(`Failed to send SMS: ${response.statusText}`);
          return new Response('Failed to send SMS', { status: 500 });
        }
      } else {
        return new Response('No mapping found for email', { status: 400 });
      }
    } catch (error) {
      console.error(`Error processing request: ${error}`);
      return new Response('Error processing request', { status: 500 });
    }
  } else {
    return new Response('Invalid request method', { status: 405 });
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

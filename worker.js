addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

const TWILIO_PHONE_NUMBER = '+61480092025'; // The client number or number on twilio used to send the SMS 

async function handleRequest(request) {
  if (request.method === 'POST') {
    const contentType = request.headers.get('content-type') || '';
    if (contentType.includes('multipart/form-data')) {
      try {
        const formData = await parseMultipartFormData(request, contentType);
        console.log('Parsed form data:', formData); // Log the parsed data

        const senderEmail = extractEmail(formData['from']);
        const messageBody = formData['text'];

        console.log(`Extracted sender email: ${senderEmail}`); // Log the extracted email
        console.log(`Extracted message body: ${messageBody}`); // Log the message body

        const phoneMappings = {

          //Nafis Setup
          'emailparase': '+number', // Replace with actual phone number
          'emailauth': '+number' //100% required so spammer don't pass 


          // Add other mappings as needed....


        };



        // had to create error logs - Leave it default so we can see errors
        const recipientPhoneNumber = phoneMappings[senderEmail];
        if (recipientPhoneNumber) {
          const smsResponse = await sendSMS(recipientPhoneNumber, messageBody);
          if (smsResponse.ok) {
            return new Response('SMS sent', { status: 200 });
          } else {
            const errorBody = await smsResponse.text();
            console.error(`Failed to send SMS: ${smsResponse.statusText}, Response Body: ${errorBody}`);
            return new Response('Failed to send SMS', { status: smsResponse.status });
          }
        } else {
          console.log('No mapping found for email', senderEmail); // Log when no mapping is found
          return new Response('No mapping found for email', { status: 400 });
        }
      } catch (error) {
        console.error('Error in handleRequest:', error);
        return new Response(`Failed to parse form data: ${error}`, { status: 400 });
      }
    } else {
      return new Response('Unsupported content type', { status: 415 });
    }
  } else {
    return new Response('Invalid request method', { status: 405 });
  }
}

//Configure Multi-part data 
async function parseMultipartFormData(request, contentType) {
  const body = await request.text();
  const boundary = contentType.split('boundary=')[1];
  const parts = body.split(`--${boundary}`);
  let formData = {};

  parts.forEach(part => {
    const [rawHeaders, content] = part.split('\r\n\r\n');
    if (content) {
      const contentDisposition = rawHeaders.match(/name="([^"]+)"/);
      if (contentDisposition) {
        const name = contentDisposition[1];
        formData[name] = content.trim();
      }
    }
  });

  console.log('FormData after parsing:', formData); // Log the final form data
  return formData;
}

function extractEmail(raw) {
  const match = raw.match(/<(.+?)>/);
  return match ? match[1].trim() : raw.trim();
}

async function sendSMS(to, body) {
  // Ensure TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN are correctly set
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

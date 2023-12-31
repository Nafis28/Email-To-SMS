
![image](https://github.com/Nafis28/Email-To-SMS/assets/30291815/a91bd6db-df1d-436d-8c16-0e6c9b93eca1)


#Info Code is Hidden. If you need to access. feel free to contact me / DM me on LinkdIn

# Email-to-SMS Bridge

A simple function that listens for incoming POST requests containing email data, then sends a corresponding SMS message using Twilio.

## Features

- Maps sender email addresses to phone numbers for specific recipients.
- Uses Twilio API to send SMS messages.
- Returns relevant HTTP responses based on the action taken.

## Prerequisites

- A Twilio account with valid `TWILIO_ACCOUNT_SID` and `TWILIO_AUTH_TOKEN`.
- The phone number associated with your Twilio account (in this example, `+61412345678`).

## Usage

This is currectly working on the server side. I'm working on specified email events (like delivery), SendGrid triggers its Webhook Event and sends an HTTP POST request to the private server endpoint.

1. Deploy this function to your preferred server platform. 
2. Send a POST request to the function's endpoint with the following JSON structure:

```json
{
  "sender": "support@yourdomain.com",
  "body": "Your email body content here"
}
```
## Development - Completed

- [x] User with an approved email sends an email via SendGrid.
- [x] SendGrid processes the email.
- [x] On specified email events (like delivery), SendGrid triggers its Webhook Event and sends an HTTP POST request to the our server endpoint.
- [x] Server checks the sender's email against a predefined mapping of email-to-mobile numbers.
- [x] If the sender is approved, an API call to Twilio with the associated mobile number.
- [x] Twilio processes the API request and sends an SMS to the mapped mobile number.
- [x] Test SMS received by the associated recipient.


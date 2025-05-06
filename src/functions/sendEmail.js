// import { google } from 'googleapis';

/**
 * Sends an email using the Gmail API.
 * @param {string} senderEmail - The email address of the sender.
 * @param {string} recipientEmail - The email address of the recipient.
 * @param {string} subject - The subject of the email.
 * @param {string} message - The body of the email.
 */
export async function sendEmail(senderEmail, recipientEmail, subject, message) {
   try {
      // Load OAuth2 client with credentials
      const oAuth2Client = new google.auth.OAuth2(
         process.env.CLIENT_ID,
         process.env.CLIENT_SECRET,
         process.env.REDIRECT_URI
      )
      oAuth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN })

      // Create the Gmail API client
      const gmail = google.gmail({ version: 'v1', auth: oAuth2Client })

      // Create the email content
      const emailContent = [
         `From: ${senderEmail}`,
         `To: ${recipientEmail}`,
         `Subject: ${subject}`,
         '',
         message,
      ].join('\n')

      // Encode the email content in base64
      const encodedMessage = Buffer.from(emailContent)
         .toString('base64')
         .replace(/\+/g, '-')
         .replace(/\//g, '_')
         .replace(/=+$/, '')

      // Send the email
      const response = await gmail.users.messages.send({
         userId: 'me',
         requestBody: {
            raw: encodedMessage,
         },
      })

      console.log('Email sent successfully:', response.data)
   } catch (error) {
      console.error('Error sending email:', error)
      throw error
   }
}

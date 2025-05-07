import { google } from 'googleapis'
import dotenv from 'dotenv'

dotenv.config()

export default async function handler(req, res) {
   if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method Not Allowed' })
   }

   const { to, subject, message } = req.body

   if (!to || !subject || !message) {
      return res.status(400).json({ error: 'Missing required fields' })
   }

   try {
      const oAuth2Client = new google.auth.OAuth2(
         process.env.VITE_CLIENT_ID,
         process.env.VITE_CLIENT_SECRET,
         process.env.VITE_REDIRECT_URI
      )

      oAuth2Client.setCredentials({
         refresh_token: process.env.VITE_REFRESH_TOKEN,
      })

      const gmail = google.gmail({ version: 'v1', auth: oAuth2Client })

      const emailContent = [
         `From: "Your App" <your-email@gmail.com>`,
         `To: ${to}`,
         `Subject: ${subject}`,
         '',
         message,
      ].join('\n')

      const encodedMessage = Buffer.from(emailContent)
         .toString('base64')
         .replace(/\+/g, '-')
         .replace(/\//g, '_')
         .replace(/=+$/, '')

      await gmail.users.messages.send({
         userId: 'me',
         requestBody: {
            raw: encodedMessage,
         },
      })

      res.status(200).json({
         success: true,
         message: 'Email sent successfully',
      })
   } catch (error) {
      console.error('Error sending email:', error)
      res.status(500).json({ error: 'Failed to send email' })
   }
}

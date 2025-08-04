const nodemailer = require('nodemailer');
const axios = require('axios');
require('dotenv').config();

let transporter;

function getTransporter() {
  if (transporter) return transporter;
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
  return transporter;
}

// PUBLIC_INTERFACE
async function sendEmailNotification(subject, text, html) {
  if (!process.env.NOTIFY_EMAIL_TO) return; // No recipient configured

  const transporter = getTransporter();
  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to: process.env.NOTIFY_EMAIL_TO,
    subject,
    text,
    html
  });
}

// PUBLIC_INTERFACE
async function sendSlackNotification(message) {
  if (!process.env.SLACK_WEBHOOK_URL) return;
  await axios.post(process.env.SLACK_WEBHOOK_URL, { text: message });
}

// PUBLIC_INTERFACE
async function notifyAll(subject, body, html) {
  await Promise.allSettled([
    sendEmailNotification(subject, body, html),
    sendSlackNotification(`*${subject}*\n${body}`)
  ]);
}

module.exports = {
  sendEmailNotification,
  sendSlackNotification,
  notifyAll
};

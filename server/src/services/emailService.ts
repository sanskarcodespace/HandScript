import nodemailer from 'nodemailer';
import { logger } from '../utils/logger';

// Create reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_PORT === '465', // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendEmail = async (to: string, subject: string, html: string) => {
  try {
    const from = process.env.EMAIL_FROM || 'noreply@handnoteai.com';
    const info = await transporter.sendMail({
      from: `"HandNote AI" <${from}>`,
      to,
      subject,
      html,
    });
    logger.info(`Message sent: ${info.messageId}`);
    return true;
  } catch (error) {
    logger.error(`Error sending email: ${error}`);
    return false;
  }
};

const baseHtmlTemplate = (content: string) => `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: 'Inter', sans-serif; background-color: #f9fafb; color: #1f2937; padding: 20px; }
    .container { max-width: 600px; margin: 0 auto; background: white; padding: 30px; border-radius: 8px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); }
    .header { text-align: center; margin-bottom: 30px; }
    .header h1 { color: #4f46e5; margin: 0; }
    .button { display: inline-block; background-color: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; margin-top: 20px; margin-bottom: 20px; }
    .footer { margin-top: 30px; font-size: 12px; color: #6b7280; text-align: center; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>HandNote AI</h1>
    </div>
    ${content}
    <div class="footer">
      &copy; ${new Date().getFullYear()} HandNote AI. All rights reserved.
    </div>
  </div>
</body>
</html>
`;

export const sendWelcomeEmail = async (to: string, name: string, token: string) => {
  const verificationUrl = `${process.env.CLIENT_URL}/verify-email?token=${token}`;
  const html = baseHtmlTemplate(`
    <p>Hi ${name},</p>
    <p>Welcome to HandNote AI! We're excited to have you on board.</p>
    <p>Please click the button below to verify your email address and activate your account:</p>
    <div style="text-align: center;">
      <a href="${verificationUrl}" class="button">Verify Email</a>
    </div>
    <p>If the button doesn't work, copy and paste this link into your browser:</p>
    <p><a href="${verificationUrl}">${verificationUrl}</a></p>
  `);
  return sendEmail(to, 'Verify your email for HandNote AI', html);
};

export const sendPasswordResetEmail = async (to: string, token: string) => {
  const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${token}`;
  const html = baseHtmlTemplate(`
    <p>Hello,</p>
    <p>We received a request to reset your password. If you didn't make this request, you can safely ignore this email.</p>
    <p>Click the button below to set a new password. This link will expire in 1 hour.</p>
    <div style="text-align: center;">
      <a href="${resetUrl}" class="button">Reset Password</a>
    </div>
    <p style="font-size: 13px; color: #4b5563; margin-top: 20px;"><strong>Security Tip:</strong> Never share your password or this link with anyone.</p>
  `);
  return sendEmail(to, 'Reset your HandNote AI password', html);
};

export const sendLoginNotificationEmail = async (to: string, device: string, time: string) => {
  const html = baseHtmlTemplate(`
    <p>Hello,</p>
    <p>We detected a new login to your HandNote AI account.</p>
    <ul>
      <li><strong>Device/Browser:</strong> ${device}</li>
      <li><strong>Time:</strong> ${time}</li>
    </ul>
    <p>If this was you, no further action is required.</p>
    <p>If you don't recognize this activity, please reset your password immediately.</p>
  `);
  return sendEmail(to, 'New login to your account', html);
};

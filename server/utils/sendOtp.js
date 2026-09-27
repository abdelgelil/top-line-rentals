import nodemailer from 'nodemailer';

let transporter;

function getTransporter() {
  if (transporter) return transporter;
  const user = typeof process.env.EMAIL_USER === 'string' ? process.env.EMAIL_USER.trim() : '';
  const pass = typeof process.env.EMAIL_PASS === 'string' ? process.env.EMAIL_PASS.trim().replace(/\s+/g, '') : '';
  if (!user || !pass) {
    console.error('[sendOTP Error] EMAIL_USER or EMAIL_PASS environment variables are missing.');
    throw new Error('Server email configuration is missing credentials.');
  }

  transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    connectionTimeout: 15_000,
    greetingTimeout: 5_000,
    socketTimeout: 15_000,
    auth: { user, pass },
  });
  return transporter;
}

export const sendOTP = async ({ email, otpCode, purpose = 'verification' }) => {
  try {
    if (!email || !otpCode) {
      throw new Error('Email and OTP code are required.');
    }

    if (process.env.NODE_ENV === 'development') {
      console.log(`[DEV OTP] ${purpose} code for ${email}: ${otpCode}`);
      return { success: true, delivered: false, development: true };
    }

    const mailer = getTransporter();
    const user = process.env.EMAIL_USER.trim();
    console.log(`[sendOTP] Attempting to send OTP email to ${email}...`);
    const info = await mailer.sendMail({
      from: `TopLine Rentals <${user}>`,
      to: email,
      subject: purpose === 'password reset' ? 'Your Password Reset OTP Code' : `Your Top Line ${purpose} code`,
      text: `Your ${purpose} code is ${otpCode}. It expires in 10 minutes. If you did not request it, you can ignore this email.`,
      html: `<div style="font-family:Arial,sans-serif;padding:20px;border:1px solid #ddd;border-radius:8px"><h2 style="color:#1e293b">Password Reset Request</h2><p>Your verification code is:</p><h1 style="color:#2563eb;letter-spacing:5px;font-size:32px">${otpCode}</h1><p>This code is valid for 10 minutes.</p></div>`,
    });
    console.log(`[sendOTP Success] Email sent: ${info.messageId}`);
    return { success: true, delivered: true };
  } catch (error) {
    console.error(`[sendOTP Error] Failed to send ${purpose} email to ${email}:`, {
      message: error.message || String(error),
      code: error.code,
      command: error.command,
      responseCode: error.responseCode,
      response: error.response,
    });
    throw error;
  }
};

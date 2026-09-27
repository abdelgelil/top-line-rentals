import nodemailer from 'nodemailer';

let transporter;

function getTransporter() {
  if (transporter) return transporter;
  const { EMAIL_USER, EMAIL_PASS } = process.env;
  if (!EMAIL_USER || !EMAIL_PASS) throw new Error('Email verification is not configured.');
  const transportOptions = process.env.EMAIL_HOST
    ? {
        host: process.env.EMAIL_HOST,
        port: Number(process.env.EMAIL_PORT || 587),
        secure: process.env.EMAIL_SECURE === 'true',
      }
    : { service: process.env.EMAIL_SERVICE || 'gmail' };
  transporter = nodemailer.createTransport({
    ...transportOptions,
    auth: { user: EMAIL_USER, pass: EMAIL_PASS },
  });
  return transporter;
}

export const sendOTP = async ({ email, otpCode }) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`[DEV OTP] Verification code for ${email}: ${otpCode}`);
    return { success: true, delivered: false, development: true };
  }

  const mailer = getTransporter();
  await mailer.sendMail({
    from: `Top Line Rentals <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Your Top Line verification code',
    text: `Your verification code is ${otpCode}. It expires in 10 minutes. If you did not request it, you can ignore this email.`,
    html: `<p>Your Top Line verification code is:</p><p style="font-size:24px;font-weight:700;letter-spacing:6px">${otpCode}</p><p>This code expires in 10 minutes. If you did not request it, you can ignore this email.</p>`,
  });
  return { success: true, delivered: true };
};

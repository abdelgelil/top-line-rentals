import { Resend } from 'resend';

let resendClient;

function getResendClient() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) throw new Error('RESEND_API_KEY is missing from environment variables.');
  if (!resendClient) resendClient = new Resend(apiKey);
  return resendClient;
}

export async function sendOTP({ email, otpCode, purpose = 'password reset' }) {
  if (process.env.NODE_ENV === 'development' && !process.env.RESEND_API_KEY) {
    console.log(`[DEV OTP] ${purpose} code for ${email}: ${otpCode}`);
    return { success: true, delivered: false, development: true };
  }

  try {
    const resend = getResendClient();
    const from = process.env.RESEND_FROM_EMAIL || 'TopLine Rentals <onboarding@resend.dev>';
    console.log(`[sendOTP] Sending ${purpose} email to ${email} via Resend.`);
    const { data, error } = await resend.emails.send({
      from,
      to: [email],
      subject: 'Your TopLine password reset code',
      text: `Your password reset code is ${otpCode}. It expires in 10 minutes. If you did not request it, you can ignore this email.`,
      html: `<p>Your TopLine password reset code is:</p><p style="font-size:24px;font-weight:700;letter-spacing:6px">${otpCode}</p><p>This code expires in 10 minutes. If you did not request it, you can ignore this email.</p>`,
    });
    if (error) throw new Error(error.message || 'Resend email delivery failed.');
    console.log(`[sendOTP] Resend accepted email${data?.id ? ` (${data.id})` : ''}.`);
    return { success: true, data };
  } catch (error) {
    console.error('[sendOTP Error] Resend email delivery failed:', {
      message: error.message || String(error),
      name: error.name,
      statusCode: error.statusCode,
    });
    throw error;
  }
}

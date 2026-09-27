import { Resend } from 'resend';

let resendClient;

function getResendClient() {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) {
    const message = 'RESEND_API_KEY environment variable is not configured on Railway.';
    console.error('[sendOTP Critical Error]', message);
    throw new Error(message);
  }
  if (!resendClient) resendClient = new Resend(apiKey);
  return resendClient;
}

export async function sendOTP({ email, otpCode, purpose = 'password reset' }) {
  if (!email || !otpCode) throw new Error('Email and OTP code are required.');

  if (process.env.NODE_ENV === 'development' && !process.env.RESEND_API_KEY) {
    console.log(`[DEV OTP] ${purpose} code for ${email}: ${otpCode}`);
    return { success: true, delivered: false, development: true };
  }

  try {
    const resend = getResendClient();
    const from = process.env.RESEND_FROM_EMAIL || 'TopLine Rentals <onboarding@resend.dev>';
    console.log(`[sendOTP] Attempting ${purpose} email delivery via Resend.`);
    const response = await resend.emails.send({
      from,
      to: [email],
      subject: 'Your TopLine password reset code',
      text: `Your password reset code is ${otpCode}. It expires in 10 minutes. If you did not request it, you can ignore this email.`,
      html: `<p>Your TopLine password reset code is:</p><p style="font-size:24px;font-weight:700;letter-spacing:6px">${otpCode}</p><p>This code expires in 10 minutes. If you did not request it, you can ignore this email.</p>`,
    });
    if (response.error) {
      console.error('[sendOTP Resend API Error]:', {
        message: response.error.message,
        name: response.error.name,
        statusCode: response.error.statusCode,
      });
      throw new Error(`Resend Delivery Error: ${response.error.message}`);
    }
    console.log(`[sendOTP Success] Email accepted${response.data?.id ? ` (ID: ${response.data.id})` : ''}.`);
    return response;
  } catch (error) {
    console.error('[sendOTP Error] Resend email delivery failed:', {
      message: error.message || String(error),
      name: error.name,
      code: error.code,
      statusCode: error.statusCode,
      cause: error.cause?.message,
    });
    throw error;
  }
}

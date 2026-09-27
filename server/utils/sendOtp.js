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

/**
  * Dispatches password reset OTP email via Resend HTTP API.
  * Supports both positional arguments: sendOTP(toEmail, otp)
  * and object arguments: sendOTP({ email, otpCode, purpose })
  */
export async function sendOTP(arg1, arg2, arg3) {
  let email, otpCode, purpose;

  // Handle object signature vs positional arguments
  if (typeof arg1 === 'object' && arg1 !== null) {
    email = arg1.email;
    otpCode = arg1.otpCode;
    purpose = arg1.purpose || 'password reset';
  } else {
    email = arg1;
    otpCode = arg2;
    purpose = arg3 || 'password reset';
  }

  if (!email || !otpCode) {
    throw new Error('Email and OTP code are required.');
  }

  if (process.env.NODE_ENV === 'development' && !process.env.RESEND_API_KEY) {
    console.log(`[DEV OTP] ${purpose} code for ${email}: ${otpCode}`);
    return { success: true, delivered: false, development: true };
  }

  try {
    const resend = getResendClient();
    const from = process.env.RESEND_FROM_EMAIL || 'TopLine Rentals <onboarding@resend.dev>';
    
    console.log(`[sendOTP] Attempting ${purpose} email delivery to ${email} via Resend.`);
    
    const response = await resend.emails.send({
      from,
      to: [email],
      subject: 'Your TopLine password reset code',
      text: `Your password reset code is ${otpCode}. It expires in 10 minutes. If you did not request it, you can ignore this email.`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
          <h2 style="color: #1e293b;">Password Reset Verification</h2>
          <p>Your 6-digit verification code is:</p>
          <h1 style="color: #2563eb; letter-spacing: 6px; font-size: 32px; margin: 16px 0;">${otpCode}</h1>
          <p>This code expires in 10 minutes. If you did not request it, you can ignore this email.</p>
        </div>
      `,
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

export default sendOTP;
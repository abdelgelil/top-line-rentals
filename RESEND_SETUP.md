# Resend setup

Railway's Free, Trial, and Hobby plans disable outbound SMTP, so Top Line sends reset emails through Resend's HTTPS API.

## Configure Resend

1. Create a Resend API key.
2. Add it to the Railway backend service as `RESEND_API_KEY`.
3. For production recipients, verify a sending domain in Resend and set `RESEND_FROM_EMAIL` to an address on that domain (for example, `TopLine Rentals <support@example.com>`).
4. Redeploy the backend.

The code defaults to `TopLine Rentals <onboarding@resend.dev>` for Resend testing. Configure a verified sender domain for production sending.

## Local development

Set `NODE_ENV=development`. If `RESEND_API_KEY` is missing, requests log the reset code to the backend console. With a key present, the utility calls Resend.

## Recovery API

`POST /api/auth/forgot-password` accepts `{ "identifier": "phone-or-username", "targetEmail": "reachable-email" }`. The destination email can differ from the user's profile email.

`POST /api/auth/reset-password` accepts `{ "identifier": "phone-or-username", "otp": "123456", "newPassword": "..." }`.

Codes expire after ten minutes. `JWT_SECRET` or `OTP_SECRET` must be at least 32 characters to hash reset codes securely. Never commit API keys or `.env` files.

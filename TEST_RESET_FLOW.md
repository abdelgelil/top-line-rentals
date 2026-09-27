# Password reset verification

## Local log-only mode

With `NODE_ENV=development` and no `RESEND_API_KEY`, submit a reset request for an existing account using its phone or username and any reachable email address. The backend should return success and print the six-digit code to its console. Use that code with the same identifier and a new password.

## Resend delivery

Configure `RESEND_API_KEY` and a valid `RESEND_FROM_EMAIL`, then request a code for an existing account. Confirm that the email arrives, reset the password with its code, and sign in with the new password.

## Expected validation behavior

- Missing identifier or malformed email: `400`.
- Unknown account: `404`.
- Missing Resend configuration in production or failed API delivery: `500` JSON response; the server process remains available.
- Malformed, mismatched, or expired reset code: `400`.
- Successful password reset: `200`.

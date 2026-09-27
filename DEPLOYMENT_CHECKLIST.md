# Deployment checklist

- Set `JWT_SECRET` (at least 32 random characters) in the backend service.
- Set `RESEND_API_KEY` in the backend service.
- Set `RESEND_FROM_EMAIL` to an address on a verified Resend domain before production delivery.
- Keep `.env` files and API keys out of Git.
- Deploy the current backend and client together so the password recovery payloads match.
- Confirm MongoDB is reachable and the backend reports healthy after deployment.
- Request a reset using a real account's phone or username and its registered email, then reset using the received six-digit code.

Local development can log a reset code when `NODE_ENV=development` and no Resend key is configured.

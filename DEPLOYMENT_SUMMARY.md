# Authentication and recovery summary

- Signup is immediate and does not require email or OTP verification.
- Signup requires username, unique phone, and password; email is optional and sparse unique.
- Login uses phone and password. Legacy scrypt password hashes are upgraded after a successful login.
- Recovery identifies accounts by phone or username and sends the code to the supplied destination email.
- Reset codes are six digits, HMAC-hashed in MongoDB, and expire after ten minutes.
- Email is sent through the Resend HTTPS API, with development-only console logging when no API key is configured.
- Recovery requests are rate limited, and all failures return JSON instead of escaping the Express handler.

See [RESEND_SETUP.md](RESEND_SETUP.md) for deployment variables and API payloads.

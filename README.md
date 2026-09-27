# Top Line

## Phone authentication setup

Sign-up and sign-in require a password, a unique phone number, and an email verification code. Passwords are stored using scrypt; OTPs expire after ten minutes and are stored as SHA-256 hashes peppered with `OTP_SECRET`. Configure these server environment variables before enabling authentication:

- `JWT_SECRET`: long, random secret used to sign seven-day session tokens.
- `OTP_SECRET`: separate long, random secret used to hash verification codes.
- `EMAIL_USER`, `EMAIL_PASS`: SMTP account and app password. Gmail SMTP is used by default; optionally set `EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_SECURE`, or `EMAIL_SERVICE` for another provider.
- `SETUP_SECRET`: one-time secret for the initial admin claim endpoint.

In development, verification codes are printed to the server console and SMTP is skipped. Production never logs codes. Passwords must be at least 12 characters. Existing accounts need valid email addresses; accounts without password hashes can set one through the email-verified **Forgot password** flow.

Before deploying against an existing database, resolve duplicate or missing phone numbers and emails. Ensure the unique indexes on both `phone` and `email` exist. Users must verify their email through OTP before the account is marked verified.

For an existing deployment, clear pending challenges created by the previous SMS flow once the SMTP version is deployed: `db.otpchallenges.deleteMany({})`. Then confirm that account records have valid unique emails and E.164 phone numbers before enabling the unique indexes.

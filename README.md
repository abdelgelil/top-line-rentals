# Top Line

## Authentication and password reset

Sign-up uses username, unique phone, and password; email is optional and signup does not require an OTP. Passwords use bcryptjs. Password recovery requires the account identifier (phone or username) and the email address registered on that account. Reset codes are HMAC-hashed, expire after ten minutes, and are delivered through Resend's HTTPS API.

Configure these server environment variables:

- `JWT_SECRET`: at least 32 random characters, used for session tokens and as the reset-code HMAC key when `OTP_SECRET` is absent.
- `OTP_SECRET`: optional separate secret of at least 32 random characters for reset-code hashing.
- `RESEND_API_KEY`: Resend API key for production delivery.
- `RESEND_FROM_EMAIL`: optional sender using a domain verified with Resend. The default `onboarding@resend.dev` sender is restricted by Resend and is not suitable for arbitrary recipients in production.
- `SETUP_SECRET`: secret for the initial admin claim endpoint.

In local development, if `RESEND_API_KEY` is absent, the reset code is printed to the server console. Production requests fail with a JSON error when Resend is not configured or delivery fails. Never commit `.env` files or API keys.

## Reservation deposits

Reservations require a one-night deposit by Vodafone Cash or InstaPay. Configure the receiving account details in the **server** environment before enabling reservations:

- `VODAFONE_CASH_NUMBER`: the receiving Vodafone Cash wallet number.
- `INSTAPAY_ADDRESS`: the receiving InstaPay address or registered alias.

The booking form displays only payment methods with configured details. Guests transfer the one-night amount, enter the transfer reference, then submit the reservation. Admins verify the reference from the Reservations page; confirming a booking marks its deposit verified. The remaining stay balance is shown to the guest as cash due after the stay is finished. Do not put payment account settings in the client environment or commit receiving credentials.

Existing accounts created with the earlier password format can migrate to bcryptjs at their next successful login. The server converts the old non-sparse email index to a sparse unique index before accepting requests.

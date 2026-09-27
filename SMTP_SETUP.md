# SMTP Configuration for Railway Deployment

## Problem
Railway (and other container platforms) block non-SSL SMTP ports (25, 587) to prevent spam. This causes connection timeouts when using standard port 587 (STARTTLS).

## Solution
Use **port 465 with SSL/TLS** for Gmail SMTP. This is fully supported and works reliably on Railway.

## Configuration

### Default (Gmail)
The app now defaults to Gmail SMTP with SSL on port 465:

```
host: smtp.gmail.com
port: 465
secure: true
```

### Environment Variables
Set these in Railway environment or `.env`:

```bash
# Required: Gmail credentials
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-16-character-app-password-without-spaces

# Optional: Override for custom SMTP provider
EMAIL_HOST=smtp.custom-provider.com
EMAIL_PORT=465
EMAIL_SECURE=true  # or false for port 587 (if your provider supports it locally)
```

## Gmail App Password Setup

1. **Enable 2-Factor Authentication** on your Google Account
2. Go to **Google Account → Security → App passwords**
3. Select "Mail" and "Windows/Linux/Mac"
4. Google generates a **16-character password** (example: `abcd efgh ijkl mnop`)
5. **Copy without spaces**: `abcdefghijklmnop`
6. Set `EMAIL_PASS=abcdefghijklmnop` in Railway variables

⚠️ **Important**: Remove all spaces from the password when setting the environment variable.

## Timeout Tuning

```javascript
connectionTimeout: 10_000,   // 10s to establish connection
greetingTimeout: 5_000,      // 5s for SMTP greeting
socketTimeout: 10_000,       // 10s for each operation
```

Increased connection timeout (10s) for Railway's potential network latency. If still timing out:
- Verify `EMAIL_PASS` has no extra spaces or special characters
- Check that 2FA is enabled on the Google Account
- Ensure the app password was created (not just regular password)

## Testing

### Local Development (Logs to Console)
```bash
NODE_ENV=development npm run dev
```
OTP codes appear in console as `[DEV OTP] password reset code for test@example.com: 123456`

### Production (Railway)
```bash
curl -X POST https://your-railway-url/api/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{
    "identifier": "+201000000000",
    "targetEmail": "test@gmail.com"
  }'
```

**Success** (200):
```json
{
  "success": true,
  "message": "A password reset code has been sent to your email address."
}
```

Check email for the OTP code.

**Email Error** (500):
```json
{
  "message": "Could not send a reset code. Please ensure email is configured and try again."
}
```
Check Railway logs for `[sendOTP] Failed to send...` with details.

## Troubleshooting

| Error | Cause | Fix |
|-------|-------|-----|
| `Email verification is not configured` | Missing `EMAIL_USER` or `EMAIL_PASS` | Set both variables in Railway |
| `Connection timeout` | Port 587/25 blocked, or slow network | Already using port 465; check network |
| `Invalid login` | Wrong app password format | Regenerate app password, copy without spaces |
| `Too many login attempts` | Account locked after failed logins | Wait 24 hours or use different Gmail account |
| `Authentication failed` | Wrong email or password | Verify credentials in Railway environment |

## Legacy SMTP Configuration

If you have a custom SMTP provider that requires port 587 (local development only):

```bash
EMAIL_HOST=smtp.example.com
EMAIL_PORT=587
EMAIL_SECURE=false
```

This will fail on Railway due to port blocking, but works locally.

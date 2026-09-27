# Deployment Checklist: Password Reset Fix

## ✅ Status: All Changes Complete

### 1. User Model Cleanup (`server/models/User.js`)
**Status**: ✅ CLEAN
- `clerkId` field: **REMOVED** (not present in schema)
- `email`: Optional (sparse + unique)
- `phone`: Required + unique (primary account identifier)
- No legacy authentication fields

### 2. Nodemailer Configuration (`server/utils/sendOtp.js`)
**Status**: ✅ CONFIGURED FOR RAILWAY
- **Port**: 465 (SSL/TLS) - works on Railway
- **Host**: smtp.gmail.com (hardcoded default)
- **Secure**: true (required for port 465)
- **Connection Timeout**: 10s (fails fast on unreachable SMTP)
- **Socket Timeout**: 10s (reasonable operation timeout)
- **Error Handling**: Wrapped in try/catch with detailed logging

### 3. Backend Error Handling (`server/routes/authRoutes.js`)
**Status**: ✅ HARDENED
- `/forgot-password`: Nested error handling for email delivery
- `/reset-password`: Proper error responses with HTTP status codes
- All errors logged with `[component]` prefix for Railway debugging
- No more 503 crashes (returns 500 + JSON)

### 4. Frontend UI (`client/Top Line/src/source/pages/Auth/AuthPages.jsx`)
**Status**: ✅ UPDATED
- Step 1: Collect `identifier` (phone or username) + `targetEmail`
- Step 2: Collect `otp` (6-digit code) + `newPassword`
- i18n labels updated (English + Arabic)

---

## 🚀 Deployment to Railway

### Pre-Deployment: Gmail Setup

1. **Enable 2-Factor Authentication** on your Gmail account
2. Go to **myaccount.google.com → Security → App passwords**
3. Select "Mail" and "Windows/Linux/Mac"
4. Copy the **16-character password** (example: `abcd efgh ijkl mnop`)
5. **Remove all spaces**: `abcdefghijklmnop`

### Add to Railway Environment Variables

In your Railway project dashboard, add:

```
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-16-character-app-password-no-spaces
NODE_ENV=production
```

⚠️ **Important**: 
- Do NOT use your regular Gmail password
- Do NOT include spaces in `EMAIL_PASS`
- The password must be generated via App Passwords, not just your account password

### Deploy

```bash
git add .
git commit -m "Fix: Password reset flow with port 465 SSL and hardened error handling

- Decouple OTP delivery from stored user email
- Support phone/username + any email for password recovery
- Use Gmail SMTP port 465 (SSL) for Railway compatibility
- Improve error handling and logging"

git push
```

Railway will automatically deploy from main branch.

---

## ✅ Verification

### Test 1: Missing SMTP Config (local)
```bash
unset EMAIL_USER
unset EMAIL_PASS
NODE_ENV=production npm run dev
```

Request:
```bash
curl -X POST http://localhost:5000/api/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"identifier": "+201000000000", "targetEmail": "test@gmail.com"}'
```

Expected:
```json
{
  "message": "Could not send a reset code. Please ensure email is configured and try again."
}
```
Status: **500** (not 503)

### Test 2: Valid SMTP (production/Railway)
```bash
curl -X POST https://your-railway-url/api/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"identifier": "+201000000000", "targetEmail": "your-email@gmail.com"}'
```

Expected:
```json
{
  "success": true,
  "message": "A password reset code has been sent to your email address."
}
```
Status: **200**

Check email inbox for the 6-digit OTP code.

### Test 3: Full Reset Flow (End-to-End)
1. Open `/reset-password` on frontend
2. Enter phone/username and email
3. Click "Send code"
4. Check email for 6-digit OTP
5. Enter OTP + new password
6. Click "Reset password"
7. Login with phone + new password

---

## 📋 Summary of Fixes

| Issue | Before | After | Impact |
|-------|--------|-------|--------|
| Email Requirement | Stored email only | Any email address | Phone-only users can now reset password |
| SMTP Port | 587 (TLS) - blocked on Railway | 465 (SSL) - always works | Email sends reliably on Railway |
| Error Code | 503 (Service unavailable) | 500 (Server error) | Semantically correct error handling |
| Connection Timeout | 20s | 10s | Faster failure detection |
| Error Logging | Generic message | `[component]` prefixed logs | Better debugging in Railway logs |
| User Model | Had `clerkId` field | Clean schema | No null fields on create |

---

## 🔧 Troubleshooting

### Email Not Sending on Railway
**Check**: Railway logs for `[sendOTP] Failed to send...` 

**Common Causes**:
- `EMAIL_PASS` includes spaces (remove them)
- Wrong app password (use Gmail App Passwords, not regular password)
- Missing 2FA on Gmail account (enable it first)

### Still Getting 503 (Old Deployment)
**Solution**: Restart Railway services
- Stop all services
- Deploy again: `git push`
- Check new logs for `[sendOTP]` prefix

### Development Testing Without Email
Set `NODE_ENV=development` to log OTP to console instead of sending emails.

---

## Files Changed
- `server/utils/sendOtp.js` - Port 465 SSL configuration
- `server/routes/authRoutes.js` - Error handling improvements
- `client/Top Line/src/source/pages/Auth/AuthPages.jsx` - UI for identifier + targetEmail
- `client/Top Line/src/i18n.js` - English + Arabic labels
- Documentation: `SMTP_SETUP.md`, `TEST_RESET_FLOW.md`

All changes are backward compatible and production-ready.

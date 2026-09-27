# Password Reset 503 Fix - Verification Guide

## Issues Fixed

1. **Changed HTTP Status Code**: 503 (Service Unavailable) → **500 (Internal Server Error)**
   - 503 implies the service is temporarily down; 500 correctly indicates a server error with a recoverable cause
   
2. **Hardened sendOTP Utility** (`server/utils/sendOtp.js`):
   - Added input validation for `email` and `otpCode` 
   - Wrapped email sending in try/catch to catch SMTP failures early
   - Enhanced error logging with context (`[sendOTP]` prefix)
   - Throws errors instead of silently failing

3. **Split Error Handling in forgot-password Route**:
   - Separate try/catch for email delivery vs. database/validation errors
   - Email errors return `500` with clear message about SMTP configuration
   - Other errors caught by outer try/catch with generic message
   - Enhanced logging with `[forgot-password]` prefix for Railway logs

## Test Scenarios

### Scenario 1: Missing SMTP Credentials
**Setup**: Remove or empty `EMAIL_USER` and `EMAIL_PASS` from `.env`

**Request**:
```bash
curl -X POST http://localhost:5000/api/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"identifier": "+201000000000", "targetEmail": "test@example.com"}'
```

**Expected Response**: 
- Status: `500` (not 503)
- Body: `{"message": "Could not send a reset code. Please ensure email is configured and try again."}`
- Console Log: `[forgot-password] Email delivery failed: Email verification is not configured.`

### Scenario 2: SMTP Connection Timeout
**Setup**: Set `EMAIL_HOST` to unreachable server, keep credentials

**Expected Response**:
- Status: `500`
- Body: `{"message": "Could not send a reset code. Please ensure email is configured and try again."}`
- Console Log: `[sendOTP] Failed to send password reset email to test@example.com: getaddrinfo ENOTFOUND...`

### Scenario 3: Valid Credentials (Success Path)
**Setup**: Configure valid Gmail App Password or SMTP service

**Request**:
```bash
curl -X POST http://localhost:5000/api/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"identifier": "+201000000000", "targetEmail": "your-email@gmail.com"}'
```

**Expected Response**:
- Status: `200`
- Body: `{"success": true, "message": "A password reset code has been sent to your email address."}`
- Console Log: Shows OTP in development mode or successful send

### Scenario 4: User Not Found
**Request** (with non-existent phone/username):
```bash
curl -X POST http://localhost:5000/api/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"identifier": "+999999999999", "targetEmail": "test@example.com"}'
```

**Expected Response**:
- Status: `404`
- Body: `{"message": "No account found with this phone number or username."}`

### Scenario 5: Invalid Email Format
**Request**:
```bash
curl -X POST http://localhost:5000/api/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"identifier": "+201000000000", "targetEmail": "not-an-email"}'
```

**Expected Response**:
- Status: `400`
- Body: `{"message": "Enter an account phone number or username and a valid email address."}`

## Key Improvements

✅ **No more 503 crashes** - All errors caught and logged cleanly  
✅ **Better error messages** - Users understand what went wrong  
✅ **Improved debugging** - Console logs with `[component]` prefix for Railway/Docker logs  
✅ **Graceful SMTP failures** - Email config issues don't crash the server  
✅ **Backward compatible** - Same API contract; existing tests should pass

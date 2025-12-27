# 🔒 Security Guide - Password Protection

Your productivity app is now password-protected! Here's everything you need to know.

## 🎯 Quick Start

### Default Password
**Password**: `ChangeMe123!`

⚠️ **IMPORTANT**: Change this password immediately after your first login!

## 🔐 How It Works

### Authentication System
- **Password-based login**: Simple and secure
- **7-day session**: Stay logged in for a week
- **SHA-256 hashing**: Passwords are never stored in plain text
- **Local storage**: Session stored in your browser

### Security Features
✅ Password hashing (SHA-256)  
✅ Session expiration (7 days)  
✅ Logout functionality  
✅ Password change capability  
✅ No server-side authentication needed  

## 📝 Changing Your Password

### Step 1: Login with Default Password
1. Open your app
2. Enter: `ChangeMe123!`
3. Click "Sign In"

### Step 2: Change Password
1. Go to **Settings** tab
2. Click **"Change Password"** button
3. Enter current password: `ChangeMe123!`
4. Enter your new password (min 8 characters)
5. Confirm your new password
6. **SAVE THE HASH** that appears in the alert!

### Step 3: Update the Code
1. Open `src/services/AuthService.ts`
2. Find this line:
   ```typescript
   private static readonly PASSWORD_HASH = '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92';
   ```
3. Replace the hash with your new hash
4. Save the file
5. Rebuild and redeploy:
   ```bash
   npm run build
   npm run deploy:netlify
   ```

## 🌐 Netlify Deployment Security

### Current Setup
- ✅ **Password-protected**: Login required to access app
- ✅ **Client-side auth**: No server needed
- ✅ **Session-based**: 7-day automatic login

### Who Can Access?
**Before Login**: Anyone with the URL sees the login screen  
**After Login**: Only users with the password can access the app  
**Session**: Lasts 7 days, then requires re-login  

### Additional Netlify Security Options

#### Option 1: Netlify Password Protection (Easiest)
Add password protection at the Netlify level:

1. Go to your Netlify site dashboard
2. Navigate to **Site settings** → **Access control**
3. Enable **Password protection**
4. Set a site-wide password
5. Now users need TWO passwords:
   - Netlify's site password (first layer)
   - Your app password (second layer)

#### Option 2: Restrict by IP Address
Limit access to specific IP addresses:

1. In Netlify dashboard: **Site settings** → **Access control**
2. Enable **IP restrictions**
3. Add your home/office IP addresses
4. Only those IPs can access the site

#### Option 3: Make Site Private (Unlisted)
1. Don't share the URL publicly
2. Use a complex subdomain name
3. Example: `my-secret-productivity-app-xyz123.netlify.app`

## 🔄 Session Management

### How Sessions Work
- **Login**: Creates a 7-day session
- **Activity**: Each page load extends the session
- **Expiration**: After 7 days of inactivity, requires re-login
- **Logout**: Immediately ends session

### Manual Logout
1. Go to **Settings** tab
2. Click **"Sign Out"** button
3. Confirm logout
4. You'll be redirected to login screen

## 🛡️ Security Best Practices

### ✅ DO:
- Change the default password immediately
- Use a strong password (12+ characters, mix of letters, numbers, symbols)
- Keep your password hash backed up securely
- Sign out on shared computers
- Use Netlify's additional security features

### ❌ DON'T:
- Share your password with others
- Use simple passwords like "password123"
- Leave the default password unchanged
- Share your Netlify URL publicly if you want privacy
- Forget to update the hash in AuthService.ts after changing password

## 🔧 Technical Details

### Password Hashing
```typescript
// Your password is hashed using SHA-256
const hash = await crypto.subtle.digest('SHA-256', password);
// Only the hash is stored, never the plain text password
```

### Session Storage
```typescript
// Session stored in localStorage
{
  authenticated: true,
  timestamp: 1234567890
}
```

### Authentication Check
```typescript
// Checked on every page load
if (!AuthService.isAuthenticated()) {
  // Show login screen
}
```

## 🆘 Troubleshooting

### Forgot Password?
1. Open `src/services/AuthService.ts`
2. Temporarily change `PASSWORD_HASH` back to default:
   ```typescript
   private static readonly PASSWORD_HASH = '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92';
   ```
3. Rebuild and redeploy
4. Login with `ChangeMe123!`
5. Change password again

### Can't Login?
- Clear browser cache and localStorage
- Try incognito/private browsing mode
- Check browser console for errors
- Verify PASSWORD_HASH in AuthService.ts

### Session Expired?
- Normal after 7 days of inactivity
- Just login again with your password
- Session will be renewed for another 7 days

## 📊 Privacy & Data

### What's Protected?
✅ All your tasks and habits  
✅ All your projects  
✅ All your goals and analytics  
✅ All your settings and preferences  

### Where's Your Data?
- **Browser localStorage**: All data stored locally
- **No server**: Nothing sent to external servers
- **No cloud**: No cloud storage or sync
- **Your device only**: Data stays on your computer

### Data Export
- Export your data anytime from Settings
- Backup is not password-protected (it's just JSON)
- Keep backups in a secure location

## 🚀 Deployment Checklist

Before deploying to Netlify:

- [ ] Changed default password
- [ ] Updated PASSWORD_HASH in AuthService.ts
- [ ] Tested login/logout functionality
- [ ] Tested password change feature
- [ ] Backed up your password hash
- [ ] Considered additional Netlify security options
- [ ] Decided whether to share URL publicly

## 📞 Need More Security?

If you need enterprise-level security:
- Consider using Auth0, Firebase Auth, or similar
- Implement OAuth (Google, GitHub login)
- Add two-factor authentication (2FA)
- Use a backend server with proper authentication
- Implement role-based access control

---

**Current Security Level**: 🔒 Password-Protected (Client-Side)  
**Recommended For**: Personal use, private productivity tracking  
**Not Recommended For**: Sensitive business data, multi-user scenarios  

**Remember**: This is client-side authentication. For maximum security, consider server-side authentication with a backend.

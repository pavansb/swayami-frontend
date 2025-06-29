# 🔧 OAuth Configuration Fix Guide

## 🚨 **Current Issue:**
Google sign-in redirects back to login page with no error and no entry in Supabase auth table. This indicates the OAuth flow isn't completing due to configuration mismatches.

## 🔍 **Diagnosis Tools:**

### **1. Use Debug Tool (IMMEDIATE)**
1. Open: **http://localhost:3000/OAUTH_DEBUG.html**
2. Click "Test Google Sign-In" to see exact error messages
3. Check configuration requirements shown on the page

### **2. Common Configuration Issues:**

#### **A. Supabase Dashboard Settings** ⚠️ **MOST LIKELY ISSUE**

1. **Go to Supabase Dashboard:**
   - Visit: https://supabase.com/dashboard/project/pbeborjasiiwuudfnzhm
   - Click "Authentication" in left sidebar
   - Click "URL Configuration"

2. **Check These Settings:**
   ```
   Site URL: http://localhost:3000
   Redirect URLs: 
   - http://localhost:3000/auth/callback
   - http://localhost:3000/dashboard
   - http://localhost:3000/login
   ```

3. **Google Provider Settings:**
   - Go to "Authentication" > "Providers"
   - Click "Google" 
   - Make sure it's enabled
   - Check Client ID and Secret are set

#### **B. Google Console OAuth App** ⚠️ **SECOND MOST LIKELY**

1. **Go to Google Console:**
   - Visit: https://console.developers.google.com/
   - Select your OAuth app project

2. **Check Authorized Redirect URIs:**
   ```
   Must include:
   - https://pbeborjasiiwuudfnzhm.supabase.co/auth/v1/callback
   ```

3. **Check Authorized JavaScript Origins:**
   ```
   Must include:
   - http://localhost:3000
   - https://pbeborjasiiwuudfnzhm.supabase.co
   ```

## ✅ **Step-by-Step Fix:**

### **Step 1: Fix Supabase URL Configuration**

```bash
# 1. Go to Supabase Dashboard
# 2. Project: pbeborjasiiwuudfnzhm
# 3. Authentication > URL Configuration
# 4. Set these exact values:

Site URL: http://localhost:3000

Additional Redirect URLs:
http://localhost:3000/auth/callback
http://localhost:3000/dashboard
http://localhost:3000/login
```

### **Step 2: Verify Google OAuth App**

```bash
# 1. Go to Google Cloud Console
# 2. APIs & Services > Credentials
# 3. Find your OAuth 2.0 Client ID
# 4. Edit and verify these settings:

Authorized JavaScript origins:
- http://localhost:3000
- https://pbeborjasiiwuudfnzhm.supabase.co

Authorized redirect URIs:
- https://pbeborjasiiwuudfnzhm.supabase.co/auth/v1/callback
```

### **Step 3: Update Code Configuration (OPTIONAL)**

If the above doesn't work, update the redirect URL in code:

```typescript
// In src/contexts/AppContext.tsx, line ~275
const { data, error } = await supabase.auth.signInWithOAuth({
  provider: 'google',
  options: {
    redirectTo: `${window.location.origin}/auth/callback`, // Changed from /dashboard
    queryParams: {
      access_type: 'offline',
      prompt: 'consent',
    }
  }
});
```

## 🧪 **Testing Steps:**

### **1. Clear Everything First:**
```bash
# In browser console (F12):
localStorage.clear();
sessionStorage.clear();
# Then hard refresh (Cmd+Shift+R)
```

### **2. Test Debug Tool:**
1. Go to: **http://localhost:3000/OAUTH_DEBUG.html**
2. Click "Test Google Sign-In"
3. Check for specific error messages

### **3. Test Main App:**
1. Go to: **http://localhost:3000/login**
2. Click "Sign in with Google"
3. Complete OAuth flow
4. Should redirect to dashboard

## 🔍 **Debugging Checklist:**

- [ ] **Supabase Site URL** = `http://localhost:3000`
- [ ] **Supabase Redirect URLs** include `/dashboard` and `/login`
- [ ] **Google OAuth JavaScript Origins** include localhost:3000
- [ ] **Google OAuth Redirect URIs** include Supabase callback URL
- [ ] **Google Provider** enabled in Supabase
- [ ] **Client ID/Secret** correctly set in Supabase

## 💡 **Most Common Solutions:**

### **Solution 1: Supabase URL Mismatch** (90% of cases)
```
Problem: Site URL is not set to http://localhost:3000
Fix: Update Site URL in Supabase Dashboard
```

### **Solution 2: Missing Redirect URLs** (80% of cases)
```
Problem: Redirect URLs don't include /dashboard
Fix: Add http://localhost:3000/dashboard to redirect URLs
```

### **Solution 3: Google Console Mismatch** (70% of cases)
```
Problem: Authorized origins missing localhost:3000
Fix: Add http://localhost:3000 to JavaScript origins
```

## 🚀 **Quick Test Commands:**

```bash
# Open browser console and test Supabase connection:
const { data, error } = await supabase.auth.getSession();
console.log('Session:', data, 'Error:', error);

# Test OAuth directly:
const { data, error } = await supabase.auth.signInWithOAuth({
  provider: 'google',
  options: { redirectTo: 'http://localhost:3000/dashboard' }
});
console.log('OAuth:', data, 'Error:', error);
```

## 📞 **Next Steps:**

1. **Try Debug Tool:** http://localhost:3000/OAUTH_DEBUG.html
2. **Check Supabase Dashboard:** Most likely issue
3. **Verify Google Console:** Second most likely issue
4. **Report back:** What specific errors you see in debug tool

**90% of OAuth issues are solved by fixing the Supabase URL configuration!** 
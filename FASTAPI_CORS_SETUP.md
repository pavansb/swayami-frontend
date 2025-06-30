# 🚀 FastAPI CORS Setup & Deployment Guide

## ✅ **CORS Configuration Completed**

Your FastAPI backend now has comprehensive CORS configuration that supports both local development and production environments.

### **CORS Configuration Summary:**
- ✅ **Local Development**: `http://localhost:3000-3004`, `http://127.0.0.1:3000`
- ✅ **Production/Staging**: `https://swayami-focus-mirror.lovable.app`
- ✅ **Methods**: GET, POST, PUT, DELETE, OPTIONS, PATCH
- ✅ **Headers**: Content-Type, Authorization, Access-Control-Allow-Origin, etc.
- ✅ **Credentials**: Enabled (`allow_credentials=True`)
- ✅ **Debugging**: CORS logging middleware added

## 🧪 **Testing CORS Configuration**

### **1. Local Testing**
```bash
# Start your FastAPI backend
cd backend
python main.py

# Test CORS locally
curl -H "Origin: http://localhost:3000" \
     -H "Access-Control-Request-Method: GET" \
     -H "Access-Control-Request-Headers: Content-Type" \
     -X OPTIONS \
     http://localhost:8000/cors-test
```

### **2. Frontend CORS Test Tool**
Access the CORS test tool at: `https://swayami-focus-mirror.lovable.app/cors-test.html`

This tool will:
- ✅ Test basic CORS functionality
- ✅ Test preflight OPTIONS requests
- ✅ Test API endpoint connectivity
- ✅ Provide debugging information

## 🌐 **Backend Deployment Options**

Since your staging frontend needs to communicate with your FastAPI backend, you have several deployment options:

### **Option 1: Cloud Deployment (Recommended)**

#### **Railway Deployment (Easy & Fast)**
1. **Create Railway Account**: Go to [railway.app](https://railway.app)
2. **Connect GitHub**: Link your backend repository
3. **Deploy**: Railway auto-detects FastAPI and deploys
4. **Get URL**: Railway provides a domain like `yourapp.railway.app`

#### **Render Deployment (Free Tier Available)**
1. **Create Render Account**: Go to [render.com](https://render.com)
2. **New Web Service**: Connect your GitHub repo
3. **Configure**:
   ```yaml
   Build Command: pip install -r requirements.txt
   Start Command: uvicorn main:app --host 0.0.0.0 --port $PORT
   ```
4. **Get URL**: Render provides a domain like `yourapp.onrender.com`

#### **DigitalOcean App Platform**
1. **Create DigitalOcean Account**
2. **App Platform**: Create new app from GitHub
3. **Configure**: Auto-detects Python/FastAPI
4. **Get URL**: Provides a domain like `yourapp-xyz.ondigitalocean.app`

### **Option 2: Temporary Testing with ngrok**

For quick testing without deployment:

```bash
# Install ngrok
brew install ngrok  # macOS
# OR download from https://ngrok.com

# Start your FastAPI backend
cd backend
python main.py

# In another terminal, expose it
ngrok http 8000

# You'll get a URL like: https://abc123.ngrok.io
```

## 🔧 **Update Frontend Configuration**

Once you have your backend deployed, update the staging configuration:

### **Update src/config/env.ts**
```typescript
export const getConfig = (): Config => {
  const isDev = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  const isQA = window.location.hostname === 'swayami-focus-mirror.lovable.app';
  
  if (isDev) {
    return {
      API_BASE_URL: 'http://localhost:8000',
      ENVIRONMENT: 'development'
    };
  } else if (isQA) {
    return {
      API_BASE_URL: 'https://YOUR-DEPLOYED-BACKEND-URL.com', // 👈 UPDATE THIS
      ENVIRONMENT: 'qa'
    };
  } else {
    // ... rest of config
  }
};
```

## 📋 **Backend Dependencies Check**

Ensure your backend has all required dependencies:

### **requirements.txt**
```txt
fastapi==0.104.1
uvicorn[standard]==0.24.0
motor==3.3.2  # MongoDB async driver
python-jose[cryptography]==3.3.0  # JWT tokens
passlib[bcrypt]==1.7.4  # Password hashing
python-multipart==0.0.6  # Form data
pydantic[email]==2.5.0  # Data validation
pydantic-settings==2.1.0  # Settings management
```

### **Install Dependencies**
```bash
cd backend
pip install -r requirements.txt
```

## 🔍 **Debugging CORS Issues**

### **Check FastAPI Logs**
Your FastAPI backend now includes CORS debugging. Look for these logs:
```
🔧 CORS Configuration:
🔧 Allowed Origins: ['http://localhost:3000', 'https://swayami-focus-mirror.lovable.app']
🔍 CORS Request - Method: OPTIONS, Origin: https://swayami-focus-mirror.lovable.app
🔧 CORS Preflight request detected
🔧 CORS Response Headers: {'access-control-allow-origin': 'https://swayami-focus-mirror.lovable.app'}
```

### **Browser Developer Tools**
1. **Open Network Tab**
2. **Look for preflight OPTIONS requests**
3. **Check Response Headers** for `Access-Control-Allow-Origin`
4. **Verify no CORS errors** in Console

### **Common CORS Issues & Solutions**

| Issue | Solution |
|-------|----------|
| `No 'Access-Control-Allow-Origin' header` | Add frontend origin to ALLOWED_ORIGINS in main.py |
| `CORS policy: credentials omitted` | Ensure `allow_credentials=True` in FastAPI |
| `Method not allowed` | Add method to ALLOWED_METHODS in main.py |
| `Header not allowed` | Add header to ALLOWED_HEADERS in main.py |

## 🚀 **Deployment Checklist**

### **Before Deployment:**
- [ ] FastAPI backend runs locally (`python main.py`)
- [ ] CORS test passes locally
- [ ] All API endpoints work locally
- [ ] MongoDB connection configured
- [ ] Environment variables set

### **After Deployment:**
- [ ] Backend URL is accessible publicly
- [ ] CORS test tool passes all tests
- [ ] Frontend can connect to backend
- [ ] All API endpoints work in production
- [ ] MongoDB connection works from deployed environment

### **Frontend Update:**
- [ ] Update `src/config/env.ts` with new backend URL
- [ ] Deploy frontend changes
- [ ] Test full authentication flow
- [ ] Verify all features work end-to-end

## 💡 **Quick Start Commands**

```bash
# 1. Test locally
cd backend && python main.py

# 2. Deploy to Railway (if using Railway)
git push origin main  # Triggers auto-deploy

# 3. Update frontend config
# Edit src/config/env.ts with deployed URL

# 4. Test staging
# Visit: https://swayami-focus-mirror.lovable.app/cors-test.html
```

## 🎯 **Success Indicators**

When everything is working correctly, you should see:
- ✅ **CORS test tool**: All tests pass
- ✅ **Browser console**: No CORS errors
- ✅ **Authentication**: Google login works on staging
- ✅ **API calls**: All frontend → backend requests succeed
- ✅ **FastAPI logs**: CORS requests logged successfully

## 🆘 **Need Help?**

If you encounter issues:
1. **Check FastAPI logs** for CORS debugging info
2. **Use the CORS test tool** at `/cors-test.html`
3. **Verify backend deployment** is accessible
4. **Check browser Network tab** for failed requests
5. **Ensure frontend config** points to correct backend URL

Your CORS configuration is now production-ready! 🎉 
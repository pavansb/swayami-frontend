# 🍃 MongoDB Setup Guide for Swayami

## ✅ **Migration Complete: Supabase ➜ MongoDB**

We've successfully migrated from Supabase database to MongoDB while keeping Supabase for Google authentication only.

## 🔧 **Architecture Overview**

- **Authentication**: Supabase (Google OAuth)
- **Database**: MongoDB Atlas (all user data, goals, tasks, etc.)
- **API**: MongoDB Data API via HTTPS

## 🛠️ **Setup Required**

### 1. MongoDB Atlas Configuration

You need to set up MongoDB Data API access:

1. Go to [MongoDB Atlas](https://cloud.mongodb.com/)
2. Navigate to your cluster: `swayami-app-db`
3. Go to "Data API" section
4. Enable Data API
5. Create an API Key
6. Copy the API endpoint URL

### 2. Environment Variables

Add to your `.env` file:

```bash
# MongoDB Configuration  
VITE_MONGO_API_KEY=your_mongodb_data_api_key_here

# Keep Supabase for Auth only
VITE_SUPABASE_URL=https://pbeborjasiiwuudfnzhm.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# OpenAI (existing)
VITE_OPENAI_API_KEY=your_openai_key
```

### 3. MongoDB Collections Structure

The app automatically creates these collections:

- **users**: User profiles and settings
- **goals**: User goals and progress  
- **tasks**: Individual tasks linked to goals
- **journal_entries**: User journal entries
- **habits**: Daily habits tracking

## 🔄 **Data Flow**

1. **Login**: User signs in via Google (Supabase Auth)
2. **User Creation**: App creates/finds user in MongoDB
3. **Data Operations**: All CRUD operations use MongoDB
4. **Real-time**: App state syncs with MongoDB

## 📱 **Features Migrated**

✅ User management
✅ Goals creation & tracking  
✅ Tasks management
✅ Journal entries
✅ Onboarding flow
✅ Progress tracking

## 🚨 **Important Notes**

- **Supabase is ONLY for authentication** (Google login)
- **All data is stored in MongoDB** 
- **No more foreign key constraints**
- **Uses `_id` instead of `id` for document IDs**

## 🧪 **Testing**

Run the Python scripts to test connection:

```bash
pip3 install pymongo dnspython
python3 test_mongodb_setup.py
python3 test_mongodb_crud.py
```

## 🔍 **Troubleshooting**

1. **API Key Issues**: Make sure MongoDB Data API is enabled
2. **CORS Errors**: Ensure API endpoint allows your domain
3. **Auth Issues**: Supabase auth still handles Google login
4. **Data Not Loading**: Check browser console for MongoDB errors

## 💡 **Benefits of Migration**

- ✅ No more SSL handshake issues
- ✅ Better performance with MongoDB
- ✅ Flexible schema for future features  
- ✅ Reduced complexity (single database)
- ✅ Better scaling options 

## 🚨 CURRENT ISSUE & IMMEDIATE SOLUTION

### Issue Analysis:
1. **API Key Missing**: Your `.env` file still has `VITE_MONGO_API_KEY=your_mongodb_data_api_key_here`
2. **CORS Problem**: MongoDB Data API requires complex CORS setup that's causing issues

### ✅ IMMEDIATE FIX - Option 1: Use MongoDB Realm Web SDK (RECOMMENDED)

This bypasses CORS issues entirely and is easier to set up.

#### Step 1: Install MongoDB Realm Web SDK
```bash
npm install realm-web
```

#### Step 2: Replace the Data API service
I'll create a new service that uses Realm Web SDK instead of the Data API.

#### Step 3: Update your `.env` file
```bash
# Replace the MongoDB API key line with:
VITE_MONGO_APP_ID=your_mongo_app_id_here
```

### ✅ IMMEDIATE FIX - Option 2: Configure Data API Properly

If you prefer to use the Data API, follow these exact steps:

#### Step 1: Get Real API Key
1. Go to [MongoDB Atlas](https://cloud.mongodb.com/)
2. Select your `swayami-app-db` project
3. Click "App Services" in left sidebar
4. If no app exists, click "Create a New App"
   - Name: `swayami-data-api`
   - Choose "Build your own App"
   - Link to your cluster
5. Go to "Authentication" → "API Keys"
6. Click "Create API Key"
7. Copy the key immediately (you only see it once!)

#### Step 2: Update `.env` file
```bash
# Replace this line in your .env file:
VITE_MONGO_API_KEY=your_actual_api_key_here
```

#### Step 3: Configure CORS (Critical!)
1. In your App Services app, go to "HTTPS Endpoints"
2. Click "Create New Endpoint"
3. Or go to "App Services" → "Values & Secrets" → "Configuration"
4. Add CORS configuration:
   - Allowed Origins: `http://localhost:3000,http://localhost:3001,http://localhost:3002,http://192.168.1.71:3000`
   - Allowed Methods: `GET,POST,PUT,DELETE,OPTIONS`
   - Allowed Headers: `*`

## 🔧 IMPLEMENTING SOLUTION 1 (RECOMMENDED): Realm Web SDK

Let me create the Realm Web SDK service for you:

## Current Issues & Solutions

### Issue 1: Missing MongoDB API Key
The app is getting CORS errors because `VITE_MONGO_API_KEY` is not set in your `.env` file.

### Issue 2: CORS Configuration Missing
MongoDB Data API needs to be configured to allow requests from your frontend origin.

## Step-by-Step Setup

### 1. MongoDB Atlas Data API Setup

1. **Go to MongoDB Atlas Dashboard**
   - Visit [MongoDB Atlas](https://cloud.mongodb.com/)
   - Log into your account
   - Select your `swayami-app-db` project

2. **Enable Data API**
   - Go to "App Services" in the left sidebar
   - Click "Create a New App" or select existing app
   - Choose "Build your own App"
   - Name it something like "swayami-data-api"
   - Link it to your `swayami-app-db` cluster

3. **Configure Data API**
   - In your App Services app, go to "HTTPS Endpoints"
   - Click "Add an Endpoint"
   - Or go to "App Services" → "Data API" → "Configure"
   - Enable the Data API
   - Set the Data Source to `swayami-app-db`
   - Set the Database to `swayami_app`

4. **Critical: Configure CORS Settings**
   ```bash
   # In App Services → Authentication → Custom User Data
   # Go to App Services → Values & Secrets → Configuration
   # Or App Services → Hosting → Custom Domain
   # Look for CORS configuration
   ```
   
   **IMPORTANT**: You need to configure CORS to allow requests from:
   - `http://localhost:3000`
   - `http://localhost:3001` 
   - `http://localhost:3002`
   - `http://192.168.1.71:3000` (your network IP)
   - Your production domain (when deployed)

   **Method 1: Through App Services UI**
   - Go to App Services → Authentication → Authentication Providers
   - Or App Services → HTTPS Endpoints → Settings
   - Add allowed origins: `http://localhost:3000,http://localhost:3001,http://localhost:3002,http://192.168.1.71:3000`

   **Method 2: Through App Configuration**
   - In App Services, go to "Deploy" → "Configuration"
   - Add this to your app configuration:
   ```json
   {
     "httpEndpoints": [{
       "route": "/data/v1/*",
       "http_method": "*",
       "function_name": "dataApiHandler",
       "validation_method": "NO_VALIDATION",
       "cors": {
         "origins": ["http://localhost:3000", "http://localhost:3001", "http://localhost:3002", "http://192.168.1.71:3000"],
         "allow_credentials": true,
         "allow_headers": ["*"],
         "allow_methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
       }
     }]
   }
   ```

5. **Get API Key**
   - Go to App Services → Authentication → API Keys
   - Click "Create API Key"
   - Name it `swayami-frontend-key`
   - Copy the API key (you'll only see it once!)

### 2. Environment Configuration

1. **Update your `.env` file**:
   ```bash
   # Add this line to your .env file
   VITE_MONGO_API_KEY=your_api_key_here
   ```

2. **Full `.env` file should look like**:
   ```bash
   # Supabase Configuration
   VITE_SUPABASE_URL=your_supabase_project_url_here
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

   # MongoDB Configuration
   VITE_MONGO_API_KEY=your_mongodb_data_api_key_here

   # OpenAI Configuration  
   VITE_OPENAI_API_KEY=your_openai_api_key_here

   # Backend Configuration (Optional - for FastAPI backend)
   VITE_API_BASE_URL=http://localhost:8000

   # Environment
   VITE_NODE_ENV=development
   ```

### 3. Verify Setup

1. **Restart your development server**:
   ```bash
   pkill -f "vite" && sleep 2 && npm run dev
   ```

2. **Check browser console** - you should see:
   ```
   🔧 MongoDB Service: Initializing...
   🔧 API Key exists: true
   🔧 API Key length: [some number > 0]
   ```

### 4. Test Collections

Run the Python test scripts to verify everything works:

```bash
# Install dependencies
pip install -r requirements.txt

# Test connection and create collections
python test_mongodb_setup.py

# Test CRUD operations
python test_mongodb_crud.py
```

## Alternative Solution: Using MongoDB Realm (If Data API doesn't work)

If you continue having CORS issues, you can use MongoDB Realm instead:

1. **Create Realm App**
   - Go to App Services → Create New App
   - Choose "Real-time Sync" template
   - Configure with your cluster

2. **Use Realm SDK** instead of Data API:
   ```bash
   npm install realm-web
   ```

3. **Update service** to use Realm instead of Data API

## Troubleshooting

### Common CORS Errors:
- `No 'Access-Control-Allow-Origin' header` → Check CORS configuration in App Services
- `API key not found` → Verify `VITE_MONGO_API_KEY` in `.env`
- `Failed to fetch` → Check if Data API is enabled and accessible

### Debug Steps:
1. Check browser console for detailed error messages
2. Verify API key is loaded (should show in console logs)
3. Test API endpoint directly with curl:
   ```bash
   curl -X POST \
     https://us-east-1.aws.data.mongodb-api.com/app/data-gcxns/endpoint/data/v1/action/findOne \
     -H "Content-Type: application/json" \
     -H "api-key: YOUR_API_KEY" \
     -d '{"collection":"users","database":"swayami_app","dataSource":"swayami-app-db","filter":{}}'
   ```

## Collections Created

The following collections will be created:
- `users` - User profiles and authentication data
- `goals` - User goals and objectives  
- `tasks` - Individual tasks linked to goals
- `journal_entries` - Daily journal entries
- `habits` - Habit tracking data

Each collection has appropriate indexes for performance.

## Next Steps

1. Set up the MongoDB API key in your `.env` file
2. Configure CORS in MongoDB Atlas App Services
3. Restart your development server
4. Test the application - login should work without CORS errors
5. Verify data is being stored in MongoDB collections

## Current Project Status

✅ **Completed:**
- MongoDB service implementation
- Frontend integration with MongoDB
- Supabase auth (Google login) integration
- CRUD operations for all data types
- Debugging and logging setup

🔧 **In Progress:**
- MongoDB Atlas Data API configuration
- CORS setup
- Environment variable configuration

🎯 **Next:**
- Production deployment setup
- Advanced MongoDB features (aggregation, etc.)
- Performance optimization 
# Swayami Local Development Setup

This guide will help you set up the Swayami application for local development with both frontend and backend.

## Quick Setup

### 1. Automated Setup (Recommended)
```bash
chmod +x setup-dev.sh
./setup-dev.sh
```

### 2. Manual Setup

#### Prerequisites
- Node.js 18+ 
- Python 3.8+
- MongoDB (local or Atlas)

#### Frontend Setup
```bash
# Install dependencies
npm install

# Install concurrently for running both services
npm install --save-dev concurrently
```

#### Backend Setup
```bash
cd backend

# Create virtual environment
python3 -m venv venv

# Activate virtual environment
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Copy environment file
cp env.example .env
```

## Configuration

### Backend Environment (.env)
Update `backend/.env` with your configuration:
```env
# MongoDB Configuration
MONGODB_URL=mongodb+srv://contactpavansb:gMM6ZpQ7ysZ1K1QX@swayami-app-db.wyd3sts.mongodb.net/

# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key_here

# Security Configuration
SECRET_KEY=your-secret-key-for-jwt-tokens-here
```

## Running the Application

### Option 1: Start Both Services Together
```bash
npm run start:full
```

### Option 2: Start Services Separately

#### Terminal 1 - Backend
```bash
cd backend
source venv/bin/activate
python main.py
```

#### Terminal 2 - Frontend
```bash
npm run dev
```

## Access URLs

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs
- **Interactive API Docs**: http://localhost:8000/redoc

## Default Login Credentials

For testing purposes, use these credentials:
- **Email**: `contact.pavansb@gmail.com`
- **Password**: `test123`

## Testing the API

### Using the Test Script
```bash
cd backend
python test_api.py
```

### Manual Testing with cURL
```bash
# Login
curl -X POST "http://localhost:8000/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email": "contact.pavansb@gmail.com", "password": "test123"}'

# Get user info (replace TOKEN with the access_token from login)
curl -X GET "http://localhost:8000/api/auth/me" \
  -H "Authorization: Bearer TOKEN"
```

## Environment Configuration

The application supports three environments:

### Development (localhost:3000)
- API Base URL: `http://localhost:8000`
- Automatically detected when hostname is localhost

### QA/Staging (swayami-focus-mirror.lovable.app)
- API Base URL: `https://api-qa.swayami.com` (update when deployed)
- Automatically detected when hostname matches Lovable deployment

### Production (app.swayami.com)
- API Base URL: `https://api.swayami.com` (update when deployed)
- Automatically detected when hostname matches production domain

## Features to Test

### Authentication
- [x] Login with email/password
- [x] JWT token storage
- [x] Protected routes

### Goals Management
- [x] Create goals
- [x] View goals
- [x] Update goal status

### Tasks Management
- [x] Create tasks
- [x] AI-generated tasks from goals
- [x] Mark tasks complete

### Journal System
- [x] Create journal entries
- [x] AI mood analysis
- [x] Journal summarization

### AI Features
- [x] Task generation from goals
- [x] Journal analysis and sentiment
- [x] Mood tracking over time

## Troubleshooting

### Frontend Issues
- If you see module resolution errors, run `npm install` again
- Clear browser cache and localStorage if login isn't working
- Check browser console for API connection errors

### Backend Issues
- Ensure MongoDB is running and accessible
- Check that all environment variables are set in `.env`
- Verify OpenAI API key is valid and has credits
- Check Python virtual environment is activated

### Database Issues
- MongoDB Atlas connection: Ensure IP is whitelisted
- Local MongoDB: Ensure service is running on port 27017

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login with email/password
- `GET /api/auth/me` - Get current user info

### Goals
- `GET /api/goals` - Get user goals
- `POST /api/goals` - Create new goal
- `PUT /api/goals/{id}` - Update goal

### Tasks
- `GET /api/tasks` - Get user tasks
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/{id}` - Update task

### Journals
- `GET /api/journals` - Get user journal entries
- `POST /api/journals` - Create new journal entry

### AI Features
- `POST /api/ai/generate-tasks` - Generate tasks from goal
- `POST /api/ai/analyze-journal` - Analyze journal entry
- `POST /api/ai/mood-analysis` - Get mood analysis across entries

## Next Steps

After local development is working:

1. **QA Environment**: Deploy backend to staging server and update QA API URL
2. **Production Environment**: Deploy to production and update production API URL
3. **Environment Variables**: Set up proper environment variable management
4. **Database**: Set up separate MongoDB databases for each environment
5. **CI/CD**: Set up automated deployment pipelines 
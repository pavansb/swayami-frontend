# Swayami Backend API

## 🎯 Overview

Swayami is a self-reliance dashboard backend built with **FastAPI**, **MongoDB**, and **OpenAI** integration. It provides goal-based productivity management with AI-powered task generation, journal analysis, and mood tracking.

## 🏗️ Architecture

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py                 # FastAPI application
│   ├── config.py               # Configuration settings
│   ├── database.py             # MongoDB connection
│   ├── models.py               # Pydantic models
│   ├── api/                    # API routes
│   │   ├── __init__.py
│   │   ├── goals.py            # Goal endpoints
│   │   ├── tasks.py            # Task endpoints
│   │   ├── journals.py         # Journal endpoints
│   │   └── ai.py               # AI-powered endpoints
│   ├── repositories/           # Database layer
│   │   ├── __init__.py
│   │   ├── goal_repository.py
│   │   ├── task_repository.py
│   │   └── journal_repository.py
│   └── services/               # Business logic
│       ├── __init__.py
│       └── openai_service.py   # AI/LLM integration
├── requirements.txt            # Python dependencies
├── env.example                 # Environment variables template
├── main.py                     # Application entry point
└── README.md                   # This file
```

## 🚀 Quick Start

### 1. Prerequisites

- Python 3.8+
- MongoDB (local or cloud)
- OpenAI API key

### 2. Installation

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### 3. Environment Setup

```bash
# Copy environment template
cp env.example .env

# Edit .env file with your settings
nano .env
```

Required environment variables:
```env
MONGODB_URI=mongodb://localhost:27017
DATABASE_NAME=swayami
OPENAI_API_KEY=your_openai_api_key_here
SECRET_KEY=your_secret_key_here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

### 4. Run the Application

```bash
# Development mode
python main.py

# Or using uvicorn directly
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at: http://localhost:8000

## 📚 API Documentation

Once running, you can access:
- **Interactive API docs**: http://localhost:8000/docs
- **Alternative docs**: http://localhost:8000/redoc
- **Health check**: http://localhost:8000/health

## 🗂️ Core Features

### 🎯 Goals Management
- Create, read, update, delete goals
- Track goal progress (0-100%)
- Categorize goals
- Filter by status (active, completed, paused, archived)

**Endpoints:**
- `POST /api/goals` - Create goal
- `GET /api/goals` - List goals
- `GET /api/goals/{id}` - Get specific goal
- `PUT /api/goals/{id}` - Update goal
- `DELETE /api/goals/{id}` - Delete goal

### ✅ Task Management
- Create and manage tasks
- Link tasks to specific goals
- Track task status and priority
- AI-generated task suggestions

**Endpoints:**
- `POST /api/tasks` - Create task
- `GET /api/tasks` - List tasks
- `GET /api/tasks/pending` - Get pending tasks
- `PATCH /api/tasks/{id}/complete` - Mark completed

### 📖 Journal System
- Create journal entries with mood tracking
- AI-powered sentiment analysis
- Search and filter entries
- Date-range queries

**Endpoints:**
- `POST /api/journals` - Create journal entry
- `GET /api/journals` - List entries
- `GET /api/journals/search` - Search entries
- `GET /api/journals/recent` - Recent entries

### 🤖 AI-Powered Features

#### Task Generation
Generate intelligent, actionable tasks based on goals:
```bash
POST /api/ai/generate-tasks
{
  "goal_id": "goal_id_here",
  "count": 5,
  "user_preferences": {}
}
```

#### Journal Analysis
Get AI insights from journal entries:
```bash
POST /api/ai/summarize-journal
{
  "journal_id": "journal_id_here"
}
```

#### Mood Analysis
Analyze mood patterns across multiple entries:
```bash
POST /api/ai/analyze-mood
{
  "journal_ids": ["id1", "id2"],
  "date_range_days": 7
}
```

#### Quick Recommendations
Get personalized productivity recommendations:
```bash
GET /api/ai/quick-recommendations
```

## 🔧 Development

### Code Structure

**Models** (`app/models.py`):
- Pydantic models for data validation
- Enums for status types
- Request/response schemas

**Repositories** (`app/repositories/`):
- Database abstraction layer
- CRUD operations
- MongoDB queries

**Services** (`app/services/`):
- Business logic
- External API integrations
- AI/OpenAI service

**API Routes** (`app/api/`):
- FastAPI routers
- Request validation
- Error handling

### Database Schema

**Users Collection:**
```json
{
  "_id": "ObjectId",
  "email": "string (unique)",
  "name": "string",
  "theme": "light|dark|system",
  "created_at": "datetime",
  "updated_at": "datetime"
}
```

**Goals Collection:**
```json
{
  "_id": "ObjectId",
  "user_id": "string",
  "title": "string",
  "description": "string",
  "category": "string",
  "status": "active|completed|paused|archived",
  "priority": "low|medium|high",
  "progress": "float (0-100)",
  "target_date": "datetime",
  "tags": ["string"],
  "created_at": "datetime",
  "updated_at": "datetime"
}
```

**Tasks Collection:**
```json
{
  "_id": "ObjectId",
  "user_id": "string",
  "goal_id": "string (optional)",
  "title": "string",
  "description": "string",
  "status": "pending|in_progress|completed|cancelled",
  "priority": "low|medium|high",
  "is_ai_generated": "boolean",
  "estimated_duration": "int (minutes)",
  "actual_duration": "int (minutes)",
  "due_date": "datetime",
  "completed_at": "datetime",
  "tags": ["string"],
  "created_at": "datetime",
  "updated_at": "datetime"
}
```

**Journals Collection:**
```json
{
  "_id": "ObjectId",
  "user_id": "string",
  "title": "string",
  "content": "string",
  "mood_score": "int (1-5)",
  "summary": "string (AI-generated)",
  "sentiment_score": "float (-1 to 1)",
  "tags": ["string"],
  "created_at": "datetime",
  "updated_at": "datetime"
}
```

**AI Logs Collection:**
```json
{
  "_id": "ObjectId",
  "user_id": "string",
  "type": "task_generation|journal_summary|mood_analysis|recommendations",
  "input": "object (request data)",
  "output": "object (AI response)",
  "timestamp": "datetime"
}
```

**Quotes Collection:**
```json
{
  "_id": "ObjectId",
  "text": "string",
  "author": "string",
  "created_at": "datetime"
}
```

**Sessions Collection:**
```json
{
  "_id": "ObjectId",
  "user_id": "string",
  "start_time": "datetime",
  "end_time": "datetime",
  "actions": [
    {
      "action": "string",
      "timestamp": "datetime",
      "data": "object"
    }
  ],
  "created_at": "datetime",
  "updated_at": "datetime"
}
```

## 🔒 Authentication

### Mock Authentication (Development)

The API uses mock authentication for development with the following credentials:

**Login Credentials:**
- Email: `contact.pavansb@gmail.com`
- Password: `test123`

**How to Authenticate:**

1. **Login to get Bearer token:**
```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "contact.pavansb@gmail.com", "password": "test123"}'
```

2. **Use Bearer token in requests:**
```bash
curl -H "Authorization: Bearer <your-token>" \
  http://localhost:8000/api/goals
```

3. **Or use Basic Auth directly:**
```bash
curl -H "Authorization: Basic Y29udGFjdC5wYXZhbnNiQGdtYWlsLmNvbTp0ZXN0MTIz" \
  http://localhost:8000/api/goals
```

**Available Auth Endpoints:**
- `POST /api/auth/login` - Login with email/password
- `GET /api/auth/me` - Get current user info
- `GET /api/auth/status` - Check auth status
- `GET /api/auth/test` - Auth system info (no auth required)

**TODO**: Integrate with Supabase Auth:
1. Add Supabase client configuration
2. Create auth middleware
3. JWT token validation
4. User session management

## 🧪 Testing

### Quick API Test

```bash
# Run the test script
cd backend
python test_api.py
```

This will test:
- Health endpoint
- Authentication (login, Bearer token, Basic auth)
- Goals CRUD operations
- Database connectivity

### Manual Testing with cURL

```bash
# 1. Test health
curl http://localhost:8000/health

# 2. Login
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "contact.pavansb@gmail.com", "password": "test123"}'

# 3. Create a goal (use token from login response)
curl -X POST http://localhost:8000/api/goals \
  -H "Authorization: Bearer <your-token>" \
  -H "Content-Type: application/json" \
  -d '{"title": "Learn MongoDB", "priority": "high"}'

# 4. Get goals
curl -H "Authorization: Bearer <your-token>" \
  http://localhost:8000/api/goals
```

### Future Testing

```bash
# Run tests (when implemented)
pytest

# Test specific modules
pytest app/tests/test_goals.py

# Coverage report
pytest --cov=app
```

## 🚀 Deployment

### Using Docker

```bash
# Build image
docker build -t swayami-api .

# Run container
docker run -p 8000:8000 --env-file .env swayami-api
```

### Production Considerations

- Use production MongoDB instance
- Set up proper environment variables
- Configure CORS for production domains
- Add rate limiting
- Implement proper logging
- Set up monitoring and health checks

## 🤝 Integration with Frontend

The API is designed to work with the React frontend. Key integration points:

1. **CORS**: Configured for `localhost:3000` (React) and `localhost:5173` (Vite)
2. **Mock Auth**: Uses hardcoded user ID until Supabase integration
3. **REST API**: Standard HTTP methods and status codes
4. **JSON Responses**: Consistent response format

### Example Frontend Usage

```javascript
// Create a goal
const response = await fetch('http://localhost:8000/api/goals', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    title: 'Learn Python',
    description: 'Master Python programming',
    category: 'programming',
    priority: 'high'
  })
});

// Generate AI tasks
const aiResponse = await fetch('http://localhost:8000/api/ai/generate-tasks', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    goal_id: 'goal_id_here',
    count: 5
  })
});
```

## 📈 Roadmap

- [ ] Supabase Authentication integration
- [ ] Real-time notifications with WebSockets
- [ ] Advanced AI features (habit tracking, performance insights)
- [ ] Data export/import functionality
- [ ] Team collaboration features
- [ ] Mobile API optimizations
- [ ] Comprehensive testing suite
- [ ] Performance monitoring
- [ ] API rate limiting
- [ ] Caching layer

## 🐛 Troubleshooting

### Common Issues

**MongoDB Connection Error:**
```bash
# Check MongoDB is running
mongosh --eval "db.adminCommand('ping')"

# Verify connection string in .env
```

**OpenAI API Errors:**
```bash
# Verify API key is set
echo $OPENAI_API_KEY

# Check API quota and billing
```

**Import Errors:**
```bash
# Ensure you're in the virtual environment
which python

# Reinstall dependencies
pip install -r requirements.txt --force-reinstall
```

## 📞 Support

For questions or issues:
1. Check the API documentation at `/docs`
2. Review the logs for error details
3. Ensure all environment variables are set correctly
4. Verify MongoDB and OpenAI connectivity

---

**Built with ❤️ for productivity and self-reliance** 
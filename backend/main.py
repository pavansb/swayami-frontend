from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import logging

from app.database import connect_to_mongo, close_mongo_connection, seed_initial_data
from app.api import goals, tasks, journals, ai, auth

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Lifespan events
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    logger.info("🚀 Starting Swayami API...")
    try:
        await connect_to_mongo()
        logger.info("✅ Database connection established")
        
        # Seed initial data
        await seed_initial_data()
        logger.info("✅ Initial data seeded")
        
    except Exception as e:
        logger.error(f"❌ Failed to start application: {e}")
        raise
    
    yield
    
    # Shutdown
    logger.info("🛑 Shutting down Swayami API...")
    await close_mongo_connection()

# Create FastAPI app
app = FastAPI(
    title="Swayami API",
    description="Self-Reliance Dashboard - Goal-based productivity companion with AI-powered insights",
    version="1.0.0",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000", 
        "http://localhost:5173",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Health check endpoint
@app.get("/")
async def root():
    return {
        "message": "🌟 Welcome to Swayami API",
        "version": "1.0.0",
        "status": "active",
        "docs": "/docs",
        "auth_test": "/api/auth/test"
    }

@app.get("/health")
async def health_check():
    return {
        "status": "healthy", 
        "service": "swayami-api",
        "database": "connected",
        "auth": "mock_enabled"
    }

# Include routers
app.include_router(auth.router, prefix="/api")
app.include_router(goals.router, prefix="/api")
app.include_router(tasks.router, prefix="/api") 
app.include_router(journals.router, prefix="/api")
app.include_router(ai.router, prefix="/api")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    ) 
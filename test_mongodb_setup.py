#!/usr/bin/env python3
"""
MongoDB Setup and Test Script for Swayami App
This script tests the MongoDB connection and creates necessary collections
"""

import pymongo
from pymongo import MongoClient
from datetime import datetime, timezone
import uuid
import json

# MongoDB Connection String
MONGO_URI = "mongodb+srv://contactpavansb:gMM6ZpQ7ysZ1K1QX@swayami-app-db.wyd3sts.mongodb.net/?retryWrites=true&w=majority&appName=swayami-app-db"
DATABASE_NAME = "swayami_app"

def test_connection():
    """Test MongoDB connection"""
    try:
        print("🔄 Testing MongoDB connection...")
        
        # Add SSL options for macOS compatibility
        client = MongoClient(
            MONGO_URI,
            tls=True,
            tlsAllowInvalidCertificates=True,
            serverSelectionTimeoutMS=5000,
            connectTimeoutMS=5000,
            socketTimeoutMS=5000
        )
        
        # Test the connection
        client.admin.command('ping')
        print("✅ MongoDB connection successful!")
        
        # List databases
        db_list = client.list_database_names()
        print(f"📚 Available databases: {db_list}")
        
        return client
    except Exception as e:
        print(f"❌ MongoDB connection failed: {e}")
        print("💡 Trying alternative connection method...")
        
        # Try with alternative SSL settings
        try:
            client = MongoClient(
                MONGO_URI,
                ssl=True,
                ssl_cert_reqs=0,  # Don't verify certificates
                serverSelectionTimeoutMS=3000
            )
            client.admin.command('ping')
            print("✅ MongoDB connection successful with alternative settings!")
            return client
        except Exception as e2:
            print(f"❌ Alternative connection also failed: {e2}")
            return None

def create_collections(client):
    """Create necessary collections with indexes"""
    try:
        db = client[DATABASE_NAME]
        print(f"📂 Using database: {DATABASE_NAME}")
        
        # Collections to create
        collections = [
            "users",
            "goals", 
            "tasks",
            "journal_entries",
            "habits"
        ]
        
        for collection_name in collections:
            if collection_name not in db.list_collection_names():
                db.create_collection(collection_name)
                print(f"✅ Created collection: {collection_name}")
            else:
                print(f"📋 Collection already exists: {collection_name}")
        
        # Create indexes for better performance
        print("\n🔧 Creating indexes...")
        
        # Users collection indexes
        db.users.create_index("google_id", unique=True)
        db.users.create_index("email", unique=True)
        print("✅ Created users indexes")
        
        # Goals collection indexes
        db.goals.create_index("user_id")
        db.goals.create_index([("user_id", 1), ("status", 1)])
        print("✅ Created goals indexes")
        
        # Tasks collection indexes
        db.tasks.create_index("user_id")
        db.tasks.create_index("goal_id")
        db.tasks.create_index([("user_id", 1), ("status", 1)])
        print("✅ Created tasks indexes")
        
        # Journal entries indexes
        db.journal_entries.create_index("user_id")
        db.journal_entries.create_index([("user_id", 1), ("created_at", -1)])
        print("✅ Created journal_entries indexes")
        
        # Habits collection indexes
        db.habits.create_index("user_id")
        print("✅ Created habits indexes")
        
        return db
        
    except Exception as e:
        print(f"❌ Error creating collections: {e}")
        return None

def insert_test_data(db):
    """Insert test data to verify collections work"""
    try:
        print("\n📝 Inserting test data...")
        
        # Test user
        test_user_id = str(uuid.uuid4())
        test_user = {
            "_id": test_user_id,
            "google_id": "test_google_123",
            "email": "test@swayami.com",
            "full_name": "Test User",
            "has_completed_onboarding": False,
            "streak": 0,
            "level": "Mindful Novice",
            "created_at": datetime.now(timezone.utc),
            "updated_at": datetime.now(timezone.utc)
        }
        
        result = db.users.insert_one(test_user)
        print(f"✅ Inserted test user: {result.inserted_id}")
        
        # Test goal
        test_goal_id = str(uuid.uuid4())
        test_goal = {
            "_id": test_goal_id,
            "user_id": test_user_id,
            "title": "Health & Fitness",
            "description": "Improve overall health and fitness levels",
            "status": "active",
            "priority": "high",
            "progress": 0,
            "category": "health_fitness",
            "created_at": datetime.now(timezone.utc)
        }
        
        result = db.goals.insert_one(test_goal)
        print(f"✅ Inserted test goal: {result.inserted_id}")
        
        # Test task
        test_task = {
            "_id": str(uuid.uuid4()),
            "user_id": test_user_id,
            "goal_id": test_goal_id,
            "title": "30-minute morning workout",
            "description": "Complete a full-body workout routine",
            "status": "pending",
            "priority": "medium",
            "created_at": datetime.now(timezone.utc)
        }
        
        result = db.tasks.insert_one(test_task)
        print(f"✅ Inserted test task: {result.inserted_id}")
        
        # Test journal entry
        test_journal = {
            "_id": str(uuid.uuid4()),
            "user_id": test_user_id,
            "content": "Today I'm feeling motivated to start my fitness journey!",
            "mood_score": 8,
            "summary": "Feeling motivated about fitness goals",
            "created_at": datetime.now(timezone.utc)
        }
        
        result = db.journal_entries.insert_one(test_journal)
        print(f"✅ Inserted test journal entry: {result.inserted_id}")
        
        # Test habit
        test_habit = {
            "_id": str(uuid.uuid4()),
            "user_id": test_user_id,
            "emoji": "💧",
            "label": "Drink 8 glasses of water",
            "completed": False,
            "created_at": datetime.now(timezone.utc)
        }
        
        result = db.habits.insert_one(test_habit)
        print(f"✅ Inserted test habit: {result.inserted_id}")
        
        print("\n✅ All test data inserted successfully!")
        return True
        
    except Exception as e:
        print(f"❌ Error inserting test data: {e}")
        return False

def query_test_data(db):
    """Query and display test data"""
    try:
        print("\n📊 Querying test data...")
        
        # Count documents in each collection
        collections = ["users", "goals", "tasks", "journal_entries", "habits"]
        
        for collection_name in collections:
            count = db[collection_name].count_documents({})
            print(f"📋 {collection_name}: {count} documents")
        
        # Display test user data
        test_user = db.users.find_one({"email": "test@swayami.com"})
        if test_user:
            print(f"\n👤 Test User: {test_user['full_name']} ({test_user['email']})")
            
            # Find user's goals
            goals = list(db.goals.find({"user_id": test_user["_id"]}))
            print(f"🎯 User's goals: {len(goals)}")
            
            # Find user's tasks
            tasks = list(db.tasks.find({"user_id": test_user["_id"]}))
            print(f"📝 User's tasks: {len(tasks)}")
            
            # Find user's journal entries
            journals = list(db.journal_entries.find({"user_id": test_user["_id"]}))
            print(f"📔 User's journal entries: {len(journals)}")
            
            # Find user's habits
            habits = list(db.habits.find({"user_id": test_user["_id"]}))
            print(f"🔄 User's habits: {len(habits)}")
        
        return True
        
    except Exception as e:
        print(f"❌ Error querying test data: {e}")
        return False

def cleanup_test_data(db):
    """Clean up test data"""
    try:
        print("\n🧹 Cleaning up test data...")
        
        # Delete test data
        db.users.delete_many({"email": "test@swayami.com"})
        db.goals.delete_many({"title": "Health & Fitness"})
        db.tasks.delete_many({"title": "30-minute morning workout"})
        db.journal_entries.delete_many({"content": {"$regex": "Today I'm feeling motivated"}})
        db.habits.delete_many({"label": "Drink 8 glasses of water"})
        
        print("✅ Test data cleaned up!")
        return True
        
    except Exception as e:
        print(f"❌ Error cleaning up test data: {e}")
        return False

def main():
    """Main function to run all tests"""
    print("🚀 Starting MongoDB Setup and Testing for Swayami App")
    print("=" * 60)
    
    # Test connection
    client = test_connection()
    if not client:
        return
    
    # Create collections
    db = create_collections(client)
    if not db:
        return
    
    # Insert test data
    if not insert_test_data(db):
        return
    
    # Query test data
    if not query_test_data(db):
        return
    
    # Ask user if they want to clean up
    response = input("\n🤔 Do you want to clean up test data? (y/n): ").lower()
    if response == 'y':
        cleanup_test_data(db)
    
    print("\n🎉 MongoDB setup and testing completed successfully!")
    print("✅ Your MongoDB database is ready for the Swayami app!")
    
    # Close connection
    client.close()

if __name__ == "__main__":
    main() 
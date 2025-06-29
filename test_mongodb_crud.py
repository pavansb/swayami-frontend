#!/usr/bin/env python3
"""
MongoDB CRUD Operations Test Script for Swayami App
This script tests all CRUD operations that will be used in the React app
"""

import pymongo
from pymongo import MongoClient
from datetime import datetime, timezone
import uuid
import json

# MongoDB Connection String
MONGO_URI = "mongodb+srv://contactpavansb:gMM6ZpQ7ysZ1K1QX@swayami-app-db.wyd3sts.mongodb.net/?retryWrites=true&w=majority&appName=swayami-app-db"
DATABASE_NAME = "swayami_app"

class SwayamiMongoDB:
    def __init__(self, mongo_uri, db_name):
        self.client = MongoClient(mongo_uri)
        self.db = self.client[db_name]
        print(f"✅ Connected to MongoDB database: {db_name}")
    
    # USER CRUD OPERATIONS
    def create_user(self, google_id, email, full_name):
        """Create a new user"""
        user_id = str(uuid.uuid4())
        user_doc = {
            "_id": user_id,
            "google_id": google_id,
            "email": email,
            "full_name": full_name,
            "has_completed_onboarding": False,
            "streak": 0,
            "level": "Mindful Novice",
            "created_at": datetime.now(timezone.utc),
            "updated_at": datetime.now(timezone.utc)
        }
        
        try:
            result = self.db.users.insert_one(user_doc)
            print(f"✅ Created user: {full_name} ({email})")
            return user_id
        except pymongo.errors.DuplicateKeyError:
            print(f"⚠️ User already exists: {email}")
            existing_user = self.db.users.find_one({"email": email})
            return existing_user["_id"] if existing_user else None
    
    def get_user_by_google_id(self, google_id):
        """Get user by Google ID"""
        return self.db.users.find_one({"google_id": google_id})
    
    def get_user_by_email(self, email):
        """Get user by email"""
        return self.db.users.find_one({"email": email})
    
    def update_user_onboarding(self, user_id, completed=True):
        """Update user onboarding status"""
        result = self.db.users.update_one(
            {"_id": user_id},
            {
                "$set": {
                    "has_completed_onboarding": completed,
                    "updated_at": datetime.now(timezone.utc)
                }
            }
        )
        return result.modified_count > 0
    
    def update_user_streak(self, user_id, streak_count):
        """Update user streak"""
        result = self.db.users.update_one(
            {"_id": user_id},
            {
                "$set": {
                    "streak": streak_count,
                    "updated_at": datetime.now(timezone.utc)
                }
            }
        )
        return result.modified_count > 0
    
    # GOAL CRUD OPERATIONS
    def create_goal(self, user_id, title, description, category="general", priority="medium"):
        """Create a new goal"""
        goal_id = str(uuid.uuid4())
        goal_doc = {
            "_id": goal_id,
            "user_id": user_id,
            "title": title,
            "description": description,
            "status": "active",
            "priority": priority,
            "progress": 0,
            "category": category,
            "created_at": datetime.now(timezone.utc)
        }
        
        result = self.db.goals.insert_one(goal_doc)
        print(f"✅ Created goal: {title}")
        return goal_id
    
    def get_user_goals(self, user_id, status=None):
        """Get all goals for a user"""
        query = {"user_id": user_id}
        if status:
            query["status"] = status
        
        return list(self.db.goals.find(query).sort("created_at", -1))
    
    def update_goal_progress(self, goal_id, progress):
        """Update goal progress"""
        result = self.db.goals.update_one(
            {"_id": goal_id},
            {"$set": {"progress": progress}}
        )
        return result.modified_count > 0
    
    def update_goal_status(self, goal_id, status):
        """Update goal status"""
        result = self.db.goals.update_one(
            {"_id": goal_id},
            {"$set": {"status": status}}
        )
        return result.modified_count > 0
    
    def delete_goal(self, goal_id):
        """Delete a goal and all its tasks"""
        # First delete all tasks associated with this goal
        self.db.tasks.delete_many({"goal_id": goal_id})
        
        # Then delete the goal
        result = self.db.goals.delete_one({"_id": goal_id})
        return result.deleted_count > 0
    
    # TASK CRUD OPERATIONS
    def create_task(self, user_id, goal_id, title, description="", priority="medium"):
        """Create a new task"""
        task_id = str(uuid.uuid4())
        task_doc = {
            "_id": task_id,
            "user_id": user_id,
            "goal_id": goal_id,
            "title": title,
            "description": description,
            "status": "pending",
            "priority": priority,
            "created_at": datetime.now(timezone.utc)
        }
        
        result = self.db.tasks.insert_one(task_doc)
        print(f"✅ Created task: {title}")
        return task_id
    
    def get_user_tasks(self, user_id, status=None):
        """Get all tasks for a user"""
        query = {"user_id": user_id}
        if status:
            query["status"] = status
        
        return list(self.db.tasks.find(query).sort("created_at", -1))
    
    def get_goal_tasks(self, goal_id):
        """Get all tasks for a specific goal"""
        return list(self.db.tasks.find({"goal_id": goal_id}).sort("created_at", -1))
    
    def update_task_status(self, task_id, status):
        """Update task status"""
        result = self.db.tasks.update_one(
            {"_id": task_id},
            {"$set": {"status": status}}
        )
        return result.modified_count > 0
    
    def update_task(self, task_id, updates):
        """Update task with given fields"""
        result = self.db.tasks.update_one(
            {"_id": task_id},
            {"$set": updates}
        )
        return result.modified_count > 0
    
    def delete_task(self, task_id):
        """Delete a task"""
        result = self.db.tasks.delete_one({"_id": task_id})
        return result.deleted_count > 0
    
    # JOURNAL CRUD OPERATIONS
    def create_journal_entry(self, user_id, content, mood_score=None):
        """Create a new journal entry"""
        entry_id = str(uuid.uuid4())
        entry_doc = {
            "_id": entry_id,
            "user_id": user_id,
            "content": content,
            "mood_score": mood_score,
            "summary": content[:100] + "..." if len(content) > 100 else content,
            "created_at": datetime.now(timezone.utc)
        }
        
        result = self.db.journal_entries.insert_one(entry_doc)
        print(f"✅ Created journal entry")
        return entry_id
    
    def get_user_journal_entries(self, user_id, limit=10):
        """Get journal entries for a user"""
        return list(self.db.journal_entries.find({"user_id": user_id})
                   .sort("created_at", -1).limit(limit))
    
    def update_journal_entry(self, entry_id, content, mood_score=None):
        """Update a journal entry"""
        updates = {
            "content": content,
            "summary": content[:100] + "..." if len(content) > 100 else content
        }
        if mood_score is not None:
            updates["mood_score"] = mood_score
        
        result = self.db.journal_entries.update_one(
            {"_id": entry_id},
            {"$set": updates}
        )
        return result.modified_count > 0
    
    def delete_journal_entry(self, entry_id):
        """Delete a journal entry"""
        result = self.db.journal_entries.delete_one({"_id": entry_id})
        return result.deleted_count > 0
    
    # HABITS CRUD OPERATIONS
    def create_habit(self, user_id, emoji, label):
        """Create a new habit"""
        habit_id = str(uuid.uuid4())
        habit_doc = {
            "_id": habit_id,
            "user_id": user_id,
            "emoji": emoji,
            "label": label,
            "completed": False,
            "created_at": datetime.now(timezone.utc)
        }
        
        result = self.db.habits.insert_one(habit_doc)
        print(f"✅ Created habit: {emoji} {label}")
        return habit_id
    
    def get_user_habits(self, user_id):
        """Get all habits for a user"""
        return list(self.db.habits.find({"user_id": user_id}).sort("created_at", -1))
    
    def toggle_habit(self, habit_id):
        """Toggle habit completion status"""
        habit = self.db.habits.find_one({"_id": habit_id})
        if habit:
            new_status = not habit.get("completed", False)
            result = self.db.habits.update_one(
                {"_id": habit_id},
                {"$set": {"completed": new_status}}
            )
            return result.modified_count > 0
        return False
    
    def delete_habit(self, habit_id):
        """Delete a habit"""
        result = self.db.habits.delete_one({"_id": habit_id})
        return result.deleted_count > 0
    
    def close_connection(self):
        """Close MongoDB connection"""
        self.client.close()
        print("🔒 MongoDB connection closed")

def test_connection():
    """Test MongoDB connection and basic operations"""
    print("🚀 Starting MongoDB Connection Test")
    print("=" * 50)
    
    try:
        mongo_db = SwayamiMongoDB(MONGO_URI, DATABASE_NAME)
        
        # Test user creation
        user_id = mongo_db.create_user(
            google_id="test_google_789",
            email="test@example.com",
            full_name="Test User"
        )
        
        # Test user retrieval
        user = mongo_db.get_user_by_email("test@example.com")
        print(f"📝 Retrieved user: {user['full_name']}")
        
        # Cleanup
        mongo_db.db.users.delete_one({"_id": user_id})
        print("🧹 Cleaned up test data")
        
        mongo_db.close_connection()
        print("\n🎉 MongoDB connection test successful!")
        
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    test_connection() 
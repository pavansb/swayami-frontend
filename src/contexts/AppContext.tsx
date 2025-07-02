import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../utils/supabaseClient';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { apiService } from '../services/api';

// Interfaces
interface Goal {
  _id: string;
  title: string;
  description?: string;
  category?: string;
  status: 'active' | 'completed' | 'stalled';
  priority?: string;
  progress?: number;
  created_at?: string;
  user_id?: string;
}

interface Task {
  _id: string;
  title: string;
  description?: string;
  goal_id?: string;
  status: 'pending' | 'completed' | 'in_progress';
  priority?: string;
  due_date?: string;
  created_at?: string;
  user_id?: string;
}

interface JournalEntry {
  _id: string;
  content: string;
  mood_score?: number;
  summary?: string;
  created_at?: string;
  user_id?: string;
}

interface User {
  _id: string;
  email: string;
  name?: string;
  full_name?: string;
  avatar_url?: string;
  isLoggedIn: boolean;
  hasCompletedOnboarding: boolean;
  streak: number;
  level: string;
  google_id?: string;
}

interface AppContextType {
  user: User | null;
  supabaseUser: SupabaseUser | null;
  goals: Goal[];
  tasks: Task[];
  journalEntries: JournalEntry[];
  habits: Array<{ _id: string; emoji: string; label: string; completed: boolean }>;
  isLoading: boolean;
  serviceError: string | null;
  login: (email: string) => void;
  loginWithToken: (userData: { id: string; email: string; name?: string }) => void;
  logout: () => void;
  signInWithGoogle: () => Promise<{ success: boolean; error: any }>;
  setUser: (user: User | null | ((prev: User | null) => User | null)) => void;
  completeOnboarding: (selectedGoals: { type: string; description: string }[]) => Promise<Goal[]>;
  addTask: (task: Omit<Task, '_id' | 'created_at'>) => Promise<void>;
  toggleTask: (taskId: string) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
  editTask: (taskId: string, updates: Partial<Task>) => Promise<void>;
  addJournalEntry: (entry: Omit<JournalEntry, '_id' | 'created_at'>) => Promise<void>;
  updateJournalEntry: (entryId: string, updates: Partial<JournalEntry>) => Promise<void>;
  toggleHabit: (habitId: string) => void;
  regenerateRecommendations: () => void;
  resetAllData: () => void;
  loadUserData: () => Promise<void>;
  refreshUserProfile: () => Promise<{ success: boolean; error: any }>;
  retryUserInitialization: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [supabaseUser, setSupabaseUser] = useState<SupabaseUser | null>(null);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [habits, setHabits] = useState<Array<{ _id: string; emoji: string; label: string; completed: boolean }>>([
    { _id: '1', emoji: '💧', label: 'Drink 8 glasses of water', completed: false },
    { _id: '2', emoji: '🏃', label: '30-minute morning run', completed: false },
    { _id: '3', emoji: '📚', label: 'Read for 20 minutes', completed: true },
    { _id: '4', emoji: '🧘', label: 'Meditate for 10 minutes', completed: false },
    { _id: '5', emoji: '🌱', label: 'Practice gratitude', completed: true },
  ]);
  const [isLoading, setIsLoading] = useState(true);
  const [serviceError, setServiceError] = useState<string | null>(null);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        console.log('🔄 MongoDB App: Initializing authentication...');
        
        // Get current Supabase session (for auth only)
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.warn('⚠️ MongoDB App: Session error (non-critical):', sessionError);
        }
        
        if (session?.user) {
          console.log('✅ MongoDB App: Found existing Supabase session');
          setSupabaseUser(session.user);
          await initializeUserFromSupabase(session.user);
        } else {
          console.log('📭 MongoDB App: No existing session found');
        }

        // Listen for auth changes (Supabase auth only)
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (event, session) => {
            console.log('🔔 COMPREHENSIVE AUTH STATE DEBUG - Event:', event);
            console.log('🔔 COMPREHENSIVE AUTH STATE DEBUG - Session details:', {
              hasSession: !!session,
              hasUser: !!session?.user,
              userEmail: session?.user?.email,
              userId: session?.user?.id
            });
            
            if (event === 'SIGNED_IN' && session?.user) {
              console.log('✅ COMPREHENSIVE AUTH STATE DEBUG - User signed in via auth state change');
              console.log('✅ User details:', {
                email: session.user.email,
                id: session.user.id,
                metadata: session.user.user_metadata
              });
              setSupabaseUser(session.user);
              await initializeUserFromSupabase(session.user);
            } else if (event === 'SIGNED_OUT') {
              console.log('👋 COMPREHENSIVE AUTH STATE DEBUG - User signed out');
              setSupabaseUser(null);
              setUser(null);
              setGoals([]);
              setTasks([]);
              setJournalEntries([]);
            } else if (event === 'TOKEN_REFRESHED') {
              console.log('🔄 COMPREHENSIVE AUTH STATE DEBUG - Token refreshed');
              if (session?.user) {
                setSupabaseUser(session.user);
                // Don't reinitialize user data on token refresh
              }
            } else {
              console.log('🔔 COMPREHENSIVE AUTH STATE DEBUG - Other event:', event);
            }
          }
        );

        return () => {
          subscription.unsubscribe();
        };
      } catch (error) {
        console.error('❌ MongoDB App: Error initializing auth:', error);
        // Don't block the app if auth initialization fails
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const initializeUserFromSupabase = async (supabaseUser: SupabaseUser) => {
    console.log('🔄 PRODUCTION USER INIT: Starting user initialization for:', supabaseUser.email);
    
    // Extract profile photo first
    const avatarUrl = supabaseUser.user_metadata?.avatar_url || 
                     supabaseUser.user_metadata?.picture ||
                     supabaseUser.user_metadata?.photo ||
                     supabaseUser.user_metadata?.image ||
                     supabaseUser.user_metadata?.profile_pic ||
                     supabaseUser.identities?.find(identity => identity.provider === 'google')?.identity_data?.picture ||
                     supabaseUser.identities?.find(identity => identity.provider === 'google')?.identity_data?.avatar_url ||
                     null;
    
    console.log('🔄 PRODUCTION USER INIT: Avatar URL extracted:', avatarUrl);

    let mongoUser = null;
    
    // Step 1: Try to find existing user
    try {
      console.log('🔍 PRODUCTION USER INIT: Checking if user exists in MongoDB...');
      mongoUser = await apiService.getUserByEmail(supabaseUser.email || '');
      console.log('✅ PRODUCTION USER INIT: Existing user found:', mongoUser?.email);
    } catch (getUserError) {
      console.log('❌ PRODUCTION USER INIT: Error checking existing user (expected for new users):', getUserError);
      // This is expected for new users - continue to user creation
    }
    
    // Step 2: Create user if doesn't exist  
    if (!mongoUser) {
      try {
        console.log('👤 PRODUCTION USER INIT: Creating new user in MongoDB...');
        console.log('👤 PRODUCTION USER INIT: User data:', {
          google_id: supabaseUser.id,
          email: supabaseUser.email,
          full_name: supabaseUser.user_metadata?.full_name || supabaseUser.user_metadata?.name || 'User'
        });
        
        mongoUser = await apiService.createUser({
          google_id: supabaseUser.id,
          email: supabaseUser.email || '',
          full_name: supabaseUser.user_metadata?.full_name || 
                    supabaseUser.user_metadata?.name ||
                    supabaseUser.email?.split('@')[0] || 
                    'User',
          avatar_url: avatarUrl || undefined
        });
        
        console.log('✅ PRODUCTION USER INIT: New user created successfully:', mongoUser?.email, 'ID:', mongoUser?._id);
             } catch (createUserError) {
         console.error('🚨 PRODUCTION USER INIT: CRITICAL - User creation failed!', createUserError);
         console.error('🚨 PRODUCTION USER INIT: This is the root cause of login redirect issue!');
         
         // RETRY MECHANISM: Try to create user again with retry logic
         console.log('🔄 PRODUCTION USER INIT: Attempting retry...');
         
         for (let retryCount = 1; retryCount <= 3; retryCount++) {
           console.log(`🔄 PRODUCTION USER INIT: Retry attempt ${retryCount}/3`);
           
           try {
             await new Promise(resolve => setTimeout(resolve, 1000 * retryCount)); // Progressive delay
             
             mongoUser = await apiService.createUser({
               google_id: supabaseUser.id,
               email: supabaseUser.email || '',
               full_name: supabaseUser.user_metadata?.full_name || 
                         supabaseUser.user_metadata?.name ||
                         supabaseUser.email?.split('@')[0] || 
                         'User',
               avatar_url: avatarUrl || undefined
             });
             
             console.log(`✅ PRODUCTION USER INIT: User creation succeeded on retry ${retryCount}!`);
             break; // Success - exit retry loop
             
           } catch (retryError) {
             console.error(`❌ PRODUCTION USER INIT: Retry ${retryCount} failed:`, retryError);
             
             if (retryCount === 3) {
               // All retries failed - show user a proper error
               console.error('🚨 PRODUCTION USER INIT: All retries failed - MongoDB appears to be down');
               console.error('🚨 PRODUCTION USER INIT: Setting temporary user state and showing error message');
               
               // Set minimal user state to prevent login redirect, but show error
               setUser({
                 _id: 'TEMP_' + supabaseUser.id, // Temporary ID that won't work with backend
                 email: supabaseUser.email || '',
                 full_name: supabaseUser.user_metadata?.full_name || supabaseUser.user_metadata?.name || 'User',
                 name: supabaseUser.user_metadata?.full_name || supabaseUser.user_metadata?.name || 'User',
                 avatar_url: avatarUrl,
                 isLoggedIn: true,
                 hasCompletedOnboarding: false,
                 streak: 0,
                 level: 'Mindful Novice',
                 google_id: supabaseUser.id
               });
               
                               // Set service error state for UI to show error message
                setServiceError('Our service is temporarily unavailable. Please try again in a few minutes.');
                console.log('💡 PRODUCTION USER INIT: Service error set - UI should show error message');
                return;
             }
           }
         }
       }
    }
    
    // Step 3: Update existing user with avatar if needed
    if (mongoUser && avatarUrl && !mongoUser.avatar_url) {
      try {
        console.log('🔄 PRODUCTION USER INIT: Updating existing user with avatar...');
        const updatedUser = await apiService.updateUserProfile(mongoUser._id, { avatar_url: avatarUrl });
        mongoUser = updatedUser;
        console.log('✅ PRODUCTION USER INIT: User avatar updated');
      } catch (updateError) {
        console.log('⚠️ PRODUCTION USER INIT: Avatar update failed (non-critical):', updateError);
        // Continue with existing user data
      }
    }

    // Step 4: Set user state (CRITICAL - this must happen!)
    if (mongoUser) {
      console.log('✅ PRODUCTION USER INIT: Setting user state in React context...');
      console.log('✅ PRODUCTION USER INIT: User data:', {
        id: mongoUser._id,
        email: mongoUser.email,
        hasCompletedOnboarding: mongoUser.has_completed_onboarding
      });
      
      setUser({
        _id: mongoUser._id,
        email: mongoUser.email,
        full_name: mongoUser.full_name,
        name: mongoUser.full_name,
        avatar_url: mongoUser.avatar_url,
        isLoggedIn: true, // ❗ CRITICAL: This prevents login redirect
        hasCompletedOnboarding: mongoUser.has_completed_onboarding || false,
        streak: mongoUser.streak || 0,
        level: mongoUser.level || 'Mindful Novice',
        google_id: mongoUser.google_id
      });

      console.log('✅ PRODUCTION USER INIT: User state set successfully - user should proceed normally');

      // Step 5: Load user data (non-critical)
      try {
        console.log('📊 PRODUCTION USER INIT: Loading user data...');
        await loadUserDataFromMongo(mongoUser._id);
        console.log('✅ PRODUCTION USER INIT: User data loaded successfully');
      } catch (loadDataError) {
        console.log('⚠️ PRODUCTION USER INIT: User data loading failed (non-critical):', loadDataError);
        // Continue - user can still use the app
      }
    } else {
      console.error('🚨 PRODUCTION USER INIT: CRITICAL - No mongoUser data available!');
      console.error('🚨 PRODUCTION USER INIT: This should never happen - check backend logs');
    }
    
    console.log('🎯 PRODUCTION USER INIT: Initialization complete');
  };

  const loadUserDataFromMongo = async (userId: string) => {
    try {
      console.log('📊 MongoDB App: Loading user data...');
      
      // Load goals, tasks, and journal entries in parallel
      const [goalsData, tasksData, journalsData] = await Promise.all([
        apiService.getUserGoals(userId),
        apiService.getUserTasks(userId),
        apiService.getUserJournalEntries(userId)
      ]);

      console.log('📊 MongoDB App: Loaded data:', {
        goals: goalsData.length,
        tasks: tasksData.length,
        journals: journalsData.length
      });

      setGoals(goalsData.map(goal => ({
        ...goal,
        status: goal.status as 'active' | 'completed' | 'stalled'
      })));
      
      setTasks(tasksData.map(task => ({
        ...task,
        status: task.status as 'pending' | 'completed' | 'in_progress'
      })));
      
      setJournalEntries(journalsData);

    } catch (error) {
      console.error('❌ MongoDB App: Error loading user data:', error);
    }
  };

  const loadUserData = async () => {
    if (user?._id) {
      await loadUserDataFromMongo(user._id);
    }
  };

  const login = (email: string) => {
    console.log('🔄 MongoDB App: Triggering login for:', email);
    // Supabase Google Auth will handle the actual login
  };

  const loginWithToken = (userData: { id: string; email: string; name?: string }) => {
    console.log('🔄 MongoDB App: Login with token:', userData.email);
    // This will be handled by Supabase auth state change
  };

  const logout = async () => {
    try {
      console.log('👋 MongoDB App: Logging out...');
      await supabase.auth.signOut();
      setUser(null);
      setSupabaseUser(null);
      setGoals([]);
      setTasks([]);
      setJournalEntries([]);
    } catch (error) {
      console.error('❌ MongoDB App: Error during logout:', error);
    }
  };

  const signInWithGoogle = async () => {
    try {
      // COMPREHENSIVE PORT & REDIRECT DEBUG for STAGING/PRODUCTION
      const currentOrigin = window.location.origin;
      const currentPort = window.location.port;
      const currentHostname = window.location.hostname;
      const isProduction = currentOrigin.includes('lovable.app');
      const expectedRedirectUrl = `${currentOrigin}/auth/callback`;
      
      console.log('🔄 STAGING/PRODUCTION SIGN-IN DEBUG - Step 1: Initiating Google OAuth...');
      console.log('🔍 CRITICAL - Environment & URL Analysis:');
      console.log('🔍 Current origin:', currentOrigin);
      console.log('🔍 Current port:', currentPort);
      console.log('🔍 Current hostname:', currentHostname);
      console.log('🔍 Is Production/Staging:', isProduction);
      console.log('🔍 Expected redirect URL:', expectedRedirectUrl);
      console.log('🔍 Full current URL:', window.location.href);
      
      // STAGING/PRODUCTION WARNING CHECKS
      if (isProduction) {
        console.log('🚀 PRODUCTION ENVIRONMENT DETECTED!');
        console.log('🔍 Production redirect URL:', expectedRedirectUrl);
        console.log('💡 Ensure this URL is configured in:');
        console.log('💡 1. Google Console OAuth redirect URIs');
        console.log('💡 2. Supabase Auth redirect URLs');
      } else {
        // Check for common local development port issues
        if (currentPort !== '3000' && currentPort !== '') {
          console.warn('⚠️ LOCAL DEV PORT ISSUE DETECTED!');
          console.warn('⚠️ Server is running on port', currentPort, 'but OAuth might be configured for port 3000');
          console.warn('⚠️ This WILL cause OAuth redirect failures!');
          console.warn('⚠️ Solution: Update OAuth redirect URLs or restart server on port 3000');
        }
      }
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: expectedRedirectUrl, // Use dynamic redirect URL
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          }
        }
      });

      console.log('🔍 STAGING/PRODUCTION SIGN-IN DEBUG - Step 2: OAuth Response');
      console.log('🔍 OAuth Data:', data);
      console.log('🔍 OAuth Error:', error);

      if (error) {
        console.error('❌ STAGING/PRODUCTION SIGN-IN DEBUG - OAuth Error Details:');
        console.error('❌ Error message:', error.message);
        console.error('❌ Error details:', error);
        
        // Check for specific error types
        if (error.message.includes('redirect_uri_mismatch')) {
          console.error('🔧 REDIRECT URI MISMATCH DETECTED!');
          console.error('💡 The OAuth redirect URL in Google/Supabase doesn\'t match current server URL');
          console.error('💡 Current redirect URL:', expectedRedirectUrl);
          console.error('🛠️ IMMEDIATE FIX REQUIRED:');
          console.error('🛠️ 1. Google Console: Add', expectedRedirectUrl);
          console.error('🛠️ 2. Supabase Dashboard: Update redirect URLs');
          console.error('🛠️ 3. Verify Site URL in Supabase matches:', currentOrigin);
        }
        
        if (error.message.includes('Database error saving new user')) {
          console.error('🚨 CRITICAL DATABASE TRIGGER ERROR DETECTED IN OAUTH INITIATION!');
          console.error('💡 This means the trigger is blocking OAuth at the very start');
          console.error('💡 The user will see the database error in the callback URL');
          console.error('🛠️ URGENT: Remove database trigger in Supabase SQL Editor');
          console.error('🛠️ SQL: DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;');
          // Still return success as the redirect will happen and show proper error handling
          return { success: true, error: null };
        }
        
        return { success: false, error };
      }

      console.log('✅ STAGING/PRODUCTION SIGN-IN DEBUG - OAuth initiated successfully');
      console.log('✅ User should be redirected to Google OAuth now');
      console.log('✅ Expected callback URL:', expectedRedirectUrl);
      console.log('✅ Environment:', isProduction ? 'Production/Staging' : 'Development');
      return { success: true, error: null };
      
    } catch (error) {
      console.error('❌ STAGING/PRODUCTION SIGN-IN DEBUG - Unexpected error during Google sign-in:', error);
      return { success: false, error };
    }
  };

  const completeOnboarding = async (selectedGoals: { type: string; description: string }[]) => {
    if (!user?._id) {
      throw new Error('User not authenticated');
    }

    try {
      console.log('🎯 ONBOARDING DEBUG: Starting onboarding completion');
      
      // Create goals in MongoDB
      const createdGoals: Goal[] = [];
      for (const goalData of selectedGoals) {
        console.log('🎯 ONBOARDING DEBUG: Creating goal:', goalData);
        
        const goal = await apiService.createGoal({
          user_id: user._id,
          title: goalData.type,
          description: goalData.description,
          category: goalData.type.toLowerCase().replace(/[^a-z0-9]/g, '_'),
          priority: 'medium'
        });
        
        console.log('🎯 ONBOARDING DEBUG: Goal created:', goal);
        
        createdGoals.push({
          ...goal,
          status: goal.status as 'active' | 'completed' | 'stalled'
        });
      }

      console.log('🎯 ONBOARDING DEBUG: All goals created:', createdGoals);

      // Update user onboarding status
      console.log('🎯 ONBOARDING DEBUG: Updating user onboarding status...');
      await apiService.updateUserOnboarding(user._id, true);

      // Update local state
      setGoals(createdGoals);
      setUser(prev => prev ? { ...prev, hasCompletedOnboarding: true } : null);

      console.log('✅ MongoDB App: Onboarding completed successfully');
      
      // Return the created goals for immediate use
      return createdGoals;
    } catch (error) {
      console.error('❌ MongoDB App: Error completing onboarding:', error);
      throw error;
    }
  };

  const addTask = async (task: Omit<Task, '_id' | 'created_at'>) => {
    if (!user?._id) return;

    try {
      console.log('📝 MongoDB App: Adding task:', task.title);
      const newTask = await apiService.createTask({
        user_id: user._id,
        title: task.title,
        description: task.description,
        goal_id: task.goal_id,
        priority: task.priority || 'medium',
        status: task.status
      });

      setTasks(prev => [{
        ...newTask,
        status: newTask.status as 'pending' | 'completed' | 'in_progress'
      }, ...prev]);
    } catch (error) {
      console.error('❌ MongoDB App: Error adding task:', error);
    }
  };

  const toggleTask = async (taskId: string) => {
    if (!user?._id) return;

    const task = tasks.find(t => t._id === taskId);
    if (!task) return;

    const newStatus = task.status === 'completed' ? 'pending' : 'completed';

    try {
      const updatedTask = await apiService.updateTaskStatus(taskId, newStatus);
      setTasks(prev => 
        prev.map(t => 
          t._id === taskId ? { ...t, status: updatedTask.status as 'pending' | 'completed' | 'in_progress' } : t
        )
      );
    } catch (error) {
      console.error('❌ MongoDB App: Error toggling task:', error);
    }
  };

  const deleteTask = async (taskId: string) => {
    if (!user?._id) return;

    try {
      await apiService.deleteTask(taskId);
      setTasks(prev => prev.filter(t => t._id !== taskId));
    } catch (error) {
      console.error('❌ MongoDB App: Error deleting task:', error);
    }
  };

  const editTask = async (taskId: string, updates: Partial<Task>) => {
    if (!user?._id) return;

    try {
      const updatedTask = await apiService.updateTaskStatus(taskId, updates.status || 'pending');
      setTasks(prev => 
        prev.map(t => 
          t._id === taskId ? { ...t, ...updates, status: updatedTask.status as 'pending' | 'completed' | 'in_progress' } : t
        )
      );
    } catch (error) {
      console.error('❌ MongoDB App: Error editing task:', error);
    }
  };

  const addJournalEntry = async (entry: Omit<JournalEntry, '_id' | 'created_at'>) => {
    if (!user?._id) return;

    try {
      const newEntry = await apiService.createJournalEntry({
        user_id: user._id,
        content: entry.content,
        mood_score: entry.mood_score
      });

      setJournalEntries(prev => [newEntry, ...prev]);
    } catch (error) {
      console.error('❌ MongoDB App: Error adding journal entry:', error);
    }
  };

  const updateJournalEntry = async (entryId: string, updates: Partial<JournalEntry>) => {
    // MongoDB service doesn't have update journal entry yet
    console.log('🔄 MongoDB App: Journal entry update not implemented yet');
  };

  const toggleHabit = (habitId: string) => {
    setHabits(prev => 
      prev.map(habit => 
        habit._id === habitId ? { ...habit, completed: !habit.completed } : habit
      )
    );
  };

  const regenerateRecommendations = () => {
    console.log('🔄 MongoDB App: Regenerating recommendations...');
  };

  const resetAllData = () => {
    console.log('🧹 MongoDB App: Resetting all data...');
    setGoals([]);
    setTasks([]);
    setJournalEntries([]);
  };

  const refreshUserProfile = async () => {
    try {
      console.log('🔄 REFRESH PROFILE: Starting profile refresh...');
      
      if (!supabaseUser) {
        console.log('❌ REFRESH PROFILE: No Supabase user found');
        return { success: false, error: 'No authenticated user found' };
      }

      // Re-run the profile extraction logic
      const avatarUrl = supabaseUser.user_metadata?.avatar_url || 
                       supabaseUser.user_metadata?.picture ||
                       supabaseUser.user_metadata?.photo ||
                       supabaseUser.user_metadata?.image ||
                       supabaseUser.user_metadata?.profile_pic ||
                       supabaseUser.identities?.find(identity => identity.provider === 'google')?.identity_data?.picture ||
                       supabaseUser.identities?.find(identity => identity.provider === 'google')?.identity_data?.avatar_url ||
                       null;

      console.log('🔄 REFRESH PROFILE: Found avatar URL:', avatarUrl);

      if (user?._id && avatarUrl) {
        // Update in MongoDB
        const updatedUser = await apiService.updateUserProfile(user._id, { avatar_url: avatarUrl });
        
        // Update local state
        setUser(prev => prev ? { ...prev, avatar_url: updatedUser.avatar_url } : null);
        
        console.log('✅ REFRESH PROFILE: Profile photo updated successfully');
        return { success: true, error: null };
      } else {
        console.log('❌ REFRESH PROFILE: No avatar URL found or no user ID');
        return { success: false, error: 'No profile photo found in Google account' };
      }
    } catch (error) {
      console.error('❌ REFRESH PROFILE: Error refreshing profile:', error);
      return { success: false, error };
    }
  };

  const retryUserInitialization = async () => {
    if (supabaseUser) {
      setServiceError(null);
      await initializeUserFromSupabase(supabaseUser);
    }
  };

  const value: AppContextType = {
    user,
    supabaseUser,
    goals,
    tasks,
    journalEntries,
    habits,
    isLoading,
    serviceError,
    login,
    loginWithToken,
    logout,
    signInWithGoogle,
    setUser,
    completeOnboarding,
    addTask,
    toggleTask,
    deleteTask,
    editTask,
    addJournalEntry,
    updateJournalEntry,
    toggleHabit,
    regenerateRecommendations,
    resetAllData,
    loadUserData,
    refreshUserProfile,
    retryUserInitialization,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export { useApp };

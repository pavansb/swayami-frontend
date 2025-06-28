
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useApp } from '@/contexts/AppContext';
import { Brain, Search, Sparkles, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const moods = [
  { emoji: '😊', label: 'Happy' },
  { emoji: '😔', label: 'Sad' },
  { emoji: '😤', label: 'Frustrated' },
  { emoji: '😰', label: 'Anxious' },
  { emoji: '😴', label: 'Tired' },
  { emoji: '🤔', label: 'Thoughtful' },
  { emoji: '💪', label: 'Motivated' },
  { emoji: '😌', label: 'Calm' },
];

const Mindspace = () => {
  const { addJournalEntry, updateJournalEntry, journalEntries } = useApp();
  const { toast } = useToast();
  const [journalText, setJournalText] = useState('');
  const [selectedMood, setSelectedMood] = useState('');
  const [currentEntryId, setCurrentEntryId] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<{
    summary?: string;
    moodAnalysis?: string;
    extractedTasks?: string[];
  }>({});

  const handleSubmit = () => {
    if (journalText.trim()) {
      const entry = {
        content: journalText,
        mood_score: selectedMood ? moods.findIndex(m => m.label === selectedMood) + 1 : undefined,
        summary: analysis.summary,
      };
      
      addJournalEntry(entry);
      toast({
        title: "Entry Saved ✅",
        description: "Your reflection has been saved successfully.",
      });
      
      setJournalText('');
      setSelectedMood('');
      setAnalysis({});
      setCurrentEntryId(null);
    }
  };

  const handleSummarize = () => {
    if (!journalText.trim()) return;
    
    // Mock AI summarization
    const summaries = [
      "You're feeling reflective about your current progress and are looking for clarity on next steps. There's a sense of both accomplishment and uncertainty about the future direction.",
      "Your thoughts reveal a desire for growth and self-improvement, with some underlying concerns about maintaining balance in your life.",
      "You're processing recent experiences and seeking ways to optimize your daily routines for better productivity and wellbeing.",
    ];
    
    const randomSummary = summaries[Math.floor(Math.random() * summaries.length)];
    setAnalysis(prev => ({ ...prev, summary: randomSummary }));
  };

  const handleAnalyzeMood = () => {
    if (!selectedMood) return;
    
    // Mock mood analysis
    const analyses = {
      'Happy': "Your positive mood indicates high energy and optimism. This is an excellent time for creative tasks and building relationships.",
      'Sad': "You're experiencing lower energy, which is natural. Consider gentle activities like reading or light exercise to nurture yourself.",
      'Frustrated': "Your frustration suggests you're pushing against obstacles. Channel this energy into problem-solving and breaking down barriers.",
      'Anxious': "Your anxiety shows you care deeply about outcomes. Practice breathing exercises and focus on one task at a time.",
      'Tired': "Your fatigue indicates you need rest. Prioritize sleep and consider what's draining your energy.",
      'Thoughtful': "Your contemplative mood is perfect for reflection and planning. Use this time for strategic thinking.",
      'Motivated': "Your high motivation is powerful - harness it for your most important goals while it's strong.",
      'Calm': "Your peaceful state is ideal for meditation and mindful activities. Enjoy this centered feeling.",
    };
    
    setAnalysis(prev => ({ 
      ...prev, 
      moodAnalysis: analyses[selectedMood as keyof typeof analyses] || "Your mood reflects your current state of mind and offers insights for your next actions."
    }));
  };

  const handleExtractTasks = () => {
    if (!journalText.trim()) return;
    
    // Mock task extraction based on common patterns
    const possibleTasks = [
      "Schedule one-on-one with team member",
      "Research industry trends",
      "Update project timeline",
      "Plan weekend self-care activities",
      "Organize workspace for better focus",
      "Reach out to mentor for guidance",
      "Review and adjust monthly goals",
      "Set boundaries with distractions",
      "Practice mindfulness meditation",
      "Exercise for stress relief",
    ];
    
    // Select 3-4 random tasks
    const tasks = possibleTasks
      .sort(() => 0.5 - Math.random())
      .slice(0, Math.floor(Math.random() * 2) + 3);
    
    setAnalysis(prev => ({ ...prev, extractedTasks: tasks }));
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Panel - Journal Entry */}
          <div className="space-y-6">
            <div className="bg-white border border-swayami-border rounded-xl p-6">
              <h3 className="text-xl font-semibold text-swayami-black mb-6">
                What's on your mind?
              </h3>
              
              <Textarea
                placeholder="Share your thoughts, feelings, or reflections..."
                value={journalText}
                onChange={(e) => setJournalText(e.target.value)}
                className="min-h-40 mb-6 rounded-xl border-swayami-border"
              />

              <div className="mb-6">
                <h4 className="text-sm font-medium text-swayami-black mb-3">
                  How are you feeling?
                </h4>
                <div className="grid grid-cols-4 gap-2">
                  {moods.map((mood) => (
                    <button
                      key={mood.label}
                      onClick={() => setSelectedMood(mood.label)}
                      className={`p-3 rounded-xl border transition-all hover:shadow-md ${
                        selectedMood === mood.label
                          ? 'border-swayami-primary bg-purple-50'
                          : 'border-swayami-border hover:border-gray-300'
                      }`}
                    >
                      <div className="text-2xl mb-1">{mood.emoji}</div>
                      <div className="text-xs text-swayami-light-text">{mood.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              <Button 
                onClick={handleSubmit}
                disabled={!journalText.trim()}
                className="w-full mb-4 bg-swayami-primary hover:bg-swayami-primary-hover rounded-xl"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Entry
              </Button>

              {journalText.trim() && (
                <div className="grid grid-cols-1 gap-2">
                  <Button 
                    variant="outline" 
                    onClick={handleSummarize}
                    className="w-full rounded-xl border-swayami-primary text-swayami-primary hover:bg-purple-50"
                  >
                    <Brain className="w-4 h-4 mr-2" />
                    Summarize with AI
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={handleExtractTasks}
                    className="w-full rounded-xl border-swayami-primary text-swayami-primary hover:bg-purple-50"
                  >
                    <Search className="w-4 h-4 mr-2" />
                    Get Smart Suggestions
                  </Button>
                  {selectedMood && (
                    <Button 
                      variant="outline" 
                      onClick={handleAnalyzeMood}
                      className="w-full rounded-xl border-swayami-primary text-swayami-primary hover:bg-purple-50"
                    >
                      <Sparkles className="w-4 h-4 mr-2" />
                      Analyze Mood
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right Panel - Analysis & History */}
          <div className="space-y-6">
            {/* Analysis Results */}
            {analysis.summary && (
              <div className="bg-white border border-swayami-border rounded-xl p-6">
                <h4 className="font-semibold text-swayami-black mb-3 flex items-center">
                  <Brain className="w-4 h-4 mr-2 text-swayami-primary" />
                  AI Summary
                </h4>
                <p className="text-swayami-light-text">{analysis.summary}</p>
              </div>
            )}

            {analysis.moodAnalysis && (
              <div className="bg-white border border-swayami-border rounded-xl p-6">
                <h4 className="font-semibold text-swayami-black mb-3 flex items-center">
                  <Sparkles className="w-4 h-4 mr-2 text-swayami-primary" />
                  Mood Analysis
                </h4>
                <p className="text-swayami-light-text">{analysis.moodAnalysis}</p>
              </div>
            )}

            {analysis.extractedTasks && (
              <div className="bg-white border border-swayami-border rounded-xl p-6">
                <h4 className="font-semibold text-swayami-black mb-3 flex items-center">
                  <Search className="w-4 h-4 mr-2 text-swayami-primary" />
                  Smart Suggestions
                </h4>
                <ul className="space-y-2">
                  {analysis.extractedTasks.map((task, index) => (
                    <li key={index} className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-swayami-primary rounded-full"></div>
                      <span className="text-swayami-light-text">{task}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Recent Entries */}
            <div className="bg-white border border-swayami-border rounded-xl p-6">
              <h4 className="font-semibold text-swayami-black mb-3">Recent Entries</h4>
              <div className="space-y-3">
                {journalEntries.slice(-5).reverse().map((entry) => (
                  <div key={entry.id} className="border-b border-swayami-border pb-3 last:border-b-0">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-sm text-swayami-light-text">
                        {new Date(entry.created_at || '').toLocaleDateString()}
                      </span>
                      {entry.mood_score && (
                        <>
                          <span className="text-sm">
                            {moods[entry.mood_score - 1]?.emoji}
                          </span>
                          <span className="text-xs text-swayami-light-text">
                            {moods[entry.mood_score - 1]?.label}
                          </span>
                        </>
                      )}
                    </div>
                    <p className="text-sm text-swayami-light-text line-clamp-2">
                      {entry.content.length > 100 ? entry.content.substring(0, 100) + '...' : entry.content}
                    </p>
                  </div>
                ))}
                {journalEntries.length === 0 && (
                  <p className="text-sm text-swayami-light-text text-center py-4">
                    No entries yet. Start journaling to see your reflection history.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Mindspace;

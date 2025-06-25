
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useApp } from '@/contexts/AppContext';
import { Brain, Search, Sparkles, Save } from 'lucide-react';

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
  const { addJournalEntry, journalEntries } = useApp();
  const [journalText, setJournalText] = useState('');
  const [selectedMood, setSelectedMood] = useState('');
  const [analysis, setAnalysis] = useState<{
    summary?: string;
    moodAnalysis?: string;
    extractedTasks?: string[];
  }>({});

  const handleSubmit = () => {
    if (journalText.trim() && selectedMood) {
      addJournalEntry({
        mood: selectedMood,
        text: journalText,
        extractedTasks: [],
      });
      setJournalText('');
      setSelectedMood('');
      setAnalysis({});
    }
  };

  const handleSummarize = () => {
    // Mock AI summarization
    setAnalysis(prev => ({
      ...prev,
      summary: "You're feeling reflective about your current progress and are looking for clarity on next steps. There's a sense of both accomplishment and uncertainty about the future direction."
    }));
  };

  const handleAnalyzeMood = () => {
    // Mock mood analysis
    setAnalysis(prev => ({
      ...prev,
      moodAnalysis: "Your mood shows a pattern of introspection mixed with determination. You tend to be more thoughtful during afternoon hours and show increased motivation after journaling sessions."
    }));
  };

  const handleExtractTasks = () => {
    // Mock task extraction
    const tasks = [
      "Schedule meeting with mentor",
      "Research market opportunities",
      "Update project timeline",
      "Plan weekend activities",
    ];
    setAnalysis(prev => ({
      ...prev,
      extractedTasks: tasks
    }));
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
                disabled={!journalText.trim() || !selectedMood}
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
                    Uncover Action Items
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={handleAnalyzeMood}
                    className="w-full rounded-xl border-swayami-primary text-swayami-primary hover:bg-purple-50"
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    Analyze Mood
                  </Button>
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
                  Action Items
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
                        {new Date(entry.createdAt).toLocaleDateString()}
                      </span>
                      <span className="text-sm">
                        {moods.find(m => m.label === entry.mood)?.emoji}
                      </span>
                    </div>
                    <p className="text-sm text-swayami-light-text line-clamp-2">
                      {entry.text.length > 100 ? entry.text.substring(0, 100) + '...' : entry.text}
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

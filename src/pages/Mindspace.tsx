
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useApp } from '@/contexts/AppContext';

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
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Journal Entry */}
          <div className="swayami-card">
            <h3 className="text-xl font-semibold text-swayami-black mb-6">
              What's on your mind?
            </h3>
            
            <Textarea
              placeholder="Share your thoughts, feelings, or reflections..."
              value={journalText}
              onChange={(e) => setJournalText(e.target.value)}
              className="min-h-40 mb-6"
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
                    className={`p-3 rounded-lg border transition-all ${
                      selectedMood === mood.label
                        ? 'border-swayami-black bg-gray-50'
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
              className="w-full mb-4"
            >
              Save Entry
            </Button>

            {journalText.trim() && (
              <div className="space-y-2">
                <Button 
                  variant="outline" 
                  onClick={handleSummarize}
                  className="w-full"
                >
                  Summarize
                </Button>
                <Button 
                  variant="outline" 
                  onClick={handleAnalyzeMood}
                  className="w-full"
                >
                  Analyze Mood
                </Button>
                <Button 
                  variant="outline" 
                  onClick={handleExtractTasks}
                  className="w-full"
                >
                  Extract Tasks
                </Button>
              </div>
            )}
          </div>

          {/* Analysis Results */}
          <div className="space-y-6">
            {analysis.summary && (
              <div className="swayami-card">
                <h4 className="font-semibold text-swayami-black mb-3">Summary</h4>
                <p className="text-swayami-light-text">{analysis.summary}</p>
              </div>
            )}

            {analysis.moodAnalysis && (
              <div className="swayami-card">
                <h4 className="font-semibold text-swayami-black mb-3">Mood Analysis</h4>
                <p className="text-swayami-light-text">{analysis.moodAnalysis}</p>
              </div>
            )}

            {analysis.extractedTasks && (
              <div className="swayami-card">
                <h4 className="font-semibold text-swayami-black mb-3">Extracted Tasks</h4>
                <ul className="space-y-2">
                  {analysis.extractedTasks.map((task, index) => (
                    <li key={index} className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-swayami-black rounded-full"></div>
                      <span className="text-swayami-light-text">{task}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Recent Entries */}
            <div className="swayami-card">
              <h4 className="font-semibold text-swayami-black mb-3">Recent Entries</h4>
              <div className="space-y-3">
                {journalEntries.slice(-3).reverse().map((entry) => (
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
                      {entry.text}
                    </p>
                  </div>
                ))}
                {journalEntries.length === 0 && (
                  <p className="text-sm text-swayami-light-text">
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

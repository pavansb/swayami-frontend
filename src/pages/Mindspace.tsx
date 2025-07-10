
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useApp } from '@/contexts/AppContext';
import { apiService } from '@/services/api';
import { Brain, Search, Sparkles, Save, CheckCircle2, Loader2 } from 'lucide-react';
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
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<{
    summary?: string;
    moodAnalysis?: string;
    extractedTasks?: string[];
  }>({});
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async () => {
    if (!journalText.trim()) return;
    
    setIsSaving(true);
    try {
      const entry = {
        content: journalText,
        mood_score: selectedMood ? moods.findIndex(m => m.label === selectedMood) + 1 : undefined,
        summary: analysis.summary,
      };
      
      await addJournalEntry(entry);
      
      toast({
        title: "Journal Saved Successfully ✅",
        description: "Your reflection has been saved to the database.",
      });
      
      // Clear the form after successful save
      setJournalText('');
      setSelectedMood('');
      setAnalysis({});
      setCurrentEntryId(null);
    } catch (error) {
      console.error('❌ Error saving journal entry:', error);
      toast({
        title: "Save Failed ❌",
        description: "Unable to save your reflection. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Auto-save functionality (save every 30 seconds if there's content)
  React.useEffect(() => {
    if (!journalText.trim()) return;
    
    const autoSaveTimer = setTimeout(async () => {
      if (journalText.trim() && !isSaving) {
        console.log('🔄 Auto-saving journal entry...');
        try {
          const entry = {
            content: journalText,
            mood_score: selectedMood ? moods.findIndex(m => m.label === selectedMood) + 1 : undefined,
            summary: analysis.summary,
          };
          
          await addJournalEntry(entry);
          console.log('✅ Auto-save completed');
        } catch (error) {
          console.error('❌ Auto-save failed:', error);
        }
      }
    }, 30000); // 30 seconds
    
    return () => clearTimeout(autoSaveTimer);
  }, [journalText, selectedMood, analysis.summary, isSaving]);

  const handleSummarize = async () => {
    if (!journalText.trim()) return;
    
    setIsAnalyzing(true);
    try {
      const result = await apiService.analyzeJournal(journalText);
      
      setAnalysis(prev => ({ 
        ...prev, 
        summary: result.summary || 'Analysis completed successfully.',
        insights: result.insights || [],
        recommendations: result.recommendations || []
      }));
      
      toast({
        title: "Analysis Complete ✅",
        description: "Your thoughts have been analyzed successfully.",
      });
    } catch (error) {
      console.error('❌ Error analyzing journal:', error);
      toast({
        title: "Analysis Failed ❌",
        description: "Unable to analyze your thoughts. Please try again.",
        variant: "destructive",
      });
      
      // Fallback to a basic summary
      setAnalysis(prev => ({ 
        ...prev, 
        summary: "Your reflection has been recorded. Consider reviewing your thoughts to gain insights."
      }));
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleAnalyzeMood = async () => {
    if (!selectedMood) return;
    
    setIsAnalyzing(true);
    try {
      // For now, use a simple analysis based on the selected mood
      // In the future, this could call a mood analysis API endpoint
      const moodInsights = {
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
        moodAnalysis: moodInsights[selectedMood as keyof typeof moodInsights] || "Your mood reflects your current state of mind and offers insights for your next actions."
      }));
      
      toast({
        title: "Mood Analysis Complete ✅",
        description: "Your mood has been analyzed successfully.",
      });
    } catch (error) {
      console.error('❌ Error analyzing mood:', error);
      toast({
        title: "Mood Analysis Failed ❌",
        description: "Unable to analyze your mood. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleExtractTasks = async () => {
    if (!journalText.trim()) return;
    
    setIsAnalyzing(true);
    try {
      // Use the journal analysis to extract potential tasks
      const result = await apiService.analyzeJournal(journalText);
      
      // Extract tasks from recommendations or insights
      const extractedTasks = [
        ...(result.recommendations || []),
        ...(result.insights || []).filter(insight => 
          insight.toLowerCase().includes('task') || 
          insight.toLowerCase().includes('action') ||
          insight.toLowerCase().includes('step')
        )
      ].slice(0, 4); // Limit to 4 tasks
      
      setAnalysis(prev => ({ ...prev, extractedTasks }));
      
      toast({
        title: "Task Extraction Complete ✅",
        description: "Potential tasks have been identified from your reflection.",
      });
    } catch (error) {
      console.error('❌ Error extracting tasks:', error);
      toast({
        title: "Task Extraction Failed ❌",
        description: "Unable to extract tasks. Please try again.",
        variant: "destructive",
      });
      
      // Fallback to basic task suggestions
      setAnalysis(prev => ({ 
        ...prev, 
        extractedTasks: [
          "Review your current goals",
          "Plan your next steps",
          "Schedule time for reflection"
        ]
      }));
    } finally {
      setIsAnalyzing(false);
    }
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
                          ? 'border-swayami-primary bg-green-50'
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
                disabled={!journalText.trim() || isSaving}
                className="w-full mb-4 bg-swayami-primary hover:bg-swayami-primary-hover rounded-xl"
              >
                {isSaving ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                {isSaving ? 'Saving...' : 'Save Entry'}
              </Button>

              {journalText.trim() && (
                <div className="grid grid-cols-1 gap-2">
                  <Button 
                    variant="outline" 
                    onClick={handleSummarize}
                    disabled={isAnalyzing}
                    className="w-full rounded-xl border-swayami-primary text-swayami-primary hover:bg-green-50"
                  >
                    {isAnalyzing ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Brain className="w-4 h-4 mr-2" />
                    )}
                    Summarize with AI
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={handleExtractTasks}
                    disabled={isAnalyzing}
                    className="w-full rounded-xl border-swayami-primary text-swayami-primary hover:bg-green-50"
                  >
                    {isAnalyzing ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Search className="w-4 h-4 mr-2" />
                    )}
                    Get Smart Suggestions
                  </Button>
                  {selectedMood && (
                    <Button 
                      variant="outline" 
                      onClick={handleAnalyzeMood}
                      disabled={isAnalyzing}
                      className="w-full rounded-xl border-swayami-primary text-swayami-primary hover:bg-green-50"
                    >
                      {isAnalyzing ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <Sparkles className="w-4 h-4 mr-2" />
                      )}
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
              {journalEntries.length === 0 ? (
                <div className="bg-gradient-to-r from-green-50 to-pink-50 rounded-xl p-4 sm:p-6 mb-4 sm:mb-6 text-center">
                  <CheckCircle2 className="w-8 h-8 text-gray-300 mx-auto mb-3" />
                  <h4 className="text-md font-semibold text-gray-600 mb-2">No reflections yet. Start your mindfulness journey!</h4>
                </div>
              ) : (
                <div className="space-y-3">
                  {journalEntries.slice(-5).reverse().map((entry) => (
                    <div key={entry._id} className="border-b border-swayami-border pb-3 last:border-b-0">
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
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Mindspace;

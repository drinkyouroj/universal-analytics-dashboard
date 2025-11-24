import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { analyzeContent } from '../lib/api';
import type { AnalysisResult } from '../types';
import { AnalysisDashboard } from './AnalysisDashboard';

export const UniversalAnalytics = () => {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState('');

  const handleAnalyze = async () => {
    if (!text.trim()) return;
    
    setLoading(true);
    setError('');
    
    try {
      const data = await analyzeContent(text);
      setResult(data);
    } catch (err) {
      setError('Failed to analyze content. Please check backend connection.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="grid gap-6 md:grid-cols-1">
        <div className="rounded-xl border bg-card p-6 text-card-foreground shadow-sm">
          <h3 className="text-lg font-semibold mb-2">Input Content</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Paste any text below to generate comprehensive analytics.
          </p>
          <div className="space-y-4">
            <textarea 
              className="w-full min-h-[150px] rounded-md border bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-y"
              placeholder="Paste article, post, or message content here..."
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <div className="flex justify-end">
              <button 
                onClick={handleAnalyze}
                disabled={loading || !text.trim()}
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md bg-primary px-8 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  'Analyze Content'
                )}
              </button>
            </div>
            {error && <p className="text-destructive text-sm">{error}</p>}
          </div>
        </div>
      </div>

      {result && <AnalysisDashboard data={result} />}
    </div>
  );
};




import type { AnalysisResult } from '../types';
import { Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { Smile, Zap, BookOpen, Clock } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface AnalysisDashboardProps {
  data: AnalysisResult;
}

export const AnalysisDashboard = ({ data }: AnalysisDashboardProps) => {
  const emotionData = [
    { name: 'Joy', value: data.emotions.joy, color: '#4ade80' },
    { name: 'Sadness', value: data.emotions.sadness, color: '#60a5fa' },
    { name: 'Anger', value: data.emotions.anger, color: '#f87171' },
    { name: 'Fear', value: data.emotions.fear, color: '#a78bfa' },
    { name: 'Neutral', value: data.emotions.neutral, color: '#94a3b8' },
  ].filter(d => d.value > 0);

  const sentimentScore = data.sentiment.score;
  const sentimentColor = sentimentScore > 0 ? 'text-green-500' : sentimentScore < 0 ? 'text-red-500' : 'text-gray-500';

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Key Metrics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium">Overall Sentiment</h3>
            <Smile className={cn("h-4 w-4", sentimentColor)} />
          </div>
          <div className="text-2xl font-bold">{data.sentiment.score}</div>
          <p className="text-xs text-muted-foreground">
            Comparative: {data.sentiment.comparative.toFixed(2)}
          </p>
        </div>
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium">Readability Score</h3>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="text-2xl font-bold">{data.readability.fleschKincaid}</div>
          <p className="text-xs text-muted-foreground">
            Flesch-Kincaid Grade
          </p>
        </div>
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium">Word Count</h3>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="text-2xl font-bold">{data.readability.wordCount}</div>
          <p className="text-xs text-muted-foreground">
            {data.readability.sentenceCount} sentences
          </p>
        </div>
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium">Est. Reading Time</h3>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="text-2xl font-bold">{Math.ceil(data.readability.wordCount / 200)} min</div>
          <p className="text-xs text-muted-foreground">
            @ 200 wpm
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Emotion Chart */}
        <div className="col-span-4 rounded-xl border bg-card p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Emotional Tone</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={emotionData} layout="vertical" margin={{ left: 40 }}>
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" width={60} tick={{ fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#f8fafc' }}
                  cursor={{ fill: 'transparent' }}
                />
                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                  {emotionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Keyword Cloud */}
        <div className="col-span-3 rounded-xl border bg-card p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Key Themes</h3>
          <div className="flex flex-wrap gap-2">
            {data.keywords.map((keyword) => (
              <span 
                key={keyword.word}
                className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium"
                style={{
                  opacity: Math.max(0.4, Math.min(1, keyword.score * 2)),
                  fontSize: `${Math.max(0.8, Math.min(1.5, 0.8 + keyword.score))}rem`
                }}
              >
                {keyword.word}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Detailed Sentiment Breakdown */}
      <div className="rounded-xl border bg-card p-6 shadow-sm">
        <h3 className="text-lg font-semibold mb-4">Sentiment Breakdown</h3>
        <div className="grid gap-4 md:grid-cols-2">
           <div>
             <h4 className="text-sm font-medium text-green-500 mb-2">Positive Indicators</h4>
             <div className="flex flex-wrap gap-2">
               {data.sentiment.positive.map((word, i) => (
                 <span key={i} className="px-2 py-1 rounded-md bg-green-500/10 text-green-500 text-xs border border-green-500/20">
                   {word}
                 </span>
               ))}
               {data.sentiment.positive.length === 0 && <span className="text-muted-foreground text-sm">None detected</span>}
             </div>
           </div>
           <div>
             <h4 className="text-sm font-medium text-red-500 mb-2">Negative Indicators</h4>
             <div className="flex flex-wrap gap-2">
               {data.sentiment.negative.map((word, i) => (
                 <span key={i} className="px-2 py-1 rounded-md bg-red-500/10 text-red-500 text-xs border border-red-500/20">
                   {word}
                 </span>
               ))}
               {data.sentiment.negative.length === 0 && <span className="text-muted-foreground text-sm">None detected</span>}
             </div>
           </div>
        </div>
      </div>
    </div>
  );
};

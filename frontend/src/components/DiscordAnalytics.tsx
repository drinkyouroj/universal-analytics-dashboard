import { useState, useEffect } from 'react';
import { MessageSquare, Hash, ChevronRight, Loader2, BarChart2 } from 'lucide-react';
import { api } from '../lib/api';
import type { AnalysisResult } from '../types';
import { AnalysisDashboard } from './AnalysisDashboard';

interface Guild {
  id: string;
  name: string;
  icon: string | null;
}

interface Channel {
  id: string;
  name: string;
  type: number;
}

interface ChannelAnalysis {
  channelId: string;
  messageCount: number;
  averageSentiment: number;
  topUsers: { username: string; count: number }[];
  messages: {
    id: string;
    content: string;
    author: { username: string };
    timestamp: number;
    analysis: AnalysisResult;
  }[];
}

export const DiscordAnalytics = () => {
  const [token, setToken] = useState<string | null>(null);
  const [guilds, setGuilds] = useState<Guild[]>([]);
  const [selectedGuild, setSelectedGuild] = useState<Guild | null>(null);
  const [channels, setChannels] = useState<Channel[]>([]);
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);
  const [analysis, setAnalysis] = useState<ChannelAnalysis | null>(null);
  
  const [loadingGuilds, setLoadingGuilds] = useState(false);
  const [loadingChannels, setLoadingChannels] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const t = localStorage.getItem('discord_token');
    setToken(t);
    if (t) {
      fetchGuilds(t);
    }
  }, []);

  const fetchGuilds = async (authToken: string) => {
    setLoadingGuilds(true);
    try {
      const response = await api.get<Guild[]>('/user/guilds', {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      setGuilds(response.data);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch servers. Your session may have expired.');
      // localStorage.removeItem('discord_token'); // Optional: logout on error
    } finally {
      setLoadingGuilds(false);
    }
  };

  const handleGuildSelect = async (guild: Guild) => {
    setSelectedGuild(guild);
    setSelectedChannel(null);
    setAnalysis(null);
    setLoadingChannels(true);
    try {
      const response = await api.get<Channel[]>(`/discord/guilds/${guild.id}/channels`);
      setChannels(response.data);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch channels. Make sure the bot is in the server.');
    } finally {
      setLoadingChannels(false);
    }
  };

  const handleChannelSelect = async (channel: Channel) => {
    setSelectedChannel(channel);
    setAnalyzing(true);
    try {
      const response = await api.get<ChannelAnalysis>(`/discord/channels/${channel.id}/analyze`);
      setAnalysis(response.data);
    } catch (err) {
      console.error(err);
      setError('Failed to analyze channel. The bot might not have permission to read messages.');
    } finally {
      setAnalyzing(false);
    }
  };

  if (!token) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] space-y-4 animate-in fade-in duration-500">
        <div className="p-4 rounded-full bg-card border shadow-sm">
          <MessageSquare className="h-12 w-12 text-[#5865F2]" />
        </div>
        <h2 className="text-2xl font-bold">Discord Integration</h2>
        <p className="text-muted-foreground max-w-md text-center">
          Connect your Discord server to unlock community insights, sentiment tracking, and engagement metrics.
        </p>
        <a 
          href="http://localhost:3002/api/auth/discord"
          className="mt-4 inline-flex items-center justify-center whitespace-nowrap rounded-md bg-[#5865F2] px-6 py-3 text-sm font-medium text-white shadow-lg hover:bg-[#4752C4] transition-all hover:scale-105"
        >
          Connect Discord Server
        </a>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
          Connected to Discord
        </h3>
        <button 
          onClick={() => {
            localStorage.removeItem('discord_token');
            window.location.reload();
          }}
          className="text-sm text-muted-foreground hover:text-destructive hover:underline transition-colors"
        >
          Disconnect
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-md bg-destructive/10 text-destructive text-sm border border-destructive/20">
          {error}
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-3">
        {/* Guild Selection */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Select Server</h4>
          <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
            {loadingGuilds ? (
               <div className="flex justify-center py-4"><Loader2 className="animate-spin h-6 w-6 text-muted-foreground" /></div>
            ) : (
              guilds.map(guild => (
                <button
                  key={guild.id}
                  onClick={() => handleGuildSelect(guild)}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all border ${
                    selectedGuild?.id === guild.id 
                      ? 'bg-primary/10 border-primary/20 ring-1 ring-primary/20' 
                      : 'bg-card border-border hover:bg-accent hover:text-accent-foreground'
                  }`}
                >
                  {guild.icon ? (
                    <img 
                      src={`https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png`} 
                      alt={guild.name}
                      className="w-8 h-8 rounded-full"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-bold">
                      {guild.name.substring(0, 2)}
                    </div>
                  )}
                  <span className="font-medium truncate">{guild.name}</span>
                  {selectedGuild?.id === guild.id && <ChevronRight className="ml-auto h-4 w-4 text-primary" />}
                </button>
              ))
            )}
          </div>
        </div>

        {/* Channel Selection */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Select Channel</h4>
          {!selectedGuild ? (
            <div className="h-32 flex items-center justify-center border rounded-lg bg-muted/10 text-muted-foreground text-sm">
              Select a server first
            </div>
          ) : (
            <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
              {loadingChannels ? (
                 <div className="flex justify-center py-4"><Loader2 className="animate-spin h-6 w-6 text-muted-foreground" /></div>
              ) : (
                channels.length === 0 ? (
                  <div className="p-4 text-sm text-muted-foreground text-center">No text channels found or bot missing permissions.</div>
                ) : (
                  channels.map(channel => (
                    <button
                      key={channel.id}
                      onClick={() => handleChannelSelect(channel)}
                      className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all border ${
                        selectedChannel?.id === channel.id 
                          ? 'bg-primary/10 border-primary/20 ring-1 ring-primary/20' 
                          : 'bg-card border-border hover:bg-accent hover:text-accent-foreground'
                      }`}
                    >
                      <Hash className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium truncate">{channel.name}</span>
                      {selectedChannel?.id === channel.id && <BarChart2 className="ml-auto h-4 w-4 text-primary" />}
                    </button>
                  ))
                )
              )}
            </div>
          )}
        </div>

        {/* Analysis Overview */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Stats Overview</h4>
          {!selectedChannel ? (
             <div className="h-32 flex items-center justify-center border rounded-lg bg-muted/10 text-muted-foreground text-sm">
               Select a channel to analyze
             </div>
          ) : analyzing ? (
             <div className="h-32 flex flex-col items-center justify-center border rounded-lg bg-card">
               <Loader2 className="animate-spin h-8 w-8 text-primary mb-2" />
               <span className="text-sm text-muted-foreground">Analyzing message history...</span>
             </div>
          ) : analysis ? (
            <div className="space-y-4">
              <div className="p-4 bg-card border rounded-lg shadow-sm">
                <div className="text-sm text-muted-foreground">Messages Analyzed</div>
                <div className="text-2xl font-bold">{analysis.messageCount}</div>
              </div>
              <div className="p-4 bg-card border rounded-lg shadow-sm">
                <div className="text-sm text-muted-foreground">Average Sentiment</div>
                <div className={`text-2xl font-bold ${analysis.averageSentiment > 0 ? 'text-green-500' : analysis.averageSentiment < 0 ? 'text-red-500' : 'text-gray-500'}`}>
                  {analysis.averageSentiment.toFixed(2)}
                </div>
              </div>
              <div className="p-4 bg-card border rounded-lg shadow-sm">
                <div className="text-sm text-muted-foreground mb-2">Top Contributors</div>
                <div className="space-y-2">
                  {analysis.topUsers.map((user, i) => (
                    <div key={i} className="flex justify-between text-sm">
                      <span>{user.username}</span>
                      <span className="font-mono text-muted-foreground">{user.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
      
      {/* Detailed Dashboard */}
      {analysis && (
        <div className="pt-8 border-t">
           <h3 className="text-lg font-semibold mb-6">Detailed Channel Analysis</h3>
           {/* We aggregate emotions from all messages to show a summary */}
           <AnalysisDashboard data={{
             sentiment: {
               score: analysis.averageSentiment,
               comparative: 0,
               tokens: [],
               words: [],
               positive: [],
               negative: []
             },
             // Aggregate keywords from messages? Or just use a placeholder/latest message?
             // For MVP, we passed simple analysis. The dashboard expects full AnalysisResult.
             // We can construct an aggregate result or just show the result of the combined text if we did that on backend.
             // Our backend currently returns `messages: { analysis: ... }`.
             // Let's aggregate emotions.
             emotions: analysis.messages.reduce((acc, m) => {
               acc.joy += m.analysis.emotions.joy;
               acc.sadness += m.analysis.emotions.sadness;
               acc.anger += m.analysis.emotions.anger;
               acc.fear += m.analysis.emotions.fear;
               acc.neutral += m.analysis.emotions.neutral;
               return acc;
             }, { joy: 0, sadness: 0, anger: 0, fear: 0, neutral: 0 }),
             
             keywords: [], // Todo: Aggregate keywords
             readability: { wordCount: 0, sentenceCount: 0, syllableCount: 0, fleschKincaid: 0 }
           }} />
           
           {/* Normalize aggregated emotions for display (avg) */}
        </div>
      )}
    </div>
  );
};

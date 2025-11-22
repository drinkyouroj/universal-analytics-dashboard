import { Routes, Route, useSearchParams } from 'react-router-dom';
import { Activity, MessageSquare } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { UniversalAnalytics } from './components/UniversalAnalytics';
import { DiscordAnalytics } from './components/DiscordAnalytics';
import { AuthSuccess } from './pages/AuthSuccess';
import { AuthError } from './pages/AuthError';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

function Dashboard() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'universal';
  
  const setActiveTab = (tab: string) => {
    setSearchParams({ tab });
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex font-sans antialiased selection:bg-primary/20">
      {/* Sidebar */}
      <aside className="w-72 border-r bg-card/30 hidden md:flex flex-col sticky top-0 h-screen backdrop-blur-xl">
        <div className="p-8">
          <div className="flex items-center gap-2">
            <Activity className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
              Analytics Hub
            </h1>
          </div>
        </div>
        <nav className="space-y-2 px-4 flex-1">
          <button
            onClick={() => setActiveTab('universal')}
            className={cn(
              "flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all",
              activeTab === 'universal' 
                ? "bg-primary/10 text-primary shadow-sm border border-primary/10" 
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            )}
          >
            <Activity className="h-4 w-4" />
            Universal Analytics
          </button>
          <button
            onClick={() => setActiveTab('discord')}
            className={cn(
              "flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all",
              activeTab === 'discord' 
                ? "bg-[#5865F2]/10 text-[#5865F2] shadow-sm border border-[#5865F2]/10" 
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            )}
          >
            <MessageSquare className="h-4 w-4" />
            Discord Analytics
          </button>
        </nav>
        <div className="p-4 text-xs text-muted-foreground border-t bg-card/50">
          v1.0.0 • Universal Analytics
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-gradient-to-br from-background to-background/50">
        <header className="border-b bg-card/50 px-8 py-6 sticky top-0 z-10 backdrop-blur-lg flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              {activeTab === 'universal' ? 'Universal Content Analytics' : 'Discord Server Analytics'}
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              {activeTab === 'universal' 
                ? 'Real-time sentiment and emotion analysis engine' 
                : 'Community health and engagement monitoring'}
            </p>
          </div>
        </header>
        <div className="p-8">
          {activeTab === 'universal' ? <UniversalAnalytics /> : <DiscordAnalytics />}
        </div>
      </main>
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/auth/success" element={<AuthSuccess />} />
      <Route path="/auth/error" element={<AuthError />} />
    </Routes>
  );
}

export default App;

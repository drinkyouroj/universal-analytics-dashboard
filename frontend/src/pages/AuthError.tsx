import { useNavigate } from 'react-router-dom';

export const AuthError = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-background text-foreground space-y-4">
      <h2 className="text-xl text-destructive font-bold">Authentication Failed</h2>
      <p className="text-muted-foreground">Could not connect to Discord.</p>
      <button 
        onClick={() => navigate('/')}
        className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md"
      >
        Return Home
      </button>
    </div>
  );
};




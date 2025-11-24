import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

export const AuthSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      localStorage.setItem('discord_token', token);
      // Ideally verify token or fetch user info here
      window.location.href = '/?tab=discord'; // Force reload/redirect to discord tab
    } else {
      navigate('/');
    }
  }, [searchParams, navigate]);

  return (
    <div className="flex items-center justify-center h-screen bg-background text-foreground">
      <div className="animate-pulse">Authenticating with Discord...</div>
    </div>
  );
};




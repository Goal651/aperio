import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useGitHubAuth } from '@/hooks/useGitHubAuth';
import { Loader2 } from 'lucide-react';

export default function AuthCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { handleCallback, isAuthenticated, error } = useGitHubAuth();

  useEffect(() => {
    const code = searchParams.get('code');
    const state = searchParams.get('state');

    if (code && state) {
      handleCallback(code, state).then(() => {
        navigate('/');
      });
    } else if (!code) {
      navigate('/connect');
    }
  }, [searchParams, handleCallback, navigate]);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (error) {
      // Redirect to connect page with error after a delay
      const timer = setTimeout(() => navigate('/connect'), 3000);
      return () => clearTimeout(timer);
    }
  }, [error, navigate]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="hero-glow fixed inset-0 pointer-events-none" />
      
      <div className="relative text-center">
        {error ? (
          <div className="glass-card p-8 max-w-md">
            <div className="text-destructive mb-4">
              <svg className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-foreground mb-2">Authentication Failed</h2>
            <p className="text-muted-foreground text-sm">{error}</p>
            <p className="text-muted-foreground text-xs mt-4">Redirecting to login...</p>
          </div>
        ) : (
          <div className="glass-card p-8">
            <Loader2 className="h-12 w-12 text-primary animate-spin mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-foreground mb-2">Authenticating...</h2>
            <p className="text-muted-foreground text-sm">Connecting to GitHub</p>
          </div>
        )}
      </div>
    </div>
  );
}

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import {
  AuthState,
  GitHubOrg,
  getAuthState,
  saveAuthState,
  clearAuthState,
  getGitHubAuthUrl,
  fetchGitHubUser,
  fetchGitHubOrgs,
  isGitHubConfigured,
} from '@/lib/github-auth';

interface AuthContextType extends AuthState {
  login: () => void;
  logout: () => void;
  selectOrg: (org: GitHubOrg) => void;
  handleCallback: (code: string, state: string) => Promise<void>;
  isLoading: boolean;
  error: string | null;
  isConfigured: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function GitHubAuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>(getAuthState);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Sync state with sessionStorage
  useEffect(() => {
    const handleStorageChange = () => {
      setAuthState(getAuthState());
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const login = useCallback(() => {
    if (!isGitHubConfigured()) {
      setError('GitHub OAuth is not configured. Please set VITE_GITHUB_CLIENT_ID.');
      return;
    }
    window.location.href = getGitHubAuthUrl();
  }, []);

  const logout = useCallback(() => {
    clearAuthState();
    setAuthState(getAuthState());
    setError(null);
  }, []);

  const selectOrg = useCallback((org: GitHubOrg) => {
    saveAuthState({ selectedOrg: org });
    setAuthState(getAuthState());
  }, []);

  const handleCallback = useCallback(async (code: string, state: string) => {
    setIsLoading(true);
    setError(null);

    try {
      // Note: In a real implementation, you would exchange the code for a token
      // via a backend endpoint to keep the client_secret secure.
      // For demo purposes, we'll simulate this with a mock token.
      
      // This is where you'd call your backend:
      // const tokenResponse = await fetch('/api/auth/github/callback', {
      //   method: 'POST',
      //   body: JSON.stringify({ code, state }),
      // });
      // const { access_token } = await tokenResponse.json();
      
      // For now, check if we have a token in URL hash (for demo with token proxy)
      const hashParams = new URLSearchParams(window.location.hash.slice(1));
      const accessToken = hashParams.get('access_token');
      
      if (!accessToken) {
        throw new Error('No access token received. Backend token exchange required.');
      }

      // Fetch user and orgs
      const [user, orgs] = await Promise.all([
        fetchGitHubUser(accessToken),
        fetchGitHubOrgs(accessToken),
      ]);

      const newState: AuthState = {
        accessToken,
        user,
        orgs,
        selectedOrg: orgs.length === 1 ? orgs[0] : null,
        isAuthenticated: true,
      };

      saveAuthState(newState);
      setAuthState(newState);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        login,
        logout,
        selectOrg,
        handleCallback,
        isLoading,
        error,
        isConfigured: isGitHubConfigured(),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useGitHubAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useGitHubAuth must be used within GitHubAuthProvider');
  }
  return context;
}

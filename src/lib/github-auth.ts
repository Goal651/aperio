// GitHub OAuth Configuration
// In production, these would come from environment variables
const GITHUB_CLIENT_ID = import.meta.env.VITE_GITHUB_CLIENT_ID || '';
const GITHUB_REDIRECT_URI = `${window.location.origin}/auth/callback`;

const GITHUB_SCOPES = [
  'read:org',
  'repo',
  'read:user',
  'user:email',
].join(' ');

export interface GitHubUser {
  id: number;
  login: string;
  name: string | null;
  avatar_url: string;
  email: string | null;
}

export interface GitHubOrg {
  id: number;
  login: string;
  avatar_url: string;
  description: string | null;
}

export interface AuthState {
  accessToken: string | null;
  user: GitHubUser | null;
  orgs: GitHubOrg[];
  selectedOrg: GitHubOrg | null;
  isAuthenticated: boolean;
}

const AUTH_STORAGE_KEY = 'gitguard_auth';

// Get the GitHub OAuth URL
export function getGitHubAuthUrl(): string {
  const state = crypto.randomUUID();
  sessionStorage.setItem('github_oauth_state', state);
  
  const params = new URLSearchParams({
    client_id: GITHUB_CLIENT_ID,
    redirect_uri: GITHUB_REDIRECT_URI,
    scope: GITHUB_SCOPES,
    state,
  });
  
  return `https://github.com/login/oauth/authorize?${params.toString()}`;
}

// Store auth state in sessionStorage (stateless - cleared on browser close)
export function saveAuthState(state: Partial<AuthState>): void {
  const existing = getAuthState();
  const newState = { ...existing, ...state };
  sessionStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(newState));
}

// Get auth state from sessionStorage
export function getAuthState(): AuthState {
  const stored = sessionStorage.getItem(AUTH_STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return getDefaultAuthState();
    }
  }
  return getDefaultAuthState();
}

function getDefaultAuthState(): AuthState {
  return {
    accessToken: null,
    user: null,
    orgs: [],
    selectedOrg: null,
    isAuthenticated: false,
  };
}

// Clear auth state (logout)
export function clearAuthState(): void {
  sessionStorage.removeItem(AUTH_STORAGE_KEY);
  sessionStorage.removeItem('github_oauth_state');
}

// Verify OAuth state parameter
export function verifyOAuthState(state: string): boolean {
  const storedState = sessionStorage.getItem('github_oauth_state');
  return storedState === state;
}

// Fetch user data from GitHub API
export async function fetchGitHubUser(accessToken: string): Promise<GitHubUser> {
  const response = await fetch('https://api.github.com/user', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: 'application/vnd.github.v3+json',
    },
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch user data');
  }
  
  return response.json();
}

// Fetch user's organizations
export async function fetchGitHubOrgs(accessToken: string): Promise<GitHubOrg[]> {
  const response = await fetch('https://api.github.com/user/orgs', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: 'application/vnd.github.v3+json',
    },
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch organizations');
  }
  
  return response.json();
}

// Check if GitHub client ID is configured
export function isGitHubConfigured(): boolean {
  return Boolean(GITHUB_CLIENT_ID);
}

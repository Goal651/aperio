import { createContext, useContext, useState, ReactNode, useCallback, useEffect } from "react";

export interface Repository {
  name: string;
  description: string;
  language: string;
  languageColor: string;
  visibility: "private" | "public";
  stars: number;
  forks: number;
  lastCommit: string;
  status: "healthy" | "warning" | "critical";
  alerts: number;
}

export interface Member {
  name: string;
  username: string;
  avatar: string;
  role: string;
  status: "active" | "inactive";
  commits: number;
  prs: number;
  reviews: number;
}

export interface SecurityAlert {
  id: string;
  repo: string;
  type: "Secret" | "Dependency" | "Code";
  title: string;
  severity: "critical" | "high" | "medium" | "low";
  detected: string;
  path: string;
}

export interface AppInstallationState {
  installed: boolean;
  installationId: number | null;
  selectedOrg: string | null;
  repos: Repository[];
  members: Member[];
  alerts: SecurityAlert[];
}

const AppContext = createContext<{
  state: AppInstallationState;
  selectOrg: (org: string, installationId: number) => void;
  installApp: () => void;
  fetchOrgData: () => Promise<void>;
  fetchMembers: () => Promise<void>;
  fetchSecurityAlerts: () => Promise<void>;
}>({
  state: { installed: false, installationId: null, selectedOrg: null, repos: [], members: [], alerts: [] },
  selectOrg: () => { },
  installApp: () => { },
  fetchOrgData: async () => { },
  fetchMembers: async () => { },
  fetchSecurityAlerts: async () => { },
});

export function GitHubAppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppInstallationState>({
    installed: false,
    installationId: null,
    selectedOrg: null,
    repos: [],
    members: [],
    alerts: [],
  });

  // Hydrate state from sessionStorage on mount
  useEffect(() => {
    const stored = sessionStorage.getItem("github_app_installation");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setState(prev => ({
          ...prev,
          installed: parsed.installed || false,
          selectedOrg: parsed.selectedOrg || null,
          installationId: parsed.installationId || null
        }));
      } catch (e) {
        console.error("Failed to parse stored installation state", e);
      }
    }
  }, []);

  const selectOrg = useCallback((org: string, installationId: number) => {
    setState(prev => ({ ...prev, installed: true, selectedOrg: org, installationId }));
    sessionStorage.setItem(
      "github_app_installation",
      JSON.stringify({ installed: true, selectedOrg: org, installationId })
    );
  }, []);

  const installApp = useCallback(() => {
    window.location.href = "https://github.com/apps/short-tagline/installations/new";
  }, []);

  const fetchOrgData = useCallback(async () => {
    if (!state.selectedOrg || !state.installationId) return;

    try {
      // 1. Fetch Installation Access Token from backend
      const tokenRes = await fetch("/api/github/token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ installationId: state.installationId }),
      });

      if (!tokenRes.ok) {
        throw new Error("Failed to get installation token from backend");
      }

      const { token, org } = await tokenRes.json();

      // If we got an org name from the backend and it doesn't match our current state, update it
      if (org && org !== state.selectedOrg) {
        setState(prev => ({ ...prev, selectedOrg: org }));
        // Also update sessionStorage
        const stored = sessionStorage.getItem("github_app_installation");
        if (stored) {
          const parsed = JSON.parse(stored);
          sessionStorage.setItem("github_app_installation", JSON.stringify({ ...parsed, selectedOrg: org }));
        }
      }

      const currentOrg = org || state.selectedOrg;

      // 2. Use the token to fetch repositories
      const res = await fetch(
        `https://api.github.com/orgs/${currentOrg}/repos`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/vnd.github+json",
          },
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to fetch repositories");
      }

      const reposData = await res.json();

      if (!Array.isArray(reposData)) {
        throw new Error("Invalid response from GitHub: expected an array of repositories");
      }

      // Map GitHub API data to your UI structure
      const repos = reposData.map((r: any) => ({
        name: r.name,
        description: r.description || "",
        language: r.language || "Unknown",
        languageColor: "#999",
        visibility: (r.private ? "private" : "public") as "private" | "public",
        stars: r.stargazers_count,
        forks: r.forks_count,
        lastCommit: new Date(r.pushed_at).toLocaleString(),
        alerts: 0,
        status: "healthy" as "healthy" | "warning" | "critical",
      }));

      setState(prev => ({ ...prev, repos }));
    } catch (err: any) {
      console.error("Failed to fetch repos:", err.message);
    }
  }, [state.selectedOrg, state.installationId]);

  const fetchMembers = useCallback(async () => {
    if (!state.selectedOrg || !state.installationId) return;
    try {
      const tokenRes = await fetch("/api/github/token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ installationId: state.installationId }),
      });
      const { token } = await tokenRes.json();

      const res = await fetch(`https://api.github.com/orgs/${state.selectedOrg}/members`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();

      const members = data.map((m: any) => ({
        name: m.login,
        username: m.login,
        avatar: m.login.substring(0, 2).toUpperCase(),
        role: "Member",
        status: "active",
        commits: 0,
        prs: 0,
        reviews: 0
      }));

      setState(prev => ({ ...prev, members }));
    } catch (err) {
      console.error("Failed to fetch members", err);
    }
  }, [state.selectedOrg, state.installationId]);

  const fetchSecurityAlerts = useCallback(async () => {
    if (!state.selectedOrg || !state.installationId) return;
    try {
      const tokenRes = await fetch("/api/github/token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ installationId: state.installationId }),
      });
      const { token } = await tokenRes.json();

      // Fetch Dependabot alerts for the org
      const depRes = await fetch(`https://api.github.com/orgs/${state.selectedOrg}/dependabot/alerts?state=open`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const depData = await depRes.json();

      const alerts: SecurityAlert[] = Array.isArray(depData) ? depData.map((a: any) => ({
        id: a.number.toString(),
        repo: a.repository.name,
        type: "Dependency",
        title: a.security_advisory.summary,
        severity: a.security_advisory.severity,
        detected: new Date(a.created_at).toLocaleString(),
        path: "package.json"
      })) : [];

      setState(prev => ({ ...prev, alerts }));
    } catch (err) {
      console.error("Failed to fetch security alerts", err);
    }
  }, [state.selectedOrg, state.installationId]);

  return (
    <AppContext.Provider value={{ state, selectOrg, installApp, fetchOrgData, fetchMembers, fetchSecurityAlerts }}>
      {children}
    </AppContext.Provider>
  );
}

export function useGitHubApp() {
  return useContext(AppContext);
}

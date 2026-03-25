"use client";

import { useState } from "react";
import { useGitHubApp } from "@/hooks/useGitHubAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2, CheckCircle, Plus, SwitchCamera, Building2, ChevronRight, AlertCircle, History } from "lucide-react";

export function OrganizationSelector() {
  const {
    state,
    checkExistingInstallations,
    switchInstallation,
    installApp,
    installToOrganization,
    isLoading,
    loadingStates
  } = useGitHubApp();

  const [isSwitching, setIsSwitching] = useState<number | null>(null);
  const [isInstalling, setIsInstalling] = useState(false);

  const handleSwitchInstallation = async (installationId: number) => {
    setIsSwitching(installationId);
    try {
      await switchInstallation(installationId);
    } finally {
      setIsSwitching(null);
    }
  };

  if (isLoading || loadingStates.fetchingOrgData || loadingStates.fetchingMembers || loadingStates.fetchingAlerts) {
    return (
      <div className="w-full max-w-2xl mx-auto glass-card p-12 text-center">
          <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto mb-4" />
          <h2 className="text-xl font-black text-foreground tracking-tight">Synchronizing Organization</h2>
          <p className="text-sm text-muted-foreground mt-2">Fetching your secure repository and security data...</p>
      </div>
    );
  }

  if (state.installationStatus === 'checking') {
    return (
      <div className="w-full max-w-2xl mx-auto glass-card p-12 text-center">
          <History className="h-10 w-10 text-primary mx-auto mb-4 opacity-50 animate-pulse" />
          <h2 className="text-xl font-black text-foreground tracking-tight">Discovering Installations</h2>
          <p className="text-sm text-muted-foreground mt-2">Verifying your GitHub App permissions and connections...</p>
      </div>
    );
  }

  if (state.installationStatus === 'error') {
    return (
      <div className="w-full max-w-2xl mx-auto glass-card p-1 md:p-1 relative overflow-hidden group border-destructive/20 bg-destructive/5">
        <div className="p-8 md:p-10 text-center">
          <div className="h-16 w-16 bg-destructive/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="h-8 w-8 text-destructive" />
          </div>
          <h2 className="text-2xl font-black text-foreground tracking-tight mb-2">Connection Interrupted</h2>
          <p className="text-muted-foreground text-sm mb-8 max-w-md mx-auto">
            We encountered a protocol error while connecting to GitHub. This usually happens when the OAuth session expires.
          </p>
          <Button 
            onClick={checkExistingInstallations} 
            variant="destructive"
            className="h-12 px-8 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-destructive/20 transition-all hover:scale-105 active:scale-95"
          >
            Retry Connection Protocol
          </Button>
        </div>
      </div>
    );
  }

  if (state.installationStatus === 'installed' && state.installations.length > 0) {
    return (
      <div className="w-full max-w-3xl mx-auto glass-card p-1 relative overflow-hidden group">
        <div className="p-6 md:p-10">
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 bg-primary/10 rounded-2xl border border-primary/20 shadow-sm">
                <Building2 className="h-6 w-6 text-primary" />
            </div>
            <div>
                <h2 className="text-2xl font-black text-foreground tracking-tight">Select Organization</h2>
                <p className="text-xs text-muted-foreground font-medium mt-0.5">Choose the infrastructure to manage with Git Guard</p>
            </div>
          </div>

          <div className="space-y-4">
            {state.installations.map(installation => (
              <div
                key={installation.installationId}
                className={`group/item flex items-center justify-between p-5 rounded-3xl border transition-all cursor-pointer relative overflow-hidden ${state.installationId === installation.installationId
                    ? 'border-primary/40 bg-primary/5 shadow-lg shadow-primary/5'
                    : 'border-border/40 hover:border-primary/20 hover:bg-secondary/10'
                  }`}
                onClick={() => handleSwitchInstallation(installation.installationId)}
              >
                <div className="flex items-center gap-5 relative z-10">
                  <div className="relative">
                    <Avatar className="h-14 w-14 rounded-2xl border-2 border-background shadow-md">
                      <AvatarImage
                        src={`https://github.com/${installation.organizationLogin}.png`}
                        alt={installation.organizationLogin}
                      />
                      <AvatarFallback className="bg-primary/20 text-primary font-black rounded-2xl">
                        {installation.organizationLogin.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    {state.installationId === installation.installationId && (
                        <div className="absolute -bottom-1 -right-1 h-5 w-5 bg-success rounded-full border-2 border-background flex items-center justify-center shadow-lg">
                            <CheckCircle className="h-3 w-3 text-white" />
                        </div>
                    )}
                  </div>
                  <div>
                    <div className="font-black text-lg text-foreground tracking-tight group-hover/item:text-primary transition-colors">@{installation.organizationLogin}</div>
                    <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-60">
                      Provisioned {new Date(installation.installedAt).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 relative z-10">
                  {state.installationId === installation.installationId && (
                    <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-success/10 border border-success/20 rounded-xl">
                      <span className="h-1.5 w-1.5 bg-success rounded-full animate-pulse" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-success">Current Target</span>
                    </div>
                  )}
                  <div className="p-3 rounded-xl bg-background/50 border border-border/40 group-hover/item:bg-primary group-hover/item:text-primary-foreground group-hover/item:border-primary transition-all">
                    {isSwitching === installation.installationId ? (
                      <Loader2 className="h-4 w-4 animate-spin text-primary" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 pt-8 border-t border-border/40">
            <Button 
                onClick={installToOrganization} 
                variant="glow" 
                className="w-full h-14 rounded-3xl gap-3 bg-secondary/10 hover:bg-secondary/20 border-border/40 text-foreground font-black uppercase tracking-widest text-[11px] transition-all hover:scale-[1.01] active:scale-95"
            >
              <Plus className="h-5 w-5 text-primary" />
              Initialize New Organization
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto glass-card p-1 relative overflow-hidden group">
      <div className="p-8 md:p-12 text-center">
        <div className="h-20 w-20 bg-primary/10 rounded-[2rem] flex items-center justify-center mx-auto mb-8 border border-primary/20 shadow-xl shadow-primary/5">
            <Building2 className="h-10 w-10 text-primary" />
        </div>
        <h2 className="text-3xl font-black text-foreground tracking-tight mb-3">No Target Found</h2>
        <p className="text-muted-foreground text-sm mb-10 max-w-sm mx-auto leading-relaxed">
          Git Guard is not yet authorized for any of your organizations. Initialize the app to start receiving infrastructure insights.
        </p>
        <Button 
            onClick={installToOrganization} 
            variant="glow" 
            className="w-full md:w-auto h-14 px-12 rounded-3xl gap-3 bg-primary text-primary-foreground font-black uppercase tracking-widest text-[11px] shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
        >
          <Plus className="h-5 w-5" />
          Connect Organization
        </Button>
      </div>
    </div>
  );
}

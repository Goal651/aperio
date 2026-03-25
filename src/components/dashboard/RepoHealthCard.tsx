import { CheckCircle2, AlertTriangle, Lock, Unlock, Shield, ChevronRight, Activity } from "lucide-react";
import { useGitHubApp } from "@/hooks/useGitHubAuth";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

const StatusIcon = ({ status }: { status: string }) => {
  if (status === "healthy")
    return <CheckCircle2 className="h-4 w-4 text-success" />;
  if (status === "warning")
    return <AlertTriangle className="h-4 w-4 text-warning" />;
  return <AlertTriangle className="h-4 w-4 text-destructive" />;
};

export function RepoHealthCard({ loading = false }: { loading?: boolean }) {
  const { state, setState } = useGitHubApp();

  const reposWithStatus = state.repos?.map(repo => {
    const repoAlerts = state.alerts?.filter(alert => alert.repo === repo.name) || [];
    const hasCritical = repoAlerts.some(a => a.severity === 'critical' || a.severity === 'high');
    return {
      ...repo,
      status: hasCritical ? 'critical' : (repo.alerts > 0 ? 'warning' : 'healthy')
    };
  }) || [];

  const unhealthyRepos = reposWithStatus
    .filter(r => r.status !== "healthy")
    .sort((a, b) => b.alerts - a.alerts)
    .slice(0, 5);

  const hasIssues = unhealthyRepos.length > 0;

  return (
    <div className="glass-card p-6 md:p-8 animate-fade-in group relative overflow-hidden" style={{ animationDelay: "0.4s" }}>
      <div className="absolute -right-6 -top-6 p-10 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity pointer-events-none">
        <Activity className="h-32 w-32 rotate-12" />
      </div>

      <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
        <div className="flex items-center gap-4">
          <div className="rounded-2xl bg-primary/10 p-3 border border-primary/20 shadow-sm group-hover:scale-110 transition-transform duration-500">
            <Shield className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h3 className="font-black text-foreground tracking-tight">Repository Health</h3>
            <p className="text-[10px] font-black uppercase  text-muted-foreground opacity-60">
              {hasIssues ? "Assets requiring immediate attention" : "All infrastructure systems operational"}
            </p>
          </div>
        </div>
        {!hasIssues && !loading && (
          <div className="flex items-center gap-2 text-success bg-success/10 border border-success/20 px-4 py-1.5 rounded-full text-[10px] font-black uppercase  shadow-sm">
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>100% Compliant</span>
          </div>
        )}
      </div>

      <div className="relative z-10 space-y-3">
        {loading ? (
          <>
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-secondary/10 border border-border/40">
                <div className="flex items-center gap-4">
                  <Skeleton className="h-5 w-5 rounded-md" />
                  <Skeleton className="h-4 w-32 rounded-md" />
                </div>
                <div className="flex items-center gap-8">
                  <Skeleton className="h-4 w-12 rounded-md" />
                  <Skeleton className="h-4 w-16 rounded-md" />
                </div>
              </div>
            ))}
          </>
        ) : !hasIssues ? (
          <div className="py-12 text-center bg-secondary/5 rounded-3xl border border-dashed border-border/40">
            <div className="h-16 w-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-success/20">
              <CheckCircle2 className="h-8 w-8 text-success" />
            </div>
            <p className="text-sm font-black text-foreground uppercase ">No Critical Risks Detected</p>
            <p className="text-xs text-muted-foreground mt-2 max-w-xs mx-auto opacity-70">All tracked repositories fall within organization security compliance standards.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {/* Table Header for Desktop */}
            <div className="hidden md:grid grid-cols-12 gap-4 px-5 py-2 text-[9px] font-black uppercase  text-muted-foreground opacity-40">
              <div className="col-span-6">Resource Asset</div>
              <div className="col-span-2 text-center">Status</div>
              <div className="col-span-2 text-center">Vulnerabilities</div>
              <div className="col-span-2 text-right">Last Sync</div>
            </div>

            {unhealthyRepos.map((repo) => (
              <div
                key={repo.name}
                className="group/item grid grid-cols-1 md:grid-cols-12 gap-4 items-center p-5 rounded-2xl bg-secondary/10 border border-border/40 hover:bg-secondary/20 hover:border-primary/20 transition-all cursor-pointer relative overflow-hidden"
                onClick={() => setState(prev => ({ ...prev, selectedRepoName: repo.name }))}
              >
                <div className="col-span-6 flex items-center gap-4 relative z-10">
                  <div className="p-2 bg-background rounded-lg border border-border/40 shadow-sm group-hover/item:scale-110 transition-transform">
                    {repo.visibility === "private" ? <Lock className="h-3.5 w-3.5 text-muted-foreground" /> : <Unlock className="h-3.5 w-3.5 text-muted-foreground" />}
                  </div>
                  <div>
                    <span className="font-black text-foreground tracking-tight group-hover/item:text-primary transition-colors block">{repo.name}</span>
                    <span className="text-[10px] font-black uppercase  text-muted-foreground opacity-40">{repo.language || "Unknown Stack"}</span>
                  </div>
                </div>

                <div className="col-span-2 flex justify-center md:block text-center relative z-10">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-background/50 rounded-full border border-border/40">
                    <StatusIcon status={repo.status} />
                    <span className="text-[9px] font-black uppercase  hidden lg:inline">{repo.status}</span>
                  </div>
                </div>

                <div className="col-span-2 text-center relative z-10">
                  <span className={`text-lg font-black font-mono tracking-tighter ${repo.status === 'critical' ? 'text-destructive' : 'text-warning'}`}>
                    {repo.alerts}
                  </span>
                  <span className="text-[8px] font-black opacity-30 ml-1.5 uppercase ">Alerts</span>
                </div>

                <div className="col-span-2 text-right relative z-10 flex items-center justify-end gap-3">
                  <span className="text-[10px] font-black font-mono text-muted-foreground opacity-60">
                    {repo.lastCommit.split(',')[0]}
                  </span>
                  <ChevronRight className="h-4 w-4 text-muted-foreground/30 group-hover/item:text-primary group-hover/item:translate-x-1 transition-all" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {hasIssues && (
        <div className="mt-8 flex justify-end relative z-10">
          <Button variant="ghost" size="sm" className="h-10 px-4 rounded-xl gap-2 text-[10px] font-black uppercase  text-muted-foreground hover:text-primary hover:bg-primary/5 transition-all">
            View Full Inventory
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}

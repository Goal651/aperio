import { AlertTriangle, Bug, Key, Package, ShieldAlert, ChevronRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useGitHubApp } from "@/hooks/useGitHubAuth";
import { Button } from "@/components/ui/button";

export function SecurityAlertsCard({ loading }: { loading: boolean }) {
  const { state } = useGitHubApp();

  const dependabotCritical = state.alerts?.filter(a => a.type === "Dependency" && a.severity === "critical").length || 0;
  const dependabotHigh = state.alerts?.filter(a => a.type === "Dependency" && a.severity === "high").length || 0;
  const dependabotMedium = state.alerts?.filter(a => a.type === "Dependency" && a.severity === "medium").length || 0;

  const codeCritical = state.alerts?.filter(a => a.type === "Code" && a.severity === "critical").length || 0;
  const codeHigh = state.alerts?.filter(a => a.type === "Code" && a.severity === "high").length || 0;
  const codeMedium = state.alerts?.filter(a => a.type === "Code" && a.severity === "medium").length || 0;

  const secretCritical = state.alerts?.filter(a => a.type === "Secret" && a.severity === "critical").length || 0;

  const alertsDisplay = [
    {
      type: "Dependency Audit",
      label: "Dependabot",
      icon: Package,
      critical: dependabotCritical,
      high: dependabotHigh,
      medium: dependabotMedium,
      color: "text-amber-400"
    },
    {
      type: "Static Analysis",
      label: "CodeQL",
      icon: Bug,
      critical: codeCritical,
      high: codeHigh,
      medium: codeMedium,
      color: "text-primary"
    },
    {
      type: "Secret Prevention",
      label: "Secrets",
      icon: Key,
      critical: secretCritical,
      high: 0,
      medium: 0,
      color: "text-destructive"
    },
  ];

  return (
    <div className="glass-card p-6 md:p-8 animate-fade-in group relative overflow-hidden h-full flex flex-col" style={{ animationDelay: "0.1s" }}>
      <div className="absolute -right-6 -top-6 p-10 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity pointer-events-none">
        <ShieldAlert className="h-32 w-32 rotate-12" />
      </div>

      <div className="flex items-center justify-between mb-8 relative z-10">
        <div className="flex items-center gap-4">
          <div className="rounded-lg bg-destructive/10 p-3 border border-destructive/20 shadow-sm group-hover:scale-110 transition-transform duration-500">
            <AlertTriangle className="h-6 w-6 text-destructive" />
          </div>
          <div>
            <h3 className="font-black text-foreground tracking-tight">Security Alerts</h3>
            <p className="text-[10px] font-black uppercase  text-muted-foreground opacity-60">Real-time Vulnerability Indexed</p>
          </div>
        </div>
      </div>

      <div className="space-y-4 flex-1 relative z-10">
        {loading ? (
          <>
            {[0, 1, 2].map((i) => (
              <div key={i} className="flex items-center justify-between rounded-lg bg-secondary/10 p-5 border border-border/40">
                <div className="flex items-center gap-4">
                  <Skeleton className="h-10 w-10 rounded-lg" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-24 rounded-md" />
                    <Skeleton className="h-3 w-16 rounded-md opacity-60" />
                  </div>
                </div>
                <Skeleton className="h-6 w-20 rounded-lg" />
              </div>
            ))}
          </>
        ) : alertsDisplay.map((alert) => (
          <div
            key={alert.label}
            className="flex items-center justify-between rounded-lg bg-secondary/10 p-5 border border-border/40 hover:bg-secondary/20 hover:border-primary/20 transition-all group/item"
          >
            <div className="flex items-center gap-4">
              <div className={`p-2.5 bg-background rounded-lg border border-border/40 shadow-sm transition-transform group-hover/item:scale-110 ${alert.color}`}>
                <alert.icon className="h-5 w-5" />
              </div>
              <div>
                <span className="text-sm font-black text-foreground block tracking-tight">
                  {alert.label}
                </span>
                <span className="text-[9px] font-black uppercase  text-muted-foreground opacity-60">
                  {alert.type}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {alert.critical > 0 && (
                <div className="bg-destructive/10 text-destructive border border-destructive/20 px-2 py-0.5 rounded text-[9px] font-black uppercase  animate-pulse shadow-sm">
                  {alert.critical} Crit
                </div>
              )}
              {alert.high > 0 && (
                <div className="bg-warning/10 text-warning border border-warning/20 px-2 py-0.5 rounded text-[9px] font-black uppercase  shadow-sm">
                  {alert.high} High
                </div>
              )}
              {alert.medium > 0 && (
                <div className="bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 rounded text-[9px] font-black uppercase  shadow-sm">
                  {alert.medium} Med
                </div>
              )}
              {alert.critical === 0 && alert.high === 0 && alert.medium === 0 && (
                <div className="flex items-center gap-2 px-3 py-1 bg-success/5 border border-success/20 rounded-lg">
                  <div className="h-1.5 w-1.5 rounded-full bg-success" />
                  <span className="text-[9px] font-black uppercase  text-success/60">Protected</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 pt-6 border-t border-border/40 relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div>
            <p className="text-[10px] font-black uppercase  text-muted-foreground opacity-60">Total Findings</p>
            <p className="text-xl font-black text-foreground leading-none mt-1">{state.alerts?.length || 0}</p>
          </div>
          <div className="h-8 w-px bg-border/40" />
          <div>
            <p className="text-[10px] font-black uppercase  text-muted-foreground opacity-60">Critical</p>
            <p className="text-xl font-black text-destructive leading-none mt-1">{state.alerts?.filter(a => a.severity === 'critical').length || 0}</p>
          </div>
        </div>
        <Button variant="ghost" size="sm" className="h-10 px-4 rounded-lg gap-2 text-[10px] font-black uppercase  text-muted-foreground hover:text-primary hover:bg-primary/5 transition-all">
          Full Audit
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

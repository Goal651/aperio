import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { ShieldCheck, TrendingUp, Zap, Info } from "lucide-react";
import { useGitHubApp } from "@/hooks/useGitHubAuth";
import { Skeleton } from "@/components/ui/skeleton";

const COLORS = ["hsl(var(--primary))", "hsl(var(--secondary)/0.3)"];

export function RiskScoreCard({ loading = false }: { loading?: boolean }) {
  const { state } = useGitHubApp();
  const healthyRepo = state.repos?.filter(repo => repo.status === 'healthy') || [];
  const totalRepo = state.repos?.length || 0;

  const score = totalRepo > 0 ? Math.round((healthyRepo.length / totalRepo) * 100) : 0;
  
  const getScoreColor = () => {
    if (score >= 90) return "text-success";
    if (score >= 70) return "text-primary";
    if (score >= 50) return "text-warning";
    return "text-destructive";
  };

  const getScoreLabel = () => {
    if (score >= 90) return "Elite";
    if (score >= 75) return "Secure";
    if (score >= 60) return "Stable";
    if (score >= 40) return "Fair";
    return "At Risk";
  };

  const data = [
    { name: "Healthy", value: score },
    { name: "Other", value: 100 - score },
  ];

  return (
    <div className="glass-card p-6 md:p-8 animate-fade-in group relative overflow-hidden" style={{ animationDelay: "0.15s" }}>
      <div className="absolute -right-6 -top-6 p-10 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity pointer-events-none">
          <ShieldCheck className="h-32 w-32 rotate-12" />
      </div>

      <div className="flex items-center justify-between mb-8 relative z-10">
        <div className="flex items-center gap-4">
          <div className="rounded-2xl bg-primary/10 p-3 border border-primary/20 shadow-sm group-hover:scale-110 transition-transform duration-500">
            <ShieldCheck className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h3 className="font-black text-foreground tracking-tight">Security Score</h3>
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-60">Aggregate Infrastructure Health</p>
          </div>
        </div>
        <div className="p-2 bg-secondary/20 rounded-xl hover:bg-secondary/30 cursor-help transition-colors">
            <Info className="h-4 w-4 text-muted-foreground" />
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center gap-6 py-4">
          <div className="relative h-44 w-44 flex items-center justify-center">
            <div className="h-44 w-44 rounded-full border-[12px] border-secondary/20 animate-pulse border-t-primary/40" />
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
              <Skeleton className="h-10 w-16 rounded-lg" />
              <Skeleton className="h-4 w-20 rounded-md" />
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-4">
          <div className="relative h-48 w-48 group/chart">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={85}
                  startAngle={90}
                  endAngle={-270}
                  paddingAngle={0}
                  dataKey="value"
                  strokeWidth={0}
                  animationBegin={0}
                  animationDuration={1500}
                >
                  <Cell fill="hsl(var(--primary))" className="drop-shadow-[0_0_12px_rgba(var(--primary),0.3)] transition-all cursor-pointer hover:opacity-80" />
                  <Cell fill="hsl(var(--secondary)/0.3)" />
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none group-hover/chart:scale-110 transition-transform duration-500">
              <span className={`text-5xl font-black tracking-tighter ${getScoreColor()}`}>{score}</span>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground opacity-60 mt-1">{getScoreLabel()}</span>
            </div>
          </div>
        </div>
      )}

      <div className="mt-8 pt-6 border-t border-border/40 grid grid-cols-2 gap-4 relative z-10">
        <div className="p-3 bg-secondary/10 rounded-2xl border border-border/40 hover:bg-secondary/20 transition-all">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="h-3 w-3 text-success" />
            <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground opacity-60">Status</span>
          </div>
          <p className="text-sm font-black text-foreground">{score}% Health</p>
        </div>
        <div className="p-3 bg-secondary/10 rounded-2xl border border-border/40 hover:bg-secondary/20 transition-all">
          <div className="flex items-center gap-2 mb-1">
            <Zap className="h-3 w-3 text-amber-400" />
            <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground opacity-60">Control</span>
          </div>
          <p className="text-sm font-black text-foreground">{12}/{15} Ops</p>
        </div>
      </div>
    </div>
  );
}

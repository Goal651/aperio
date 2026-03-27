import { TrendingUp, Users, ChevronRight, Medal } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useGitHubApp } from "@/hooks/useGitHubAuth";
import { Button } from "@/components/ui/button";

export function TopContributors({ loading }: { loading: boolean }) {
  const { state, setState } = useGitHubApp();
  const members = state.members?.slice(0, 5) || [];

  return (
    <div className="glass-card p-6 md:p-8 animate-fade-in group relative overflow-hidden h-full flex flex-col" style={{ animationDelay: "0.3s" }}>
      <div className="absolute -right-6 -top-6 p-10 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity pointer-events-none">
        <Users className="h-32 w-32 rotate-12" />
      </div>

      <div className="flex items-center justify-between mb-8 relative z-10">
        <div className="flex items-center gap-4">
          <div className="rounded-lg bg-success/10 p-3 border border-success/20 shadow-sm group-hover:scale-110 transition-transform duration-500">
            <Medal className="h-6 w-6 text-success" />
          </div>
          <div>
            <h3 className="font-black text-foreground tracking-tight">Top Contributors</h3>
            <p className="text-[10px] font-black uppercase  text-muted-foreground opacity-60">High-Velocity Engineering Force</p>
          </div>
        </div>
      </div>

      <div className="space-y-3 flex-1 relative z-10">
        {loading ? (
          <>
            {[0, 1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center justify-between rounded-lg bg-secondary/10 p-4 border border-border/40">
                <div className="flex items-center gap-4">
                  <Skeleton className="h-10 w-10 rounded-full shrink-0" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-24 rounded-md" />
                    <Skeleton className="h-3 w-32 rounded-md opacity-60" />
                  </div>
                </div>
                <Skeleton className="h-5 w-8 rounded-md" />
              </div>
            ))}
          </>
        ) : members.length === 0 ? (
          <div className="py-12 text-center bg-secondary/5 rounded-3xl border border-dashed border-border/40">
            <p className="text-sm font-black text-foreground uppercase  opacity-40 italic">Inertia Detected</p>
            <p className="text-[10px] text-muted-foreground mt-2 max-w-xs mx-auto opacity-50 font-black uppercase ">No contribution events recorded in window</p>
          </div>
        ) : (
          members.map((contributor, index) => (
            <div
              key={contributor.username}
              onClick={() => setState(prev => ({ ...prev, selectedMemberId: contributor.username }))}
              className="group/item flex items-center justify-between rounded-lg bg-secondary/10 p-4 border border-border/40 hover:bg-secondary/20 hover:border-primary/20 transition-all cursor-pointer overflow-hidden relative"
            >
              <div className="flex items-center gap-4 relative z-10">
                <div className="relative">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/20 overflow-hidden text-xs font-black text-primary border-2 border-background shadow-lg transition-transform group-hover/item:scale-110">
                    {contributor.avatar?.startsWith("http") ? (
                      <img src={contributor.avatar} alt={contributor.username} className="h-full w-full object-cover" />
                    ) : (
                      <span className="uppercase">{contributor.username.substring(0, 2)}</span>
                    )}
                  </div>
                  {index === 0 && (
                    <div className="absolute -top-1 -right-1 h-5 w-5 bg-amber-400 rounded-full flex items-center justify-center border-2 border-background shadow-md">
                      <Medal className="h-3 w-3 text-white" />
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-sm font-black text-foreground tracking-tight group-hover/item:text-primary transition-colors">
                    {contributor.name || contributor.username}
                  </p>
                  <p className="text-[10px] font-black uppercase  text-muted-foreground opacity-60">
                    {contributor.commits || 0} commits <span className="mx-1 opacity-30">•</span> {contributor.prs || 0} PRs
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4 relative z-10">
                <div className="flex flex-col items-end">
                  <span className="font-black font-mono text-xs text-muted-foreground opacity-40">
                    RANKING
                  </span>
                  <span className="font-black font-mono text-lg text-foreground leading-none">
                    #{index + 1}
                  </span>
                </div>
                <TrendingUp className="h-4 w-4 text-success opacity-0 group-hover/item:opacity-100 transition-all group-hover/item:translate-y-[-2px]" />
              </div>
            </div>
          ))
        )}
      </div>

      <div className="mt-8 pt-6 border-t border-border/40 relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-[9px] font-black uppercase  text-muted-foreground opacity-40">Analysis window: 30 days</span>
        </div>
        <Button variant="ghost" size="sm" className="h-10 px-4 rounded-lg gap-2 text-[10px] font-black uppercase  text-muted-foreground hover:text-primary hover:bg-primary/5 transition-all">
          Full Squad
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

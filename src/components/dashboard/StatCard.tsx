import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon: LucideIcon;
  iconColor?: "primary" | "success" | "warning" | "destructive";
  href?: string;
  loading: boolean;
}

const iconColorClasses = {
  primary: "text-primary bg-primary/10 border-primary/20 shadow-primary/5",
  success: "text-success bg-success/10 border-success/20 shadow-success/5",
  warning: "text-warning bg-warning/10 border-warning/20 shadow-warning/5",
  destructive: "text-destructive bg-destructive/10 border-destructive/20 shadow-destructive/5",
};

export function StatCard({
  title,
  value,
  change,
  changeType = "neutral",
  icon: Icon,
  iconColor = "primary",
  href,
  loading,
}: StatCardProps) {
  const content = (
    <div className={cn(
      "glass-card p-6 transition-all duration-300 group relative overflow-hidden",
      href && "hover:border-primary/40 hover:scale-[1.02] cursor-pointer"
    )}>
      <div className="absolute -right-4 -top-4 p-6 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity pointer-events-none">
        <Icon className="h-24 w-24 rotate-12" />
      </div>

      <div className="flex items-start justify-between relative z-10">
        <div className="space-y-3 flex-1 min-w-0">
          <p className="text-[10px] font-black uppercase  text-muted-foreground opacity-70">{title}</p>
          {loading ? (
            <div className="space-y-2">
              <Skeleton className="h-10 w-24 rounded-lg" />
              <Skeleton className="h-4 w-32 rounded-md" />
            </div>
          ) : (
            <div className="space-y-1">
              <p className="text-3xl font-black tracking-tight text-foreground leading-none">{value}</p>
              {change && (
                <div className="flex items-center gap-1.5 mt-2">
                  <div className={cn(
                    "h-1.5 w-1.5 rounded-full animate-pulse",
                    changeType === "positive" && "bg-success",
                    changeType === "negative" && "bg-destructive",
                    changeType === "neutral" && "bg-muted-foreground"
                  )} />
                  <p
                    className={cn(
                      "text-[10px] font-black uppercase ",
                      changeType === "positive" && "text-success",
                      changeType === "negative" && "text-destructive",
                      changeType === "neutral" && "text-muted-foreground"
                    )}
                  >
                    {change}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
        <div className={cn(
          "rounded-2xl p-3.5 shrink-0 border transition-transform group-hover:scale-110 duration-500",
          iconColorClasses[iconColor]
        )}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  );

  if (href) {
    return <Link href={href} className="block">{content}</Link>;
  }

  return content;
}

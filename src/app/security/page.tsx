"use client";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import {
    Shield,
    AlertTriangle,
    Bug,
    Key,
    Package,
    ExternalLink,
    ChevronRight,
    Clock
} from "lucide-react";
import { Button } from "@/components/ui/button";

import { useGitHubApp } from "@/hooks/useGitHubAuth";
import { useEffect } from "react";

import { useRouter } from "next/navigation";

export default function Page() {
    const { state, fetchSecurityAlerts } = useGitHubApp();
    const router = useRouter();

    useEffect(() => {
        if (!state.installed) {
            router.push("/connect");
        } else {
            fetchSecurityAlerts();
        }
    }, [state.installed, fetchSecurityAlerts, router]);

    if (!state.installed) return null;

    const criticalAlerts = state.alerts?.filter(a => a.severity === "critical") || [];

    const alertStats = [
        { label: "Critical", count: state.alerts.filter(a => a.severity === "critical").length, color: "bg-destructive" },
        { label: "High", count: state.alerts.filter(a => a.severity === "high").length, color: "bg-warning" },
        { label: "Medium", count: state.alerts.filter(a => a.severity === "medium").length, color: "bg-primary" },
        { label: "Low", count: state.alerts.filter(a => a.severity === "low").length, color: "bg-muted-foreground" },
    ];

    const totalAlertsCount = state.alerts.length;

    const alertTypes = [
        { icon: Package, label: "Dependabot", count: state.alerts.filter(a => a.type === "Dependency").length, active: state.alerts.filter(a => a.type === "Dependency").length },
        { icon: Bug, label: "Code Scanning", count: state.alerts.filter(a => a.type === "Code").length, active: state.alerts.filter(a => a.type === "Code").length },
        { icon: Key, label: "Secret Scanning", count: state.alerts.filter(a => a.type === "Secret").length, active: state.alerts.filter(a => a.type === "Secret").length },
    ];
    return (
        <DashboardLayout>
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                    <Shield className="h-6 w-6 text-primary" />
                    <h1 className="text-2xl font-bold text-foreground">Security Overview</h1>
                </div>
                <p className="text-muted-foreground">
                    Vulnerabilities and security alerts across your organization
                </p>
            </div>

            {/* Alert summary bar */}
            <div className="glass-card p-6 mb-8 animate-fade-in">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="font-semibold text-foreground">Alert Summary</h2>
                    <span className="text-sm text-muted-foreground">{totalAlertsCount} total alerts</span>
                </div>
                <div className="flex gap-2 h-3 rounded-full overflow-hidden bg-secondary">
                    {alertStats.map((stat) => (
                        <div
                            key={stat.label}
                            className={`${stat.color} transition-all duration-500`}
                            style={{ width: totalAlertsCount > 0 ? `${(stat.count / totalAlertsCount) * 100}%` : "0%" }}
                        />
                    ))}
                </div>
                <div className="flex gap-6 mt-4">
                    {alertStats.map((stat) => (
                        <div key={stat.label} className="flex items-center gap-2">
                            <div className={`h-2 w-2 rounded-full ${stat.color}`} />
                            <span className="text-sm text-muted-foreground">
                                {stat.label}: <span className="font-mono text-foreground">{stat.count}</span>
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Main grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                {/* Alert types */}
                {alertTypes.map((type, index) => (
                    <div
                        key={type.label}
                        className="glass-card p-6 animate-fade-in"
                        style={{ animationDelay: `${0.1 + index * 0.1}s` }}
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="rounded-lg bg-primary/10 p-2">
                                    <type.icon className="h-5 w-5 text-primary" />
                                </div>
                                <span className="font-medium text-foreground">{type.label}</span>
                            </div>
                            <ExternalLink className="h-4 w-4 text-muted-foreground cursor-pointer hover:text-primary transition-colors" />
                        </div>
                        <div className="flex items-baseline gap-2">
                            <span className="text-3xl font-bold text-foreground">{type.active}</span>
                            <span className="text-sm text-muted-foreground">/ {type.count} total</span>
                        </div>
                        <div className="mt-3 h-2 rounded-full bg-secondary overflow-hidden">
                            <div
                                className="h-full bg-primary rounded-full transition-all duration-500"
                                style={{ width: `${(type.active / type.count) * 100}%` }}
                            />
                        </div>
                    </div>
                ))}
            </div>

            {/* Critical alerts */}
            <div className="glass-card p-6 animate-fade-in" style={{ animationDelay: "0.4s" }}>
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <AlertTriangle className="h-5 w-5 text-destructive" />
                        <h2 className="font-semibold text-foreground">Critical Alerts</h2>
                        <span className="badge-critical">{criticalAlerts.length} items</span>
                    </div>
                    <Button variant="ghost" size="sm">
                        View All <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                </div>

                <div className="space-y-3">
                    {criticalAlerts.map((alert) => (
                        <div
                            key={alert.id}
                            className="flex items-center justify-between p-4 rounded-lg bg-destructive/5 border border-destructive/20 hover:bg-destructive/10 transition-colors cursor-pointer"
                        >
                            <div className="flex items-center gap-4">
                                <div className="h-10 w-10 rounded-lg bg-destructive/20 flex items-center justify-center">
                                    {alert.type === "Secret" && <Key className="h-5 w-5 text-destructive" />}
                                    {alert.type === "Dependency" && <Package className="h-5 w-5 text-destructive" />}
                                    {alert.type === "Code" && <Bug className="h-5 w-5 text-destructive" />}
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <span className="font-mono text-sm text-primary">{alert.repo}</span>
                                        <span className="text-xs text-muted-foreground">·</span>
                                        <span className="badge-critical">{alert.type}</span>
                                    </div>
                                    <p className="text-sm font-medium text-foreground mt-1">{alert.title}</p>
                                    <p className="text-xs text-muted-foreground font-mono mt-0.5">{alert.path}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <Clock className="h-3 w-3" />
                                {alert.detected}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </DashboardLayout>
    );
}

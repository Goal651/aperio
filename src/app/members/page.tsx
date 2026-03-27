"use client";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Users, GitCommit, GitPullRequest, MessageSquare, Search, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

import { useGitHubApp } from "@/hooks/useGitHubAuth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";


import { LoadingScreen } from "@/components/ui/LoadingScreen";
import { Member } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";

// Custom tooltip with better styling
const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="glass-card px-4 py-3 shadow-lg border border-border/50">
                <p className="font-bold text-foreground mb-2 border-b border-border/50 pb-1">{label}</p>
                <div className="space-y-1.5">
                    <p className="flex items-center justify-between gap-4 font-mono text-xs">
                        <span className="text-muted-foreground uppercase  font-black">Commits</span>
                        <span className="text-primary font-black">{payload[0].value}</span>
                    </p>
                    <p className="flex items-center justify-between gap-4 font-mono text-xs">
                        <span className="text-muted-foreground uppercase  font-black">PRs</span>
                        <span className="text-success font-black">{payload[1].value}</span>
                    </p>
                    <p className="flex items-center justify-between gap-4 font-mono text-xs">
                        <span className="text-muted-foreground uppercase  font-black">Reviews</span>
                        <span className="text-warning font-black">{payload[2].value}</span>
                    </p>
                </div>
            </div>
        );
    }
    return null;
};

export default function Page() {
    const { state, setState, fetchMembers, isLoading, loadingStates } = useGitHubApp();
    const router = useRouter();

    const [searchQuery, setSearchQuery] = useState("");
    const [sortBy, setSortBy] = useState<"commits" | "prs" | "reviews" | "name">("prs");

    useEffect(() => {
        if (!isLoading && !state.installed) {
            router.push("/connect");
        } else if (!isLoading && state.installed) {
            fetchMembers();
        }
    }, [isLoading, state.installed, fetchMembers, router]);

    if (isLoading) return <LoadingScreen />;
    if (!state.installed) return null;

    const members = state.members || [];
    const filteredMembers = members.filter(m =>
        m.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.name?.toLowerCase().includes(searchQuery.toLowerCase())
    ).sort((a, b) => {
        if (sortBy === "commits") return b.commits - a.commits;
        if (sortBy === "prs") return b.prs - a.prs;
        if (sortBy === "reviews") return b.reviews - a.reviews;
        return a.name.localeCompare(b.name);
    });


    const chartData = members.slice(0, 5).map((m: Member) => ({
        name: m.username,
        commits: m.commits || 0,
        prs: m.prs || 0,
        reviews: m.reviews || 0,
    }));

    return (
        <DashboardLayout>
            {/* Header */}
            <div className="mb-8 p-4 md:p-0 bg-secondary/5 md:bg-transparent rounded-lg border md:border-0 border-border/40">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-2">
                    <div className="p-2 bg-primary/10 rounded-lg w-fit">
                        <Users className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">Team Members</h1>
                        <p className="text-sm text-muted-foreground">
                            Deep contribution analytics and activity metrics for your organization
                        </p>
                    </div>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-8">
                {loadingStates.fetchingMembers ? (
                    <>
                        {[0, 1, 2, 3].map(i => (
                            <div key={i} className="stat-card animate-fade-in p-4">
                                <Skeleton className="h-3 w-16 mb-2" />
                                <Skeleton className="h-8 w-10" />
                            </div>
                        ))}
                    </>
                ) : (
                    <>
                        <div className="stat-card animate-fade-in p-4 md:p-6 bg-background/40">
                            <p className="text-[10px] md:text-xs font-black uppercase  text-muted-foreground mb-1 md:mb-2">Total</p>
                            <p className="text-xl md:text-3xl font-black text-foreground font-mono">{members.length}</p>
                        </div>
                        <div className="stat-card animate-fade-in p-4 md:p-6 bg-background/40" style={{ animationDelay: "0.05s" }}>
                            <p className="text-[10px] md:text-xs font-black uppercase  text-muted-foreground mb-1 md:mb-2">Active</p>
                            <p className="text-xl md:text-3xl font-black text-success font-mono">{members.filter(m => (m.prs || 0) > 0 || (m.commits || 0) > 0).length}</p>
                        </div>
                        <div className="stat-card animate-fade-in p-4 md:p-6 bg-background/40" style={{ animationDelay: "0.1s" }}>
                            <p className="text-[10px] md:text-xs font-black uppercase  text-muted-foreground mb-1 md:mb-2">Inert</p>
                            <p className="text-xl md:text-3xl font-black text-warning font-mono">{members.filter(m => (m.prs || 0) === 0 && (m.commits || 0) === 0).length}</p>
                        </div>
                        <div className="stat-card animate-fade-in p-4 md:p-6 bg-background/40" style={{ animationDelay: "0.15s" }}>
                            <p className="text-[10px] md:text-xs font-black uppercase  text-muted-foreground mb-1 md:mb-2">Pending</p>
                            <p className="text-xl md:text-3xl font-black text-muted-foreground/40 font-mono">0</p>
                        </div>
                    </>
                )}
            </div>

            {/* Chart */}
            <div className="glass-card-medium p-6 mb-8 animate-fade-in group hover:border-primary/20 transition-all" style={{ animationDelay: "0.2s" }}>
                <div className="flex items-center justify-between mb-8">
                    <div className="flex flex-col gap-1">
                        <h2 className="font-bold text-foreground">Top Contributors</h2>
                        <p className="text-[10px] text-muted-foreground uppercase  font-black opacity-60">Comparative Activity Pulse</p>
                    </div>
                </div>
                <div className="h-64 sm:h-80 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData} layout="vertical" margin={{ left: -20, right: 20 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border) / 0.1)" horizontal={false} />
                            <XAxis type="number" hide />
                            <YAxis
                                dataKey="name"
                                type="category"
                                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10, fontWeight: 600 }}
                                width={100}
                                axisLine={false}
                                tickLine={false}
                            />
                            <Tooltip
                                content={<CustomTooltip />}
                                cursor={{ fill: 'hsl(var(--primary) / 0.05)' }}
                            />
                            <Bar dataKey="commits" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} barSize={12} />
                            <Bar dataKey="prs" fill="hsl(var(--success))" radius={[0, 4, 4, 0]} barSize={12} />
                            <Bar dataKey="reviews" fill="hsl(var(--warning))" radius={[0, 4, 4, 0]} barSize={12} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                <div className="flex flex-wrap gap-4 md:gap-8 mt-6 pt-6 border-t border-border/40">
                    <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-primary shadow-[0_0_8px_hsl(var(--primary))]" />
                        <span className="text-[10px] font-black uppercase  text-muted-foreground">Commits</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-success shadow-[0_0_8px_hsl(var(--success))]" />
                        <span className="text-[10px] font-black uppercase  text-muted-foreground">PRs</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-warning shadow-[0_0_8px_hsl(var(--warning))]" />
                        <span className="text-[10px] font-black uppercase  text-muted-foreground">Reviews</span>
                    </div>
                </div>
            </div>

            {/* Members List */}
            <div className="glass-card p-4 md:p-8 animate-fade-in" style={{ animationDelay: "0.3s" }}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                            <Users className="h-5 w-5 text-primary" />
                        </div>
                        <h2 className="font-bold text-xl text-foreground tracking-tight">Organization Members</h2>
                    </div>
                    <div className="flex items-center gap-2 self-start sm:self-auto">
                        <span className="text-[10px] font-black uppercase  px-3 py-1.5 rounded-full border bg-secondary/50 border-border/50 text-muted-foreground">
                            {filteredMembers.length} Professional Contributors
                        </span>
                    </div>
                </div>

                {/* Search and Sort (Mobile Optimized) */}
                <div className="flex flex-col lg:flex-row gap-4 mb-6">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
                        <Input
                            placeholder="Search members..."
                            className="pl-10 h-11 bg-secondary/20 border-border/50 focus:border-primary/40 rounded-lg"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <select
                            className="flex-1 lg:flex-none bg-secondary/20 border border-border/50 rounded-lg px-4 h-11 text-sm font-medium outline-none focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer"
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value as any)}
                        >
                            <option value="prs">Sort by PRs</option>
                            <option value="commits">Sort by Commits</option>
                            <option value="reviews">Sort by Reviews</option>
                            <option value="name">Sort by Name</option>
                        </select>
                    </div>
                </div>

                {/* Desktop Table */}
                <div className="hidden md:block overflow-hidden rounded-lg border border-border/50">
                    <Table>
                        <TableHeader className="bg-secondary/30">
                            <TableRow className="hover:bg-transparent border-border/50">
                                <TableHead className="font-black text-[10px] uppercase  py-4">Member</TableHead>
                                <TableHead className="font-black text-[10px] uppercase  py-4 text-center">Commits</TableHead>
                                <TableHead className="font-black text-[10px] uppercase  py-4 text-center">PRs</TableHead>
                                <TableHead className="font-black text-[10px] uppercase  py-4 text-center">Reviews</TableHead>
                                <TableHead className="font-black text-[10px] uppercase  py-4 text-center">Status</TableHead>
                                <TableHead className="font-black text-[10px] uppercase  py-4 text-right">Activity</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loadingStates.fetchingMembers ? (
                                [0, 1, 2, 3, 4].map(i => (
                                    <TableRow key={i} className="border-border/40">
                                        <TableCell><Skeleton className="h-10 w-40" /></TableCell>
                                        <TableCell><Skeleton className="h-6 w-12 mx-auto" /></TableCell>
                                        <TableCell><Skeleton className="h-6 w-12 mx-auto" /></TableCell>
                                        <TableCell><Skeleton className="h-6 w-12 mx-auto" /></TableCell>
                                        <TableCell><Skeleton className="h-6 w-16 mx-auto" /></TableCell>
                                        <TableCell><Skeleton className="h-8 w-24 ml-auto" /></TableCell>
                                    </TableRow>
                                ))
                            ) : filteredMembers.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-40 text-center text-muted-foreground font-medium">
                                        No organization members discovered yet.
                                    </TableCell>
                                </TableRow>
                            ) : filteredMembers.map((member, idx) => (
                                <TableRow
                                    key={member.username}
                                    className="hover:bg-primary/5 transition-colors border-border/40 group/row cursor-pointer"
                                    onClick={() => router.push(`/members/${member.username}`)}
                                >
                                    <TableCell className="py-4">
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-10 w-10 border-2 border-border/50 group-hover/row:border-primary/30 transition-all">
                                                <AvatarImage src={member.avatar} />
                                                <AvatarFallback className="bg-primary/5 text-primary text-xs font-bold">
                                                    {member.username.substring(0, 2).toUpperCase()}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="flex flex-col">
                                                <span className="font-bold text-foreground group-hover/row:text-primary transition-colors">{member.name}</span>
                                                <span className="text-[10px] text-muted-foreground font-mono uppercase tracking-tighter">@{member.username}</span>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-center font-mono font-bold text-foreground">{member.commits || 0}</TableCell>
                                    <TableCell className="text-center font-mono font-bold text-success">{member.prs || 0}</TableCell>
                                    <TableCell className="text-center font-mono font-bold text-warning">{member.reviews || 0}</TableCell>
                                    <TableCell className="text-center">
                                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase  border ${member.status === "active" ? "bg-success/10 border-success/20 text-success" : "bg-warning/10 border-warning/20 text-warning"
                                            }`}>
                                            {member.status}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <div className="h-1.5 w-16 bg-secondary/50 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-primary rounded-full transition-all duration-1000"
                                                    style={{ width: `${Math.min(((member.commits || 0) + (member.prs || 0) * 5) / 5, 100)}%` }}
                                                />
                                            </div>
                                            <ChevronRight className="h-4 w-4 text-muted-foreground group-hover/row:translate-x-1 transition-transform" />
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>

                {/* Mobile Cards */}
                <div className="md:hidden space-y-4">
                    {loadingStates.fetchingMembers ? (
                        [0, 1, 2].map(i => (
                            <div key={i} className="p-4 rounded-lg bg-secondary/10 border border-border/40 space-y-4">
                                <div className="flex items-center gap-3">
                                    <Skeleton className="h-12 w-12 rounded-full" />
                                    <div className="space-y-2">
                                        <Skeleton className="h-4 w-24" />
                                        <Skeleton className="h-3 w-16" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-3 gap-2">
                                    <Skeleton className="h-8 rounded-lg" />
                                    <Skeleton className="h-8 rounded-lg" />
                                    <Skeleton className="h-8 rounded-lg" />
                                </div>
                            </div>
                        ))
                    ) : filteredMembers.length === 0 ? (
                        <div className="py-12 text-center text-muted-foreground text-sm font-medium bg-secondary/5 rounded-lg border border-dashed border-border/50">
                            No members found.
                        </div>
                    ) : (
                        filteredMembers.map((member, idx) => (
                            <div
                                key={member.username}
                                className="p-5 rounded-3xl bg-secondary/10 border border-border/40 active:bg-secondary/20 transition-all space-y-5 animate-fade-in group"
                                style={{ animationDelay: `${idx * 0.05}s` }}
                                onClick={() => router.push(`/members/${member.username}`)}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <Avatar className="h-12 w-12 border-2 border-primary/10 group-active:border-primary/30 transition-all">
                                            <AvatarImage src={member.avatar} />
                                            <AvatarFallback className="bg-primary/5 text-primary text-sm font-black">
                                                {member.username.substring(0, 2).toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex flex-col">
                                            <span className="font-black text-foreground text-lg tracking-tight group-active:text-primary transition-colors">{member.name}</span>
                                            <div className="flex items-center gap-1.5 mt-0.5">
                                                <div className={`h-1.5 w-1.5 rounded-full ${member.status === 'active' ? 'bg-success shadow-[0_0_4px_hsl(var(--success))]' : 'bg-warning shadow-[0_0_4px_hsl(var(--warning))]'}`} />
                                                <span className="text-[10px] text-muted-foreground font-black uppercase  opacity-60">{member.status} Contributor</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-2 bg-background/50 rounded-lg border border-border/40">
                                        <ChevronRight className="h-5 w-5 text-muted-foreground opacity-40 group-active:translate-x-1 transition-transform" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 gap-3">
                                    <div className="p-3 rounded-lg bg-background/40 border border-border/40 flex flex-col items-center gap-1 group-active:border-primary/20 transition-all">
                                        <span className="text-[10px] font-black uppercase tracking-tighter text-muted-foreground/50">Commits</span>
                                        <span className="font-mono font-black text-foreground text-lg">{member.commits || 0}</span>
                                    </div>
                                    <div className="p-3 rounded-lg bg-background/40 border border-border/40 flex flex-col items-center gap-1 group-active:border-success/20 transition-all">
                                        <span className="text-[10px] font-black uppercase tracking-tighter text-muted-foreground/50">PRs</span>
                                        <span className="font-mono font-black text-success text-lg">{member.prs || 0}</span>
                                    </div>
                                    <div className="p-3 rounded-lg bg-background/40 border border-border/40 flex flex-col items-center gap-1 group-active:border-warning/20 transition-all">
                                        <span className="text-[10px] font-black uppercase tracking-tighter text-muted-foreground/50">Reviews</span>
                                        <span className="font-mono font-black text-warning text-lg">{member.reviews || 0}</span>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}

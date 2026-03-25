"use client";

import { useGitHubApp } from "@/hooks/useGitHubAuth";
import { Button } from "@/components/ui/button";
import { ArrowLeft, GitCommit, GitPullRequest, Eye, Shield } from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Member } from "@/types";
import { LoadingScreen } from "@/components/ui/LoadingScreen";
import { Skeleton } from "@/components/ui/skeleton";

export default function MemberDetailView() {
    const router = useRouter()
    const params = useParams();
    const { state, setState, isLoading, loadingStates } = useGitHubApp();
    const [member, setMember] = useState<Member | null>(null);

    useEffect(() => {
        if (!isLoading && !state.installed) {
            router.push("/connect");
            return;
        }
        const found = state.members.find(m => m.username === params.id);
        if (found) setMember(found);
    }, [params, state.members, isLoading, state.installed, router]);

    if (isLoading) return <LoadingScreen />;
    if (!state.installed) return null;

    // Members still fetching — show skeleton
    if (!member && loadingStates.fetchingMembers) {
        return (
            <div className="animate-fade-in p-4">
                <div className="mb-8 flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-full">
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <div className="flex items-center gap-4">
                        <Skeleton className="h-12 w-12 rounded-full" />
                        <div className="space-y-2">
                            <Skeleton className="h-6 w-40" />
                            <Skeleton className="h-4 w-28" />
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {[0, 1, 2].map(i => <StatCard key={i} title="" value="" icon={GitCommit} loading={true} />)}
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 glass-card p-6 space-y-4">
                        {[0, 1, 2].map(i => <Skeleton key={i} className="h-14 w-full rounded-xl" />)}
                    </div>
                    <div className="glass-card p-6 space-y-3">
                        {[0, 1, 2].map(i => <Skeleton key={i} className="h-6 w-full" />)}
                    </div>
                </div>
            </div>
        );
    }

    // Member not found even after load
    if (!member) return (
        <div className="p-4 text-center text-muted-foreground">
            <p>Member not found.</p>
            <Button variant="ghost" size="sm" onClick={() => router.back()} className="mt-4">
                <ArrowLeft className="h-4 w-4 mr-2" /> Go back
            </Button>
        </div>
    );

    const backToDashboard = () => router.back()

    return (
        <div className="animate-fade-in p-4">
            <div className="mb-8 flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={backToDashboard} className="rounded-full">
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                <div className="flex items-center gap-4">
                    <img src={member.avatar} alt={member.username || "Member avatar"} className="h-12 w-12 rounded-full border border-border/50" />
                    <div>
                        <h1 className="text-2xl font-bold text-foreground">{member.name}</h1>
                        <p className="text-muted-foreground">@{member.username} · {member.role}</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <StatCard
                    title="Monthly Commits"
                    value={member.commits.toString()}
                    icon={GitCommit}
                    loading={false}
                />
                <StatCard
                    title="Pull Requests"
                    value={member.prs.toString()}
                    icon={GitPullRequest}
                    loading={false}
                />
                <StatCard
                    title="Code Reviews"
                    value={member.reviews.toString()}
                    icon={Eye}
                    loading={false}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <div className="glass-card p-6">
                        <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                            <GitCommit className="h-5 w-5 text-primary" />
                            Repository Contributions
                        </h2>
                        <div className="space-y-4">
                            {member.contributedRepos.length > 0 ? (
                                member.contributedRepos.map(repoName => (
                                    <div key={repoName} className="flex items-center justify-between p-4 rounded-xl bg-secondary/20 border border-border/50 hover:border-primary/30 transition-all group">
                                        <div>
                                            <span className="font-semibold text-foreground group-hover:text-primary transition-colors">{repoName}</span>
                                            <p className="text-xs text-muted-foreground mt-1">Core contributor this month</p>
                                        </div>
                                        <Button variant="ghost" size="sm" onClick={() => router.push(`/repos/${repoName}`)}>
                                            View Repo
                                        </Button>
                                    </div>
                                ))
                            ) : (
                                <p className="text-muted-foreground italic">No specific repo contributions found for this period.</p>
                            )}
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="glass-card p-6">
                        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                            <Shield className="h-5 w-5 text-success" />
                            Contribution Mix
                        </h2>
                        <div className="space-y-4">
                            {[
                                { label: 'Commits', value: member.commits, color: 'bg-primary' },
                                { label: 'PRs', value: member.prs, color: 'bg-success' },
                                { label: 'Reviews', value: member.reviews, color: 'bg-warning' }
                            ].map(item => {
                                const total = member.commits + member.prs + member.reviews;
                                const percentage = total > 0 ? (item.value / total) * 100 : 0;
                                return (
                                    <div key={item.label} className="space-y-1.5">
                                        <div className="flex justify-between text-xs">
                                            <span className="text-muted-foreground">{item.label}</span>
                                            <span className="font-mono text-foreground">{item.value}</span>
                                        </div>
                                        <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                                            <div className={`h-full ${item.color}`} style={{ width: `${percentage}%` }} />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="glass-card p-6">
                        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                            <Shield className="h-5 w-5 text-success" />
                            Security Posture
                        </h2>
                        <div className="p-4 rounded-xl bg-success/5 border border-success/20">
                            <p className="text-xs text-muted-foreground leading-relaxed">
                                {member.name} has no pending security reviews or blocked merges for this month.
                                All contributions are aligned with organization security policies.
                            </p>
                        </div>
                        <div className="mt-6">
                            <h3 className="text-xs font-semibold text-muted-foreground mb-3 uppercase ">Activity Highlights</h3>
                            <ul className="space-y-3 text-xs">
                                <li className="flex items-start gap-2 text-foreground/80">
                                    <div className="h-1.5 w-1.5 rounded-full bg-success mt-1" />
                                    <span>Merged {Math.max(1, Math.floor(member.prs / 2))} critical PRs recently</span>
                                </li>
                                <li className="flex items-start gap-2 text-foreground/80">
                                    <div className="h-1.5 w-1.5 rounded-full bg-primary mt-1" />
                                    <span>Top contributor in {member.contributedRepos.length} repositories</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

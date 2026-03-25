"use client";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useGitHubApp } from "@/hooks/useGitHubAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
    Settings,
    Shield,
    Users,
    Bell,
    Moon,
    Info,
    RefreshCw,
    LogOut,
    Sliders,
    Building2,
    Palette,
    CheckCircle2,
    Monitor,
    Cloud,
    Lock,
    Cpu
} from "lucide-react";
import { LoadingScreen } from "@/components/ui/LoadingScreen";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function Page() {
    const { state, setState, updateRankingWeights, fetchMembers, disconnect, isLoading } = useGitHubApp();
    const [weights, setWeights] = useState(state.rankingWeights || { prs: 20, reviews: 15, commits: 2 });
    const [isSaving, setIsSaving] = useState(false);
    const [isDisconnecting, setIsDisconnecting] = useState(false);
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && !state.installed) {
            router.push("/connect");
        }
    }, [isLoading, state.installed, router]);

    if (isLoading) return <LoadingScreen />;
    if (!state.installed) return null;

    const handleSaveWeights = async () => {
        setIsSaving(true);
        try {
            updateRankingWeights(weights);
            await fetchMembers();
            toast.success("Ranking algorithm updated!");
        } catch (e) {
            toast.error("Failed to update ranking.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleDisconnect = async () => {
        setIsDisconnecting(true);
        try {
            await disconnect();
        } finally {
            setIsDisconnecting(false);
        }
    };

    return (
        <DashboardLayout>
            {/* Header */}
            <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-1">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-primary/10 rounded-2xl border border-primary/20 shadow-sm">
                            <Settings className="h-7 w-7 text-primary" />
                        </div>
                        <div>
                            <h1 className="text-3xl md:text-4xl font-black text-foreground tracking-tight">Settings</h1>
                            <p className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                                <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                                Customizing your organization experience
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <Tabs defaultValue="ranking" className="space-y-8">
                <div className="overflow-x-auto pb-2 no-scrollbar">
                    <TabsList className="bg-secondary/10 p-1.5 rounded-2xl border border-border/40 w-full sm:w-auto h-14 items-stretch">
                        <TabsTrigger value="ranking" className="flex-1 sm:flex-none gap-2 px-6 rounded-xl data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-lg transition-all font-black uppercase tracking-widest text-[10px]">
                            <Sliders className="h-3.5 w-3.5" /> Ranking Logic
                        </TabsTrigger>
                        <TabsTrigger value="organization" className="flex-1 sm:flex-none gap-2 px-6 rounded-xl data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-lg transition-all font-black uppercase tracking-widest text-[10px]">
                            <Building2 className="h-3.5 w-3.5" /> Infrastructure
                        </TabsTrigger>
                        <TabsTrigger value="appearance" className="flex-1 sm:flex-none gap-2 px-6 rounded-xl data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-lg transition-all font-black uppercase tracking-widest text-[10px]">
                            <Palette className="h-3.5 w-3.5" /> Visual Style
                        </TabsTrigger>
                    </TabsList>
                </div>

                {/* Ranking System */}
                <TabsContent value="ranking" className="animate-fade-in space-y-6 outline-none">
                    <div className="glass-card p-6 md:p-10 relative overflow-hidden group">
                         <div className="absolute -right-10 -top-10 p-8 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity pointer-events-none">
                            <Cpu className="h-64 w-64 rotate-12" />
                        </div>
                        
                        <div className="max-w-3xl relative z-10">
                            <h2 className="text-2xl font-black text-foreground mb-2 flex items-center gap-3 tracking-tight">
                                Ranking Engine
                                <span className="p-1 px-2 bg-primary/10 rounded font-black text-[10px] uppercase tracking-widest text-primary border border-primary/20 shadow-sm">v2.0 Active</span>
                            </h2>
                            <p className="text-muted-foreground text-sm mb-10 leading-relaxed font-medium">
                                Fine-tune the weights for each contribution type. These variables directly influence the 
                                <span className="text-foreground font-bold px-1.5">Fair Ranking</span> score calculated for every team member.
                            </p>

                            <div className="space-y-12">
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-1">
                                            <Label className="text-base font-black text-foreground tracking-tight">Pull Requests Weight</Label>
                                            <p className="text-xs text-muted-foreground">Rewards integration of new logic and features.</p>
                                        </div>
                                        <span className="text-lg font-black font-mono text-primary bg-primary/10 px-4 py-1.5 rounded-xl border border-primary/20 min-w-[3.5rem] text-center">{weights.prs}x</span>
                                    </div>
                                    <Slider
                                        value={[weights.prs]}
                                        max={50}
                                        step={1}
                                        className="py-4"
                                        onValueChange={([v]) => setWeights(prev => ({ ...prev, prs: v }))}
                                    />
                                </div>

                                <div className="space-y-6">
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-1">
                                            <Label className="text-base font-black text-foreground tracking-tight">Review Contributions</Label>
                                            <p className="text-xs text-muted-foreground">Rewards mentoring and code quality maintenance.</p>
                                        </div>
                                        <span className="text-lg font-black font-mono text-success bg-success/10 px-4 py-1.5 rounded-xl border border-success/20 min-w-[3.5rem] text-center">{weights.reviews}x</span>
                                    </div>
                                    <Slider
                                        value={[weights.reviews]}
                                        max={50}
                                        step={1}
                                        className="py-4"
                                        onValueChange={([v]) => setWeights(prev => ({ ...prev, reviews: v }))}
                                    />
                                </div>

                                <div className="space-y-6">
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-1">
                                            <Label className="text-base font-black text-foreground tracking-tight">Raw Commit Frequency</Label>
                                            <p className="text-xs text-muted-foreground">Baseline weight for development pulse.</p>
                                        </div>
                                        <span className="text-lg font-black font-mono text-warning bg-warning/10 px-4 py-1.5 rounded-xl border border-warning/20 min-w-[3.5rem] text-center">{weights.commits}x</span>
                                    </div>
                                    <Slider
                                        value={[weights.commits]}
                                        max={10}
                                        step={1}
                                        className="py-4"
                                        onValueChange={([v]) => setWeights(prev => ({ ...prev, commits: v }))}
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4 pt-12 mt-4 border-t border-border/40">
                                <Button 
                                    onClick={handleSaveWeights} 
                                    className="h-12 px-8 gap-2 bg-primary text-primary-foreground font-black shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all rounded-2xl"
                                    disabled={isSaving}
                                >
                                    {isSaving ? <RefreshCw className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
                                    <span className="uppercase tracking-widest text-[10px]">Save & Recalculate</span>
                                </Button>
                                <Button 
                                    variant="outline" 
                                    className="h-12 px-8 rounded-2xl font-black uppercase tracking-widest text-[10px] bg-secondary/10 border-border/40 hover:bg-secondary/20 transition-all" 
                                    onClick={() => setWeights({ prs: 20, reviews: 15, commits: 2 })}
                                    disabled={isSaving}
                                >
                                    Restore Defaults
                                </Button>
                            </div>
                        </div>
                    </div>
                </TabsContent>

                {/* Organization Details */}
                <TabsContent value="organization" className="animate-fade-in outline-none">
                    <div className="glass-card p-1 relative overflow-hidden group">
                        <div className="p-6 md:p-10 space-y-10">
                            <div>
                                <h2 className="text-2xl font-black text-foreground mb-2 tracking-tight">Infrastructure</h2>
                                <p className="text-muted-foreground text-sm font-medium">Manage your GitHub Enterprise connection and app status.</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="p-6 rounded-3xl bg-secondary/10 border border-border/40 group-hover:bg-secondary/20 transition-all">
                                    <div className="flex items-center gap-3 mb-4 opacity-60">
                                        <Building2 className="h-4 w-4" />
                                        <span className="text-[10px] font-black uppercase tracking-widest">Connected Org</span>
                                    </div>
                                    <p className="font-black text-2xl text-primary tracking-tight">@{state.selectedOrg || "None"}</p>
                                </div>
                                <div className="p-6 rounded-3xl bg-secondary/10 border border-border/40 group-hover:bg-secondary/20 transition-all">
                                    <div className="flex items-center gap-3 mb-4 opacity-60">
                                        <Cloud className="h-4 w-4" />
                                        <span className="text-[10px] font-black uppercase tracking-widest">Installation ID</span>
                                    </div>
                                    <p className="font-mono text-2xl text-foreground font-black tracking-tight">{state.installationId || "N/A"}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 p-5 rounded-2xl bg-primary/5 border border-primary/10 text-primary group/info">
                                <div className="p-2 bg-primary/10 rounded-xl group-hover/info:scale-110 transition-transform">
                                    <Lock className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-foreground">Zero-Storage Architecture</p>
                                    <p className="text-xs opacity-70 font-medium">Your organization data is temporarily cached in secure session storage. No repository content is ever stored.</p>
                                </div>
                            </div>

                            <div className="pt-10 border-t border-border/40 flex flex-col sm:flex-row justify-between items-center gap-6">
                                <div>
                                    <p className="text-base font-black text-foreground tracking-tight">External Connection</p>
                                    <p className="text-xs text-muted-foreground font-medium">The GitHub App currently has elevated privileges for code and member endpoints.</p>
                                </div>
                                <Button 
                                    variant="destructive" 
                                    className="h-12 px-8 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-destructive/20 hover:scale-[1.02] active:scale-95 transition-all gap-2" 
                                    onClick={handleDisconnect}
                                    disabled={isDisconnecting}
                                >
                                    {isDisconnecting ? <RefreshCw className="h-4 w-4 animate-spin" /> : <LogOut className="h-4 w-4" />}
                                    {isDisconnecting ? "Severing Connection..." : "Disconnect Organization"}
                                </Button>
                            </div>
                        </div>
                    </div>
                </TabsContent>

                {/* Appearance */}
                <TabsContent value="appearance" className="animate-fade-in outline-none">
                    <div className="glass-card p-6 md:p-10 relative overflow-hidden group">
                        <div className="max-w-3xl space-y-10">
                            <div>
                                <h2 className="text-2xl font-black text-foreground mb-2 tracking-tight">Interface Style</h2>
                                <p className="text-muted-foreground text-sm font-medium">Customizing how Kordian presents your infrastructure insights.</p>
                            </div>

                            <div className="flex items-center justify-between p-6 rounded-3xl bg-secondary/10 border border-border/40 hover:bg-secondary/20 transition-all group/switch">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-background rounded-xl shadow-sm border border-border/20 group-hover/switch:scale-110 transition-transform">
                                            <Moon className="h-4 w-4 text-primary" />
                                        </div>
                                        <Label className="text-base font-black text-foreground tracking-tight">Stealth Mode (Dark)</Label>
                                    </div>
                                    <p className="text-xs text-muted-foreground font-medium ml-9">Optimize the interface for low-light developer environments.</p>
                                </div>
                                <Switch
                                    checked={state.theme === 'dark'}
                                    className="data-[state=checked]:bg-primary"
                                    onCheckedChange={(checked) => {
                                        const newTheme = checked ? 'dark' : 'light';
                                        setState(prev => ({ ...prev, theme: newTheme }));
                                        localStorage.setItem('kordian_theme', newTheme);
                                    }}
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="p-5 rounded-2xl border border-border/40 bg-secondary/5 opacity-50 flex items-center gap-4 cursor-not-allowed group/item">
                                    <div className="p-2 bg-background rounded-xl border border-border/20">
                                        <Monitor className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Coming Soon</p>
                                        <p className="text-sm font-black text-foreground">Compact Layout</p>
                                    </div>
                                </div>
                                <div className="p-5 rounded-2xl border border-border/40 bg-secondary/5 opacity-50 flex items-center gap-4 cursor-not-allowed">
                                    <div className="p-2 bg-background rounded-xl border border-border/20">
                                        <Bell className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Coming Soon</p>
                                        <p className="text-sm font-black text-foreground">Accent Colors</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </TabsContent>
            </Tabs>
        </DashboardLayout>
    );
}

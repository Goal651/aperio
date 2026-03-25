"use client";

import { 
    Github, 
    Shield, 
    Lock, 
    Zap, 
    ArrowRight, 
    Loader2, 
    CheckCircle, 
    Plus, 
    AlertCircle, 
    RefreshCw, 
    XCircle, 
    Building2, 
    Users, 
    GitBranch, 
    Award, 
    PieChart, 
    Target, 
    Globe, 
    Sparkles,
    BarChart3,
    Layers,
    Terminal,
    Cpu,
    ShieldCheck,
    Container,
    LayoutDashboard
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useGitHubApp } from "@/hooks/useGitHubAuth";
import { OrganizationSelector } from "@/components/OrganizationSelector";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Alert, AlertDescription } from "@/components/ui/alert";

const enterpriseFeatures = [
    {
        icon: ShieldCheck,
        title: "Enterprise Security",
        description: "Unified posture monitoring across elite engineering teams.",
        badge: "Tier 1",
        metrics: ["Vulnerability Scan", "Secret Guard", "Policy Audit"],
        color: "text-primary"
    },
    {
        icon: BarChart3,
        title: "Engineering Vitals",
        description: "High-fidelity insights on architectural velocity and health.",
        badge: "Real-time",
        metrics: ["Flow Metrics", "Quality Index", "DORA Trends"],
        color: "text-blue-400"
    },
    {
        icon: Lock,
        title: "Stateless Security",
        description: "Your IP remains local. Zero data retention architecture.",
        badge: "GDPR Ready",
        metrics: ["Ephemeral Compute", "No Persistence", "Local Encryption"],
        color: "text-purple-400"
    },
    {
        icon: LayoutDashboard,
        title: "Unified Intelligence",
        description: "A single command center for 50+ scaled repositories.",
        badge: "Centralized",
        metrics: ["Cross-stack", "Multi-team", "Executive View"],
        color: "text-indigo-400"
    },
];

const getErrorDescription = (error: string) => {
    const errorMessages: Record<string, string> = {
        'missing_credentials': 'GitHub environment variables not provisioned.',
        'token_exchange_failed': 'Secure handshake with GitHub Enterprise failed.',
        'no_access_token': 'Identity provider rejected request. Check permissions.',
        'user_info_failed': 'Failed to resolve organization metadata.',
        'installations_failed': 'Could not discover existing installations.',
        'orgs_failed': 'Organization index inaccessible. Verify token scopes.',
        'invalid_token': 'Authentication session expired. Re-handshake required.',
        'server_error': 'Internal protocol error. Engineering has been alerted.',
        'no_code': 'Missing authorization code from GitHub callback.',
        'access_denied': 'Access denied. Required: read:org, read:repo.',
        'default': 'System connection error. Please initialize again.'
    };
    
    return errorMessages[error] || errorMessages.default;
};

export default function Page() {
    const router = useRouter();
    const { state, selectOrg, fetchOrgData, installApp, installToOrganization, isLoading, getUserInstallations, loadingStates } = useGitHubApp();
    const [manualId, setManualId] = useState("");
    const [showManualInput, setShowManualInput] = useState(false);
    const [isRedirecting, setIsRedirecting] = useState(false);
    const [isConnecting, setIsConnecting] = useState(false);
    const [authError, setAuthError] = useState<string | null>(null);

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const error = urlParams.get('error');
        
        if (error) {
            setAuthError(error);
            window.history.replaceState({}, '', window.location.pathname);
        }
    }, []);

    useEffect(() => {
        if (state.installed && state.selectedOrg && !isConnecting && !isRedirecting) {
            setIsRedirecting(true);
            router.push("/");
        }
    }, [state.installed, state.selectedOrg, router, isConnecting, isRedirecting]);

    const handleConnect = async () => {
        setIsConnecting(true);
        await installApp();
    };

    const handleManualConnect = () => {
        if (!manualId) return;
        selectOrg("Loading...", parseInt(manualId));
        setTimeout(() => {
            fetchOrgData(true);
            router.push("/");
        }, 100);
    };

    if (isLoading || loadingStates.fetchingOrgData) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center p-6 sm:p-12 relative overflow-hidden">
                <div className="hero-glow fixed inset-0 pointer-events-none opacity-40" />
                <div className="relative text-center glass-card p-12 max-w-md animate-glow border-primary/20 shadow-2xl">
                    <div className="relative mb-8">
                        <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full" />
                        <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto relative z-10" />
                    </div>
                    <h2 className="text-2xl font-black text-foreground tracking-tight mb-3">
                        {isConnecting ? 'Initializing Handshake' : 
                         loadingStates.fetchingOrgData ? 'Synchronizing Data' : 
                         'Verifying Identity'}
                    </h2>
                    <p className="text-muted-foreground text-sm font-medium leading-relaxed">
                        {isConnecting 
                            ? 'Establishing secure connection with your GitHub infrastructure.'
                            : loadingStates.fetchingOrgData
                                ? 'Parsing repository metadata and security audit logs.'
                                : 'Mapping existing GitHub App installations.'
                        }
                    </p>
                </div>
            </div>
        );
    }

    if (state.installationStatus === 'installed' && state.installations.length > 0 && !state.selectedOrg) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center p-6 sm:p-12 relative overflow-hidden no-scrollbar overflow-y-auto">
                <div className="hero-glow fixed inset-0 pointer-events-none opacity-40" />
                <div className="relative w-full py-12">
                    <OrganizationSelector />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black flex justify-center p-6 sm:p-12 relative overflow-x-hidden no-scrollbar overflow-y-auto">
            {/* Animated Background Elements */}
            <div className="hero-glow fixed inset-0 pointer-events-none opacity-40" />
            <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] animate-pulse pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[100px] animate-pulse pointer-events-none" style={{ animationDelay: '1s' }} />

            <div className="relative w-full max-w-5xl z-20 flex flex-col items-center">
                
                {/* Hero Section */}
                <div className="text-center mb-16 animate-fade-in py-12 md:py-20 w-full">
                    <div className="inline-flex items-center justify-center h-20 w-20 rounded-[2.5rem] bg-black border-2 border-primary/20 mb-8 animate-glow shadow-2xl shadow-primary/10 relative group">
                        <div className="absolute inset-0 bg-primary/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity rounded-full" />
                        <Building2 className="h-10 w-10 text-primary relative z-10 transition-transform group-hover:scale-110" />
                    </div>
                    <h1 className="text-4xl md:text-7xl font-black text-white mb-6 tracking-tighter leading-[0.9] text-balance">
                        Engineering Intelligence <br /> <span className="text-primary italic opacity-90">Decentralized</span>
                    </h1>
                    <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto font-medium leading-relaxed px-4">
                        Unified visualization of security, productivity, and health across your entire team infrastructure. Stateless by design.
                    </p>
                    
                    {/* Compliance Badges */}
                    <div className="flex flex-wrap items-center justify-center gap-3 mt-10">
                        <div className="flex items-center gap-2 px-4 py-2 bg-secondary/10 border border-primary/20 rounded-full text-[10px] font-black uppercase tracking-widest text-primary shadow-sm">
                            <Shield className="h-3 w-3" /> SOC2 COMPLIANT
                        </div>
                        <div className="flex items-center gap-2 px-4 py-2 bg-secondary/10 border border-blue-500/20 rounded-full text-[10px] font-black uppercase tracking-widest text-blue-400 shadow-sm">
                            <Globe className="h-3 w-3" /> GDPR READY
                        </div>
                        <div className="flex items-center gap-2 px-4 py-2 bg-secondary/10 border border-purple-500/20 rounded-full text-[10px] font-black uppercase tracking-widest text-purple-400 shadow-sm">
                            <Lock className="h-3 w-3" /> ZERO RETENTION
                        </div>
                    </div>
                </div>

                {/* Error Banner */}
                {authError && (
                    <div className="w-full mb-10 max-w-3xl animate-fade-in shadow-2xl">
                        <Alert className="border-destructive/30 bg-destructive/5 backdrop-blur-xl rounded-3xl p-6">
                            <div className="flex flex-col sm:flex-row items-center gap-6 justify-between w-full">
                                <div className="flex items-center gap-4 text-center sm:text-left">
                                    <div className="p-3 bg-destructive/10 rounded-2xl">
                                        <XCircle className="h-6 w-6 text-destructive" />
                                    </div>
                                    <div>
                                        <h4 className="font-black text-foreground tracking-tight">Security Handshake Failed</h4>
                                        <p className="text-muted-foreground text-sm font-medium">{getErrorDescription(authError)}</p>
                                    </div>
                                </div>
                                <div className="flex gap-3 shrink-0">
                                    <Button 
                                        variant="outline" 
                                        size="sm" 
                                        onClick={() => handleConnect()}
                                        className="h-10 px-6 rounded-xl border-destructive/20 text-destructive hover:bg-destructive shadow-lg transition-all"
                                    >
                                        Reconnect
                                    </Button>
                                    <Button 
                                        variant="ghost" 
                                        size="sm" 
                                        onClick={() => setAuthError(null)}
                                        className="h-10 px-4 text-muted-foreground"
                                    >
                                        Dismiss
                                    </Button>
                                </div>
                            </div>
                        </Alert>
                    </div>
                )}

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12 w-full max-w-5xl">
                    {enterpriseFeatures.map((feature, index) => (
                        <div key={index} className="glass-card p-8 md:p-10 group relative overflow-hidden animate-fade-in" style={{ animationDelay: `${0.1 * index}s` }}>
                            <div className="absolute -right-8 -top-8 p-12 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity pointer-events-none">
                                <feature.icon className="h-40 w-40 rotate-12" />
                            </div>
                            
                            <div className="flex items-start justify-between mb-8">
                                <div className="flex items-center gap-4">
                                    <div className={`p-4 bg-secondary/20 rounded-2xl group-hover:scale-110 group-hover:bg-primary/10 transition-all border border-border/40 ${feature.color}`}>
                                        <feature.icon className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-black text-foreground tracking-tight group-hover:text-primary transition-colors">{feature.title}</h3>
                                        <span className="text-[9px] font-black uppercase tracking-[0.2em] opacity-40">Protocol Feature</span>
                                    </div>
                                </div>
                                <Badge variant="secondary" className="px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest bg-primary/10 text-primary border border-primary/20 shadow-sm">
                                    {feature.badge}
                                </Badge>
                            </div>
                            
                            <p className="text-sm text-muted-foreground mb-8 leading-relaxed font-medium">
                                {feature.description}
                            </p>
                            
                            <div className="flex flex-wrap gap-2 pt-6 border-t border-border/20">
                                {feature.metrics.map((metric, i) => (
                                    <span key={i} className="text-[10px] font-bold bg-secondary/20 px-3 py-1 rounded-lg text-foreground/60 border border-border/20 flex items-center gap-1.5">
                                        <Zap className="h-2 w-2 text-primary" />
                                        {metric}
                                    </span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Main Action Call */}
                <div className="w-full max-w-md text-center py-12 animate-fade-in" style={{ animationDelay: "0.4s" }}>
                    <Button 
                        onClick={handleConnect} 
                        variant="glow" 
                        size="lg" 
                        className="w-full h-20 text-xl font-black rounded-[2rem] bg-primary text-primary-foreground group mb-6 shadow-2xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all gap-4 relative overflow-hidden"
                        disabled={isConnecting || isLoading || loadingStates.fetchingOrgData}
                    >
                        {isConnecting ? (
                            <>
                                <Loader2 className="h-6 w-6 animate-spin" />
                                Provisioning...
                            </>
                        ) : (
                            <>
                                <Github className="h-7 w-7" />
                                <span className="uppercase tracking-[0.1em]">Connect Infrastructure</span>
                                <ArrowRight className="h-6 w-6 transition-transform group-hover:translate-x-2" />
                            </>
                        )}
                        <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                    </Button>
                    
                    <div className="space-y-4">
                        <p className="text-[11px] text-muted-foreground font-black uppercase tracking-[0.2em] px-4 opacity-60">
                            Enterprise read access only. No source code storage. 
                        </p>
                        <button 
                            onClick={() => setShowManualInput(!showManualInput)}
                            className="text-primary hover:text-primary/80 font-black uppercase tracking-widest text-[10px] underline underline-offset-4 decoration-primary/30 transition-colors"
                        >
                            Developer Manual Installation
                        </button>
                    </div>

                    {showManualInput && (
                        <div className="mt-8 p-6 glass-card animate-slide-up">
                            <div className="flex gap-3">
                                <Input
                                    type="text"
                                    placeholder="GH_INSTALLATION_ID"
                                    value={manualId}
                                    onChange={(e) => setManualId(e.target.value)}
                                    className="h-12 bg-secondary/10 border-border/40 focus:border-primary/50 rounded-2xl font-mono text-sm tracking-wider"
                                />
                                <Button onClick={handleManualConnect} variant="glow" className="h-12 w-12 rounded-2xl bg-primary shadow-lg shadow-primary/20 p-0">
                                    <ArrowRight className="h-5 w-5" />
                                </Button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer Section */}
                <div className="w-full text-center mt-12 pb-24 opacity-60 flex flex-col items-center gap-6 animate-fade-in" style={{ animationDelay: "0.5s" }}>
                    <div className="h-px w-32 bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
                    <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground">
                        <span className="flex items-center gap-2"><Cpu className="h-3.5 w-3.5" /> Edge Validated</span>
                        <span className="flex items-center gap-2"><Container className="h-3.5 w-3.5" /> Isolated Runtime</span>
                        <span className="flex items-center gap-2"><ShieldCheck className="h-3.5 w-3.5" /> Tier 1 Encryption</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
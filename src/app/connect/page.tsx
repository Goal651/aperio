"use client";

import { Github, Shield, Lock, Zap, ArrowRight, Loader2, CheckCircle, Plus, AlertCircle, RefreshCw, XCircle, Building2, Users, GitBranch, Award, PieChart, Target, Globe, Sparkles } from "lucide-react";
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
        icon: Shield,
        title: "Enterprise Security",
        description: "Unified view of security alerts across all your teams",
        badge: "SOC2 Ready",
        metrics: ["Dependabot", "Code Scanning", "Secret Scanning"]
    },
    {
        icon: Building2,
        title: "Team Performance",
        description: "Data-driven insights on engineering productivity",
        badge: "Fair Ranking",
        metrics: ["PR Velocity", "Review Quality", "Code Ownership"]
    },
    {
        icon: Lock,
        title: "Zero Data Retention",
        description: "Your code never touches our servers",
        badge: "GDPR Compliant",
        metrics: ["Stateless", "No Storage", "Ephemeral"]
    },
    {
        icon: PieChart,
        title: "Org-wide Dashboard",
        description: "One unified view of 50+ repositories",
        badge: "Real-time",
        metrics: ["Cross-team", "Filterable", "Exportable"]
    },
];

const trustedCompanies = [
    { name: "Fintech Corp", size: "250+ repos" },
    { name: "DevOps Platform", size: "100+ engineers" },
    { name: "SaaS Provider", size: "50+ teams" }
];

const getErrorDescription = (error: string) => {
    const errorMessages: Record<string, string> = {
        'missing_credentials': 'GitHub OAuth credentials are not configured. Please contact your admin.',
        'token_exchange_failed': 'Failed to connect to GitHub Enterprise. Please try again.',
        'no_access_token': 'No access token received. Please check GitHub App permissions.',
        'user_info_failed': 'Failed to get organization information from GitHub.',
        'installations_failed': 'Failed to get GitHub installations. Check app permissions.',
        'orgs_failed': 'Failed to get organizations. Verify GitHub Enterprise access.',
        'invalid_token': 'Session expired. Please reconnect.',
        'server_error': 'Server error. Our team has been notified.',
        'no_code': 'No authorization code received.',
        'access_denied': 'Access denied. Required: read:org, read:repo permissions.',
        'default': 'Connection error. Please try again.'
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

    // Check for OAuth errors in URL
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
            router.push("/"); // dashboard page
        }
    }, [state.installed, state.selectedOrg, router, isConnecting, isRedirecting]);

    const handleConnect = async () => {
        setIsConnecting(true);
        await installApp();
    };

    const handleSelectOrganization = (org: any) => {
        setIsRedirecting(true);
        if (org.hasApp && org.installation) {
            selectOrg(org.login, org.installation.installationId);
            setTimeout(() => {
                fetchOrgData(true);
                router.push("/");
            }, 100);
        } else {
            installToOrganization();
        }
    };

    const handleManualConnect = () => {
        if (!manualId) return;
        selectOrg("Loading...", parseInt(manualId));
        setTimeout(() => {
            fetchOrgData(true);
            router.push("/");
        }, 100);
    };

    // Show loading while checking installations or connecting
    if (isLoading || loadingStates.fetchingOrgData) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center p-4">
                <div className="hero-glow fixed inset-0 pointer-events-none" />
                <div className="relative text-center glass-card p-8 max-w-md">
                    <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
                    <h2 className="text-xl font-semibold text-foreground mb-2">
                        {isConnecting ? 'Connecting to GitHub Enterprise...' : 
                         loadingStates.fetchingOrgData ? 'Loading organization data...' : 
                         'Checking installations...'}
                    </h2>
                    <p className="text-muted-foreground text-sm">
                        {isConnecting 
                            ? 'Please wait while we connect to your GitHub organization.'
                            : loadingStates.fetchingOrgData
                                ? 'Fetching repositories and security data...'
                                : 'Verifying GitHub App installation.'
                        }
                    </p>
                </div>
            </div>
        );
    }

    // If we have installations but none selected, show the organization selector
    if (state.installationStatus === 'installed' && state.installations.length > 0 && !state.selectedOrg) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center p-4">
                <div className="hero-glow fixed inset-0 pointer-events-none" />
                <OrganizationSelector />
            </div>
        );
    }

    // If no installations found, show the main connect page
    return (
        <div className="h-screen overflow-auto bg-black flex  justify-center p-4 ">
            <div className="hero-glow fixed inset-0 pointer-events-none" />
            
            <div className="relative w-full max-w-4xl z-20 ">
                {/* Logo and heading - B2B focused */}
                <div className="text-center mb-8 animate-fade-in">
                    <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-black border border-black mb-6 animate-glow">
                        <Building2 className="h-8 w-8 text-green-500" />
                    </div>
                    <h1 className="text-4xl font-bold text-white mb-4 leading-tight">
                        GitHub Organization Intelligence <br /> for Engineering Leaders
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        A privacy-first dashboard that gives you a unified view of security, productivity, and collaboration across all your teams.
                    </p>
                    
                    {/* Trust badges */}
                    <div className="flex flex-wrap items-center justify-center gap-4 mt-4">
                        <Badge variant="outline" className="bg-black/40 border-green-500/20 text-green-400">
                            <Shield className="h-3 w-3 mr-1" /> SOC2 Ready
                        </Badge>
                        <Badge variant="outline" className="bg-black/40 border-blue-500/20 text-blue-400">
                            <Globe className="h-3 w-3 mr-1" /> GDPR Compliant
                        </Badge>
                        <Badge variant="outline" className="bg-black/40 border-purple-500/20 text-purple-400">
                            <Lock className="h-3 w-3 mr-1" /> Zero Data Retention
                        </Badge>
                    </div>
                </div>

                {/* Error Display */}
                {authError && (
                    <Alert className="mb-6 border-red-200 bg-red-950/50 border-red-800/50">
                        <XCircle className="h-4 w-4 text-red-400" />
                        <AlertDescription className="text-red-300">
                            <div className="flex items-center justify-between">
                                <div>
                                    <strong>Connection Error:</strong> {getErrorDescription(authError)}
                                </div>
                                <div className="flex gap-2">
                                    {authError === 'invalid_token' && (
                                        <Button 
                                            variant="outline" 
                                            size="sm" 
                                            onClick={() => {
                                                setAuthError(null);
                                                handleConnect();
                                            }}
                                            className="border-red-800 text-red-300 hover:bg-red-950"
                                        >
                                            Reconnect
                                        </Button>
                                    )}
                                    <Button 
                                        variant="outline" 
                                        size="sm" 
                                        onClick={() => setAuthError(null)}
                                        className="border-red-800 text-red-300 hover:bg-red-950"
                                    >
                                        Dismiss
                                    </Button>
                                </div>
                            </div>
                        </AlertDescription>
                    </Alert>
                )}

                {/* Enterprise Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                    {enterpriseFeatures.map((feature, index) => (
                        <div key={index} className="p-5 rounded-lg bg-card border border-border hover:border-green-600/20 transition-all">
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center gap-2">
                                    <feature.icon className="h-5 w-5 text-green-500" />
                                    <h3 className="font-semibold text-foreground">{feature.title}</h3>
                                </div>
                                <Badge variant="secondary" className="text-xs bg-green-950/30 text-green-400 border-green-800/50">
                                    {feature.badge}
                                </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-3">{feature.description}</p>
                            <div className="flex flex-wrap gap-2">
                                {feature.metrics.map((metric, i) => (
                                    <span key={i} className="text-xs bg-black/30 px-2 py-1 rounded-full text-gray-400">
                                        {metric}
                                    </span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Value proposition for enterprises */}
                <Card className="mb-8 bg-gradient-to-r from-green-950/20 to-black border-green-800/30">
                    <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row items-center gap-6">
                            <div className="flex-1">
                                <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
                                    <Sparkles className="h-5 w-5 text-green-500" />
                                    Built for scale
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                    Used by engineering teams managing 50+ repositories. Get insights across your entire organization without storing any data.
                                </p>
                                <div className="flex items-center gap-4 mt-4">
                                    <div className="flex items-center gap-2">
                                        <Users className="h-4 w-4 text-green-500" />
                                        <span className="text-xs text-gray-400">100+ team members</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <GitBranch className="h-4 w-4 text-green-500" />
                                        <span className="text-xs text-gray-400">50+ repositories</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col gap-2">
                                {trustedCompanies.map((company, i) => (
                                    <div key={i} className="flex items-center gap-2 text-xs">
                                        <CheckCircle className="h-3 w-3 text-green-500" />
                                        <span className="text-gray-300">{company.name}</span>
                                        <span className="text-gray-500">• {company.size}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Connect button with B2B messaging */}
                <div className="text-center">
                    <Button 
                        onClick={handleConnect} 
                        variant="glow" 
                        size="lg" 
                        className="w-full md:w-auto min-w-[300px] h-14 text-gray-300 bg-black/20 hover:bg-black/80 group mb-4 shadow-lg border-green-500/20"
                        disabled={isConnecting || isLoading || loadingStates.fetchingOrgData}
                    >
                        {isConnecting ? (
                            <>
                                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                                Connecting to GitHub...
                            </>
                        ) : isLoading || loadingStates.fetchingOrgData ? (
                            <>
                                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                                Checking installations...
                            </>
                        ) : (
                            <>
                                <Building2 className="h-5 w-5 mr-2" />
                                Connect GitHub Organization
                                <ArrowRight className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1" />
                            </>
                        )}
                    </Button>
                    
                    <p className="text-xs text-muted-foreground max-w-md mx-auto">
                        Only requires read access to repositories and organizations. 
                        <button 
                            onClick={() => setShowManualInput(!showManualInput)}
                            className="text-green-500 hover:text-green-400 ml-1 underline decoration-dotted"
                        >
                            Manual installation?
                        </button>
                    </p>
                </div>

                {/* Manual installation input */}
                {showManualInput && (
                    <div className="mt-4 max-w-md mx-auto animate-fade-in">
                        <div className="flex gap-2">
                            <Input
                                type="text"
                                placeholder="Installation ID"
                                value={manualId}
                                onChange={(e) => setManualId(e.target.value)}
                                className="bg-black/50 border-border"
                            />
                            <Button onClick={handleManualConnect} variant="secondary">
                                <ArrowRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                )}

                {/* Footer */}
                <p className="text-xs text-muted-foreground text-center mt-8 pb-20 animate-fade-in" style={{ animationDelay: "0.5s" }}>
                    Enterprise-ready • No data storage • Real-time insights • Built for engineering leaders
                </p>
            </div>
        </div>
    );
}
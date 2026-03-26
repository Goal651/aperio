"use client";

import { useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useGitHubApp } from '@/hooks/useGitHubAuth';

function SetupContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { selectOrg } = useGitHubApp();

  useEffect(() => {
    if (!searchParams) return;
    const installationId = searchParams.get('installation_id');
    const setupAction = searchParams.get('setup_action');

    if (installationId && setupAction === 'install') {
        // Fetch real org name first
        fetch('/api/github/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ installationId: Number(installationId) })
        })
        .then(res => res.json())
        .then(({ org, accountType }) => {
            selectOrg(org || 'default-org', Number(installationId), accountType);
            router.push('/');
        })
        .catch(() => router.push('/connect'));
    } else {
        router.push('/connect');
    }
}, [searchParams, selectOrg, router]);

    return (
        <div className="min-h-screen flex items-center justify-center">
            <p>Setting up your GitHub App… Redirecting home…</p>
        </div>
    );
}

export default function Page() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center">Loading...</div>}>
            <SetupContent />
        </Suspense>
    );
}

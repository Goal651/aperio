# GitGuard - Security & Productivity Dashboard

GitGuard is a powerful, stateless dashboard for GitHub Organizations, built with Next.js and the App Router. It provides a comprehensive overview of your organization's security posture, member contributions, and repository health.

## Key Features

- **🛡️ Security Overview**: Real-time monitoring of security alerts, including secret scanning and Dependabot alerts.
- **👥 Team Analytics**: Detailed metrics on member contributions, pull requests, and code reviews.
- **📦 Repository Health**: Unified view of project status, visibility, and activity across all repositories.
- **✅ Compliance Tracking**: Monitor adherence to best practices, CI/CD health, and branch protection policies.
- **🔒 Stateless & Secure**: No data is stored. Authentication is handled via GitHub Apps with tokens generated on-the-fly.

## Technology Stack

- **Framework**: [Next.js 15+](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [Shadcn UI](https://ui.shadcn.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Data Fetching**: [TanStack Query](https://tanstack.com/query/latest)
- **Charts**: [Recharts](https://recharts.org/)

## Getting Started

### 1. Prerequisites

- Node.js 18.x or later
- A GitHub Organization

### 2. Create a GitHub App

1. Go to your Organization Settings > Developer Settings > GitHub Apps > **New GitHub App**.
2. **App Name**: e.g., `GitGuard Dashboard`.
3. **Homepage URL**: Your production URL (or `http://localhost:3000` for dev).
4. **Callback URL**: `http://localhost:3000/auth/callback`.
5. **Setup URL**: `http://localhost:3000/setup`.
6. **Permissions**:
   - **Repository permissions**:
     - Administration: Read
     - Contents: Read
     - Metadata: Read
     - Dependabot alerts: Read
     - Secret scanning alerts: Read
   - **Organization permissions**:
     - Members: Read
7. Generate a **Private Key** and download it.
8. Take note of your **App ID**, **Client ID**, and **Client Secret**.

### 3. Installation

```bash
git clone https://github.com/your-username/github-compass.git
cd github-compass
npm install
```

### 4. Environment Variables

Create a `.env.local` file in the root directory:

```env
GITHUB_APP_ID=your_app_id
GITHUB_CLIENT_ID=your_client_id
GITHUB_CLIENT_SECRET=your_client_secret
GITHUB_PRIVATE_KEY="-----BEGIN RSA PRIVATE KEY-----\n...\n-----END RSA PRIVATE KEY-----"

# Public (Client-side)
NEXT_PUBLIC_GITHUB_CLIENT_ID=your_client_id
```

### 5. Run the App

```bash
npm run dev
```

Visit `http://localhost:3000` and click "Connect Your Organization".

## Deployment

Deploy easily on [Vercel](https://vercel.com/):

1. Push your code to GitHub.
2. Import the project in Vercel.
3. Add your environment variables in the Vercel Dashboard.
4. Deploy!

## License

MIT

# GitGuard 🛡️

GitGuard is a powerful, real-time dashboard for managing and visualizing your GitHub organization's health, security, and member activity. It provides a deeper layer of analytics on top of your existing GitHub data, focusing on security compliance and contribution metrics.

![GitGuard Dashboard](https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=2000)

## ✨ Features

- **Real-time Analytics**: View up-to-the-minute stats on repositories, pull requests, and commits.
- **Fair Ranking Algorithm**: A flexible scoring system to evaluate team member contributions based on PRs, reviews, and commits.
- **Security Compliance**: Track automated compliance checks, including Dependsbot status, secret scanning, and code scanning alerts.
- **Repo Health Cards**: Quickly identify repositories that need attention (Warning/Critical status).
- **Interactive Dashboards**:
  - **Repositories**: Filter by health status, search by name, and view detailed metrics.
  - **Members**: Analyze team contribution velocity and search for specific members.
  - **Security**: Filter vulnerability alerts by severity and type.

## 🛠️ Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Directory)
- **Language**: TypeScript
- **Styling**: Tailwind CSS & `shadcn/ui` (Radix Primitives)
- **Charts**: Recharts
- **Icons**: Lucide React
- **API**: GitHub REST & GraphQL API
- **State Management**: React Context + LocalStorage Persistence

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- A GitHub App configured with the following permissions:
  - **Repository**: Read-only (Contents, Metadata, Pull Requests, Security alerts)
  - **Organization**: Read-only (Members)

### Installation

1. **Clone the repository**:

    ```bash
    git clone https://github.com/your-username/github-compass.git
    cd github-compass
    ```

2. **Install dependencies**:

    ```bash
    npm install
    # or
    pnpm install
    ```

3. **Environment Setup**:
    Create a `.env.local` file in the root directory and add your GitHub App credentials:

    ```env
    # Optional: Only needed for backend token exchange if using server-side auth
    GITHUB_APP_ID=your_app_id
    GITHUB_APP_PRIVATE_KEY=your_private_key
    ```

    *Note: The current version uses a client-side centric approach with a backend token proxy.*

4. **Run the development server**:

    ```bash
    npm run dev
    ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📖 Usage

### Connecting Your Organization

1. Click the **"Connect"** button on the landing page.
2. You will be redirected to GitHub to install the GitGuard App on your organization.
3. Once installed, you'll be redirected back to the dashboard.
4. If you are already installed but redirected to settings, use the **"Manual Connect"** option and enter your Installation ID found in the URL.

### Configuring Ranking Weights

Go to **Settings > Ranking System** to adjust the weights for:

- **PRs**: Weight for opening pull requests.
- **Reviews**: Weight for reviewing code.
- **Commits**: Weight for individual commits.

These settings are saved locally and affect how the "Activity Score" is calculated across the app.

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for details on how to get started.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

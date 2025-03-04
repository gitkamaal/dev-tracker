# Dev Tracker

A professional accomplishment tracking tool that helps users connect external accounts (GitHub, Atlassian) and compile their contributions for performance reviews.

## Purpose

Dev Tracker simplifies the process of preparing for mid-year and year-end reviews by automatically aggregating your professional contributions across various platforms. It categorizes these accomplishments according to the five core competencies:

- Be Candid
- Build Expertise
- Cultivate Difference
- Drive Outcomes
- Develop Others

## Features

- Connect to external platforms (GitHub, Atlassian - Jira, Confluence, Bitbucket)
- View a unified timeline of contributions across all platforms
- Automatically categorize contributions by competency
- Generate customized "brag sheets" for performance reviews
- Export reports in various formats (PDF, Markdown)

## Tech Stack

- **Frontend**: Next.js, TypeScript, Tailwind CSS, shadcn/ui
- **Authentication**: OAuth 2.0 for external services

## Project Structure

```
dev-tracker/
├── client/                 # Frontend Next.js application
│   ├── app/                # Next.js App Router
│   ├── components/         # Reusable UI components
│   │   └── ui/             # shadcn/ui components
│   ├── lib/                # Utility functions and shared code
│   ├── hooks/              # Custom React hooks
│   ├── types/              # TypeScript type definitions
│   └── public/             # Static assets
├── server/                 # Backend Node.js application
│   ├── config/             # Configuration files
│   ├── controllers/        # Request handlers
│   ├── models/             # Database models
│   ├── routes/             # API routes
│   ├── services/           # Business logic
│   └── utils/              # Utility functions
├── docs/                   # Documentation
└── features.md             # Detailed feature specifications
```

## Getting Started

### Prerequisites

- Node.js (v16+)
- npm or yarn
- GitHub OAuth App credentials
- Atlassian OAuth App credentials

### Installation

1. Clone the repository:

   ```
   git clone https://github.com/yourusername/dev-tracker.git
   cd dev-tracker
   ```

2. Install dependencies:

   ```
   npm install
   # or
   yarn install
   ```

3. Set up environment variables:
   - Copy the `.env.example` file to `.env.local`:
     ```
     cp .env.example .env.local
     ```
   - Edit `.env.local` and add your OAuth credentials (see Environment Variables section below)

4. Start the development server:

   ```
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Environment Variables

The application uses the following environment variables:

### GitHub OAuth

1. Create a GitHub OAuth App at [GitHub Developer Settings](https://github.com/settings/developers)
2. Set the Authorization callback URL to `http://localhost:3000/api/auth/callback/github`
3. Add the following to your `.env.local` file:
   ```
   NEXT_PUBLIC_GITHUB_CLIENT_ID=your_github_client_id
   GITHUB_CLIENT_SECRET=your_github_client_secret
   NEXT_PUBLIC_GITHUB_REDIRECT_URI=http://localhost:3000/api/auth/callback/github
   ```

### Atlassian OAuth

1. Create an Atlassian OAuth App at [Atlassian Developer Console](https://developer.atlassian.com/console/myapps/)
2. Set the Authorization callback URL to `http://localhost:3000/auth/jira/complete`
3. Add the following to your `.env.local` file:
   ```
   NEXT_PUBLIC_JIRA_CLIENT_ID=your_jira_client_id
   JIRA_CLIENT_SECRET=your_jira_client_secret
   NEXT_PUBLIC_JIRA_REDIRECT_URI=http://localhost:3000/auth/jira/complete
   ```

### Application URL

Set the application URL for server-side operations:
```
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Development Workflow

1. Create a new branch for each feature or bug fix
2. Write tests for new functionality
3. Submit a pull request for review
4. Ensure CI checks pass before merging

## License

This project is licensed under the MIT License - see the LICENSE file for details.

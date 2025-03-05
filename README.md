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
- **Authentication**: Personal Access Tokens for external services

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
- GitHub Personal Access Token
- Atlassian API Token

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

3. Start the development server:

   ```
   npm run dev
   # or
   yarn dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Personal Access Tokens

The application uses personal access tokens for authentication with external services:

### GitHub Personal Access Token

1. Go to [GitHub Developer Settings](https://github.com/settings/tokens)
2. Click "Generate new token" (classic)
3. Give your token a descriptive name
4. Select the following scopes:
   - `repo` (all)
   - `user` (all)
5. Click "Generate token"
6. Copy the token and paste it into the application when connecting your GitHub account

### Atlassian API Token

1. Go to [Atlassian API Tokens](https://id.atlassian.com/manage-profile/security/api-tokens)
2. Click "Create API token"
3. Give your token a descriptive name
4. Click "Create"
5. Copy the token and paste it into the application when connecting your Atlassian account

## Development Workflow

1. Create a new branch for each feature or bug fix
2. Write tests for new functionality
3. Submit a pull request for review
4. Ensure CI checks pass before merging

## License

This project is licensed under the MIT License - see the LICENSE file for details.

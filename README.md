# Dev Tracker

A professional accomplishment tracking tool that helps users connect external accounts (GitHub, Bitbucket, Jira, Confluence) and compile their contributions for performance reviews.

## Purpose

Dev Tracker simplifies the process of preparing for mid-year and year-end reviews by automatically aggregating your professional contributions across various platforms. It categorizes these accomplishments according to the five core competencies:

- Be Candid
- Build Expertise
- Cultivate Difference
- Drive Outcomes
- Develop Others

## Features

- Connect to external platforms (GitHub, Bitbucket, Jira, Confluence)
- View a unified timeline of contributions across all platforms
- Automatically categorize contributions by competency
- Generate customized "brag sheets" for performance reviews
- Export reports in various formats (PDF, Markdown)

## Tech Stack

- **Frontend**: Next.js, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Node.js, Express
- **Database**: PostgreSQL
- **Authentication**: NextAuth.js, OAuth 2.0 for external services

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
- PostgreSQL

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/dev-tracker.git
   cd dev-tracker
   ```

2. Install dependencies:
   ```
   # Install server dependencies
   cd server
   npm install

   # Install client dependencies
   cd ../client
   npm install
   ```

3. Set up environment variables:
   - Create `.env` files in both `client` and `server` directories based on the provided `.env.example` files

4. Set up the database:
   ```
   # From the server directory
   npm run db:setup
   ```

5. Start the development servers:
   ```
   # Start the backend server (from server directory)
   npm run dev

   # Start the frontend server (from client directory)
   npm run dev
   ```

## Development Workflow

1. Create a new branch for each feature or bug fix
2. Write tests for new functionality
3. Submit a pull request for review
4. Ensure CI checks pass before merging

## License

This project is licensed under the MIT License - see the LICENSE file for details. 
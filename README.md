
# NEO AI Marketing Platform

## Project Overview

NEO AI is a comprehensive marketing platform designed to help agencies manage clients and campaigns. The platform provides tools for tracking client information, campaign details, and performance metrics across various marketing channels.

## Core Features

### Client Management
- Create, view, edit and delete client profiles
- Track client status (Active, Inactive, Prospect)
- Store detailed brand information and audience insights
- Visualize platform performance with score metrics

### Campaign Management
- Create and manage marketing campaigns
- Track campaign status (Draft, Active, Completed, On Hold)
- Store detailed campaign recommendations including tone, style, formats and targeting
- Link campaigns to specific clients

## Technical Architecture

### Frontend
- **Framework**: React with TypeScript
- **UI Libraries**: Tailwind CSS, shadcn/ui
- **State Management**: React Query (Tanstack Query)
- **Routing**: React Router
- **Charts**: Recharts

### Backend
- **Database**: Supabase (PostgreSQL)
- **Real-time Updates**: Supabase Realtime
- **Authentication**: Supabase Auth

## Data Structure

### Clients
Clients table stores basic information about each client:
- ID (UUID)
- Name
- Status (Active, Inactive, Prospect)
- Country
- Created date
- Updated date

### Campaigns
Campaigns table contains information about marketing initiatives:
- ID (UUID)
- Name
- Client ID (foreign key)
- Status (Draft, Active, Completed, On Hold)
- Start date
- End date
- Budget
- Objectives
- Recommendations (tone, style, formats, targeting, creators/influencers)

## Realtime Features

The application leverages Supabase Realtime for live updates:
- Client profile changes are reflected instantly across all connected clients
- Campaign updates propagate in real-time

## Getting Started

### Prerequisites
- Node.js (v16+)
- npm or yarn package manager

### Local Development

```sh
# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at http://localhost:8080

### Environment Variables

Create a `.env` file with the following variables:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Pages and Navigation

- `/` - Welcome/Login page
- `/home` - Dashboard overview
- `/clients` - Client management
- `/clients/:clientId` - Detailed client view
- `/campaigns` - Campaign management
- `/campaigns/:campaignId` - Detailed campaign view
- `/lab` - Experimental features

## Key Components

### Client Details
- Brand information section
- Score visualization with rationale
- Audience insights

### Campaign Details
- Campaign information
- Recommendations section (tone, style, formats, targeting, creators)
- Performance metrics

## Development Workflow

1. All code changes should be committed to the connected GitHub repository
2. Database changes should be made through Supabase interface or SQL migrations
3. Component additions should follow existing design patterns

## License

This project is proprietary software - all rights reserved.


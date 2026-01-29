# Teacher Substitution System

## Overview

A teacher substitution management system (Sistema de Substituição) built for Portuguese-speaking schools. The application manages teacher absences, assigns substitute teachers, and organizes weekly schedules. Core entities include teachers (professores), subjects/disciplines (disciplinas), classes (turmas), absences (ausências), and substitutions (substituições). The system features automated schedule generation and dashboard analytics.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

- **Framework**: React 18+ with TypeScript, using Vite as the build tool
- **UI Components**: Radix UI primitives with shadcn/ui components following Material Design 3 principles
- **Styling**: Tailwind CSS with HSL color variables for light/dark theme support
- **State Management**: TanStack Query (React Query) for server state; local component state via React hooks
- **Routing**: Wouter for lightweight client-side routing
- **Form Handling**: React Hook Form with Zod schema validation integrated with database schemas
- **Data Visualization**: Recharts for dashboard metrics and charts

### Backend Architecture

- **Runtime**: Node.js with Express.js in ESM mode
- **Entry Points**: Separate development (Vite middleware with HMR) and production (static file serving) configurations
- **API Design**: RESTful endpoints organized by resource (`/api/professores`, `/api/disciplinas`, `/api/turmas`, `/api/ausencias`, `/api/substituicoes`, `/api/escala-semanal`, `/api/gerar-escala`, `/api/dashboard/stats`)
- **Storage Layer**: Abstract `IStorage` interface in `server/storage.ts` allowing pluggable storage implementations; currently supports in-memory storage with full CRUD operations

### Database Schema

- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Schema Location**: `shared/schema.ts` defines tables for professores, disciplinas, turmas, ausencias, and substituicoes
- **Validation**: Zod schemas generated from Drizzle schemas via `drizzle-zod` for type-safe form validation
- **Migrations**: Managed via `drizzle-kit push` command

### Key Design Patterns

- Shared schema types between frontend and backend via `@shared/*` path alias
- Request/response logging middleware with timing metrics
- Toast notifications for user feedback on mutations
- Collapsible sidebar navigation with mobile responsiveness

## External Dependencies

### Database
- **PostgreSQL**: Primary database via `@neondatabase/serverless` driver
- **Drizzle ORM**: Schema definition, queries, and migrations

### Third-Party Services
- **Google Fonts CDN**: Inter and Roboto font families for typography

### Key Libraries
- **Radix UI**: Accessible component primitives (dialog, select, popover, tabs, etc.)
- **TanStack Query**: Server state management and data fetching
- **Recharts**: Dashboard charts and data visualization
- **date-fns**: Date manipulation for weekly schedule calculations
- **Zod**: Runtime type validation
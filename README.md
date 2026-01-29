# Teacher Substitution System

## Overview

This is a teacher substitution management system (Sistema de Substituição) built for Portuguese-speaking schools. The application helps manage teacher absences, assign substitute teachers, and organize weekly schedules. It provides a comprehensive dashboard for tracking substitutions, managing teacher workloads, and ensuring all classes have proper coverage when regular teachers are absent.

The system handles core entities including teachers (professores), subjects/disciplines (disciplinas), classes (turmas), absences (ausências), and substitutions (substituições). It features automated schedule generation, workload tracking, and detailed metrics for administrative oversight.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React 18+ with TypeScript, using Vite as the build tool and development server.

**UI Component Library**: Radix UI primitives with custom shadcn/ui components following Material Design 3 principles. The design emphasizes productivity, clarity, and data-dense displays suitable for administrative workflows.

**Styling**: Tailwind CSS with a custom theme configured for Material Design 3. Uses HSL color variables for theme support (light/dark mode) with Inter and Roboto font families. The design system includes custom elevation, spacing primitives (2, 4, 6, 8 units), and carefully structured typography hierarchy.

**State Management**: TanStack Query (React Query) for server state management with configured query client that handles API requests, caching, and refetching strategies. Local component state managed with React hooks.

**Routing**: Wouter for lightweight client-side routing with routes for Dashboard, Substituição, Escala Semanal, Professores, Turmas, and Disciplinas.

**Form Handling**: React Hook Form with Zod schema validation for type-safe form handling integrated with the database schema.

**Data Visualization**: Recharts library for dashboard metrics, including bar charts and line charts showing substitution trends and teacher workload.

### Backend Architecture

**Runtime**: Node.js with Express.js framework running in ESM mode.

**Development vs Production**: Separate entry points (index-dev.ts and index-prod.ts) where development mode uses Vite's middleware for HMR and production serves pre-built static files.

**API Structure**: RESTful API with endpoints organized by resource:
- `/api/professores` - Teacher CRUD operations
- `/api/disciplinas` - Subject/discipline management
- `/api/turmas` - Class management
- `/api/ausencias` - Absence tracking
- `/api/substituicoes` - Substitution assignments
- `/api/escala-semanal` - Weekly schedule generation
- `/api/gerar-escala` - Automated schedule generation
- `/api/dashboard/stats` - Dashboard metrics aggregation

**Storage Layer**: Abstract storage interface (IStorage) defined in server/storage.ts allowing for pluggable storage implementations. Currently supports in-memory storage with methods for all CRUD operations on core entities.

**Request Processing**: Express middleware for JSON parsing with raw body preservation, request/response logging with timing, and error handling.

### Database & Data Layer

**ORM**: Drizzle ORM configured for PostgreSQL with schema-first approach.

**Schema Design**: Type-safe schema definitions in shared/schema.ts using Drizzle's PostgreSQL table builders:
- `professores` - Teachers with name, knowledge area, and workload tracking
- `disciplinas` - Subjects with name and knowledge area
- `turmas` - Classes/groups
- `ausencias` - Absences with week/year/day/time tracking, linked to teacher, subject, and class
- `substituicoes` - Substitution assignments linking absences to substitute teachers

**Schema Validation**: Zod schemas auto-generated from Drizzle schemas using drizzle-zod for runtime validation on API boundaries.

**Database Provider**: Neon serverless PostgreSQL configured via environment variable DATABASE_URL.

**Migrations**: Drizzle Kit for schema migrations with output directory at ./migrations.

### Key Design Patterns

**Shared Types**: Common schema definitions and types stored in `/shared` directory, imported by both client (`@shared/*`) and server to ensure type consistency across the stack.

**Component Composition**: UI built from small, reusable shadcn/ui components (Button, Card, Dialog, Form, Table, etc.) composed into feature-specific components and pages.

**Separation of Concerns**: Clear separation between:
- Client code in `/client` directory
- Server code in `/server` directory  
- Shared types in `/shared` directory
- UI components in `/client/src/components`
- Page components in `/client/src/pages`

**Week-Based Scheduling**: Ausencias and substitutions tracked by ISO week number and year, enabling weekly schedule views and automated assignment generation.

**Workload Management**: Teacher workload (cargaHoraria) automatically updated when substitutions are assigned, helping balance distribution of substitute teaching duties.

## External Dependencies

### Database
- **Neon Serverless PostgreSQL**: Managed PostgreSQL database accessed via `@neondatabase/serverless` package
- **Connection**: Via DATABASE_URL environment variable

### Third-Party Services
- **Google Fonts CDN**: Inter and Roboto font families loaded from fonts.googleapis.com

### Build & Development Tools
- **Vite**: Frontend build tool with HMR
- **Replit Plugins**: Development-specific plugins for runtime error overlay, cartographer, and dev banner when running in Replit environment
- **esbuild**: Backend bundling for production builds

### Key NPM Packages
- **drizzle-orm** & **drizzle-kit**: Database ORM and migration tools
- **zod** & **drizzle-zod**: Runtime schema validation
- **@tanstack/react-query**: Server state management
- **react-hook-form** & **@hookform/resolvers**: Form handling with Zod integration
- **wouter**: Lightweight routing
- **recharts**: Data visualization
- **date-fns**: Date manipulation utilities
- **class-variance-authority** & **clsx**: Dynamic className management
- **lucide-react**: Icon library
- Multiple **@radix-ui** packages: Unstyled, accessible component primitives

### UI Component Dependencies
Extensive Radix UI component primitives for building accessible UI:
- Dialog, Dropdown Menu, Select, Popover for overlays
- Accordion, Tabs, Collapsible for content organization
- Toast for notifications
- Progress, Slider, Switch for interactive controls
- And many more primitive components
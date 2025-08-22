# Overview

This is a full-stack blog application called "404by.me" built with React frontend and Express backend. The application serves as a personal tech blog focused on system design, databases, programming languages, and other developer topics. It features a modern, responsive design with dark/light theme support and provides a platform for publishing and reading technical articles.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React with TypeScript using Vite as the build tool
- **Routing**: Wouter for client-side routing with pages for home, blog, categories, about, and contact
- **State Management**: TanStack Query for server state management and caching
- **Styling**: Tailwind CSS with shadcn/ui component library for consistent design
- **Theme System**: Custom theme context with localStorage persistence for dark/light mode switching

## Component Structure
- **Layout Components**: Navbar with search functionality, footer with social links
- **Blog Components**: BlogCard for post previews, CategoryBadge for visual categorization, MDX content rendering with syntax highlighting
- **UI Components**: Comprehensive shadcn/ui component library including forms, dialogs, buttons, inputs

## Backend Architecture
- **Framework**: Express.js with TypeScript
- **API Design**: RESTful endpoints for blog posts, categories, and search functionality
- **Storage Layer**: Abstract storage interface with in-memory implementation (MemStorage class)
- **Development Setup**: Vite integration for hot module replacement in development

## Data Models
The application uses three main entities defined in the shared schema:
- **Users**: Basic user management with username/password authentication
- **BlogPosts**: Core content with metadata including slug, title, description, content, category, tags, and publication date
- **Categories**: Organizational structure with name, slug, description, color coding, and post counts

## Content Management
- **MDX Support**: Full MDX processing with syntax highlighting using Prism
- **Search Functionality**: Text-based search across post titles, descriptions, and tags
- **Category Filtering**: Posts organized by technical categories (System Design, Databases, Languages, etc.)

# External Dependencies

## Database Configuration
- **ORM**: Drizzle ORM configured for PostgreSQL
- **Database Provider**: Neon serverless PostgreSQL (configured but not actively used in current implementation)
- **Connection**: Environment-based database URL configuration

## UI and Styling
- **Component Library**: Radix UI primitives for accessible, unstyled components
- **Styling Framework**: Tailwind CSS with custom design tokens and CSS variables
- **Icons**: Lucide React for consistent iconography
- **Fonts**: Google Fonts integration (Inter, JetBrains Mono)

## Development Tools
- **Build Tool**: Vite with React plugin and runtime error handling
- **Code Quality**: TypeScript with strict configuration
- **Development Enhancement**: Replit-specific plugins for cartographer and error modals

## Content Processing
- **MDX Processing**: next-mdx-remote for server-side MDX compilation
- **Syntax Highlighting**: react-syntax-highlighter with Prism themes
- **Date Handling**: date-fns for consistent date formatting
- **Form Management**: React Hook Form with Zod validation

## Query and State Management
- **Data Fetching**: TanStack Query for server state with caching and background updates
- **Form Validation**: Zod schemas integrated with Drizzle for type-safe data validation
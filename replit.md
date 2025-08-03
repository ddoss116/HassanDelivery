# Overview

HassanDelivery is a comprehensive delivery service application that connects customers with delivery services in Saudi Arabia. The platform allows users to place delivery orders for various categories (supermarket, grocery, other items), track their orders, and receive WhatsApp notifications. The application provides price estimation using AI, location-based services with Google Maps integration, and a complete order management system with Arabic language support.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React with TypeScript using Vite as the build tool
- **Styling**: Tailwind CSS with shadcn/ui component library for consistent UI components
- **State Management**: TanStack Query (React Query) for server state management and API caching
- **Routing**: Wouter for lightweight client-side routing
- **Form Handling**: React Hook Form with Zod validation for type-safe form management
- **Internationalization**: Arabic RTL support with Inter and Noto Sans Arabic fonts

## Backend Architecture
- **Framework**: Express.js with TypeScript for the REST API server
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Authentication**: Replit Auth integration with OpenID Connect and session-based authentication
- **Session Management**: PostgreSQL-backed sessions using connect-pg-simple

## Database Design
- **Users Table**: Stores user profiles with Replit Auth integration (id, email, names, profile image, WhatsApp number)
- **Orders Table**: Complete order management with status tracking, location data, pricing, and delivery information
- **Sessions Table**: Secure session storage for authentication persistence

## Key Features
- **Location Services**: Google Maps integration for precise location selection and address geocoding
- **AI-Powered Pricing**: OpenAI GPT-4o integration for intelligent price estimation based on order descriptions
- **Multi-Category Support**: Supermarket, grocery, and custom category ordering with category-specific pricing
- **Real-time Order Tracking**: Status-based order management (pending, confirmed, in_progress, delivered, cancelled)
- **Mobile-First Design**: Responsive design optimized for mobile devices with bottom navigation

## API Structure
- **Authentication Routes**: `/api/auth/user` for user management and profile updates
- **Order Management**: `/api/orders` for CRUD operations with user-specific filtering
- **Order Confirmation**: `/api/orders/:id/confirm` for order processing and WhatsApp notifications

# External Dependencies

## Core Services
- **Database**: Neon PostgreSQL serverless database for scalable data storage
- **Authentication**: Replit Auth service for secure user authentication and authorization
- **Maps**: Google Maps API for location services, geocoding, and address selection
- **AI Services**: OpenAI API (GPT-4o model) for intelligent price estimation and delivery time calculation
- **Communication**: WhatsApp Business API integration for order notifications and customer communication

## Development Tools
- **Build System**: Vite with React plugin for fast development and optimized production builds
- **Database Migrations**: Drizzle Kit for schema management and database migrations
- **Error Handling**: Replit runtime error overlay for development debugging
- **Code Quality**: TypeScript with strict configuration for type safety across the entire application

## UI Components
- **Component Library**: Radix UI primitives with shadcn/ui styling for accessible, consistent components
- **Icons**: Lucide React for a comprehensive icon system
- **Styling**: Tailwind CSS with custom CSS variables for theming and responsive design
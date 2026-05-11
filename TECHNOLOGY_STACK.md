# Nursing Educator Hub: Technology Stack Analysis
**Date:** May 10, 2026  
**Status:** Comprehensive Inventory & Documentation

## 1. Executive Summary
The Nursing Educator Hub is a **TypeScript-first, full-stack monolith** built with modern, production-grade technologies. The platform emphasizes type safety, modular design, and a cohesive developer experience.

---

## 2. Frontend Technology Stack
### Core Framework
| Component | Version | Purpose |
| :--- | :--- | :--- |
| **React** | ^18.2.0 | Primary UI library (Functional components + Hooks) |
| **TypeScript** | ^5.9.2 | Static typing for type safety |
| **Vite** | ^6.3.6 | Build tool and dev server (Extremely fast HMR) |
| **@vitejs/plugin-react** | ^4.3.2 | React plugin for Vite (Fast Refresh, JSX support) |

### UI & Styling
| Component | Version | Purpose |
| :--- | :--- | :--- |
| **Tailwind CSS** | ^3.4.18 | Utility-first CSS framework for rapid, responsive UI |
| **@tailwindcss/typography** | ^0.5.15 | Beautiful typography defaults for blog and study materials |
| **tailwind-merge** | ^2.6.0 | Intelligent merging of Tailwind classes to avoid conflicts |
| **class-variance-authority** | ^0.7.1 | Type-safe component variants |
| **clsx** | ^2.1.1 | Class name utility (often used with cva) |
| **tailwindcss-animate** | ^1.0.7 | Pre-built Tailwind animations |
| **tw-animate-css** | ^1.2.5 | Additional animation library |
| **Lucide React** | ^0.453.0 | Beautiful, consistent, MIT-licensed icons |
| **Framer Motion** | ^11.18.2 | Declarative animations and transitions |

### Component Ecosystem
| Component | Version | Purpose |
| :--- | :--- | :--- |
| **Radix UI** | Various | Headless, unstyled UI primitives (all components: Dialog, Dropdown Menu, Toast, etc.) |
| **React Hook Form** | ^7.55.0 | Performant, flexible form handling |
| **@hookform/resolvers** | ^3.10.0 | Resolvers for Zod (Schema-first validation) |
| **Zod** | ^3.24.2 | TypeScript-first schema declaration and validation |
| **React Day Picker** | ^8.10.1 | Date picker component for scheduling/filters |
| **Embla Carousel React** | ^8.6.0 | High-performance, accessible carousel |
| **React Markdown** | ^9.0.1 | Render Markdown for blogs/notes |
| **Recharts** | ^2.15.2 | Composable charting library for performance analytics |
| **Vaull** | ^1.1.2 | Drawer/Sheet component |

### Routing & State Management
| Component | Version | Purpose |
| :--- | :--- | :--- |
| **React Router DOM** | ^7.9.4 | Full-featured client-side routing |
| **Wouter** | ^3.3.5 | Minimalist routing library (Used as secondary route handler in some contexts) |
| **@tanstack/react-query** | ^5.60.5 | Server state management and data synchronization |
| **React Helmet Async** | ^2.0.5 | Dynamic document head management (Title, meta tags for SEO) |

### Forms & Utilities
| Component | Version | Purpose |
| :--- | :--- | :--- |
| **Input OTP** | ^1.4.2 | One-time password input component |
| **Date-fns** | ^3.6.0 | Modern date utility library (Date formatting, manipulation) |

---

## 3. Backend Technology Stack
### Core Runtime & Framework
| Component | Version | Purpose |
| :--- | :--- | :--- |
| **Node.js** | >=18 (Engine requirement) | JavaScript runtime environment |
| **Express** | ^4.21.2 | Minimal, flexible Node.js web application framework |
| **TypeScript** | ^5.9.2 | Static typing for backend (via tsx/esbuild) |
| **TSX** | ^4.19.1 | TypeScript execution engine (Faster than tsc-node for dev) |
| **ESBuild** | ^0.25.9 | Bundler for production server builds |

### Authentication & Security
| Component | Version | Purpose |
| :--- | :--- | :--- |
| **Express Session** | ^1.18.1 | Session management middleware |
| **Connect-PG-Simple** | ^10.0.0 | PostgreSQL-based session store |
| **Memorystore** | ^1.6.7 | In-memory session store (Fallback for development) |
| **Helmet** | ^7.1.0 | Security headers middleware |
| **Express Rate Limit** | ^7.4.0 | Basic rate-limiting to prevent abuse |
| **Bcrypt** | ^6.0.0 | Secure password hashing |
| **BcryptJS** | ^3.0.2 | Alternative bcrypt implementation |
| **Passport** | ^0.7.0 | Authentication middleware (Flexible strategy-based) |
| **Passport Local** | ^1.0.0 | Local username/password authentication |
| **JSON Web Token** | ^9.0.2 | Token-based authentication library |

### Database & ORM
| Component | Version | Purpose |
| :--- | :--- | :--- |
| **PostgreSQL (via Neon)** | - | Primary database (Neon Serverless) |
| **@neondatabase/serverless** | ^0.10.4 | Neon's serverless Postgres driver (WebSocket support) |
| **Node-PG** | ^8.16.3 | Official PostgreSQL client for Node.js |
| **Drizzle ORM** | ^0.44.7 | Type-safe ORM for SQL databases (Excellent developer experience) |
| **Drizzle Kit** | ^0.31.5 | CLI for migrations and Studio UI (Drizzle's Admin tool) |
| **Drizzle Zod** | ^0.7.0 | Generate Zod schemas from Drizzle tables |

### Storage & Caching
| Component | Version | Purpose |
| :--- | :--- | :--- |
| **Redis** | ^4.6.13 | In-memory data store for caching and session fallback |
| **Multer** | ^2.0.2 | File upload middleware |

### API & Communication
| Component | Version | Purpose |
| :--- | :--- | :--- |
| **Axios** | ^1.7.9 | Promise-based HTTP client (Used by frontend) |
| **CORS** | ^2.8.5 | Cross-Origin Resource Sharing middleware |
| **WS** | ^8.18.0 | WebSocket library for real-time features |
| **Path-to-RegExp** | ^8.3.0 | Used by Express for routing pattern matching |

### Payments & Integrations
| Component | Version | Purpose |
| :--- | :--- | :--- |
| **Stripe** | ^14.21.0 | Payment processing API integration |

### Utilities
| Component | Version | Purpose |
| :--- | :--- | :--- |
| **XLSX** | ^0.18.5 | Excel file reading/writing (For admin bulk uploads) |
| **Zod Validation Error** | ^3.4.0 | Pretty-print Zod errors for better developer UX |
| **Dotenv** | ^16.6.1 | Load environment variables from .env file |
| **Cross-Env** | ^10.0.0 | Set environment variables across platforms |
| **Concurrently** | ^9.2.1 | Run multiple commands simultaneously (dev:server + dev:client) |
| **Rimraf** | ^4.0.0 | Deep deletion of build artifacts |

---

## 4. Build & Deployment Tools
### Build Pipeline
1. **Dev Environment**: Concurrently runs Express server (tsx watch) and Vite dev server.
2. **Production Build**: 
   - Frontend: Vite builds to `dist/public`.
   - Backend: ESBuild bundles `server/index.ts` to `dist/index.js` (ES Module).
3. **Database**: Drizzle Kit manages migrations (`db:migrate` and `db:studio`).

### Linting & Code Quality
| Component | Version | Purpose |
| :--- | :--- | :--- |
| **ESLint** | ^9.35.0 | Pluggable linting tool for TypeScript/JavaScript |
| **@typescript-eslint/eslint-plugin** | ^8.43.0 | TypeScript-specific lint rules |
| **@typescript-eslint/parser** | ^8.43.0 | Parser for ESLint to understand TypeScript |

---

## 5. Shared / Cross-Stack Technologies
- **TypeScript**: Used end-to-end (Frontend, Backend, Schema).
- **Zod**: Used for validation on both frontend (Forms) and backend (API schemas).
- **Lucide React**: Consistent iconography.

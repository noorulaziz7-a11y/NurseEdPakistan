# Nursing Educator Hub - Complete Directory Structure
**Date:** May 11, 2026  
**Version:** 1.0

---

## Full Stack Hierarchical Structure
```
Nursing%20Educator%20Hub/
│
├── client/                                  # Frontend React application
│   ├── public/                              # Static assets
│   │   ├── images/
│   │   │   ├── about-us.jpg
│   │   │   ├── logo.png
│   │   │   └── nurse-hero.png
│   │   └── robots.txt
│   │
│   ├── src/                                 # Frontend source code
│   │   ├── app/                             # Core application configuration
│   │   │   ├── config/
│   │   │   │   └── env.ts
│   │   │   ├── providers/
│   │   │   │   ├── AppProviders.tsx
│   │   │   │   ├── AuthProvider.tsx
│   │   │   │   └── QueryProvider.tsx
│   │   │   ├── router/
│   │   │   │   └── router.tsx
│   │   │   ├── store/
│   │   │   │   └── store.ts
│   │   │   ├── App.tsx
│   │   │   ├── index.css
│   │   │   ├── main.tsx
│   │   │   └── routes.tsx
│   │   │
│   │   ├── components/                        # Reusable UI components
│   │   │   ├── auth/
│   │   │   │   ├── AuthModal.tsx
│   │   │   │   └── ProtectedRoute.tsx
│   │   │   ├── cards/
│   │   │   │   ├── college-card.tsx
│   │   │   │   ├── library-card.tsx
│   │   │   │   └── news-card.tsx
│   │   │   ├── layout/
│   │   │   │   ├── AppLayout.tsx
│   │   │   │   ├── footer.tsx
│   │   │   │   ├── header.tsx
│   │   │   │   └── mobile-menu.tsx
│   │   │   ├── sections/
│   │   │   │   ├── exam-modules.tsx
│   │   │   │   ├── hero.tsx
│   │   │   │   └── platform-overview.tsx
│   │   │   ├── skeleton/
│   │   │   │   ├── CollegeCardSkeleton.tsx
│   │   │   │   ├── ExamCardSkeleton.tsx
│   │   │   │   └── QuizSkeleton.tsx
│   │   │   ├── ErrorBoundary.tsx
│   │   │   ├── ThemeToggle.tsx
│   │   │   └── lazy.tsx
│   │   │
│   │   ├── hooks/                             # Custom React hooks
│   │   │   ├── use-auth.tsx
│   │   │   ├── use-mobile.tsx
│   │   │   ├── use-theme.ts
│   │   │   ├── use-toast.ts
│   │   │   ├── useDailyChallenge.ts
│   │   │   └── useExamTimer.ts
│   │   │
│   │   ├── lib/                               # Utility libraries
│   │   │   ├── api/
│   │   │   │   ├── colleges.ts
│   │   │   │   ├── exam.ts
│   │   │   │   └── users.ts
│   │   │   ├── constants.ts
│   │   │   ├── offline.ts
│   │   │   ├── queryClient.ts
│   │   │   ├── quizStorage.ts
│   │   │   └── utils.ts
│   │   │
│   │   ├── modules/                           # Feature modules
│   │   │   ├── admin/
│   │   │   │   └── index.ts
│   │   │   ├── analytics/
│   │   │   │   └── index.ts
│   │   │   ├── auth/
│   │   │   │   └── index.ts
│   │   │   ├── blog/
│   │   │   │   ├── pages/
│   │   │   │   │   ├── BlogAdminPage.tsx
│   │   │   │   │   ├── BlogDetailPage.tsx
│   │   │   │   │   └── BlogListPage.tsx
│   │   │   │   ├── services/
│   │   │   │   │   └── blogApi.ts
│   │   │   │   └── index.ts
│   │   │   ├── colleges/
│   │   │   │   └── index.ts
│   │   │   ├── dashboard/
│   │   │   │   ├── components/
│   │   │   │   │   └── DashboardLayout.tsx
│   │   │   │   └── index.ts
│   │   │   ├── exams/
│   │   │   │   ├── components/
│   │   │   │   │   ├── quiz/
│   │   │   │   │   │   └── QuizSetupForm.tsx
│   │   │   │   │   ├── Breadcrumbs.tsx
│   │   │   │   │   ├── ExamPageSEO.tsx
│   │   │   │   │   ├── ProgressWidget.tsx
│   │   │   │   │   └── SectionHeader.tsx
│   │   │   │   ├── services/
│   │   │   │   │   └── attemptApi.ts
│   │   │   │   └── index.ts
│   │   │   ├── library/
│   │   │   │   └── index.ts
│   │   │   ├── mcqs/
│   │   │   │   ├── pages/
│   │   │   │   │   └── McqAdminPage.tsx
│   │   │   │   ├── services/
│   │   │   │   │   └── mcqApi.ts
│   │   │   │   └── index.ts
│   │   │   ├── subscriptions/
│   │   │   │   └── index.ts
│   │   │   └── users/
│   │   │       └── index.ts
│   │   │
│   │   ├── pages/                              # Page components
│   │   │   ├── exam-prep/
│   │   │   │   ├── components/
│   │   │   │   │   ├── Exam-Card.tsx
│   │   │   │   │   ├── ExamLayout.tsx
│   │   │   │   │   ├── exam-nav.tsx
│   │   │   │   │   └── performance-overview.tsx
│   │   │   │   ├── dha/
│   │   │   │   │   ├── index.tsx
│   │   │   │   │   └── studymaterials.tsx
│   │   │   │   ├── haad/
│   │   │   │   │   ├── index.tsx
│   │   │   │   │   └── studymaterials.tsx
│   │   │   │   ├── ielts/
│   │   │   │   │   ├── dta/
│   │   │   │   │   │   ├── reading-passages.ts
│   │   │   │   │   │   ├── speaking-prompts.ts
│   │   │   │   │   │   └── writing-tasks.ts
│   │   │   │   │   ├── dashboard.tsx
│   │   │   │   │   ├── index.tsx
│   │   │   │   │   ├── listening.tsx
│   │   │   │   │   ├── reading.tsx
│   │   │   │   │   ├── speaking.tsx
│   │   │   │   │   └── writing.tsx
│   │   │   │   ├── moh/
│   │   │   │   │   ├── index.tsx
│   │   │   │   │   └── studymaterials.tsx
│   │   │   │   ├── nclex/
│   │   │   │   │   ├── index.tsx
│   │   │   │   │   └── studymaterials.tsx
│   │   │   │   ├── shared/
│   │   │   │   │   ├── quiz-components/
│   │   │   │   │   │   ├── QuestionCard.tsx
│   │   │   │   │   │   ├── QuizProgress.tsx
│   │   │   │   │   │   └── Timer.tsx
│   │   │   │   │   ├── quizzes/
│   │   │   │   │   │   ├── index.tsx
│   │   │   │   │   │   ├── quiz.tsx
│   │   │   │   │   │   ├── result.tsx
│   │   │   │   │   │   └── setup.tsx
│   │   │   │   │   ├── ui/
│   │   │   │   │   │   ├── layouts/
│   │   │   │   │   │   │   └── ExamLayout.tsx
│   │   │   │   │   │   ├── ButtonGroup.tsx
│   │   │   │   │   │   └── SearchBar.tsx
│   │   │   │   │   ├── ExamOverview.tsx
│   │   │   │   │   ├── FlashcardsPage.tsx
│   │   │   │   │   ├── NursingNotesPage.tsx
│   │   │   │   │   ├── PastPapersPage.tsx
│   │   │   │   │   ├── StudyGuidesPage.tsx
│   │   │   │   │   └── StudyMaterialsPage.tsx
│   │   │   │   ├── snle/
│   │   │   │   │   ├── index.tsx
│   │   │   │   │   └── studymaterials.tsx
│   │   │   │   ├── specialties/
│   │   │   │   │   └── index.tsx
│   │   │   │   ├── DynamicExamPage.tsx
│   │   │   │   ├── analytics.tsx
│   │   │   │   ├── daily-challenge.tsx
│   │   │   │   ├── exam-data.tsx
│   │   │   │   ├── guide.tsx
│   │   │   │   ├── index.tsx
│   │   │   │   ├── leaderboard.tsx
│   │   │   │   ├── progress.tsx
│   │   │   │   └── resources.tsx
│   │   │   ├── AboutUs.tsx
│   │   │   ├── Study-Libray.tsx
│   │   │   ├── auth.tsx
│   │   │   ├── colleges.tsx
│   │   │   ├── contact.tsx
│   │   │   ├── dashboard.tsx
│   │   │   ├── home.tsx
│   │   │   ├── news.tsx
│   │   │   ├── not-found.tsx
│   │   │   └── practice-test.tsx
│   │   │
│   │   ├── shared/                              # Shared utilities and UI
│   │   │   ├── api/
│   │   │   │   ├── axios.ts
│   │   │   │   ├── endpoints.ts
│   │   │   │   └── interceptors.ts
│   │   │   ├── seo/
│   │   │   │   └── Seo.tsx
│   │   │   ├── ui/                              # ShadCN UI components
│   │   │   │   ├── accordion.tsx
│   │   │   │   ├── alert-dialog.tsx
│   │   │   │   ├── alert.tsx
│   │   │   │   ├── aspect-ratio.tsx
│   │   │   │   ├── avatar.tsx
│   │   │   │   ├── badge.tsx
│   │   │   │   ├── breadcrumb.tsx
│   │   │   │   ├── button.tsx
│   │   │   │   ├── calendar.tsx
│   │   │   │   ├── card.tsx
│   │   │   │   ├── carousel.tsx
│   │   │   │   ├── chart.tsx
│   │   │   │   ├── checkbox.tsx
│   │   │   │   ├── collapsible.tsx
│   │   │   │   ├── command.tsx
│   │   │   │   ├── context-menu.tsx
│   │   │   │   ├── dialog.tsx
│   │   │   │   ├── drawer.tsx
│   │   │   │   ├── dropdown-menu.tsx
│   │   │   │   ├── form.tsx
│   │   │   │   ├── hover-card.tsx
│   │   │   │   ├── input-otp.tsx
│   │   │   │   ├── input.tsx
│   │   │   │   ├── label.tsx
│   │   │   │   ├── menubar.tsx
│   │   │   │   ├── navigation-menu.tsx
│   │   │   │   ├── pagination.tsx
│   │   │   │   ├── popover.tsx
│   │   │   │   ├── progress-bar.tsx
│   │   │   │   ├── progress.tsx
│   │   │   │   ├── radio-group.tsx
│   │   │   │   ├── resizable.tsx
│   │   │   │   ├── scroll-area.tsx
│   │   │   │   ├── select.tsx
│   │   │   │   ├── separator.tsx
│   │   │   │   ├── sheet.tsx
│   │   │   │   ├── sidebar.tsx
│   │   │   │   ├── skeleton.tsx
│   │   │   │   ├── slider.tsx
│   │   │   │   ├── switch.tsx
│   │   │   │   ├── table.tsx
│   │   │   │   ├── tabs.tsx
│   │   │   │   ├── textarea.tsx
│   │   │   │   ├── toast.tsx
│   │   │   │   ├── toaster.tsx
│   │   │   │   ├── toggle-group.tsx
│   │   │   │   ├── toggle.tsx
│   │   │   │   └── tooltip.tsx
│   │   │
│   │   ├── styles/                              # Global styles
│   │   │   ├── animations.css
│   │   │   ├── global.css
│   │   │   └── tailwind.css
│   │   │
│   │   ├── types/                               # TypeScript type definitions
│   │   │   ├── college.ts
│   │   │   ├── exam.ts
│   │   │   ├── quiz.ts
│   │   │   └── user.ts
│   │   │
│   │   └── index.html                            # Root HTML file
│   │
│   ├── server/                                  # Backend Express application
│   │   ├── db/
│   │   │   └── schema.ts                        # Drizzle ORM schema
│   │   │
│   │   ├── modules/                             # Backend feature modules
│   │   │   ├── auth/
│   │   │   │   ├── controller.ts
│   │   │   │   ├── routes.ts
│   │   │   │   ├── schema.ts
│   │   │   │   └── service.ts
│   │   │   ├── blog/
│   │   │   │   ├── controller.ts
│   │   │   │   ├── routes.ts
│   │   │   │   ├── schema.ts
│   │   │   │   └── service.ts
│   │   │   ├── colleges/
│   │   │   │   ├── controller.ts
│   │   │   │   ├── routes.ts
│   │   │   │   ├── schema.ts
│   │   │   │   └── service.ts
│   │   │   ├── exams/
│   │   │   │   ├── controller.ts
│   │   │   │   ├── routes.ts
│   │   │   │   ├── schema.ts
│   │   │   │   └── service.ts
│   │   │   ├── library/
│   │   │   │   ├── controller.ts
│   │   │   │   ├── routes.ts
│   │   │   │   ├── schema.ts
│   │   │   │   └── service.ts
│   │   │   ├── mcqs/
│   │   │   │   ├── controller.ts
│   │   │   │   ├── routes.ts
│   │   │   │   ├── schema.ts
│   │   │   │   └── service.ts
│   │   │   ├── subscriptions/
│   │   │   │   ├── controller.ts
│   │   │   │   ├── routes.ts
│   │   │   │   ├── schema.ts
│   │   │   │   └── service.ts
│   │   │   └── users/
│   │   │       ├── controller.ts
│   │   │       ├── routes.ts
│   │   │       ├── schema.ts
│   │   │       └── service.ts
│   │   │
│   │   ├── scripts/                             # Utility scripts
│   │   │   ├── migrate-questions.ts
│   │   │   └── verify-migration.ts
│   │   │
│   │   ├── types/                               # TypeScript types for backend
│   │   │   └── session.d.ts
│   │   │
│   │   ├── audit.ts
│   │   ├── cache.ts
│   │   ├── database-storage.ts
│   │   ├── db.ts                                # Database connection
│   │   ├── index.ts                             # Main server entry
│   │   ├── redis.ts
│   │   ├── routes.ts                            # Route registration
│   │   ├── seed-colleges.ts
│   │   ├── seed.ts                              # Database seeding
│   │   ├── seo.ts
│   │   ├── storage.ts
│   │   └── vite.ts
│   │
│   ├── env/                                     # Environment configuration examples
│   │   ├── development.example
│   │   ├── docker.env
│   │   └── production.example
│   │
│   ├── migrations/                              # Drizzle database migrations
│   │   ├── meta/
│   │   │   └── 0000_snapshot.json
│   │   ├── 0000_third_valkyrie.sql
│   │   ├── 0001_old_colonel_america.sql
│   │   ├── 0002_shocking_malcolm_colcord.sql
│   │   ├── 0003_mcq_system.sql
│   │   ├── 0004_exam_engine.sql
│   │   ├── 0005_blog_posts.sql
│   │   ├── 0006_subscriptions.sql
│   │   ├── 0007_auth_audit.sql
│   │   ├── 0008_mcq_difficulty_levels.sql
│   │   ├── 0009_mcq_classification.sql
│   │   ├── 0010_exams_columns.sql
│   │   ├── 0011_mcq_advanced_fields.sql
│   │   ├── 0012_attempt_answer_multi.sql
│   │   └── 0013_exam_subjects_topics.sql
│   │
│   ├── .github/                                 # GitHub configuration
│   │   └── workflows/
│   │       └── ci.yml
│   │
│   ├── .vscode/                                 # VS Code configuration
│   │   └── settings.json
│   │
│   ├── attached_assets/                         # Project assets
│   │   └── Pasted-NurseEd-Pakistan-Overview-...txt
│   │
│   ├── Documentation & Reports                  # Documentation files
│   │   ├── ARCHITECTURE_AUDIT.md
│   │   ├── DIAGNOSTIC_ANALYSIS_REPORT.md
│   │   ├── FINAL_ARCHITECTURE_AUDIT.md
│   │   ├── NPM_INSTALLATION_GUIDE.md
│   │   ├── SCALABILITY_TRANSFORMATION_PLAN.md
│   │   ├── TECHNICAL_AUDIT_REPORT.md
│   │   └── TECHNOLOGY_STACK.md
│   │
│   ├── Configuration Files                      # Root configuration
│   │   ├── .dockerignore
│   │   ├── .env
│   │   ├── .gitignore
│   │   ├── Dockerfile
│   │   ├── autocommit.bat
│   │   ├── bootstrap-drizzle-migrations.cjs
│   │   ├── components.json
│   │   ├── docker-compose.yml
│   │   ├── drizzle.config.ts
│   │   ├── package.json
│   │   ├── pnpm-lock.yaml
│   │   ├── README.md (implied)
│   │   └── vite.config.ts
```

---

## Key Structure Notes

### Frontend Organization
- **`client/src/app/`**: Core React app config (providers, routing, store)
- **`client/src/components/`**: Reusable UI components organized by category
- **`client/src/modules/`**: Feature modules with pages, services, and components
- **`client/src/pages/`**: Page-level components including the exam-prep section
- **`client/src/shared/`**: Shared UI (ShadCN), API clients, and SEO utilities

### Backend Organization
- **`server/modules/`**: Feature modules following MVC pattern (controller/routes/schema/service)
- **`server/db/`**: Drizzle schema definitions
- **`server/scripts/`**: Data migration and utility scripts
- **`migrations/`**: Drizzle database migration files

### Infrastructure & DevOps
- **`docker-compose.yml`**: Local multi-container dev environment
- **`Dockerfile`**: Production container build
- **`.github/workflows/`**: CI/CD pipeline

# ATOM Frontend

Single-page application for the ATOM Task Manager, built with Angular 17.

## Table of Contents

- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Local Development](#local-development)
- [Firebase Setup](#firebase-setup)
- [Environment Configuration](#environment-configuration)
- [Testing](#testing)
- [CI/CD](#cicd)

---

## Architecture

The frontend follows **Clean Architecture** principles adapted for Angular 17 standalone components.

### Core layer (`src/app/core/`)

Infrastructure concerns shared across the entire application:

- **`AuthGuard`** — functional guard (`CanActivateFn`) that reads `userId` from `StorageService` and redirects to `/auth` if absent. Keeps route protection declarative and testable without a class.
- **`ApiInterceptor`** — functional HTTP interceptor that clones every outbound request and injects the `x-user-id` header from `StorageService`. Authentication state propagates to the API without any component being aware of it.
- **`StorageService`** — typed wrapper over `localStorage`. Centralises the key names and provides a single place to swap the storage backend.
- **`ThemeService`** — manages the `body.dark` CSS class. Reads `prefers-color-scheme` on first visit, persists the preference to `localStorage`. Components never touch `document.body` directly.
- **`I18nService`** — signal-based translation engine. Translations are compiled into the bundle as typed JSON imports (`resolveJsonModule: true`). `t` is an Angular `computed()` signal derived from `currentLang`, so any component reading `i18n()` re-renders automatically on language change without manual change detection calls. The `interpolate()` method handles `{{placeholder}}` substitution for dynamic strings.

### Features layer (`src/app/features/`)

Each feature is a self-contained vertical slice:

- **`auth/`** — login page with a reactive form (email only). On submit it calls `GET /api/users/:email`; if not found it opens a confirmation dialog before calling `POST /api/users`. The resolved `userId` is stored via `StorageService` and the user is navigated to `/tasks`.
- **`tasks/`** — task list page with create form (accordion), real-time search, task cards, edit dialog, delete confirmation dialog, and pagination. `TaskService` holds a `BehaviorSubject<Task[]>` as the single source of truth for the current page of tasks.

### State management

`TaskService` uses a `BehaviorSubject<Task[]>`. Create and delete operations reload the current page from the API to keep pagination metadata consistent — optimistic updates were avoided here because pagination counts would become stale.

Client-side search is implemented with `combineLatest([tasks$, searchTerm$])` + `map`, so filtering is reactive and never triggers an API call.

### Key decisions

| Decision | Rationale |
|---|---|
| Standalone components throughout | No `NgModule` boilerplate; each component declares its own imports |
| `ChangeDetectionStrategy.OnPush` everywhere | Components only check for changes when inputs change or a signal/observable emits |
| Angular signals for local UI state | `signal()` for `loading`, `error`, `currentPage`, `metadata` — no RxJS overhead for simple local state |
| `computed()` for i18n translations | Zero-subscription reactive translations; works with OnPush automatically |
| Lazy-loaded routes | `/auth` and `/tasks` are loaded on demand, keeping the initial bundle small |
| Functional guards and interceptors | No class boilerplate, easier to test, aligns with Angular 17 recommended patterns |
| `x-user-id` header instead of JWT | The interceptor pattern means JWT can replace this with a single change in one file |
| Angular Material M2 theming | M3 prebuilt themes don't exist in Material 17.3; M2 with separate light/dark palettes gives full control |
| Light-blue/cyan palette for dark mode | Indigo (light mode primary) is mid-dark and disappears on dark backgrounds; light-blue provides the contrast needed |

---

## Project Structure

```
src/app/
  core/
    guards/           — authGuard (functional)
    interceptors/     — apiInterceptor (functional, injects x-user-id header)
    services/         — StorageService, ThemeService, I18nService
    models/           — Task, User interfaces + pagination types
    constants/        — Pagination defaults
  features/
    auth/
      pages/login/    — Login page (email form + create user dialog)
      services/       — AuthService
      components/     — CreateUserDialogComponent
    tasks/
      pages/task-list/ — Main task list page
      components/     — TaskFormComponent, TaskCardComponent, TaskEditDialogComponent
      services/       — TaskService (BehaviorSubject + HTTP)
  shared/
    components/
      confirm-dialog/ — Reusable confirmation dialog
      pagination/     — Pagination component (responsive, ellipsis, active page)
      settings-panel/ — Floating FAB with dark mode toggle and language switcher
src/assets/
  i18n/
    en.json           — English translations
    es.json           — Spanish translations
src/environments/
  environment.ts          — Development (points to deployed Firebase Function)
  environment.prod.ts     — Production
  environment.docker.ts   — Docker local dev (points to localhost:3000)
```

---

## Local Development

### Option A — Docker (recommended)

Requires Docker Desktop. From the project root:

```bash
docker-compose up --build
```

The app is served at `http://localhost:4200` with hot-reload. The functions API and Firestore emulator start automatically alongside it.

### Option B — Local setup

**Requirements:** Node 20, Angular CLI 17

```bash
npm install
ng serve
```

The app starts at `http://localhost:4200`. By default it points to the deployed Firebase Function URL defined in `environment.ts`. To point to a local functions server instead:

```bash
ng serve --configuration docker
```

---

## Firebase Setup

The app is deployed to Firebase Hosting. On all routes except `/api/**` the hosting rewrite serves `index.html`, enabling client-side routing.

### First-time deploy

```bash
npm run build
npx firebase-tools deploy --only hosting --project <your-project-id>
```

### CI/CD deploy token

Generate a token for GitHub Actions:

```bash
firebase login:ci
```

Add it as `FIREBASE_TOKEN` in your repository secrets.

---

## Environment Configuration

| File | Used when |
|---|---|
| `environment.ts` | Local development (`ng serve`) |
| `environment.prod.ts` | Production build (`--configuration production`) |
| `environment.docker.ts` | Docker dev (`--configuration docker`) |

To point the dev build at a different API, edit `environment.ts`:

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api',
};
```

---

## Testing

```bash
# Run all tests
npm test

# Run with coverage report
npm run test:coverage
```

Tests use Karma + Jasmine (Angular default). Services are tested with `HttpClientTestingModule`; components use `TestBed` with stub dependencies.

---

## CI/CD

GitHub Actions pipeline defined in `.github/workflows/ci-cd.yml`:

1. **Lint** — ESLint + Prettier check
2. **Test** — Karma tests with coverage (runs after lint)
3. **Build** — Production build verification (runs after test)
4. **Deploy** — Firebase Hosting deploy (runs on `master` push only)

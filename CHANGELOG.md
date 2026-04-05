# CHANGELOG

## 1.0.5
**Date:** 2026-04-04
**Description:** Added dark mode support via ThemeService (persisted to localStorage, respects prefers-color-scheme on first visit). Added floating SettingsPanelComponent (FAB bottom-right) with dark mode toggle and a Language placeholder marked as coming soon. Panel closes on Escape key.

## 1.0.4
**Date:** 2026-04-04
**Description:** Added pagination feature. TaskService now sends limit and offset params and parses the paginated response. New PaginationComponent (standalone) with prev/next buttons and numbered page buttons. On desktop shows first, last, and sibling pages with ellipsis gaps. On mobile hides all numbers and shows only prev/ellipsis/next. Pagination is pinned below the task list and not affected by the vertical scroll. Create and delete operations reload the list to keep pagination state consistent.

## 1.0.3
**Date:** 2026-04-04
**Description:** Converted the task form into a collapsible accordion using mat-expansion-panel, expanded by default. Fixed the search bar to stay pinned above the task list. Task list now scrolls independently without growing the page beyond the viewport height.

## 1.0.2
**Date:** 2026-04-04
**Description:** Added "Create task" title to the task form. Added a real-time search bar to the task list that filters tasks by title or description using a signal + combineLatest. Includes a clear button and distinct empty states for "no tasks" vs "no results".

## 1.0.1
**Date:** 2026-04-04
**Description:** App logs a welcome message with the current version to the console on startup.

## 1.0.0
**Date:** 2026-04-04
**Description:** Initial release. Angular 17 standalone SPA with authentication flow, task management (CRUD), Angular Material, OnPush change detection, lazy loading, HTTP interceptor, ESLint, Prettier and CI/CD pipeline.

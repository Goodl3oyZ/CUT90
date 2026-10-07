# Contributing to Cut 90 Planner

Thank you for your interest in contributing to Cut 90 Planner! Please read these guidelines before submitting code changes or pull requests.

---

## 1. Development Workflow & Code Style

* **Language**: TypeScript with strict mode enabled. Avoid `any` types.
* **UI & Styling**: Use Tailwind CSS with design system tokens (`var(--bg-main)`, `var(--text-primary)`, `var(--accent-color)`). Avoid hardcoding hex color values inside component files.
* **Component Standards**: Place reusable primitives inside `src/components/ui/`. Ensure all interactive elements include unique `id` attributes and accessible `aria-label` or `aria-hidden` attributes.
* **Language Rules**: Code, variables, comments, and commit messages must be in **English**. User-facing copy must be in **natural, understandable Thai**.

---

## 2. Running Tests & Linting

All PRs must pass linting, TypeScript type checking, and unit/integration tests before merging.

```bash
# Run TypeScript type checker
npx tsc --noEmit

# Run Vitest test suite
npm test

# Run ESLint check
npm run lint
```

---

## 3. Commit Message Format

Follow the Conventional Commits specification:

* `feat: add info popover for BMR and TDEE`
* `fix: correct calculation rounding on Day 90 macros`
* `docs: update deployment and architecture documentation`
* `style: overhaul dark theme palette to obsidian brass`

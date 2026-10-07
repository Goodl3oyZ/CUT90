# Changelog

All notable changes to Cut 90 Planner will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.0.0] - 2026-10-08

### Added
- **Luxury UI Redesign**: "Private-Club Performance Logbook" aesthetic with obsidian green-black dark theme and brushed brass metallic accents.
- **Responsive Layout**: Added desktop left navigation rail (`SideRail`) and two-column dashboard layout for viewports `>= 1024px`.
- **Design System Primitives**: Created `src/components/ui/` primitives including `Button`, `IconButton`, `Card`, `StatTile`, `ProgressBar`, `Ring`, `Pill`, `Field`, `Select`, `Tabs`, `Popover`, `Sheet`, `Toast`, `Skeleton`, `EmptyState`, `Table`, and `Icon`.
- **Icon System**: Integrated uniform `<Icon>` wrapper using `lucide-react` with 1.75 stroke width across all metric labels and actions.
- **Help Center (`/help`)**: Added comprehensive Help page featuring Glossary, FAQ, and PWA installation guides for iOS and Android.
- **Enhanced Onboarding**: Transformed onboarding into a structured 4-step stepper (About -> Body -> Goal -> Plan Preview) with instant mathematical preview before confirmation.
- **Info Popovers**: Contextual popovers for BMR, TDEE, Deficit, 7-day average, and Recalibration.
- **Mobile Card View**: Added Card List view toggle for `/plan` screen alongside sticky table view.
- **Comprehensive Documentation Suite**: Added `DESIGN_SYSTEM.md`, `FORMULAS.md`, `USER_GUIDE.th.md`, `ARCHITECTURE.md`, `API.md`, `SECURITY.md`, `DEPLOY.md`, `UI_AUDIT.md`, `README.md`, `CHANGELOG.md`, `CONTRIBUTING.md`.
- **Playwright Screenshot Generator**: `scripts/screenshots.ts` script for capturing light & dark images across mobile and desktop viewports.

### Changed
- **Typography**: Replaced default fonts with Google Fonts `Bodoni Moda` (display Didone headings), `Plus Jakarta Sans` (humanist UI sans), and `Noto Sans Thai` with `>= 1.65` line-height.
- **WCAG AA Compliance**: Overhauled color variables to guarantee 100% contrast compliance (> 4.5:1 body, > 3:1 UI elements).
- **Understandable Copy**: Replaced technical jargon ("Expected"/"Actual") with plain Thai ("เป้าวันนี้"/"ที่กินจริง") and status summary sentences.

### Fixed
- Fixed SQLITE_BUSY locking issues duringVitest concurrent test execution using single-fork process pooling.

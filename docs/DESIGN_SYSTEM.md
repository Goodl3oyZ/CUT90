# Cut 90 Planner - Design System Documentation

**Theme Concept**: Private-Club Performance Logbook. Quiet, precise, expensive-feeling restraint.

---

## 1. Palette & WCAG AA Contrast Verification Table

The palette relies on obsidian green-black tones for dark mode, warm off-white paper for light mode, and a single brushed brass/champagne accent (`#D4AF37` dark / `#8C6D1F` light) to guarantee WCAG AA 4.5:1 contrast compliance.

| Theme | UI Element | Text Color | Background Color | Contrast Ratio | WCAG AA Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Dark** | Body Primary Text | Warm Ivory (`#F4F3EF`) | Obsidian Black (`#090C0B`) | **18.2:1** | ✅ AAA Passed |
| **Dark** | Secondary Text | Muted Sage (`#8E9C8A`) | Obsidian Surface (`#121715`) | **5.9:1** | ✅ AA Passed |
| **Dark** | Key Numbers / Accent | Brushed Brass (`#D4AF37`) | Obsidian Surface (`#121715`) | **8.4:1** | ✅ AA Passed |
| **Dark** | Status Ahead | Emerald Text (`#10B981`) | Emerald Subtle (`rgba(16,185,129,0.15)`) | **7.2:1** | ✅ AA Passed |
| **Light** | Body Primary Text | Deep Ink (`#121614`) | Paper White (`#F7F6F2`) | **17.5:1** | ✅ AAA Passed |
| **Light** | Secondary Text | Darkened Sage (`#4D5C4A`) | Paper White (`#F7F6F2`) | **6.4:1** | ✅ AA Passed |
| **Light** | Primary Button / Accent | Darkened Brass (`#8C6D1F`) | Paper Surface (`#FFFFFF`) | **4.9:1** | ✅ AA Passed |

---

## 2. Typography Scale & Fallbacks

* **Display Face**: `Bodoni Moda` (`--font-display`) - Used exclusively for hero numbers, main titles, and brand headers.
* **Humanist UI Sans**: `Plus Jakarta Sans` (`--font-sans`) - Used for UI elements, labels, buttons, and system controls.
* **Thai Script**: `Noto Sans Thai` (`--font-thai`) - Generous line-height (`>= 1.65`) for comfortable reading.
* **Tabular Numerals**: `.tabular-nums` applied to all weights, calories, macros, and dates to eliminate layout shifts.

### Type Scale Hierarchy
| Token | Pixel Size | Line Height | Application |
| :--- | :--- | :--- | :--- |
| `text-2xs` | 11px | 16px | Metric unit badges & micro hints |
| `text-xs` | 12px | 20px | Input labels, helper text, table body |
| `text-sm` | 14px | 24px | Form controls, button text, list items |
| `text-base` | 16px | 26px | Body prose, popover text |
| `text-xl` | 20px | 28px | Card titles, modal headers |
| `text-2xl` | 28px | 36px | Page main section headings |
| `text-4xl` | 44px | 52px | Hero stat numbers |
| `text-6xl` | 72px | 80px | Display hero numerals |

---

## 3. Icon Map (`lucide-react`, stroke 1.75)

All icons use `lucide-react` rendered through the `<Icon name="..." />` uniform wrapper.

| Category | Label / Purpose | Icon Name | Size |
| :--- | :--- | :--- | :--- |
| **Navigation** | Today Dashboard | `Sun` / `CalendarCheck` | 24 |
| **Navigation** | 90-Day Plan Table | `LayoutGrid` / `Table2` | 24 |
| **Navigation** | Trend & Progress | `LineChart` | 24 |
| **Navigation** | Setup & Settings | `SlidersHorizontal` | 24 |
| **Navigation** | Help & FAQ | `CircleHelp` | 24 |
| **Metrics** | Weight (น้ำหนัก) | `Scale` | 20 |
| **Metrics** | Waist (รอบเอว) | `Ruler` | 20 |
| **Metrics** | Calories (พลังงาน) | `Flame` | 20 |
| **Metrics** | Protein (โปรตีน) | `Beef` | 20 |
| **Metrics** | Carb (คาร์โบไฮเดรต) | `Wheat` | 20 |
| **Metrics** | Fat (ไขมัน) | `Droplet` | 20 |
| **Metrics** | Goal Weight (เป้าหมาย) | `Target` | 20 |
| **Status** | Ahead of Plan | `TrendingDown` | 14 |
| **Status** | On Track | `CheckCircle2` | 14 |
| **Status** | Behind Plan | `AlertCircle` | 14 |
| **Actions** | Save / Save Auto | `Check` / `Save` | 16 |
| **Actions** | Export Data | `Download` | 16 |
| **Actions** | Import Data | `Upload` | 16 |
| **Actions** | Recalibrate Plan | `RefreshCw` | 16 |
| **Actions** | Delete / Danger | `Trash2` | 16 |
| **Actions** | Logout | `LogOut` | 16 |

---

## 4. Component Library Inventory (`src/components/ui/`)

1. **`<Button>`**: Primary (brass), Secondary, Ghost, Danger variants. `min-h-[44px]` for touch compliance.
2. **`<IconButton>`**: 44x44px target with obligatory `ariaLabel`.
3. **`<Card>`**: Default (1px hairline border), Hero (subtle brass glow gradient), Glass, Outlined.
4. **`<StatTile>`**: Displays metric icon, label, actual/target, and remaining hint.
5. **`<ProgressBar>`**: Animated 200ms ease progress fill with macro-specific colors.
6. **`<Ring>`**: SVG circular progress indicator for day and weight completion percentages.
7. **`<Pill>`**: Status pill with `rounded-full` shape, icon, and text.
8. **`<Field>`**: Form input with label, icon, inline unit badge (`กก.`, `g`), helper text.
9. **`<Select>`**: Styled dropdown selector.
10. **`<Tabs>`**: Tab control with smooth active state indicator.
11. **`<Popover>`**: Accessible popover for BMR, TDEE, Deficit, 7-day average explanations.
12. **`<Sheet>`**: Accessible modal dialog / bottom sheet.
13. **`<Toast>`**: Auto-save and sync feedback toast with `aria-live="polite"`.
14. **`<Skeleton>`**: Shimmer placeholder card/text during data fetching.
15. **`<EmptyState>`**: Friendly illustration-free empty state with action button.
16. **`<Table>`**: Detailed data table wrapper with sticky headers.
17. **`<SideRail>`**: Fixed left navigation rail for desktop (`>= 1024px`).

---

## 5. Motion & Accessibility Rules

### Motion Guidelines
* Transition durations: **150ms - 250ms ease-out**.
* Applied to: tab switching, bar fills, route transitions, popover appearance.
* **Prefers-Reduced-Motion**: Supported via `@media (prefers-reduced-motion: reduce)` in `globals.css` (disables all non-essential animations).

### Do's & Don'ts
* **DO**: Use tabular numbers (`.tabular-nums`) for all alignable numeric data.
* **DO**: Provide text labels alongside status icons (never color alone).
* **DON'T**: Use neon colors, heavy drop shadows, or emojis as UI icons.
* **DON'T**: Hardcode color hex values directly in component files; always consume CSS variables or Tailwind tokens.

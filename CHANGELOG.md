# Changelog

All notable changes to Serayu UI will be documented in this file.

Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/).

[1.0.2] - 2026-09-29

Patch release adding 2 hooks, 3 utilities, 4 UI components, and 1
pattern, with README banner URL fix and refreshed counts across
playground, landing, docs, and README.

NEW HOOKS

- `usePrefersReducedMotion` - reactive boolean for the
  `prefers-reduced-motion` media query. SSR-safe.
- `useNetworkStatus` - tracks `isOnline` plus a sticky `wasOffline`
  flag, useful for "back online" toasts.

NEW UTILITIES

- `formatBytes(bytes, options?)` - locale-aware byte formatter with
  manual unit selection (B / KB / MB / GB / TB / PB) using 1024-base.
- `formatCompactNumber(value, options?)` - locale-aware compact
  notation (`1.2K`, `3.4M`, `1.5B`) via `Intl.NumberFormat`.
- `isValidURL(value, options?)` - URL constructor with configurable
  protocol allowlist (defaults to `http` and `https`).

NEW UI COMPONENTS

- `Kbd` - keyboard shortcut chip with `default` and `muted` variants.
- `Collapsible` - single open/close region with smooth height
  animation. Wraps `@radix-ui/react-collapsible`.
- `HoverCard` - floating content shown on hover with 200ms open
  delay. Wraps `@radix-ui/react-hover-card`.
- `ScrollArea` - custom-styled scrollable region with 8px scrollbar.
  Wraps `@radix-ui/react-scroll-area`.

NEW PATTERN

- `Breadcrumb` - slot-based hierarchical navigation: `Breadcrumb`,
  `BreadcrumbList`, `BreadcrumbItem`, `BreadcrumbLink`,
  `BreadcrumbSeparator`, `BreadcrumbEllipsis`, `BreadcrumbCurrent`.

PLAYGROUND

- Added demo cards for `Kbd`, `Collapsible`, `HoverCard`,
  `ScrollArea`, `Breadcrumb`, `usePrefersReducedMotion`, and
  `useNetworkStatus`.
- `CommandPalette` demo now uses the new `Kbd` component instead
  of raw `<kbd>` markup.
- Updated `CATEGORIES` counts (layout 4 to 6, overlays 6 to 8,
  patterns 10 to 11, hooks-ext 5 to 7) and hero stat tiles
  (52 / 29 / 10 / 7 to 56 / 30 / 12 / 8).

LANDING PAGE

- Hero badge now reads `Version 1.0.2 - production ready`.
- StatsBar updated to 56 / 30 / 12 / 24.
- Hero copy and `SectionHeader` updated to reflect 56 components
  and 30 patterns.
- Footer version string updated to `v1.0.2`.

DOCS

- `docs/components.md`: added entries for `Kbd`, `Collapsible`,
  `HoverCard`, and `ScrollArea`; updated total to 56.
- `docs/patterns.md`: added `Breadcrumb` entry; updated total to 30.
- `README.md`: counts and listings refreshed across Components,
  Patterns, Hooks (10 to 12), and Utilities (21 to 24).

[1.0.1] - 2026-09-27

Patch release with bug fixes, chore cleanup, and playground demo
improvements.

BUG FIXES

- TimePicker: selected item text now visible above the highlight
  band. The absolute-positioned highlight overlay was painting
  on top of the item text due to a stacking order issue. Fixed
  by adding `relative z-10` to the scroll container so its items
  render above the overlay.

- MobileSearch: hide the browser's native clear UI on
  `<input type="search">` so consumers see one clear button
  (the Serayu UI one), not two. Added a CSS rule in `utilities.css`
  covering `::-webkit-search-cancel-button`,
  `::-webkit-search-decoration`,
  `::-webkit-search-results-button`, and
  `::-webkit-search-results-decoration`.

CHORE

- `package.json` homepage now points to the docs subdomain
  (`https://serayu-ui.serayudigital.com`).
- `package-lock.json` root version synchronized with `package.json`
  (`1.0.0`).

PLAYGROUND

- InstallPrompt, UpdateAvailableToast, Onboarding, CommandPalette:
  added a trigger button to each demo card so the gated-by-default
  state is reachable on demand instead of appearing empty.

[1.0.0] - 2026-09-26

Initial public release of `@serayu/ui`.

UI COMPONENTS (52)

Foundations: Button, Badge, Card, Separator, Skeleton, Alert, Toast,
Toaster, Input, Textarea, Checkbox, Switch, RadioGroup, Select, Label,
Tabs, Accordion, Dialog, AlertDialog, Sheet, Popover, DropdownMenu,
Tooltip, Avatar, ThemeToggle.

Forms advanced: Chip, SegmentedControl, Slider, Rating, Stepper,
Combobox, Form (FormField, FormItem, FormLabel, FormControl,
FormDescription, FormMessage), MultiSelectCombobox, ColorPicker.

Data: AvatarGroup, SkeletonGroup (preset profile/list/card/feed),
DatePicker, DateRangePicker, VirtualList.

Data viz: Charts (Sparkline, ProgressRing, Donut, BarChart, LineChart,
Heatmap), AnimatedNumber, Carousel.

Media: PhotoViewer, StoryReelsViewer, MapPreview.

PATTERNS (29)

Core: MobileHeader, BottomNav, MobileNav, MobileSearch, FilterBar,
FilterSheet, BottomSheet, DataTable, EmptyState, LoadingState.

Forms: Onboarding, ProfileHeader, SettingsList, SearchResults,
ChatBubble, MediaGrid, SwipeActions, PullToRefresh, OTPInput.

Advanced: CommandPalette, NotificationPermission, AuthLoginScreen,
AuthOTPForm, AuthBiometricPrompt, CommandBarMobile, ThemeCustomizer,
Tour.

HOOKS (10)

`useTheme`, `useMediaQuery`, `useToast`, `useDebounce`,
`useLocalStorage`, `useClickOutside`, `useKeyboardShortcuts`,
`useIntersectionObserver`, `useScrollLock`, `useVisibilityPause`.

UTILITIES (21)

`cn`, `formatCurrency`, `formatNumber`, `formatDate`, `formatRelative`,
`sleep`, `isClient`, `composeEventHandlers`, `mergeRefs`,
`formatRupiah`, `formatTanggal`, `formatNomorHP`, `formatPhoneNumber`,
`isValidEmail`, `isValidIndonesianPhone`, `isValidNIK`, `truncate`,
`capitalize`, `clamp`, `uid`, `noop`, `theme-overrides`,
`theme-presets`, `calendar-utils`.

PLATFORM

- `sd-` design tokens (Serayu Digital) with light, dark, and
  `prefers-color-scheme` support.
- Anti-FOWT inline script + theme toggle + cross-tab sync.
- PWA-ready: manifest, service worker, theme-color, maskable icon,
  icon generator.
- `LocaleProvider` with `useLocale`, `useT`, and
  `useLocaleFormatters` hooks.
- PWA components: InstallPrompt, NetworkStatus, OfflineIndicator,
  ShareButton, UpdateAvailableToast (with `useUpdateAvailable` hook).
- Interaction: SwipeableRow (left/right gesture for list items).

TOOLING

- Vite + TypeScript strict build with dual output (app + library).
- Library mode emits ESM, CJS, type declarations, and bundled CSS.
- Internal ESLint plugin (`tools/eslint-plugin-serayu/`) with 4 rules
  to enforce design conventions:
  `serayu/no-hardcoded-color`, `serayu/no-gradient`,
  `serayu/tap-target`, `serayu/sd-namespace`.
- Playground for demoing every component and pattern.
- 131 unit tests via vitest.
- TypeScript declarations per-component for tree-shake-friendly types.

[1.0.0]: https://github.com/serayudigital/serayu-ui/releases/tag/v1.0.0
[1.0.1]: https://github.com/serayudigital/serayu-ui/releases/tag/v1.0.1
[1.0.2]: https://github.com/serayudigital/serayu-ui/releases/tag/v1.0.2

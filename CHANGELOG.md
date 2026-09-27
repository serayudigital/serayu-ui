# Changelog

All notable changes to Serayu UI will be documented in this file.

Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/).

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

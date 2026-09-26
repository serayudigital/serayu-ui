# Changelog

All notable changes to Serayu UI will be documented in this file.

Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/).

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

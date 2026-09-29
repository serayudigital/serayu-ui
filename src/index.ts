/*
 * Serayu UI - Barrel export
 * Mobile-first React UI components built with Radix UI and Tailwind CSS.
 * by Serayu Digital - www.serayudigital.com
 *
 * UI components are added in phase 2. Patterns are added in phase 3.
 *
 * NOTE: this barrel does NOT import CSS. Consumers must import the CSS
 * separately: `import "@serayu/ui/styles.css"` in the app entry. Library
 * mode builds use src/lib.entry.ts which auto-imports CSS so Vite
 * extracts style.css into dist/.
 */

// Lib
export { cn } from "./lib/cn";
export {
  sleep,
  isClient,
  formatNumber,
  formatCurrency,
  formatRupiah,
  formatDate,
  formatTanggal,
  formatRelative,
  formatNomorHP,
  formatPhoneNumber,
  formatBytes,
  formatCompactNumber,
  isValidEmail,
  isValidURL,
  isValidIndonesianPhone,
  isValidNIK,
  truncate,
  capitalize,
  clamp,
  uid,
  composeEventHandlers,
  mergeRefs,
  noop,
} from "./lib/utils";

// Hooks
export {
  useMediaQuery,
  breakpoints,
  useIsDesktop,
  useIsMobile,
} from "./hooks/use-media-query";
export {
  useTheme,
  THEME_STORAGE_KEY,
  type ThemePreference,
  type ResolvedTheme,
  type UseThemeReturn,
} from "./hooks/use-theme";
export { useToast, toast, type ToasterToast } from "./hooks/use-toast";
export {
  AnimatedNumber,
  type AnimatedNumberProps,
} from "./components/ui/animated-number";
export {
  MultiSelectCombobox,
  type MultiSelectComboboxProps,
  type MultiSelectComboboxItem,
} from "./components/ui/multiselect-combobox";
export {
  PhotoViewer,
  type PhotoViewerProps,
  type PhotoViewerImage,
} from "./components/ui/photo-viewer";
export {
  ColorPicker,
  type ColorPickerProps,
} from "./components/ui/color-picker";
export { useDebounce } from "./hooks/use-debounce";
export { useLocalStorage } from "./hooks/use-local-storage";
export {
  useClickOutside,
  type UseClickOutsideOptions,
} from "./hooks/use-click-outside";
export {
  useKeyboardShortcuts,
  type KeyboardShortcut,
} from "./hooks/use-keyboard-shortcuts";
export {
  useIntersectionObserver,
  type UseIntersectionObserverOptions,
} from "./hooks/use-intersection-observer";
export { useVisibilityPause } from "./hooks/use-visibility-pause";
export { useScrollLock } from "./hooks/use-scroll-lock";
export { usePrefersReducedMotion } from "./hooks/use-prefers-reduced-motion";
export {
  useNetworkStatus,
  type UseNetworkStatusReturn,
} from "./hooks/use-network-status";

// Components
export * from "./components/ui/accordion";
export * from "./components/ui/alert";
export * from "./components/ui/alert-dialog";
export * from "./components/ui/avatar";
export * from "./components/ui/avatar-group";
export * from "./components/ui/badge";
export * from "./components/ui/button";
export * from "./components/ui/card";
export * from "./components/ui/carousel";
export * from "./components/ui/charts";
export * from "./components/ui/checkbox";
export * from "./components/ui/chip";
export * from "./components/ui/collapsible";
export * from "./components/ui/combobox";
export * from "./components/ui/date-picker";
export * from "./components/ui/date-range-picker";
export * from "./components/ui/dialog";
export * from "./components/ui/dropdown-menu";
export * from "./components/ui/form";
export * from "./components/ui/hover-card";
export * from "./components/ui/input";
export * from "./components/ui/install-prompt";
export * from "./components/ui/kbd";
export * from "./components/ui/label";
export * from "./components/ui/locale-provider";
export * from "./components/ui/network-status";
export * from "./components/ui/offline-indicator";
export * from "./components/ui/popover";
export * from "./components/ui/progress";
export * from "./components/ui/radio-group";
export * from "./components/ui/rating";
export * from "./components/ui/scroll-area";
export * from "./components/ui/segmented-control";
export * from "./components/ui/select";
export * from "./components/ui/separator";
export * from "./components/ui/share-button";
export * from "./components/ui/sheet";
export * from "./components/ui/skeleton";
export * from "./components/ui/skeleton-group";
export * from "./components/ui/slider";
export * from "./components/ui/stepper";
export * from "./components/ui/swipeable-row";
export * from "./components/ui/switch";
export * from "./components/ui/tabs";
export * from "./components/ui/textarea";
export * from "./components/ui/theme-toggle";
export * from "./components/ui/time-picker";
export * from "./components/ui/toast";
export * from "./components/ui/tooltip";
export * from "./components/ui/update-available-toast";
export * from "./components/ui/virtual-list";
export { Toaster } from "./components/ui/toaster";

// Patterns
export * from "./components/patterns";

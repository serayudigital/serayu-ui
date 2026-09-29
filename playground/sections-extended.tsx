// Forms Advanced, Charts, PWA & i18n, Patterns Advanced, Hooks Advanced.
// This file was lost during an automated batch replacement (PowerShell write
// contention race) and reconstructed. The component showcases here are minimal
// demonstrations. Expand per-component Demos to restore full coverage.
import * as React from "react";
import { createPortal } from "react-dom";
import { Plus, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Chip } from "@/components/ui/chip";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { Slider } from "@/components/ui/slider";
import { Rating } from "@/components/ui/rating";
import { Stepper } from "@/components/ui/stepper";
import { Combobox } from "@/components/ui/combobox";
import { Input } from "@/components/ui/input";
import { DatePicker } from "@/components/ui/date-picker";
import { TimePicker } from "@/components/ui/time-picker";
import { Sparkline, ProgressRing, Donut } from "@/components/ui/charts";
import { InstallPrompt } from "@/components/ui/install-prompt";
import { NetworkStatus } from "@/components/ui/network-status";
import { OfflineIndicator } from "@/components/ui/offline-indicator";
import { ShareButton } from "@/components/ui/share-button";
import { UpdateAvailableToast } from "@/components/ui/update-available-toast";
import { LocaleProvider } from "@/components/ui/locale-provider";
import { Onboarding } from "@/components/patterns/onboarding";
import { ProfileHeader } from "@/components/patterns/profile-header";
import { SettingsList } from "@/components/patterns/settings-list";
import { SearchResults } from "@/components/patterns/search-results";
import { ChatBubble } from "@/components/patterns/chat-bubble";
import { SwipeActions } from "@/components/patterns/swipe-actions";
import { OTPInput } from "@/components/patterns/otp-input";
import { CommandPalette } from "@/components/patterns/command-palette";
import { NotificationPermission } from "@/components/patterns/notification-permission";
import { useDebounce } from "@/hooks/use-debounce";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { useClickOutside } from "@/hooks/use-click-outside";
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { useNetworkStatus } from "@/hooks/use-network-status";
import { DemoCard } from "./demo-card";
import { cn } from "@/lib/cn";

/* ============================================================
 * FORMS ADVANCED - Chip, SegmentedControl, Slider, Rating,
 *                   Stepper, Combobox, DatePicker, TimePicker
 * ============================================================ */
export function FormsExtSection() {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <DemoCard
        title="Chip"
        description="Interactive tags for filter, category, or removable tag."
        code={`<Chip selected>Active</Chip>
<Chip variant="success" removable readOnly onRemove={() => {}}>
  Success
</Chip>`}
      >
        <div className="flex flex-wrap items-center justify-center gap-1.5">
          <Chip selected>Active</Chip>
          <Chip variant="secondary" removable readOnly onRemove={() => {}}>
            Secondary
          </Chip>
          <Chip variant="success" removable readOnly onRemove={() => {}}>
            Success
          </Chip>
          <Chip variant="danger" removable readOnly onRemove={() => {}}>
            Delete
          </Chip>
        </div>
      </DemoCard>

      <DemoCard
        title="SegmentedControl"
        description="Option switcher, useful for sort or horizontal tabs."
        code={`<SegmentedControl
  items={[
    { value: "new", label: "Newest" },
    { value: "top", label: "Top" },
  ]}
  value={sort}
  onValueChange={setSort}
  aria-label="Sort options"
/>`}
      >
        <SegmentedControlDemo />
      </DemoCard>

      <DemoCard
        title="Slider"
        description="Range slider, single or dual-thumb."
        code={`<Slider defaultValue={[60]} max={100} step={1} />`}
      >
        <div className="w-full max-w-sm space-y-6">
          <Slider defaultValue={[60]} max={100} step={1} />
          <Slider defaultValue={[20, 80]} max={100} step={1} />
        </div>
      </DemoCard>

      <DemoCard
        title="Rating"
        description="Star rating with read-only or interactive mode."
        code={`<Rating value={4} onValueChange={setValue} />
<Rating value={5} readOnly />`}
      >
        <div className="flex flex-col items-center gap-3">
          <RatingInteractive />
          <div className="text-xs text-muted-foreground">read-only</div>
          <Rating value={5} readOnly />
        </div>
      </DemoCard>

      <DemoCard
        title="Stepper"
        description="Multi-step progress for form or checkout."
        code={`<Stepper
  steps={[
    { title: "Cart" },
    { title: "Pay" },
    { title: "Done" },
  ]}
  currentStep={1}
/>`}
      >
        <StepperInteractive />
      </DemoCard>

      <DemoCard
        title="Combobox"
        description="Searchable select for long lists."
        code={`<Combobox
  items={cities}
  value={value}
  onValueChange={setValue}
  placeholder="Search city..."
/>`}
      >
        <ComboboxDemo />
      </DemoCard>

      <DemoCard
        title="DatePicker"
        description="iOS-style calendar with swipe between months."
        code={`<DatePicker value={date} onChange={setDate} />`}
      >
        <DatePickerDemo />
      </DemoCard>

      <DemoCard
        title="TimePicker"
        description="Scroll picker for hours and minutes with keyboard nav."
        code={`<TimePicker value={time} onChange={setTime} />`}
      >
        <TimePickerDemo />
      </DemoCard>
    </div>
  );
}

function SegmentedControlDemo() {
  const [sort, setSort] = React.useState("new");
  return (
    <SegmentedControl
      items={[
        { value: "new", label: "Newest" },
        { value: "top", label: "Top" },
        { value: "old", label: "Oldest" },
      ]}
      value={sort}
      onValueChange={setSort}
      aria-label="Sort options"
    />
  );
}

function RatingInteractive() {
  const [v, setV] = React.useState(4);
  return <Rating value={v} onValueChange={setV} />;
}

function StepperInteractive() {
  const [current, setCurrent] = React.useState(1);
  return (
    <Stepper
      steps={[
        { title: "Cart", description: "Review items" },
        { title: "Pay", description: "Choose method" },
        { title: "Done", description: "Receipt" },
      ]}
      currentStep={current}
      onStepClick={(i) => setCurrent(i)}
    />
  );
}

const CITY_ITEMS = [
  { value: "jakarta", label: "Jakarta" },
  { value: "bandung", label: "Bandung" },
  { value: "surabaya", label: "Surabaya" },
  { value: "medan", label: "Medan" },
  { value: "makassar", label: "Makassar" },
  { value: "denpasar", label: "Denpasar" },
  { value: "yogyakarta", label: "Yogyakarta" },
  { value: "semarang", label: "Semarang" },
];

function ComboboxDemo() {
  const [value, setValue] = React.useState<string | undefined>(undefined);
  return (
    <Combobox
      items={CITY_ITEMS}
      value={value}
      onValueChange={setValue}
      placeholder="Search city..."
      id="city-combobox"
    />
  );
}

function DatePickerDemo() {
  const [date, setDate] = React.useState<Date | undefined>(undefined);
  return <DatePicker value={date} onChange={setDate} />;
}

function TimePickerDemo() {
  const [time, setTime] = React.useState<
    { hours: number; minutes: number } | undefined
  >(undefined);
  return <TimePicker value={time} onChange={setTime} />;
}

/* ============================================================
 * CHARTS - Sparkline, ProgressRing, Donut
 * ============================================================ */
export function DataVizSection() {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <DemoCard
        title="Sparkline"
        description="Compact trend line for card or list."
        code={`<Sparkline data={[12, 18, 14, 22, 18, 28, 26, 32]} />`}
      >
        <SparklineDemo />
      </DemoCard>

      <DemoCard
        title="ProgressRing"
        description="Progress ring with center label."
        code={`<ProgressRing value={72} label="72%" />`}
      >
        <ProgressRingDemo />
      </DemoCard>

      <DemoCard
        title="Donut"
        description="Layered donut chart with theme color tokens."
        code={`<Donut
  segments={[
    { value: 60, colorToken: "brand", label: "Active" },
    { value: 25, colorToken: "success", label: "Paid" },
    { value: 15, colorToken: "danger", label: "Failed" },
  ]}
/>`}
      >
        <DonutDemo />
      </DemoCard>
    </div>
  );
}

function SparklineDemo() {
  return (
    <Sparkline
      data={[12, 18, 14, 22, 18, 28, 26, 32, 30, 36, 34, 40]}
      width={240}
      height={64}
      ariaLabel="Trend"
    />
  );
}

function ProgressRingDemo() {
  return <ProgressRing value={72} label="72%" />;
}

function DonutDemo() {
  return (
    <Donut
      segments={[
        { value: 60, colorToken: "brand", label: "Active" },
        { value: 25, colorToken: "success", label: "Paid" },
        { value: 15, colorToken: "danger", label: "Failed" },
      ]}
      size={140}
    />
  );
}

// Demo wrapper for InstallPrompt - dispatches a fake `beforeinstallprompt`
// event when the trigger button is clicked, so the prompt UI is visible
// in playground without depending on real PWA install criteria.
function InstallPromptDemo() {
  const trigger = React.useCallback(() => {
    if (typeof window === "undefined") return;
    // Clear any prior snooze so subsequent demos can be triggered.
    try {
      Object.keys(window.localStorage)
        .filter((k) => k.startsWith("sd-install-prompt-snooze:"))
        .forEach((k) => window.localStorage.removeItem(k));
    } catch {
      // Ignore private-mode quota errors.
    }
    const fake = new Event("beforeinstallprompt") as Event & {
      platforms: string[];
      prompt: () => Promise<void>;
      userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
    };
    fake.platforms = ["web"];
    fake.prompt = () => Promise.resolve();
    fake.userChoice = Promise.resolve({ outcome: "dismissed" });
    window.dispatchEvent(fake);
  }, []);

  return (
    <div className="flex flex-col items-center gap-3">
      <button
        type="button"
        onClick={trigger}
        className="h-9 rounded-md border border-border bg-background px-3 text-sm font-medium text-foreground sd-tap hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        Show install prompt
      </button>
      <InstallPrompt />
    </div>
  );
}

// Demo wrapper for UpdateAvailableToast - toggles `available` via a trigger
// button so the toast only fires on demand.
function UpdateAvailableToastDemo() {
  const [available, setAvailable] = React.useState(false);
  return (
    <div className="flex flex-col items-center gap-3">
      <button
        type="button"
        onClick={() => setAvailable(true)}
        className="h-9 rounded-md border border-border bg-background px-3 text-sm font-medium text-foreground sd-tap hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        Trigger update toast
      </button>
      <UpdateAvailableToast
        available={available}
        onReload={() => {
          setAvailable(false);
          if (typeof window !== "undefined") window.location.reload();
        }}
      />
    </div>
  );
}

/* ============================================================
 * PWA & i18n - InstallPrompt, NetworkStatus, OfflineIndicator,
 *              ShareButton, UpdateAvailableToast, LocaleProvider
 * ============================================================ */
export function PWASection() {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <DemoCard
        title="InstallPrompt"
        description="PWA install button shown when the browser allows."
        code={`<InstallPrompt />`}
      >
        <InstallPromptDemo />
      </DemoCard>

      <DemoCard
        title="NetworkStatus"
        description="Real-time online/offline indicator for header or sidebar."
        code={`<NetworkStatus />
<NetworkStatus offlineLabel="No connection" />`}
      >
        <NetworkStatusBadgeDemo />
      </DemoCard>

      <DemoCard
        title="OfflineIndicator"
        description="Banner auto-show when device loses connection."
        code={`<OfflineIndicator
  message="You are offline."
/>`}
      >
        <div className="w-full space-y-2 text-center text-xs text-muted-foreground">
          <p>(auto-appear when offline)</p>
          <OfflineIndicator message="You are offline." />
        </div>
      </DemoCard>

      <DemoCard
        title="ShareButton"
        description="Native share via navigator.share with copy fallback."
        code={`<ShareButton
  title="Serayu UI"
  url="https://www.serayudigital.com"
/>`}
      >
        <div className="flex justify-center">
          <ShareButton
            title="Serayu UI"
            text="Mobile-first React components"
            url="https://www.serayudigital.com"
          />
        </div>
      </DemoCard>

      <DemoCard
        title="UpdateAvailableToast"
        description="Auto-notification when service worker detects a new version."
        code={`<UpdateAvailableToast available onReload={reload} />`}
      >
        <UpdateAvailableToastDemo />
      </DemoCard>

      <DemoCard
        title="LocaleProvider"
        description="i18n context for number, currency, date, and string formatting."
        code={`<LocaleProvider locale="id-ID">
  ...
</LocaleProvider>`}
      >
        <LocaleProviderDemo />
      </DemoCard>
    </div>
  );
}

function NetworkStatusBadgeDemo() {
  return (
    <div className="flex items-center justify-center gap-2">
      <NetworkStatus />
      <span className="text-xs text-muted-foreground">live indicator</span>
    </div>
  );
}

function LocaleProviderDemo() {
  const translations = {
    "id-ID": { hello: "Hello" },
    "en-US": { hello: "Hello" },
  };
  return (
    <LocaleProvider locale="en-US" translations={translations}>
      <div className="rounded-md border border-border bg-background p-3">
        <p className="text-sm">Hello, locale-aware components</p>
        <p className="text-xs text-muted-foreground">
          Locale context wraps child components
        </p>
      </div>
    </LocaleProvider>
  );
}

/* ============================================================
 * PATTERNS ADVANCED - Onboarding, ProfileHeader, SettingsList,
 *                      SearchResults, ChatBubble, SwipeActions,
 *                      OTPInput, CommandPalette, NotificationPermission
 * ============================================================ */
export function PatternsExtSection() {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <DemoCard
        title="Onboarding"
        description="First-launch carousel with skip and CTA. Stored in localStorage."
        code={`<Onboarding
  slides={[
    { id: "1", icon: <Rocket />, title: "Welcome" },
  ]}
/>`}
      >
        <OnboardingDemo />
      </DemoCard>

      <DemoCard
        title="ProfileHeader"
        description="Profile header with avatar, cover, stats, and follow CTA."
        code={`<ProfileHeader
  name="Andi Wijaya"
  stats={[...]}
/>`}
      >
        <ProfileHeader
          name="Andi Wijaya"
          fallback="AW"
          stats={[
            { label: "Posts", value: 124 },
            { label: "Followers", value: 1820 },
            { label: "Following", value: 312 },
          ]}
        />
      </DemoCard>

      <DemoCard
        title="SettingsList"
        description="Settings list with section, switch, link, and destructive actions."
        code={`<SettingsList
  sections={[
    {
      id: "account",
      title: "Account",
      items: [...],
    },
  ]}
/>`}
      >
        <SettingsList
          sections={[
            {
              id: "account",
              title: "Account",
              items: [
                {
                  id: "profile",
                  type: "link",
                  label: "Edit profile",
                  description: "Name, photo, bio",
                  onClick: () => {},
                },
                {
                  id: "email",
                  type: "info",
                  label: "Email",
                  value: "andi@example.com",
                },
              ],
            },
          ]}
        />
      </DemoCard>

      <DemoCard
        title="SearchResults"
        description="Search results with filter slot, loading skeleton, and empty state."
        code={`<SearchResults
  results={[...]}
  filters={...}
/>`}
      >
        <SearchResultsDemo />
      </DemoCard>

      <DemoCard
        title="ChatBubble"
        description="Incoming and outgoing chat bubbles with read receipt."
        code={`<ChatBubble variant="outgoing" timestamp="12:30">
  Hello!
</ChatBubble>`}
      >
        <div className="w-full max-w-xs space-y-2">
          <ChatBubble variant="incoming" timestamp="12:30">
            Hello there!
          </ChatBubble>
          <ChatBubble variant="outgoing" timestamp="12:31" read>
            Hi, how are you?
          </ChatBubble>
          <ChatBubble variant="incoming" timestamp="12:32">
            I am good, thanks!
          </ChatBubble>
        </div>
      </DemoCard>

      <DemoCard
        title="SwipeActions"
        description="Swipe row to reveal actions. Confirm destructive via AlertDialog."
        code={`<SwipeActions
  leftActions={[{ label: "Pin", tone: "brand" }]}
  rightActions={[{ label: "Delete", tone: "danger" }]}
>
  <Row>...</Row>
</SwipeActions>`}
      >
        <SwipeActions
          leftActions={[
            { label: "Pin", tone: "brand", onSelect: () => {} },
          ]}
          rightActions={[
            {
              label: "Delete",
              tone: "danger",
              onSelect: () => {},
              confirm: true,
            },
          ]}
        >
          <Card className="p-3">
            <div className="text-sm font-medium">Order #001</div>
            <div className="text-xs text-muted-foreground">
              Swipe me left or right
            </div>
          </Card>
        </SwipeActions>
      </DemoCard>

      <DemoCard
        title="OTPInput"
        description="N-digit OTP input with auto-advance and paste."
        code={`<OTPInput
  length={6}
  onComplete={(code) => verify(code)}
/>`}
      >
        <OTPInput length={6} onComplete={() => {}} />
      </DemoCard>

      <DemoCard
        title="CommandPalette"
        description="Global search dialog with Cmd/Ctrl+K shortcut."
        code={`<CommandPalette
  open={open}
  onOpenChange={setOpen}
  items={[...]}
/>`}
      >
        <CommandPaletteDemo />
      </DemoCard>

      <DemoCard
        title="NotificationPermission"
        description="Notification API permission button with state machine."
        code={`<NotificationPermission />`}
      >
        <div className="flex justify-center">
          <NotificationPermission />
        </div>
      </DemoCard>
    </div>
  );
}

function OnboardingDemo() {
  const [seed, setSeed] = React.useState(0);
  const showOnboarding = React.useCallback(() => {
    if (typeof window === "undefined") return;
    // Clear completed flag so the demo can re-trigger on demand.
    try {
      window.localStorage.removeItem("sd-onboarding-completed");
    } catch {
      // Ignore private-mode quota errors.
    }
    setSeed((s) => s + 1);
  }, []);
  return (
    <div className="flex flex-col items-center gap-3">
      <button
        type="button"
        onClick={showOnboarding}
        className="h-9 rounded-md border border-border bg-background px-3 text-sm font-medium text-foreground sd-tap hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        Show onboarding
      </button>
      <Onboarding
        key={seed}
        slides={[
          {
            id: "welcome",
            title: "Welcome",
            description: "Build mobile apps that feel native.",
            icon: <Sparkles aria-hidden className="h-10 w-10 text-brand" />,
          },
          {
            id: "components",
            title: "Ready-to-use components",
            description: "Bottom-nav, sheet, swipe - patterns, drop in.",
            icon: <Plus aria-hidden className="h-10 w-10 text-brand" />,
          },
        ]}
        onComplete={() => setSeed((s) => s + 1)}
      />
    </div>
  );
}

const SAMPLE_PRODUCTS = [
  {
    id: "1",
    title: "Sneakers Limited Edition",
    description: "Rp 1.200.000",
    meta: "Stock: 4",
    onClick: () => {},
  },
  {
    id: "2",
    title: "Smart Watch Series 9",
    description: "Rp 4.500.000",
    meta: "Stock: 12",
    onClick: () => {},
  },
  {
    id: "3",
    title: "Wireless Headphones",
    description: "Rp 850.000",
    meta: "Stock: 2",
    onClick: () => {},
  },
];

function SearchResultsDemo() {
  return (
    <SearchResults
      results={SAMPLE_PRODUCTS}
      filters={
        <Button size="sm" variant="outline">
          All
        </Button>
      }
    />
  );
}

function CommandPaletteDemo() {
  const [open, setOpen] = React.useState(false);
  return (
    <div className="flex flex-col items-center gap-3">
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="h-9 rounded-md border border-border bg-background px-3 text-sm font-medium text-foreground sd-tap hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        Open command palette
      </button>
      <p className="text-xs text-muted-foreground">
        Or press <kbd className="rounded border border-border bg-muted px-1.5 py-0.5 text-[10px] font-medium">Ctrl+K</kbd>
      </p>
      <CommandPalette
        open={open}
        onOpenChange={setOpen}
        items={[
          {
            id: "orders",
            label: "Orders",
            group: "Navigation",
            onSelect: () => {},
          },
          {
            id: "settings",
            label: "Settings",
            group: "Navigation",
            onSelect: () => {},
          },
          {
            id: "new",
            label: "Create new",
            group: "Actions",
            onSelect: () => {},
          },
        ]}
      />
    </div>
  );
}

/* ============================================================
 * HOOKS ADVANCED - useDebounce, useLocalStorage,
 *                   useClickOutside, useKeyboardShortcuts,
 *                   useIntersectionObserver
 * ============================================================ */
export function HooksExtSection() {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <DemoCard
        title="useDebounce"
        description="Debounce value - useful for search input or auto-save."
        code={`const debounced = useDebounce(value, 300);`}
      >
        <DebounceDemo />
      </DemoCard>

      <DemoCard
        title="useLocalStorage"
        description="State that automatically syncs with localStorage."
        code={`const [name, setName] = useLocalStorage("name", "");`}
      >
        <LocalStorageDemo />
      </DemoCard>

      <DemoCard
        title="useClickOutside"
        description="Triggers callback when click is outside the target element."
        code={`useClickOutside(ref, () => setOpen(false));`}
      >
        <ClickOutsideDemo />
      </DemoCard>

      <DemoCard
        title="useKeyboardShortcuts"
        description="Register global shortcuts for power user features."
        code={`useKeyboardShortcuts([
  { key: "mod+k", handler: open },
]);`}
      >
        <KeyboardShortcutsDemo />
      </DemoCard>

      <DemoCard
        title="useIntersectionObserver"
        description="Lazy trigger when element enters viewport."
        code={`const ref = useRef<HTMLDivElement>(null);
const entry = useIntersectionObserver(ref, { threshold: 0.5 });`}
      >
        <IntersectionObserverDemo />
      </DemoCard>

      <DemoCard
        title="usePrefersReducedMotion"
        description="Reactive boolean for prefers-reduced-motion media query."
        code={`const reduce = usePrefersReducedMotion();`}
      >
        <PrefersReducedMotionDemo />
      </DemoCard>

      <DemoCard
        title="useNetworkStatus"
        description="Tracks online/offline state with sticky wasOffline flag for back-online toasts."
        code={`const { isOnline, wasOffline } = useNetworkStatus();`}
      >
        <NetworkStatusDemo />
      </DemoCard>
    </div>
  );
}

function DebounceDemo() {
  const [value, setValue] = React.useState("");
  const debounced = useDebounce(value, 300);
  return (
    <div className="w-full max-w-sm space-y-2">
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Type to debounce..."
        inputSize="sm"
      />
      <p className="text-xs text-muted-foreground">
        debounced (300ms):{" "}
        <span className="font-mono">{debounced || "(empty)"}</span>
      </p>
    </div>
  );
}

function LocalStorageDemo() {
  const [name, setName] = useLocalStorage("sd-name", "");
  return (
    <div className="w-full max-w-sm space-y-2">
      <Input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Name"
        inputSize="sm"
      />
      <p className="text-xs text-muted-foreground">
        Stored in localStorage. Refresh the page to verify.
      </p>
    </div>
  );
}

function ClickOutsideDemo() {
  const [open, setOpen] = React.useState(false);
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const menuRef = React.useRef<HTMLDivElement>(null);
  const [pos, setPos] = React.useState<
    { top: number; left: number } | null
  >(null);
  const menuWidth = 176; // w-44

  useClickOutside(triggerRef, () => setOpen(false), {
    ignoreRefs: [menuRef],
  });

  const toggle = () => {
    if (open) {
      setOpen(false);
      return;
    }
    const trigger = triggerRef.current;
    if (!trigger) return;
    const rect = trigger.getBoundingClientRect();
    const menuHeight = 124; // 3 items + padding, approx
    const spaceBelow = window.innerHeight - rect.bottom;
    const placeAbove = spaceBelow < menuHeight + 8;
    const top = placeAbove
      ? rect.top - menuHeight - 4
      : rect.bottom + 4;
    const maxLeft = window.innerWidth - menuWidth - 8;
    const left = Math.min(Math.max(8, rect.left), maxLeft);
    setPos({ top, left });
    setOpen(true);
  };

  return (
    <>
      <Button
        ref={triggerRef}
        size="sm"
        variant="outline"
        onClick={toggle}
        aria-expanded={open}
        aria-haspopup="menu"
      >
        {open ? "Close menu" : "Open menu"}
      </Button>
      {open &&
        pos &&
        createPortal(
          <div
            ref={menuRef}
            role="menu"
            className="fixed z-50 w-44 rounded-md border border-border bg-background p-1 shadow-md"
            style={{ top: pos.top, left: pos.left }}
          >
            {["Profile", "Settings", "Help & feedback"].map((item) => (
              <button
                key={item}
                type="button"
                role="menuitem"
                onClick={() => {
                  alert(`${item} clicked`);
                  setOpen(false);
                }}
                className="block w-full rounded px-2.5 py-1.5 text-left text-sm hover:bg-muted focus-visible:outline-none focus-visible:bg-muted"
              >
                {item}
              </button>
            ))}
          </div>,
          document.body,
        )}
    </>
  );
}

function KeyboardShortcutsDemo() {
  const [pressed, setPressed] = React.useState<string[]>([]);
  useKeyboardShortcuts([
    { key: "g", handler: () => setPressed((p) => [...p, "g"]) },
    { key: "h", handler: () => setPressed((p) => [...p, "h"]) },
  ]);
  return (
    <div className="rounded-md border border-border bg-background p-3 text-xs">
      <p className="mb-1 text-muted-foreground">
        Press <kbd className="rounded bg-muted px-1">g</kbd> then{" "}
        <kbd className="rounded bg-muted px-1">h</kbd>
      </p>
      {pressed.length === 0
        ? "No shortcut pressed yet"
        : `Last: ${pressed[pressed.length - 1]}`}
    </div>
  );
}

function IntersectionObserverDemo() {
  const ref = React.useRef<HTMLDivElement>(null);
  const entry = useIntersectionObserver(ref, { threshold: 0.4 });
  const visible = entry?.isIntersecting ?? false;
  return (
    <div className="w-full space-y-2">
      <div
        ref={ref}
        className="flex h-24 w-full items-center justify-center rounded-md border border-border bg-surface text-sm"
      >
        {visible ? "Currently visible!" : "Scroll into the viewport"}
      </div>
      <p className="text-xs text-muted-foreground">
        Scroll down to trigger the element above.
      </p>
    </div>
  );
}

function PrefersReducedMotionDemo() {
  const reduce = usePrefersReducedMotion();
  return (
    <div className="w-full space-y-2">
      <div
        className={cn(
          "flex h-24 w-full items-center justify-center rounded-md border border-border text-sm",
          reduce ? "bg-muted" : "bg-surface",
        )}
      >
        {reduce
          ? "Reduce motion is enabled"
          : "Reduce motion is disabled"}
      </div>
      <p className="text-xs text-muted-foreground">
        Toggle the OS-level setting to see this update in real time.
      </p>
    </div>
  );
}

function NetworkStatusDemo() {
  const { isOnline, wasOffline } = useNetworkStatus();
  return (
    <div className="w-full space-y-2">
      <div className="flex items-center gap-2">
        <Chip
          variant={isOnline ? "success" : "danger"}
          size="sm"
        >
          {isOnline ? "Online" : "Offline"}
        </Chip>
        {wasOffline && isOnline ? (
          <Chip variant="info" size="sm">
            Back online
          </Chip>
        ) : null}
      </div>
      <div className="flex flex-wrap gap-2">
        <Button
          size="sm"
          variant="outline"
          onClick={() =>
            window.dispatchEvent(new Event("offline"))
          }
        >
          Simulate offline
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() =>
            window.dispatchEvent(new Event("online"))
          }
        >
          Simulate online
        </Button>
      </div>
    </div>
  );
}

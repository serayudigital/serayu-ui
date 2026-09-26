// Add-on sections: items distributed to their matching category.
// AnimatedNumber → DataViz. MultiSelectCombobox + ColorPicker → FormsExt.
// PhotoViewer + LoginScreen + OTPForm + BiometricPrompt + StoryReels +
// MapPreview + CommandBar → PatternsExt. BarChart / LineChart / Heatmap
// → DataViz. VirtualList → Data. ThemeCustomizer → PWA.
import * as React from "react";
import {
  Copy,
  Share2,
  MessageCircle,
  Trash2,
  Edit3,
  Play,
  Image as ImageIcon,
  User,
  Bell,
  Settings,
  Rocket,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { AnimatedNumber } from "@/components/ui/animated-number";
import { MultiSelectCombobox } from "@/components/ui/multiselect-combobox";
import { PhotoViewer } from "@/components/ui/photo-viewer";
import { ColorPicker } from "@/components/ui/color-picker";
import { Carousel } from "@/components/ui/carousel";
import {
  BarChart,
  LineChart,
  Heatmap,
} from "@/components/ui/charts";
import { VirtualList } from "@/components/ui/virtual-list";
import { DatePicker } from "@/components/ui/date-picker";
import {
  DateRangePicker,
  type DateRange,
  type DateRangePreset,
} from "@/components/ui/date-range-picker";
import { LoginScreen } from "@/components/patterns/auth-login";
import { OTPForm } from "@/components/patterns/auth-otp";
import { BiometricPrompt } from "@/components/patterns/auth-biometric";
// MapPreview + StoryReelsViewer are lazy-loaded (code split)
// to keep playground First Contentful Paint low. Bundle stays
// eager-exported from the package; lazy is only for the showcase.
const LazyStoryReelsViewer = React.lazy(() =>
  import("@/components/patterns/story-reels-viewer").then((m) => ({
    default: m.StoryReelsViewer,
  }))
);
const LazyMapPreview = React.lazy(() =>
  import("@/components/patterns/map-preview").then((m) => ({
    default: m.MapPreview,
  }))
);
import { CommandBarMobile } from "@/components/patterns/command-bar-mobile";
import { ThemeCustomizer } from "@/components/patterns/theme-customizer";
import { Tour, useTour, type TourStep } from "@/components/patterns/tour";
import { DEFAULT_THEME, type ThemeOverrides } from "@/lib/theme-presets";
import { formatPhoneNumber } from "@/lib/utils";
import { DataTable, type Column } from "@/components/patterns/data-table";
import { DemoCard } from "./demo-card";

/** Standard Suspense fallback for lazy components. */
const lazyFallback = (
  <div className="flex h-32 items-center justify-center text-sm text-muted-foreground">
    Loading...
  </div>
);

/* ============================================================
 * DATA VIZ ADDONS - AnimatedNumber, BarChart, LineChart, Heatmap
 * (Combined with DataVizSection in sections-extended.tsx)
 * ============================================================ */
export function DataVizAddOnSection() {
  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-2">
        <DemoCard
          title="AnimatedNumber"
          description="Count-up animation for stats in dashboard, e-commerce, or wallet."
          code={`const [value, setValue] = React.useState(0);
React.useEffect(() => {
  const t = setInterval(() => setValue((v) => v + 100), 1500);
  return () => clearInterval(t);
}, []);
<AnimatedNumber value={value} duration={1000} />`}
        >
          <AnimatedNumberDemo />
        </DemoCard>

        <DemoCard
          title="BarChart"
          description="Vertical/horizontal bar chart with token color options."
          code={`<BarChart
  data={[
    { label: "Mon", value: 12 },
    { label: "Tue", value: 18 },
    { label: "Wed", value: 9 },
  ]}
  showValues
  color="brand"
/>`}
        >
          <BarChartDemo />
        </DemoCard>

        <DemoCard
          title="LineChart"
          description="Line chart with smooth curves, optional area fill."
          code={`<LineChart
  data={[
    { label: "Jan", value: 10 },
    { label: "Feb", value: 25 },
    { label: "Mar", value: 18 },
  ]}
  smooth
  showArea
/>`}
        >
          <LineChartDemo />
        </DemoCard>

        <DemoCard
          title="Heatmap"
          description="Contributor-style heatmap for daily tracker. Functional gradient."
          code={`<Heatmap data={data} levels={5} cellSize={12} />`}
        >
          <HeatmapDemo />
        </DemoCard>
      </div>
    </div>
  );
}

/* ============================================================
 * DATA ADDONS - VirtualList
 * ============================================================ */
export function DataAddOnSection() {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <DemoCard
        title="VirtualList"
        description="Windowing for 10K+ item lists. Fixed or variable size."
        code={`<VirtualList
  items={Array.from({ length: 10000 }, (_, i) => ({ id: i, label: \`Item \${i}\` }))}
  itemHeight={48}
  height={400}
  renderItem={(item) => <Row item={item} />}
/>`}
      >
        <VirtualListDemo />
      </DemoCard>

      <DemoCard
        title="Carousel"
        description="CSS scroll-snap native. Responsive items per view + loop + autoplay."
        code={`<Carousel
  items={photos}
  renderItem={(p) => <img src={p.url} alt={p.alt} />}
  itemsPerView={{ sm: 1, md: 2, lg: 3 }}
  showDots
  showArrows
  autoplay={{ intervalMs: 4000, pauseOnHover: true }}
/>`}
      >
        <CarouselDemo />
      </DemoCard>

      <DemoCard
        title="DataTable++"
        description="Sortable columns + pagination. Header click toggles asc/desc; pageSize splits rows into pages."
        code={`<DataTable
  columns={[
    { key: "name", header: "Name" },
    { key: "age", header: "Age", sortable: true, sortAccessor: r => r.age },
  ]}
  data={rows}
  keyExtractor={r => r.id}
  pageSize={5}
  defaultSort={{ key: "age", direction: "asc" }}
/>`}
      >
        <DataTableSortPaginationDemo />
      </DemoCard>

      <DemoCard
        title="DatePicker"
        description="Monday-first calendar with month swipe + prev/next button. Single date selection."
        code={`const [date, setDate] = React.useState<Date>();
<DatePicker
  value={date}
  onChange={setDate}
  minDate={new Date(2026, 0, 1)}
  maxDate={new Date(2026, 11, 31)}
/>`}
      >
        <DatePickerDemo />
      </DemoCard>

      <DemoCard
        title="DateRangePicker"
        description="First tap = start, second tap = end. Auto-swap if the second tap lands before start. Optional quick presets."
        code={`const presets: DateRangePreset[] = [
  {
    label: "Last 7 days",
    range: () => {
      const end = new Date();
      const start = new Date();
      start.setDate(start.getDate() - 6);
      return { start, end };
    },
  },
];
const [range, setRange] = React.useState<DateRange>();
<DateRangePicker
  value={range}
  onChange={setRange}
  presets={presets}
/>`}
      >
        <DateRangePickerDemo />
      </DemoCard>
    </div>
  );
}

/* ============================================================
 * FORMS EXT ADDONS - MultiSelectCombobox, ColorPicker,
 * formatPhoneNumber (util)
 * ============================================================ */
export function FormsExtAddOnSection() {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <DemoCard
        title="MultiSelectCombobox"
        description="Pick multiple items with removable chips. Inline creation supported (TagInput)."
        code={`const [value, setValue] = React.useState<string[]>([]);
<MultiSelectCombobox
  items={tags}
  value={value}
  onValueChange={setValue}
  placeholder="Select tag..."
  canCreate
  onCreate={(label) => setValue([...value, label.toLowerCase()])}
  maxItems={5}
/>`}
      >
        <MultiSelectComboboxDemo />
      </DemoCard>

      <DemoCard
        title="ColorPicker"
        description="HSL spectrum box + hue bar. Supports hex input and presets."
        code={`const [color, setColor] = React.useState("#3b82f6");
<ColorPicker
  value={color}
  onChange={setColor}
  presets={["#ef4444", "#f59e0b", "#10b981", "#3b82f6", "#8b5cf6"]}
  label="Pick color"
/>`}
      >
        <ColorPickerDemo />
      </DemoCard>

      <DemoCard
        title="formatPhoneNumber (util)"
        description="Format phone numbers from user input into a clean display."
        code={`import { formatPhoneNumber } from "@/lib/utils";
formatPhoneNumber("081234567890"); // "+62 812-3456-7890"
formatPhoneNumber("081234567890", { format: "local" }); // "0812-3456-7890"
formatPhoneNumber("invalid"); // null`}
      >
        <FormatPhoneNumberDemo />
      </DemoCard>
    </div>
  );
}

/* ============================================================
 * PATTERNS EXT ADDONS - PhotoViewer, Auth flows,
 * StoryReelsViewer, MapPreview, CommandBarMobile
 * ============================================================ */
export function PatternsExtAddOnSection() {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <DemoCard
        title="PhotoViewer"
        description="Lightbox swipeable + pinch-zoom + double-tap zoom + swipe dismiss."
        code={`const [open, setOpen] = React.useState(false);
<Button onClick={() => setOpen(true)}>Open</Button>
<PhotoViewer
  open={open}
  onOpenChange={setOpen}
  images={images}
  startIndex={0}
/>`}
      >
        <PhotoViewerDemo />
      </DemoCard>

      <DemoCard
        title="LoginScreen"
        description="Login shell with email or phone identifier + password or PIN secret. Adapter callback."
        code={`const [err, setErr] = React.useState<string>();
<LoginScreen
  identifierType="both"
  onSubmit={async ({ secret }) => {
    await fakeSignIn(secret);
  }}
  error={err}
/>`}
      >
        <LoginScreenDemo />
      </DemoCard>

      <DemoCard
        title="OTPForm"
        description="4/6-digit verification with resend cooldown and phone or email target."
        code={`<OTPForm
  length={6}
  target="phone"
  targetLabel="0812-3456-7890"
  onComplete={async (code) => {
    if (code !== "123456") setErr("Wrong code");
  }}
  onResend={async () => {}}
/>`}
      >
        <OTPFormDemo />
      </DemoCard>

      <DemoCard
        title="BiometricPrompt"
        description="Biometric confirmation (WebAuthn) with PIN or password fallback."
        code={`<BiometricPrompt
  title="Confirm purchase"
  onConfirm={async () => {}}
  onFallback={() => goToPinScreen()}
  available
/>`}
      >
        <BiometricPromptDemo />
      </DemoCard>

      <DemoCard
        title="StoryReelsViewer"
        description="Vertical pager like Instagram stories. Auto-advance + tap pause + tap zone."
        code={`const [open, setOpen] = React.useState(false);
<Button onClick={() => setOpen(true)}>Open story</Button>
<StoryReelsViewer
  open={open}
  onOpenChange={setOpen}
  slides={slides}
  onComplete={() => setOpen(false)}
/>`}
      >
        <StoryReelsDemo />
      </DemoCard>

      <DemoCard
        title="MapPreview"
        description="3x3 OSM tile with pin. Tap opens external map."
        code={`<MapPreview
  lat={-6.2088}
  lng={106.8456}
  zoom={15}
  height={200}
  markerLabel="Monas"
  onTap={() => openExternalMaps()}
/>`}
      >
        <MapPreviewDemo />
      </DemoCard>

      <DemoCard
        title="CommandBarMobile"
        description="Bottom sheet like an iOS share sheet. Grouped actions, destructive styling."
        code={`<CommandBarMobile
  open={open}
  onOpenChange={setOpen}
  title="Quick actions"
  groups={[
    { label: "Share", items: [...] },
    { label: "More", items: [...] },
  ]}
/>`}
      >
        <CommandBarDemo />
      </DemoCard>

      <DemoCard
        title="Tour"
        description="Guided walkthrough with spotlight + auto-positioned tooltip on the target element."
        code={`const tour = useTour([
  { id: "create", target: "[data-tour=create]",
    title: "Create new", description: "..." },
  { id: "notif",  target: "[data-tour=notif]",
    title: "Notifications", description: "..." },
]);
<Button data-tour="create" onClick={tour.start}>Start</Button>
<Tour steps={steps} tour={tour} />`}
      >
        <TourDemo />
      </DemoCard>
    </div>
  );
}

/* ============================================================
 * PWA & i18n ADDONS - ThemeCustomizer
 * ============================================================ */
export function PWAAddOnSection() {
  return (
    <div className="grid gap-6">
      <DemoCard
        title="ThemeCustomizer"
        description="Live preview token sd- via inline style scope. 4 preset (Serayu/Garuda/Tropical/Midnight)."
        code={`const [overrides, setOverrides] = React.useState<ThemeOverrides>(DEFAULT_THEME);
<ThemeCustomizer
  value={overrides}
  onChange={setOverrides}
  scope="container"
/>`}
      >
        <ThemeCustomizerDemo />
      </DemoCard>
    </div>
  );
}

/* ============================================================
 * DEMOS
 * ============================================================ */

function AnimatedNumberDemo() {
  const [value, setValue] = React.useState(0);
  React.useEffect(() => {
    const t = setInterval(() => setValue((v) => v + 100), 1500);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-baseline gap-2">
        <span className="text-3xl font-bold text-brand">
          <AnimatedNumber value={value} duration={1000} />
        </span>
        <span className="text-sm text-muted-foreground">items sold</span>
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-semibold">
          <AnimatedNumber
            value={value * 12000}
            duration={1000}
            format="rupiah"
          />
        </span>
        <span className="text-sm text-muted-foreground">revenue</span>
      </div>
    </div>
  );
}

function BarChartDemo() {
  return (
    <BarChart
      data={[
        { label: "Mon", value: 12 },
        { label: "Tue", value: 18 },
        { label: "Wed", value: 9 },
        { label: "Thu", value: 24 },
        { label: "Fri", value: 30 },
        { label: "Sat", value: 22 },
        { label: "Sun", value: 14 },
      ]}
      showValues
      color="brand"
      ariaLabel="Daily visitors"
    />
  );
}

function LineChartDemo() {
  return (
    <LineChart
      data={[
        { label: "Jan", value: 10 },
        { label: "Feb", value: 25 },
        { label: "Mar", value: 18 },
        { label: "Apr", value: 32 },
        { label: "May", value: 28 },
        { label: "Jun", value: 40 },
      ]}
      smooth
      showArea
      ariaLabel="Monthly revenue"
    />
  );
}

function HeatmapDemo() {
  const data = React.useMemo(() => {
    const out: { date: string; value: number }[] = [];
    const today = new Date();
    for (let i = 89; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      out.push({
        date: d.toISOString().slice(0, 10),
        value: Math.floor(Math.random() * 10),
      });
    }
    return out;
  }, []);
  return <Heatmap data={data} levels={5} cellSize={12} ariaLabel="90 days of activity" />;
}

interface VirtualRow {
  id: number;
  label: string;
}

function VirtualListDemo() {
  const items: VirtualRow[] = React.useMemo(
    () =>
      Array.from({ length: 10000 }, (_, i) => ({
        id: i,
        label: `Item #${i}`,
      })),
    []
  );
  return (
    <VirtualList
      items={items}
      itemHeight={48}
      height={300}
      ariaLabel="List of 10K items"
      renderItem={(item) => (
        <div className="flex h-12 items-center justify-between border-b border-border px-3 text-sm">
          <span>{item.label}</span>
          <Button size="sm" variant="ghost" onClick={() => alert(`Item ${item.id}`)}>
            Open
          </Button>
        </div>
      )}
    />
  );
}

function MultiSelectComboboxDemo() {
  const [value, setValue] = React.useState<string[]>(["react"]);
  const items = [
    { value: "react", label: "React" },
    { value: "typescript", label: "TypeScript" },
    { value: "vite", label: "Vite" },
    { value: "tailwind", label: "Tailwind" },
    { value: "radix", label: "Radix" },
  ];
  return (
    <MultiSelectCombobox
      items={items}
      value={value}
      onValueChange={setValue}
      placeholder="Select stack..."
      canCreate
      onCreate={(label) => setValue([...value, label.toLowerCase()])}
      maxItems={5}
    />
  );
}

function ColorPickerDemo() {
  const [color, setColor] = React.useState("#3b82f6");
  return (
    <div className="flex flex-col items-center gap-3">
      <ColorPicker
        value={color}
        onChange={setColor}
        presets={["#ef4444", "#f59e0b", "#10b981", "#3b82f6", "#8b5cf6", "#ec4899"]}
        label="Pick color"
      />
      <p className="font-mono text-xs text-muted-foreground">{color}</p>
      <div
        className="h-10 w-full rounded-md border border-border"
        style={{ backgroundColor: color }}
        aria-hidden
      />
    </div>
  );
}

function FormatPhoneNumberDemo() {
  const samples = [
    "081234567890",
    "+6281234567890",
    "0812 3456 7890",
    "081-234-567-890",
  ];
  return (
    <div className="space-y-2 text-sm">
      {samples.map((s) => (
        <div
          key={s}
          className="flex items-center justify-between gap-2 rounded border border-border bg-background px-2 py-1.5"
        >
          <code className="font-mono text-xs text-muted-foreground">{s}</code>
          <code className="font-mono text-xs text-brand">
            {formatPhoneNumber(s) ?? "(invalid)"}
          </code>
        </div>
      ))}
    </div>
  );
}

function placeholderSvgSrc(color: string, label: string) {
  return `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600"><rect width="100%" height="100%" fill="${color}"/><text x="50%" y="50%" fill="white" font-family="sans-serif" font-size="64" text-anchor="middle" dominant-baseline="middle">${label}</text></svg>`
  )}`;
}

function PhotoViewerDemo() {
  const [open, setOpen] = React.useState(false);
  const images = [
    { src: placeholderSvgSrc("#0064f0", "1"), alt: "1" },
    { src: placeholderSvgSrc("#dc2626", "2"), alt: "2" },
    { src: placeholderSvgSrc("#0d9488", "3"), alt: "3" },
    { src: placeholderSvgSrc("#7c3aed", "4"), alt: "4" },
  ];
  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        leftIcon={<ImageIcon className="h-4 w-4" />}
      >
        Open photo viewer
      </Button>
      <PhotoViewer
        open={open}
        onOpenChange={setOpen}
        images={images}
        startIndex={0}
      />
    </>
  );
}

function LoginScreenDemo() {
  const [error, setError] = React.useState<string | undefined>();
  return (
    <LoginScreen
      title="Sign in"
      subtitle="Login demo"
      identifierType="both"
      onSubmit={async ({ secret }) => {
        if (secret.length < 6) {
          setError("Password must be at least 6 characters.");
          return { error: "Password must be at least 6 characters." };
        }
        setError(undefined);
      }}
      error={error}
      footer={
        <a className="text-brand hover:underline" href="#">
          No account yet? Sign up
        </a>
      }
    />
  );
}

function OTPFormDemo() {
  const [error, setError] = React.useState<string | undefined>();
  return (
    <OTPForm
      length={6}
      target="phone"
      targetLabel="0812-3456-7890"
      resendCooldown={10}
      onComplete={async (code) => {
        if (code !== "123456") {
          setError("Wrong code. Try 123456.");
          return { error: "Wrong code" };
        }
        setError(undefined);
      }}
      onResend={async () => {
        // simulation
      }}
      error={error}
    />
  );
}

function BiometricPromptDemo() {
  return (
    <BiometricPrompt
      title="Confirm demo"
      description="Static demo. Activate in a real app with onConfirm."
      onConfirm={async () => {
        // simulation
      }}
      onFallback={() => alert("Use PIN")}
      available
    />
  );
}

function StoryReelsDemo() {
  const [open, setOpen] = React.useState(false);
  const slides = [
    {
      id: "1",
      type: "image" as const,
      src: placeholderSvgSrc("#0064f0", "1"),
      durationMs: 4000,
      overlay: <Button size="sm">View offer</Button>,
    },
    {
      id: "2",
      type: "image" as const,
      src: placeholderSvgSrc("#dc2626", "2"),
      durationMs: 4000,
    },
    {
      id: "3",
      type: "image" as const,
      src: placeholderSvgSrc("#0d9488", "3"),
      durationMs: 4000,
      overlay: <Button size="sm">Buy now</Button>,
    },
  ];
  return (
    <>
      <Button onClick={() => setOpen(true)} leftIcon={<Play className="h-4 w-4" />}>
        Open story (3 slide)
      </Button>
      <React.Suspense fallback={lazyFallback}>
        <LazyStoryReelsViewer
          open={open}
          onOpenChange={setOpen}
          slides={slides}
          onComplete={() => setOpen(false)}
        />
      </React.Suspense>
    </>
  );
}

function MapPreviewDemo() {
  return (
    <React.Suspense fallback={lazyFallback}>
      <LazyMapPreview
        lat={-6.2088}
        lng={106.8456}
        zoom={15}
        height={200}
        markerLabel="Monas, Jakarta"
        onTap={() =>
          alert("Tap! Will open Google Maps in a real app.")
        }
      />
    </React.Suspense>
  );
}

function CommandBarDemo() {
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        leftIcon={<Share2 className="h-4 w-4" />}
      >
        Open command bar
      </Button>
      <CommandBarMobile
        open={open}
        onOpenChange={setOpen}
        title="Quick actions"
        snapPoints={["medium", "full"]}
        groups={[
          {
            label: "Share",
            items: [
              {
                id: "copy",
                label: "Copy link",
                description: "Copy URL to clipboard",
                icon: <Copy className="h-4 w-4" />,
                onSelect: () => alert("Link copied"),
              },
              {
                id: "wa",
                label: "Send to WhatsApp",
                description: "Share via chat",
                icon: <MessageCircle className="h-4 w-4" />,
                onSelect: () => alert("Open WhatsApp"),
              },
            ],
          },
          {
            label: "Manage",
            items: [
              {
                id: "edit",
                label: "Edit",
                description: "Edit details",
                icon: <Edit3 className="h-4 w-4" />,
                onSelect: () => alert("Mode edit"),
              },
              {
                id: "del",
                label: "Delete",
                description: "This action cannot be undone",
                icon: <Trash2 className="h-4 w-4" />,
                onSelect: () => alert("Delete"),
                destructive: true,
              },
            ],
          },
        ]}
      />
    </>
  );
}

function ThemeCustomizerDemo() {
  const [overrides, setOverrides] = React.useState<ThemeOverrides>(DEFAULT_THEME);
  return <ThemeCustomizer value={overrides} onChange={setOverrides} scope="container" />;
}

interface Photo {
  id: string;
  url: string;
  alt: string;
}

const SAMPLE_PHOTOS: Photo[] = [
  { id: "p1", url: "https://picsum.photos/seed/serayu1/600/400", alt: "Landscape 1" },
  { id: "p2", url: "https://picsum.photos/seed/serayu2/600/400", alt: "Landscape 2" },
  { id: "p3", url: "https://picsum.photos/seed/serayu3/600/400", alt: "Landscape 3" },
  { id: "p4", url: "https://picsum.photos/seed/serayu4/600/400", alt: "Landscape 4" },
  { id: "p5", url: "https://picsum.photos/seed/serayu5/600/400", alt: "Landscape 5" },
];

function CarouselDemo() {
  return (
    <Carousel
      items={SAMPLE_PHOTOS}
      renderItem={(p) => (
        <div className="overflow-hidden rounded-md border border-border">
          <img
            src={p.url}
            alt={p.alt}
            loading="lazy"
            className="aspect-[3/2] w-full object-cover"
          />
        </div>
      )}
      itemsPerView={{ sm: 1, md: 2, lg: 3 }}
      gap={12}
      showDots
      showArrows
      ariaLabel="Photo gallery"
    />
  );
}

interface PersonRow {
  id: string;
  name: string;
  city: string;
  age: number;
}

const SAMPLE_PEOPLE: PersonRow[] = [
  { id: "1", name: "Budi Santoso", city: "Jakarta", age: 28 },
  { id: "2", name: "Ani Rahmawati", city: "Bandung", age: 34 },
  { id: "3", name: "Citra Dewi", city: "Surabaya", age: 22 },
  { id: "4", name: "Dedi Kurniawan", city: "Yogyakarta", age: 41 },
  { id: "5", name: "Eka Putri", city: "Semarang", age: 29 },
  { id: "6", name: "Fajar Nugroho", city: "Medan", age: 36 },
  { id: "7", name: "Gita Pertiwi", city: "Denpasar", age: 25 },
  { id: "8", name: "Hadi Wibowo", city: "Makassar", age: 45 },
  { id: "9", name: "Indah Lestari", city: "Malang", age: 31 },
  { id: "10", name: "Joko Susanto", city: "Solo", age: 38 },
  { id: "11", name: "Kartika Sari", city: "Palembang", age: 27 },
  { id: "12", name: "Lutfi Hakim", city: "Bali", age: 33 },
];

function DataTableSortPaginationDemo() {
  const columns: Column<PersonRow>[] = [
    { key: "name", header: "Name" },
    { key: "city", header: "City" },
    {
      key: "age",
      header: "Age",
      sortable: true,
      sortAccessor: (r) => r.age,
    },
  ];
  return (
    <div className="w-full">
      <DataTable
        columns={columns}
        data={SAMPLE_PEOPLE}
        keyExtractor={(r) => r.id}
        pageSize={5}
        defaultSort={{ key: "age", direction: "asc" }}
        pageLabel={(from, to) => `${from} - ${to} from ${SAMPLE_PEOPLE.length}`}
      />
    </div>
  );
}

function TourDemo() {
  const tour = useTour(T_DEMO_STEPS, { storageKey: "sd-playground-tour" });
  return (
    <>
      <div className="flex flex-wrap items-center gap-2">
        <Button
          data-tour="t-create"
          leftIcon={<Rocket className="h-4 w-4" />}
          onClick={tour.start}
        >
          Start tour
        </Button>
        <Button data-tour="t-profile" variant="outline" leftIcon={<User className="h-4 w-4" />}>
          Profile
        </Button>
        <Button data-tour="t-notif" variant="outline" leftIcon={<Bell className="h-4 w-4" />}>
          Notifications
        </Button>
        <Button data-tour="t-settings" variant="ghost" leftIcon={<Settings className="h-4 w-4" />}>
          Settings
        </Button>
      </div>
      <Tour steps={T_DEMO_STEPS} tour={tour} onSkip={() => {}} />
    </>
  );
}

const T_DEMO_STEPS: TourStep[] = [
  {
    id: "create",
    target: "[data-tour=t-create]",
    title: "Primary button",
    description: "Start a new action from here. Click to create an item.",
    placement: "bottom",
  },
  {
    id: "profile",
    target: "[data-tour=t-profile]",
    title: "Your profile",
    description: "View and edit your personal data.",
    placement: "bottom",
  },
  {
    id: "notif",
    target: "[data-tour=t-notif]",
    title: "Notifications",
    description: "Recent notifications will appear here.",
    placement: "bottom",
  },
  {
    id: "settings",
    target: "[data-tour=t-settings]",
    title: "Settings",
    description: "Manage your application and account preferences.",
    placement: "bottom",
  },
];

function DatePickerDemo() {
  const [date, setDate] = React.useState<Date | undefined>(new Date(2026, 11, 31));
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="text-sm font-medium text-foreground">
        {date
          ? `Selected: ${date.toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" })}`
          : "No date selected yet."}
      </div>
      <DatePicker
        value={date}
        onChange={setDate}
        minDate={new Date(2026, 0, 1)}
        maxDate={new Date(2026, 11, 31)}
      />
    </div>
  );
}

function DateRangePickerDemo() {
  const presets: DateRangePreset[] = [
    {
      label: "Last 7 days",
      range: () => {
        const end = new Date();
        const start = new Date();
        start.setDate(start.getDate() - 6);
        return { start, end };
      },
    },
    {
      label: "This month",
      range: () => {
        const now = new Date();
        const start = new Date(now.getFullYear(), now.getMonth(), 1);
        const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        return { start, end };
      },
    },
    {
      label: "Last 30 days",
      range: () => {
        const end = new Date();
        const start = new Date();
        start.setDate(start.getDate() - 29);
        return { start, end };
      },
    },
  ];
  const [range, setRange] = React.useState<DateRange | undefined>();
  return (
    <DateRangePicker
      value={range}
      onChange={setRange}
      presets={presets}
      className="w-full max-w-md"
    />
  );
}

import * as React from "react";
import {
  Sparkles,
  ArrowLeft,
  Menu,
  X,
  Layers,
  Smartphone,
  Palette,
  Cpu,
  Search,
  Github,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Toaster } from "@/components/ui/toaster";
import { Separator } from "@/components/ui/separator";
import { SerayuLogo } from "@/components/serayu-logo";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/cn";
import { useIsDesktop } from "@/hooks/use-media-query";
import {
  ActionsSection,
  LayoutSection,
  FeedbackSection,
  FormsSection,
  NavigationSection,
  OverlaysSection,
  DataSection,
  PatternsSection,
  HooksSection,
} from "./sections";
import {
  FormsExtSection,
  DataVizSection,
  PWASection,
  PatternsExtSection,
  HooksExtSection,
} from "./sections-extended";
import {
  FormsExtAddOnSection,
  DataAddOnSection,
  DataVizAddOnSection,
  PatternsExtAddOnSection,
  PWAAddOnSection,
} from "./sections-addons";

// Sidebar category list. Order = render order in content.
type CategoryId =
  | "actions"
  | "layout"
  | "feedback"
  | "forms"
  | "forms-ext"
  | "navigation"
  | "overlays"
  | "data"
  | "data-viz"
  | "pwa"
  | "patterns"
  | "patterns-ext"
  | "hooks"
  | "hooks-ext";

interface NavCategory {
  id: CategoryId;
  label: string;
  group: "UI Components" | "Patterns" | "Hooks";
  count: number;
}

const CATEGORIES: NavCategory[] = [
  { id: "actions", label: "Actions", group: "UI Components", count: 4 },
  { id: "layout", label: "Layout", group: "UI Components", count: 6 },
  { id: "feedback", label: "Feedback", group: "UI Components", count: 2 },
  { id: "forms", label: "Forms", group: "UI Components", count: 6 },
  { id: "forms-ext", label: "Forms Advanced", group: "UI Components", count: 12 },
  { id: "navigation", label: "Navigation", group: "UI Components", count: 2 },
  { id: "overlays", label: "Overlays", group: "UI Components", count: 8 },
  { id: "data", label: "Data", group: "UI Components", count: 8 },
  { id: "data-viz", label: "Charts", group: "UI Components", count: 7 },
  { id: "pwa", label: "PWA & i18n", group: "UI Components", count: 7 },
  { id: "patterns", label: "Mobile Patterns", group: "Patterns", count: 11 },
  { id: "patterns-ext", label: "Patterns Advanced", group: "Patterns", count: 19 },
  { id: "hooks", label: "Hooks", group: "Hooks", count: 4 },
  { id: "hooks-ext", label: "Hooks Advanced", group: "Hooks", count: 7 },
];

const SECTION_TITLES: Record<CategoryId, string> = {
  actions: "Actions",
  layout: "Layout",
  feedback: "Feedback",
  forms: "Forms",
  "forms-ext": "Forms Advanced",
  navigation: "Navigation",
  overlays: "Overlays",
  data: "Data",
  "data-viz": "Charts",
  pwa: "PWA & i18n",
  patterns: "Mobile Patterns",
  "patterns-ext": "Patterns Advanced",
  hooks: "Hooks",
  "hooks-ext": "Hooks Advanced",
};

export default function PlaygroundApp() {
  const [activeId, setActiveId] = React.useState<CategoryId>("actions");
  const [search, setSearch] = React.useState("");
  const [mobileNavOpen, setMobileNavOpen] = React.useState(false);
  const isDesktop = useIsDesktop();

  // Highlight the category currently in view while scrolling.
  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) {
          setActiveId(visible[0].target.id as CategoryId);
        }
      },
      { rootMargin: "-30% 0px -55% 0px", threshold: [0, 0.25, 0.5, 0.75] }
    );
    CATEGORIES.forEach((c) => {
      const el = document.getElementById(c.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const goTo = (id: CategoryId) => {
    setMobileNavOpen(false);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const filtered = React.useMemo(() => {
    if (!search.trim()) return CATEGORIES;
    const q = search.toLowerCase();
    return CATEGORIES.filter(
      (c) =>
        c.label.toLowerCase().includes(q) ||
        SECTION_TITLES[c.id].toLowerCase().includes(q) ||
        c.group.toLowerCase().includes(q)
    );
  }, [search]);

  const grouped = React.useMemo(() => {
    const groups: Record<string, NavCategory[]> = {};
    filtered.forEach((c) => {
      if (!groups[c.group]) groups[c.group] = [];
      groups[c.group].push(c);
    });
    return groups;
  }, [filtered]);

  return (
    <>
      <Toaster />

      {/* Skip link for keyboard accessibility */}
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-2 focus:top-2 focus:z-50 focus:rounded-md focus:bg-brand focus:px-3 focus:py-1.5 focus:text-sm focus:font-medium focus:text-brand-foreground"
      >
        Skip to content
      </a>

      <div className="min-h-screen bg-background text-foreground">
        <TopBar
          onMenuClick={() => setMobileNavOpen((v) => !v)}
          showMenuButton={!isDesktop}
        />

        <div className="mx-auto flex w-full max-w-[1400px]">
          <Sidebar
            grouped={grouped}
            activeId={activeId}
            search={search}
            setSearch={setSearch}
            onSelect={goTo}
            mobileOpen={mobileNavOpen}
            onClose={() => setMobileNavOpen(false)}
          />

          <main
            id="main"
            className="min-w-0 flex-1 px-4 pb-20 pt-6 md:px-8 md:pb-24 md:pt-10"
          >
            <Hero />

            <div className="mt-12 space-y-20 md:mt-16 md:space-y-28">
              <SectionShell id="actions" eyebrow="UI Components" title={SECTION_TITLES.actions}>
                <ActionsSection />
              </SectionShell>

              <SectionShell id="layout" eyebrow="UI Components" title={SECTION_TITLES.layout}>
                <LayoutSection />
              </SectionShell>

              <SectionShell id="feedback" eyebrow="UI Components" title={SECTION_TITLES.feedback}>
                <FeedbackSection />
              </SectionShell>

              <SectionShell id="forms" eyebrow="UI Components" title={SECTION_TITLES.forms}>
                <FormsSection />
              </SectionShell>

              <SectionShell id="forms-ext" eyebrow="UI Components" title={SECTION_TITLES["forms-ext"]}>
                <FormsExtSection />
                <FormsExtAddOnSection />
              </SectionShell>

              <SectionShell id="navigation" eyebrow="UI Components" title={SECTION_TITLES.navigation}>
                <NavigationSection />
              </SectionShell>

              <SectionShell id="overlays" eyebrow="UI Components" title={SECTION_TITLES.overlays}>
                <OverlaysSection />
              </SectionShell>

              <SectionShell id="data" eyebrow="UI Components" title={SECTION_TITLES.data}>
                <DataSection />
                <DataAddOnSection />
              </SectionShell>

              <SectionShell id="data-viz" eyebrow="UI Components" title={SECTION_TITLES["data-viz"]}>
                <DataVizSection />
                <DataVizAddOnSection />
              </SectionShell>

              <SectionShell id="pwa" eyebrow="UI Components" title={SECTION_TITLES.pwa}>
                <PWASection />
                <PWAAddOnSection />
              </SectionShell>

              <SectionShell id="patterns" eyebrow="Patterns" title={SECTION_TITLES.patterns}>
                <PatternsSection />
              </SectionShell>

              <SectionShell id="patterns-ext" eyebrow="Patterns" title={SECTION_TITLES["patterns-ext"]}>
                <PatternsExtSection />
                <PatternsExtAddOnSection />
              </SectionShell>

              <SectionShell id="hooks" eyebrow="Hooks" title={SECTION_TITLES.hooks}>
                <HooksSection />
              </SectionShell>

              <SectionShell id="hooks-ext" eyebrow="Hooks" title={SECTION_TITLES["hooks-ext"]}>
                <HooksExtSection />
              </SectionShell>
            </div>

            <PlaygroundFooter />
          </main>
        </div>
      </div>
    </>
  );
}

/* ============================================================
 * TOP BAR
 * ============================================================ */
function TopBar({ onMenuClick, showMenuButton }: { onMenuClick: () => void; showMenuButton: boolean }) {
  return (
    <header className="sticky top-0 z-[var(--sd-z-sticky)] border-b border-border bg-background sd-safe-pt">
      <div className="mx-auto flex h-14 max-w-[1400px] items-center justify-between gap-3 px-4 md:px-6">
        <div className="flex items-center gap-2">
          {showMenuButton && (
            <button
              type="button"
              onClick={onMenuClick}
              aria-label="Open category navigation"
              className="inline-flex h-10 w-10 items-center justify-center rounded-md text-foreground sd-tap transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring md:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>
          )}
          <SerayuLogo
            subtitle="Playground"
            size="sm"
            logoSrc="/serayu-ui.png"
            logoAlt="Serayu UI logo"
          />
        </div>

        <div className="flex items-center gap-2">
          <a
            href="../index.html"
            className="hidden items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium text-muted-foreground sd-tap transition-colors hover:bg-muted hover:text-foreground md:inline-flex"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Landing
          </a>
          <ThemeToggle ariaLabel="Toggle theme" />
          <a
            href="https://github.com/serayudigital/serayu-ui"
            target="_blank"
            rel="noreferrer"
            className="hidden md:inline-flex"
          >
            <Button variant="outline" size="sm" rightIcon={<Github className="h-4 w-4" />}>
              GitHub
            </Button>
          </a>
        </div>
      </div>
    </header>
  );
}

/* ============================================================
 * SIDEBAR
 * ============================================================ */
function Sidebar({
  grouped,
  activeId,
  search,
  setSearch,
  onSelect,
  mobileOpen,
  onClose,
}: {
  grouped: Record<string, NavCategory[]>;
  activeId: CategoryId;
  search: string;
  setSearch: (v: string) => void;
  onSelect: (id: CategoryId) => void;
  mobileOpen: boolean;
  onClose: () => void;
}) {
  return (
    <>
      {/* Overlay for mobile */}
      {mobileOpen && (
        <button
          type="button"
          aria-label="Close navigation"
          onClick={onClose}
          className="fixed inset-0 z-30 bg-foreground/40 backdrop-blur-sm md:hidden"
        />
      )}

      <aside
        className={cn(
          "fixed left-0 top-14 z-40 h-[calc(100vh-3.5rem)] w-72 shrink-0 overflow-y-auto border-r border-border bg-background transition-transform duration-200 ease-out md:sticky md:top-14 md:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        <div className="flex h-full flex-col gap-4 px-4 py-5">
          <div className="flex items-center justify-between md:hidden">
            <span className="text-sm font-semibold">Categories</span>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="inline-flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground sd-tap hover:bg-muted hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <Input
            type="search"
            placeholder="Search categories..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            leftSlot={<Search className="h-4 w-4" />}
            inputSize="sm"
            aria-label="Search categories"
          />

          <nav aria-label="Category list" className="flex-1 space-y-5">
            {Object.entries(grouped).map(([group, items]) => (
              <div key={group}>
                <h3 className="mb-2 px-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  {group}
                </h3>
                <ul className="space-y-0.5">
                  {items.map((cat) => {
                    const isActive = activeId === cat.id;
                    return (
                      <li key={cat.id}>
                        <button
                          type="button"
                          onClick={() => onSelect(cat.id)}
                          aria-current={isActive ? "true" : undefined}
                          className={cn(
                            "flex w-full items-center justify-between rounded-md px-2.5 py-2 text-left text-sm sd-tap transition-colors",
                            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                            isActive
                              ? "bg-brand text-brand-foreground"
                              : "text-foreground hover:bg-muted"
                          )}
                        >
                          <span className="truncate font-medium">{cat.label}</span>
                          <span
                            className={cn(
                              "ml-2 shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-semibold",
                              isActive
                                ? "bg-brand-foreground/20 text-brand-foreground"
                                : "bg-muted text-muted-foreground"
                            )}
                          >
                            {cat.count}
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}

            {Object.keys(grouped).length === 0 && (
              <p className="px-2 text-sm text-muted-foreground">
                No categories match &quot;{search}&quot;.
              </p>
            )}
          </nav>

          <Separator />

          <div className="rounded-md border border-border bg-surface p-3 text-xs text-muted-foreground">
            <p className="font-medium text-foreground">Tip</p>
            <p className="mt-1 leading-relaxed">
              Click a category in the sidebar to jump to that section.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}

/* ============================================================
 * HERO
 * ============================================================ */
function Hero() {
  return (
    <section className="relative overflow-hidden rounded-xl border border-border bg-surface">
      {/* Decorative dot pattern - solid SVG (NOT a gradient) */}
      <svg
        aria-hidden
        xmlns="http://www.w3.org/2000/svg"
        className="pointer-events-none absolute inset-0 h-full w-full text-foreground opacity-[0.04] dark:opacity-[0.06]"
      >
        <defs>
          <pattern
            id="sd-playground-dots"
            x="0"
            y="0"
            width="20"
            height="20"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="1" cy="1" r="1" fill="currentColor" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#sd-playground-dots)" />
      </svg>
      <div className="relative px-5 py-8 md:px-8 md:py-10">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
          <Sparkles className="h-3 w-3 text-brand" />
          <span>interactive</span>
        </div>

        <h1 className="mt-4 text-3xl font-bold leading-[1.1] tracking-tight md:text-4xl lg:text-5xl">
          Try every component,
          <br className="hidden sm:block" />
          <span className="text-brand">right in the browser.</span>
        </h1>

        <p className="mt-3 max-w-2xl text-sm text-muted-foreground md:text-base">
          This playground shows Serayu UI&apos;s UI components, mobile-first
          patterns, and hooks. Every card has a live preview and code you can
          copy.
        </p>

        <div className="mt-6 grid grid-cols-2 gap-3 sm:max-w-2xl sm:grid-cols-4">
          <StatTile icon={Layers} value="56" label="UI Components" />
          <StatTile icon={Smartphone} value="30" label="Mobile Patterns" />
          <StatTile icon={Cpu} value="12" label="Hooks" />
          <StatTile icon={Palette} value="7" label="Theme Presets" />
        </div>
      </div>
    </section>
  );
}

function StatTile({
  icon: Icon,
  value,
  label,
}: {
  icon: React.ComponentType<{ className?: string }>;
  value: string;
  label: string;
}) {
  return (
    <div className="rounded-md border border-border bg-background p-3">
      <Icon className="h-3.5 w-3.5 text-muted-foreground" />
      <div className="mt-1.5 text-xl font-bold text-foreground md:text-2xl">{value}</div>
      <div className="text-[10px] font-medium text-muted-foreground md:text-xs">{label}</div>
    </div>
  );
}

/* ============================================================
 * SECTION SHELL
 * ============================================================ */
function SectionShell({
  id,
  eyebrow,
  title,
  children,
}: {
  id: string;
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} aria-labelledby={`${id}-heading`} className="scroll-mt-20">
      <div className="mb-6 flex items-end justify-between gap-4 border-b border-border pb-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            {eyebrow}
          </p>
          <h2
            id={`${id}-heading`}
            className="mt-1 text-xl font-bold tracking-tight text-foreground md:text-2xl"
          >
            {title}
          </h2>
        </div>
        <a
          href={`#${id}`}
          className="hidden text-xs font-medium text-muted-foreground hover:text-foreground md:inline-flex"
          aria-label={`Link to section ${title}`}
        >
          #{id}
        </a>
      </div>
      <div className="space-y-6">{children}</div>
    </section>
  );
}

/* ============================================================
 * FOOTER
 * ============================================================ */
function PlaygroundFooter() {
  return (
    <footer className="mt-20 rounded-xl border border-border bg-surface px-5 py-6 md:px-8 md:py-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <SerayuLogo
            subtitle="Mobile-first components"
            size="sm"
            logoSrc="/serayu-ui.png"
            logoAlt="Serayu UI logo"
          />
          <p className="mt-2 max-w-md text-xs text-muted-foreground">
            This playground shows interactive previews only. For integration
            into your app, install via npm and import what you need.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <a href="../index.html">
            <Button variant="outline" size="sm" leftIcon={<ArrowLeft className="h-4 w-4" />}>
              Back to landing
            </Button>
          </a>
          <a href="https://www.serayudigital.com" target="_blank" rel="noreferrer">
            <Button size="sm">Serayu Digital</Button>
          </a>
        </div>
      </div>
    </footer>
  );
}

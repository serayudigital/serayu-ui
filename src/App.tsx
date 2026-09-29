import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Alert } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { SerayuLogo } from "@/components/serayu-logo";
import { PhoneMockup } from "../playground/components/landing/phone-mockup";
import {
  ArrowRight,
  Smartphone,
  Layers,
  Zap,
  Check,
  Bell,
  Home as HomeIcon,
  Wallet,
  User as UserIcon,
  Search,
  Moon,
  Sun,
  Monitor,
  CircleCheck,
  Sparkles,
  Github,
} from "lucide-react";
import { Toaster } from "@/components/ui/toaster";
import * as React from "react";
import { cn } from "@/lib/cn";

// Serayu UI - Mobile-first React UI components built with Radix UI and Tailwind CSS.
// by Serayu Digital - www.serayudigital.com
export default function App() {
  return (
    <>
      <Toaster />
      <main className="min-h-screen bg-background text-foreground">
        <SiteHeader />
        <Hero />
        <StatsBar />
        <ComponentShowcase />
        <PatternsShowcase />
        <ThemeShowcase />
        <CodeSnippetSection />
        <FinalCTA />
        <SiteFooter />
      </main>
    </>
  );
}

/* ============================================================
 * HEADER
 * ============================================================ */
function SiteHeader() {
  return (
    <header className="sticky top-0 z-[var(--sd-z-sticky)] border-b border-border bg-background sd-safe-pt">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-3 px-4 md:px-6">
        <SerayuLogo
          subtitle="Mobile-first components"
          size="sm"
          logoSrc="/serayu-ui.png"
          logoAlt="Serayu UI logo"
        />
        <nav className="hidden items-center gap-1 md:flex">
          <a
            href="#components"
            className="rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground sd-tap hover:bg-muted hover:text-foreground"
          >
            Components
          </a>
          <a
            href="#patterns"
            className="rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground sd-tap hover:bg-muted hover:text-foreground"
          >
            Mobile Patterns
          </a>
          <a
            href="#theme"
            className="rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground sd-tap hover:bg-muted hover:text-foreground"
          >
            Theme
          </a>
        </nav>
        <div className="flex items-center gap-2">
          <ThemeToggle ariaLabel="Toggle theme" />
          <a
            href="/playground/index.html"
            className="hidden md:inline-flex"
          >
            <Button size="sm">
              Playground
              <ArrowRight className="h-4 w-4" />
            </Button>
          </a>
        </div>
      </div>
    </header>
  );
}

/* ============================================================
 * HERO
 * ============================================================ */
function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-border bg-surface">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-10 md:grid-cols-[1.1fr_1fr] md:gap-12 md:px-6 md:py-16 lg:py-20">
        <div className="flex flex-col justify-center gap-5">
          <Badge variant="secondary" className="w-fit">
            <Sparkles className="h-3 w-3" />
            Version 1.0.2 - production ready
          </Badge>
          <h1 className="text-4xl font-bold leading-[1.1] tracking-tight md:text-5xl lg:text-6xl">
            Mobile-first
            <br />
            <span className="text-brand">React</span>
            <br />
            components.
          </h1>
          <p className="max-w-xl text-base text-muted-foreground md:text-lg">
            56 components and 30 mobile patterns, themed light and dark
            out of the box. Built on Radix UI primitives, with safe-area
            handling and 44-pixel tap targets that work on real devices.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <a href="/playground/index.html">
              <Button size="lg">
                Open Playground
                <ArrowRight className="h-4 w-4" />
              </Button>
            </a>
            <a
              href="https://www.serayudigital.com"
              target="_blank"
              rel="noreferrer"
            >
              <Button size="lg" variant="outline">
                Visit Serayu Digital
              </Button>
            </a>
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <Check className="h-3.5 w-3.5 text-success" />
              MIT License
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Check className="h-3.5 w-3.5 text-success" />
              Strict TypeScript
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Check className="h-3.5 w-3.5 text-success" />
              Tree-shakable
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Check className="h-3.5 w-3.5 text-success" />
              A11y by default
            </span>
          </div>
        </div>

        {/* Phone mockup showcase */}
        <div className="flex items-center justify-center md:justify-end">
          <PhoneMockup size="md">
            <PhoneDemoApp />
          </PhoneMockup>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
 * PHONE DEMO - content rendered inside PhoneMockup
 * ============================================================ */
function PhoneDemoApp() {
  return (
    <div className="flex h-full flex-col bg-background">
      {/* Mobile header */}
      <div className="flex items-center justify-between border-b border-border bg-background px-3 py-2">
        <div className="text-xs font-semibold">Orders</div>
        <div className="flex items-center gap-1.5">
          <div className="flex h-5 w-5 items-center justify-center rounded text-muted-foreground">
            <Search className="h-3 w-3" />
          </div>
          <div className="relative flex h-5 w-5 items-center justify-center rounded text-muted-foreground">
            <Bell className="h-3 w-3" />
            <span className="absolute right-0.5 top-0.5 h-1.5 w-1.5 rounded-full bg-danger" />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 space-y-2 overflow-hidden p-3">
        <div className="text-[10px] font-semibold text-muted-foreground">
          ACTIVE
        </div>
        {[
          { name: "Ayu Lestari", amount: "Rp 250.000", tone: "success" },
          { name: "Budi Santoso", amount: "Rp 150.000", tone: "warning" },
          { name: "Citra Dewi", amount: "Rp 480.000", tone: "success" },
        ].map((o) => (
          <div
            key={o.name}
            className="flex items-center justify-between rounded-md border border-border bg-card p-2"
          >
            <div className="min-w-0 flex-1">
              <div className="truncate text-[10px] font-medium">{o.name}</div>
              <div className="text-[9px] text-muted-foreground">{o.amount}</div>
            </div>
            <span
              className={cn(
                "rounded-full px-1.5 py-0.5 text-[8px] font-semibold",
                o.tone === "success" && "bg-success text-success-foreground",
                o.tone === "warning" && "bg-warning text-warning-foreground"
              )}
            >
              {o.tone === "success" ? "Paid" : "Pending"}
            </span>
          </div>
        ))}
      </div>

      {/* Bottom nav */}
      <div className="flex items-center justify-around border-t border-border bg-background px-2 py-2">
        {[
          { icon: HomeIcon, label: "Home", active: true },
          { icon: Wallet, label: "Wallet" },
          { icon: Bell, label: "Alerts" },
          { icon: UserIcon, label: "Profile" },
        ].map((it) => (
          <div
            key={it.label}
            className={cn(
              "flex flex-col items-center gap-0.5 px-2 py-1",
              it.active ? "text-brand" : "text-muted-foreground"
            )}
          >
            <it.icon className="h-3.5 w-3.5" />
            <span className="text-[8px] font-medium">{it.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ============================================================
 * STATS BAR
 * ============================================================ */
function StatsBar() {
  const stats = [
    { value: "56", label: "UI components", icon: Layers },
    { value: "30", label: "Mobile patterns", icon: Smartphone },
    { value: "12", label: "React hooks", icon: Zap },
    { value: "24", label: "Utility helpers", icon: CircleCheck },
  ];
  return (
    <section className="border-b border-border bg-background">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-px bg-border px-px md:grid-cols-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="flex flex-col items-center gap-1 bg-background px-3 py-5 text-center"
          >
            <s.icon className="h-4 w-4 text-muted-foreground" />
            <div className="text-2xl font-bold text-foreground md:text-3xl">
              {s.value}
            </div>
            <div className="text-[11px] font-medium text-muted-foreground md:text-xs">
              {s.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ============================================================
 * COMPONENT SHOWCASE
 * ============================================================ */
function ComponentShowcase() {
  return (
    <section
      id="components"
      className="border-b border-border bg-background py-12 md:py-16"
    >
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <SectionHeader
          eyebrow="Components"
          title="56 ready-to-use components"
          subtitle="Every component is keyboard-navigable, exposes proper ARIA roles, and ships with a focus ring. Solid colors only. TypeScript types included."
        />

        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {/* Button */}
          <ShowcaseCard title="Button" subtitle="6 variants, 5 sizes">
            <div className="flex flex-wrap items-center gap-2">
              <Button size="sm">Primary</Button>
              <Button size="sm" variant="outline">
                Outline
              </Button>
              <Button size="sm" variant="ghost">
                Ghost
              </Button>
              <Button size="sm" variant="danger">
                Danger
              </Button>
            </div>
          </ShowcaseCard>

          {/* Badge */}
          <ShowcaseCard title="Badge" subtitle="7 tones, 3 sizes">
            <div className="flex flex-wrap gap-1.5">
              <Badge>Default</Badge>
              <Badge variant="success">Success</Badge>
              <Badge variant="warning">Warning</Badge>
              <Badge variant="danger">Danger</Badge>
              <Badge variant="info">Info</Badge>
            </div>
          </ShowcaseCard>

          {/* Card */}
          <ShowcaseCard title="Card" subtitle="5 layout variants">
            <div className="space-y-2">
              <Card variant="outline">
                <CardContent className="p-3">
                  <div className="text-xs font-medium">Elevated default</div>
                  <div className="text-[10px] text-muted-foreground">
                    bg card + shadow-md
                  </div>
                </CardContent>
              </Card>
              <Card variant="brand">
                <CardContent className="p-3">
                  <div className="text-xs font-semibold text-brand-foreground">
                    Brand card
                  </div>
                  <div className="text-[10px] text-brand-foreground/80">
                    Solid bg-brand
                  </div>
                </CardContent>
              </Card>
              <Card variant="accent">
                <CardContent className="p-3">
                  <div className="text-xs font-medium">Accent card</div>
                  <div className="text-[10px] text-muted-foreground">
                    Brand left border
                  </div>
                </CardContent>
              </Card>
            </div>
          </ShowcaseCard>

          {/* Alert */}
          <ShowcaseCard title="Alert" subtitle="4 solid tones">
            <div className="space-y-2">
              <Alert variant="success" title="Payment successful">
                Order #1234 confirmed.
              </Alert>
              <Alert variant="warning" title="Limited stock">
                2 items remaining.
              </Alert>
            </div>
          </ShowcaseCard>

          {/* Form */}
          <ShowcaseCard title="Form" subtitle="Input, Select, Checkbox">
            <div className="space-y-2">
              <div className="flex items-center gap-2 rounded-md border border-border bg-background px-2.5 py-1.5 text-xs">
                <Search className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-muted-foreground">Search products...</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex h-4 w-4 items-center justify-center rounded border-2 border-brand bg-brand">
                  <Check className="h-2.5 w-2.5 text-brand-foreground" />
                </div>
                <span className="text-xs">Agree to terms</span>
              </div>
              <div className="flex h-7 items-center justify-between rounded-md border border-border bg-background px-2 text-xs">
                <span>All categories</span>
                <span className="text-muted-foreground">&#9662;</span>
              </div>
            </div>
          </ShowcaseCard>

          {/* Theme toggle */}
          <ShowcaseCard title="Theme" subtitle="Light, dark, system">
            <ThemeShowcaseButtons />
          </ShowcaseCard>
        </div>
      </div>
    </section>
  );
}

function ShowcaseCard({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <Card className="overflow-hidden">
      <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
        <div>
          <div className="text-sm font-semibold">{title}</div>
          <div className="text-[10px] text-muted-foreground">{subtitle}</div>
        </div>
      </div>
      <CardContent className="p-4">{children}</CardContent>
    </Card>
  );
}

function ThemeShowcaseButtons() {
  return (
    <div className="grid grid-cols-3 gap-1.5">
      <Button size="sm" variant="outline">
        <Sun className="h-3.5 w-3.5" />
        Light
      </Button>
      <Button size="sm" variant="outline">
        <Moon className="h-3.5 w-3.5" />
        Dark
      </Button>
      <Button size="sm" variant="outline">
        <Monitor className="h-3.5 w-3.5" />
        Auto
      </Button>
    </div>
  );
}

/* ============================================================
 * PATTERNS SHOWCASE
 * ============================================================ */
function PatternsShowcase() {
  return (
    <section id="patterns" className="border-b border-border bg-surface py-12 md:py-16">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <SectionHeader
          eyebrow="Mobile Patterns"
          title="Patterns you already know"
          subtitle="The same bottom-nav, sheet, search, and filter flows from your favorite apps - with safe-area handling, 44-pixel tap targets, and gesture support built in."
        />

        <div className="mt-10 grid gap-8 md:grid-cols-3">
          <PatternColumn
            label="BottomNav + Header"
            description="Standard skeleton for modern mobile apps."
          >
            <PhoneMockup size="sm">
              <PhoneDemoApp />
            </PhoneMockup>
          </PatternColumn>

          <PatternColumn
            label="BottomSheet"
            description="Bottom-anchored sheet with snap points and a drag handle."
          >
            <PhoneMockup size="sm">
              <PhoneDemoSheet />
            </PhoneMockup>
          </PatternColumn>

          <PatternColumn
            label="DataTable"
            description="Cards on mobile, table on desktop - responsive automatically."
          >
            <PhoneMockup size="sm">
              <PhoneDemoTable />
            </PhoneMockup>
          </PatternColumn>
        </div>
      </div>
    </section>
  );
}

function PatternColumn({
  label,
  description,
  children,
}: {
  label: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center gap-3">
      {children}
      <div className="text-center">
        <div className="text-sm font-semibold">{label}</div>
        <p className="mt-1 text-xs text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}

function PhoneDemoSheet() {
  return (
    <div className="flex h-full flex-col bg-surface">
      <div className="flex-1 bg-background p-2">
        <div className="rounded-md border border-border bg-card p-2 text-[10px]">
          Active orders list
        </div>
      </div>
      {/* Bottom sheet preview */}
      <div className="rounded-t-xl border-t border-border bg-card p-3 shadow-lg">
        <div className="mx-auto mb-2 h-1 w-8 rounded-full bg-muted" />
        <div className="text-[11px] font-semibold">Select action</div>
        <div className="mt-2 space-y-1">
          {["Share", "Pin", "Delete"].map((a, i) => (
            <div
              key={a}
              className={cn(
                "rounded-md border border-border px-2 py-1.5 text-[10px]",
                i === 2 && "border-danger text-danger"
              )}
            >
              {a}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function PhoneDemoTable() {
  const rows = [
    { id: "001", name: "Ayu", total: "250K", tone: "success" as const },
    { id: "002", name: "Budi", total: "150K", tone: "warning" as const },
    { id: "003", name: "Citra", total: "480K", tone: "success" as const },
    { id: "004", name: "Dani", total: "95K", tone: "danger" as const },
  ];
  return (
    <div className="flex h-full flex-col bg-background p-2">
      <div className="mb-2 flex items-center justify-between">
        <div className="text-[10px] font-semibold">Orders</div>
        <div className="text-[9px] text-muted-foreground">4 rows</div>
      </div>
      <div className="flex-1 space-y-1.5 overflow-hidden">
        {rows.map((r) => (
          <div
            key={r.id}
            className="flex items-center justify-between rounded-md border border-border bg-card p-1.5"
          >
            <div className="min-w-0">
              <div className="truncate text-[10px] font-medium">{r.name}</div>
              <div className="font-mono text-[8px] text-muted-foreground">
                #{r.id}
              </div>
            </div>
            <div className="text-right">
              <div className="text-[10px] font-semibold">{r.total}</div>
              <span
                className={cn(
                  "rounded-full px-1 py-0.5 text-[7px] font-semibold",
                  r.tone === "success" && "bg-success text-success-foreground",
                  r.tone === "warning" && "bg-warning text-warning-foreground",
                  r.tone === "danger" && "bg-danger text-danger-foreground"
                )}
              >
                {r.tone === "success"
                  ? "Paid"
                  : r.tone === "warning"
                    ? "Pending"
                    : "Failed"}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ============================================================
 * THEME SHOWCASE - dual theme side by side
 * ============================================================ */
function ThemeShowcase() {
  return (
    <section
      id="theme"
      className="border-b border-border bg-background py-12 md:py-16"
    >
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <SectionHeader
          eyebrow="Theme"
          title="Light & dark, default from day one"
          subtitle="Toggle light or dark, or follow the OS preference. The choice persists in localStorage, syncs across tabs, and applies before the first paint to prevent flash."
        />

        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {/* Light theme preview */}
          <ThemePreview
            label="Light"
            surface="#ffffff"
            card="#ffffff"
            surface2="#f7f7f8"
            muted="#f1f1f3"
            border="#e4e4e7"
            text="#0a0a0a"
            mutedText="#52525b"
            brand="#0064f0"
          />
          {/* Dark theme preview */}
          <ThemePreview
            label="Dark"
            surface="#0b0b10"
            card="#1c1c24"
            surface2="#15151b"
            muted="#1c1c24"
            border="#2a2a33"
            text="#f4f4f5"
            mutedText="#a1a1aa"
            brand="#4d9aff"
          />
        </div>
      </div>
    </section>
  );
}

interface ThemePreviewProps {
  label: string;
  surface: string;
  card: string;
  surface2: string;
  muted: string;
  border: string;
  text: string;
  mutedText: string;
  brand: string;
}

function ThemePreview(p: ThemePreviewProps) {
  return (
    <div
      className="overflow-hidden rounded-lg border"
      style={{ backgroundColor: p.surface, borderColor: p.border }}
    >
      <div
        className="flex items-center justify-between border-b px-4 py-2.5"
        style={{ borderColor: p.border }}
      >
        <div className="flex items-center gap-2">
          <div
            className="h-2 w-2 rounded-full"
            style={{ backgroundColor: p.brand }}
          />
          <span className="text-xs font-semibold" style={{ color: p.text }}>
            {p.label} theme
          </span>
        </div>
        <span className="text-[10px]" style={{ color: p.mutedText }}>
          {p.brand}
        </span>
      </div>
      <div className="space-y-2 p-4">
        {/* Sample card */}
        <div
          className="rounded-md p-3"
          style={{ backgroundColor: p.card, border: `1px solid ${p.border}` }}
        >
          <div
            className="text-sm font-semibold"
            style={{ color: p.text }}
          >
            Order #001
          </div>
          <div className="mt-0.5 text-[11px]" style={{ color: p.mutedText }}>
            Rp 250.000 - Paid
          </div>
          <div className="mt-2 flex gap-1.5">
            <div
              className="rounded-full px-2 py-0.5 text-[10px] font-semibold"
              style={{ backgroundColor: p.brand, color: "#ffffff" }}
            >
              Paid
            </div>
            <div
              className="rounded-full px-2 py-0.5 text-[10px] font-semibold"
              style={{ backgroundColor: p.muted, color: p.text }}
            >
              3 items
            </div>
          </div>
        </div>
        {/* Surface row */}
        <div
          className="rounded-md p-3"
          style={{ backgroundColor: p.surface2, color: p.text }}
        >
          <div className="text-[11px] font-medium">Secondary surface</div>
          <div className="text-[10px]" style={{ color: p.mutedText }}>
            For sections or banners
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
 * CODE SNIPPET SECTION
 * ============================================================ */
function CodeSnippetSection() {
  return (
    <section className="border-b border-border bg-surface py-12 md:py-16">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <SectionHeader
          eyebrow="Usage"
          title="Install, import, ship"
          subtitle="Tree-shaking keeps unused components out of your bundle. Import a single button or the whole library - the size you ship scales with what you actually use."
        />

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <CodeBlock
            label="1. Install"
            language="bash"
            code={`npm install @serayu/ui

# Peer deps
npm install react@^18 react-dom@^18`}
          />
          <CodeBlock
            label="2. Import stylesheet"
            language="tsx"
            code={`// main.tsx
import "@serayu/ui/styles.css";
import { createRoot } from "react-dom/client";
import App from "./App";

createRoot(document.getElementById("root")!).render(
  <App />
);`}
          />
          <CodeBlock
            label="3. Use components"
            language="tsx"
            code={`import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  useToast,
} from "@serayu/ui";

export function Demo() {
  const { toast } = useToast();
  return (
    <Card>
      <CardHeader>
        <CardTitle>Hello, Serayu UI</CardTitle>
      </CardHeader>
      <CardContent>
        <Button onClick={() =>
          toast({ title: "Saved", variant: "success" })
        }>
          Click me
        </Button>
      </CardContent>
    </Card>
  );
}`}
          />
          <CodeBlock
            label="4. Custom theme"
            language="css"
            code={`/* Override tokens in your application */
:root {
  --sd-brand: #ff5722;       /* replace brand */
  --sd-radius-lg: 24px;       /* more rounded */
  --sd-duration-standard: 150ms;
}

[data-theme="dark"] {
  --sd-surface: #000000;     /* deeper surface */
}`}
          />
        </div>
      </div>
    </section>
  );
}

function CodeBlock({
  label,
  language,
  code,
}: {
  label: string;
  language: string;
  code: string;
}) {
  return (
    <Card className="overflow-hidden">
      <div className="flex items-center justify-between border-b border-border bg-muted px-4 py-2">
        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            <span className="h-2 w-2 rounded-full bg-danger" />
            <span className="h-2 w-2 rounded-full bg-warning" />
            <span className="h-2 w-2 rounded-full bg-success" />
          </div>
          <span className="ml-1 text-xs font-medium">{label}</span>
        </div>
        <span className="text-[10px] uppercase tracking-wide text-muted-foreground">
          {language}
        </span>
      </div>
      <pre className="overflow-x-auto bg-card p-4 text-[11px] leading-relaxed text-foreground">
        <code>{code}</code>
      </pre>
    </Card>
  );
}

/* ============================================================
 * FINAL CTA
 * ============================================================ */
function FinalCTA() {
  return (
    <section className="bg-background py-16 md:py-24">
      <div className="mx-auto max-w-3xl px-4 text-center md:px-6">
                <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
          Ship your next mobile interface
        </h2>
        <p className="mt-3 text-base text-muted-foreground md:text-lg">
          Browse the playground to try every component interactively, or pull
          the package from npm and start integrating. MIT licensed,
          TypeScript-first, production-tested.
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <a href="/playground/index.html">
            <Button size="lg">
              Open Playground
              <ArrowRight className="h-4 w-4" />
            </Button>
          </a>
          <a
            href="https://github.com/serayudigital/serayu-ui"
            target="_blank"
            rel="noreferrer"
          >
            <Button size="lg" variant="outline">
              <Github className="h-4 w-4" />
              View on GitHub
            </Button>
          </a>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
 * FOOTER
 * ============================================================ */
function SiteFooter() {
  return (
    <footer className="border-t border-border bg-surface px-4 py-8 md:px-6">
      <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-4">
        <div className="md:col-span-2">
          <SerayuLogo
          subtitle="Mobile-first components"
          size="sm"
          logoSrc="/serayu-ui.png"
          logoAlt="Serayu UI logo"
        />
                    <p className="mt-3 max-w-sm text-xs text-muted-foreground">
            Mobile-first React components for apps that need to feel native.
            Dual theme, PWA-ready, released under the MIT License.
          </p>
        </div>
        <FooterColumn
          title="Library"
          links={[
            { label: "Components", href: "#components" },
            { label: "Mobile Patterns", href: "#patterns" },
            { label: "Theme", href: "#theme" },
            { label: "Playground", href: "/playground/index.html" },
          ]}
        />
        <FooterColumn
          title="Serayu Digital"
          links={[
            { label: "Website", href: "https://www.serayudigital.com" },
            { label: "hello@serayudigital.com", href: "mailto:hello@serayudigital.com" },
          ]}
        />
      </div>
      <Separator className="mx-auto my-6 max-w-6xl" />
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 text-center text-xs text-muted-foreground md:flex-row md:text-left">
        <p className="inline-flex items-center gap-1.5">
          <span>Serayu UI v1.0.2</span>
          <span aria-hidden="true">-</span>
          <span>Released under the MIT License.</span>
        </p>
        <a
          href="https://www.serayudigital.com"
          target="_blank"
          rel="noreferrer"
          className="hover:text-foreground"
        >
          www.serayudigital.com
        </a>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div>
      <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {title}
      </h4>
      <ul className="mt-3 space-y-1.5">
        {links.map((l) => (
          <li key={l.label}>
            <a
              href={l.href}
              target={l.href.startsWith("http") ? "_blank" : undefined}
              rel={l.href.startsWith("http") ? "noreferrer" : undefined}
              className="text-xs text-foreground/80 hover:text-foreground"
            >
              {l.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ============================================================
 * SECTION HEADER (reusable)
 * ============================================================ */
function SectionHeader({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <div className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
        <span>{eyebrow}</span>
      </div>
      <h2 className="mt-3 text-2xl font-bold tracking-tight md:text-3xl">
        {title}
      </h2>
      <p className="mt-2 text-sm text-muted-foreground md:text-base">
        {subtitle}
      </p>
    </div>
  );
}

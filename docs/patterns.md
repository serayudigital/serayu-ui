# Patterns

Common mobile-first patterns found in modern applications. All patterns are responsive and respect safe-area insets. 30 patterns in total - see source for the full API.


MOBILE HEADER

Sticky 3-slot header: left (back/menu), center (title + subtitle), right (action).

```tsx
import { MobileHeader } from "@serayu/ui";

<MobileHeader
  title="Orders"
  subtitle="12 active orders"
  back
  right={
    <Button size="icon-sm" variant="ghost" aria-label="Search">
      <Search className="h-4 w-4" />
    </Button>
  }
/>
```

Props:

- `title` (string) - main title
- `subtitle` (string, optional)
- `back` (boolean) - show back button on the left
- `left` (ReactNode) - override left slot
- `right` (ReactNode) - override right slot

The left slot automatically becomes a back button with an `aria-label` when `back` is true. If you need a menu, use the `left` prop.


BREADCRUMB

Hierarchical navigation trail. Slot-based: list, item, link, separator, ellipsis, current.

```tsx
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbCurrent,
} from "@serayu/ui";

<Breadcrumb>
  <BreadcrumbList>
    <BreadcrumbItem>
      <BreadcrumbLink href="/">Home</BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem>
      <BreadcrumbLink href="/docs">Docs</BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem>
      <BreadcrumbCurrent>Getting started</BreadcrumbCurrent>
    </BreadcrumbItem>
  </BreadcrumbList>
</Breadcrumb>
```

`BreadcrumbCurrent` renders a `span` with `aria-current="page"`. `BreadcrumbLink` supports `asChild` to swap the rendered element. `BreadcrumbSeparator` and `BreadcrumbEllipsis` are themselves `<li>` elements and should NOT be wrapped in `BreadcrumbItem`.


BOTTOM NAV

Sticky bottom tab bar on mobile. 3-5 items.

```tsx
import { BottomNav } from "@serayu/ui";

<BottomNav
  activeKey="home"
  onItemClick={(key) => setActive(key)}
  items={[
    { key: "home", label: "Home", icon: <Home /> },
    { key: "wallet", label: "Wallet", icon: <Wallet /> },
    { key: "notif", label: "Notif", icon: <Bell /> },
    { key: "profile", label: "Profile", icon: <User /> },
  ]}
/>
```

Optional item fields: `badge` (number/shortcut), `href` (render as a link).


MOBILE NAV

Left/right drawer with sections.

```tsx
import { MobileNav } from "@serayu/ui";

<MobileNav
  trigger={<Button variant="outline">Menu</Button>}
  title="Serayu Digital"
  subtitle="halo@serayudigital.com"
  side="left"           {/* or "right" */}
  sections={[
    {
      title: "Main",
      items: [
        { key: "home", label: "Home", icon: <Home />, active: true },
        { key: "wallet", label: "Wallet", icon: <Wallet /> },
      ],
    },
  ]}
  footer={<Button variant="ghost">Logout</Button>}
/>
```


MOBILE SEARCH

Search bar with optional clear and mic.

```tsx
<MobileSearch
  placeholder="Search products..."
  value={value}
  onChange={(e) => setValue(e.target.value)}
  showClear
  showMic
  onMicClick={() => startVoice()}
/>
```


FILTER BAR

Horizontal scrollable chip bar with snap.

```tsx
import { FilterBar } from "@serayu/ui";

<FilterBar
  items={[
    { key: "all", label: "All", active: true, count: 42 },
    { key: "active", label: "Active", count: 12 },
  ]}
  onItemClick={(key) => handleFilter(key)}
  onMoreClick={() => setFilterSheetOpen(true)}
/>
```

A `more` item appears at the end automatically when `onMoreClick` is provided.


FILTER SHEET

Sheet with Apply/Reset footer.

```tsx
import { FilterSheet } from "@serayu/ui";

<FilterSheet
  trigger={<Button>Filter</Button>}
  open={open}
  onOpenChange={setOpen}
  title="Search filters"
  onApply={handleApply}
  onReset={handleReset}
>
  {/* filter form here */}
</FilterSheet>
```


BOTTOM SHEET

Sheet with snap points (small/medium/full).

```tsx
import { BottomSheet } from "@serayu/ui";

<BottomSheet
  trigger={<Button>Open</Button>}
  title="Pick an action"
  description="Swipe down to close."
  snap="medium"   {/* "small" | "medium" | "full" */}
>
  {/* body */}
</BottomSheet>
```


DATA TABLE

Responsive table: cards on `<md`, table on `>=md`. Generic and type-safe.

```tsx
import { DataTable, type Column } from "@serayu/ui";

interface Order {
  id: string;
  customer: string;
  total: number;
  status: "Paid" | "Pending";
}

const columns: Column<Order>[] = [
  { key: "id", header: "ID", render: (row) => row.id },
  { key: "customer", header: "Customer", accessor: (row) => row.customer },
  {
    key: "total",
    header: "Total",
    accessor: (row) => `Rp ${row.total.toLocaleString("id-ID")}`,
  },
  {
    key: "status",
    header: "Status",
    render: (row) => <Badge variant={row.status === "Paid" ? "success" : "warning"}>{row.status}</Badge>,
  },
];

<DataTable
  columns={columns}
  data={orders}
  keyExtractor={(row) => row.id}
/>
```

`Column<T>` props:

- `key` - unique identifier
- `header` - column label
- `accessor` - function returning a string value
- `render` - cell render function (more powerful than `accessor`)
- `mobileHide` - hide on mobile (default `false`)


EMPTY STATE

Empty state for list/feed.

```tsx
import { EmptyState } from "@serayu/ui";

<EmptyState
  icon={<Inbox className="h-6 w-6" />}
  title="No items"
  description="No data matches the current filter yet."
  action={<Button size="sm">Reset filter</Button>}
/>
```


LOADING STATE

Inline spinner with label.

```tsx
import { LoadingState } from "@serayu/ui";

<LoadingState label="Loading data..." />
```

Has `role="status"` and `aria-live="polite"` so screen readers announce changes.


AUTH FLOW

End-to-end authentication pattern. The three pieces can be used on their own or composed into a single flow (email/password login -> OTP verification -> biometric option for the next login).


AUTH LOGIN

Email/password login form with social buttons (Google, Apple, Facebook) + remember me.

```tsx
import { AuthLogin } from "@serayu/ui";

<AuthLogin
  onSubmit={async (email, password, remember) => {
    await login(email, password, remember);
  }}
  onSocialLogin={(provider) => oauth(provider)}
  loading={loading}
  error={error?.message}
  showSocial
/>
```


AUTH OTP

4/6 digit OTP input with auto-advance to the next cell, paste detection, and a 60-second resend countdown.

```tsx
import { AuthOtp } from "@serayu/ui";

<AuthOtp
  length={6}
  onComplete={async (code) => {
    await verify(code);
  }}
  onResend={sendCode}
  loading={loading}
  resendCooldownSec={60}
/>
```


AUTH BIOMETRIC

WebAuthn `PublicKeyCredential` detection with a password fallback. Does not enable biometric if the device does not support it.

```tsx
import { AuthBiometric } from "@serayu/ui";

<AuthBiometric
  onSuccess={(credential) => authenticate(credential)}
  onFallback={() => setShowPassword(true)}
  supported={webauthnSupported}
/>
```


VISUAL STORIES


STORY REELS VIEWER

Vertical pager in the style of Instagram/TikTok stories. Auto-advance via IntersectionObserver + scroll snap, left/right tap zones, pause via long-press.

```tsx
import { StoryReelsViewer } from "@serayu/ui";

<StoryReelsViewer
  open={open}
  onOpenChange={setOpen}
  slides={[
    { id: "1", type: "image", src: "/a.jpg", durationMs: 5000,
      overlay: <Button>View product</Button> },
    { id: "2", type: "video", src: "/b.mp4" },
  ]}
  onComplete={() => setOpen(false)}
/>
```


MAP PREVIEW

OSM map preview with a 3x3 tile grid (Mercator math). Supports `osm` (default), `mapbox`, and `none` (placeholder only) providers. Optional pin overlay.

```tsx
import { MapPreview } from "@serayu/ui";

<MapPreview
  lat={-7.2575}
  lng={112.7521}
  zoom={14}
  provider="osm"
  markerLabel="Sidoarjo"
  height={240}
/>
```


QUICK ACTIONS


COMMAND BAR MOBILE

Bottom sheet in the style of an iOS share sheet with grouped actions, destructive variant, and optional haptic feedback. Supports snap points (small/medium/full).

```tsx
import { CommandBarMobile } from "@serayu/ui";

<CommandBarMobile
  open={open}
  onOpenChange={setOpen}
  title="Quick actions"
  snapPoints={["small", "medium"]}
  groups={[
    {
      label: "Share",
      items: [
        { id: "copy", label: "Copy link", icon: <Copy />, onSelect: copy },
        { id: "wa", label: "WhatsApp", icon: <MessageCircle />, onSelect: share },
      ],
    },
    {
      label: "More",
      items: [
        { id: "del", label: "Delete", destructive: true, onSelect: del },
      ],
    },
  ]}
/>
```


THEME


THEME CUSTOMIZER

Live preview panel for tweaking `sd-*` tokens (brand, radius, surface tone) at runtime. Default scope is `container` so the global document is not changed.

```tsx
import { ThemeCustomizer, overridesToInlineStyle, type ThemeOverrides } from "@serayu/ui";

const [overrides, setOverrides] = useState<ThemeOverrides>({});

<div style={overridesToInlineStyle(overrides)}>
  <ThemeCustomizer
    overrides={overrides}
    onChange={setOverrides}
    scope="container"
    presets={["serayu-original", "garuda", "tropical", "midnight"]}
  />
</div>
```

See [Theming](https://github.com/serayudigital/serayu-ui/blob/main/docs/theming.md#override-runtime-via-themecustomizer) for the full runtime override API.


COMPOSITION TIPS

1. MobileHeader + BottomNav = a standard mobile app shell.
2. FilterBar + FilterSheet = hybrid filter (common chips + detail sheet).
3. MobileSearch + EmptyState + DataTable = a complete list view.
4. BottomSheet + Button trigger = a quick action without leaving the page.

All patterns automatically:
- Respect safe-area insets (top/bottom)
- Have `aria-label` and keyboard support
- Are theme-aware (light + dark)
- Use solid colors for visual consistency

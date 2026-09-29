# UI Components

Quick reference for 56 UI components. For full API, read the TypeScript source - all props are documented via JSDoc.

ACTIONS

BUTTON

Button with 6 variants and 5 sizes.

```tsx
import { Button } from "@serayu/ui";

<Button>Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="danger">Danger</Button>
<Button variant="link">Link</Button>
```

Sizes: `sm`, `md` (default), `lg`, `icon`, `icon-sm`.

State: `loading`, `disabled`, with `leftIcon` / `rightIcon`.

BADGE

Solid chip in 7 color tones.

```tsx
<Badge>Default</Badge>
<Badge variant="success">Success</Badge>
<Badge variant="warning">Warning</Badge>
<Badge variant="danger">Danger</Badge>
```

LAYOUT

CARD

Content container with 5 variants.

```tsx
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Subtitle</CardDescription>
  </CardHeader>
  <CardContent>Main content</CardContent>
  <CardFooter>
    <Button>OK</Button>
  </CardFooter>
</Card>
```

| Variant | Background | Border | Shadow | Use for |
| ------- | ---------- | ------ | ------ | ------- |
| `elevated` (default) | `bg-card` | thin border | `shadow-md` | General content, list items |
| `outline` | `bg-card` | thin border | - | Secondary content |
| `filled` | `bg-muted` | - | - | Info banner, announcement |
| `brand` | `bg-brand` solid | - | `shadow-md` | Hero card, primary CTA |
| `accent` | `bg-card` | brand left border 4px | `shadow-sm` | Highlight / featured |

SEPARATOR

Horizontal or vertical line.

```tsx
<Separator />
<Separator orientation="vertical" />
```

SKELETON

Loading placeholder. Use `rounded-full` for circles, default for text.

```tsx
<Skeleton className="h-12 w-12 rounded-full" />
<Skeleton className="h-4 w-3/4" />
```

KBD

Keyboard shortcut chip. Renders inline, monospace, decorative. Pass `children` as separate strings to auto-join with `+`.

```tsx
import { Kbd } from "@serayu/ui";

<Kbd>Ctrl</Kbd>
<Kbd>Ctrl</Kbd>
<Kbd>K</Kbd>
<Kbd variant="muted">Esc</Kbd>
```

FEEDBACK

ALERT

Solid banner in 4 tones.

```tsx
<Alert variant="info" title="Info">Info message</Alert>
<Alert variant="success" title="Success">Success.</Alert>
<Alert variant="warning" title="Warning">Be careful.</Alert>
<Alert variant="danger" title="Failed">An error occurred.</Alert>
```

TOAST

Transient notification with global queue.

```tsx
import { useToast } from "@serayu/ui";

const { toast } = useToast();
toast({ title: "Saved", variant: "success" });
toast({ title: "Failed", description: "Try again.", variant: "danger" });
```

Mount `<Toaster />` once at root. Default duration 5 seconds.

FORMS

INPUT

Text input with optional icon slot.

```tsx
<Input placeholder="Email" type="email" />
<Input leftSlot={<Search />} placeholder="Search..." />
<Input invalid placeholder="Invalid" />
<Input inputSize="sm" /> {/* sm, md, lg */}
```

TEXTAREA

```tsx
<Textarea rows={4} placeholder="Write a message..." />
```

CHECKBOX

```tsx
<Checkbox checked={value} onCheckedChange={setValue} />
<Checkbox indeterminate />
<Checkbox disabled />
```

SWITCH

```tsx
<Switch checked={value} onCheckedChange={setValue} />
```

RADIOGROUP

```tsx
<RadioGroup value={val} onValueChange={setVal}>
  <RadioGroupItem value="a" id="a" />
  <RadioGroupItem value="b" id="b" />
</RadioGroup>
```

SELECT

Mobile-style dropdown.

```tsx
<Select value={val} onValueChange={setVal}>
  <SelectTrigger>
    <SelectValue placeholder="Select..." />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="a">A</SelectItem>
    <SelectItem value="b">B</SelectItem>
  </SelectContent>
</Select>
```

LABEL

Always use with input for a11y.

```tsx
<Label htmlFor="email" required>Email</Label>
<Input id="email" />
```

MULTISELECTCOMBOBOX

Select multiple items from a list with chip preview in the trigger, search, and optional select-all.

```tsx
import { MultiSelectCombobox } from "@serayu/ui";

<MultiSelectCombobox
  options={[
    { value: "js", label: "JavaScript" },
    { value: "ts", label: "TypeScript" },
    { value: "rb", label: "Ruby" },
  ]}
  value={selected}
  onChange={setSelected}
  placeholder="Select technology..."
  searchPlaceholder="Search..."
  showSelectAll
  maxSelected={5}
/>
```

COLORPICKER

Color picker with 3 modes: preset palette, custom hue + SV spectrum, and hex input.

```tsx
import { ColorPicker } from "@serayu/ui";

<ColorPicker
  value="#0064f0"
  onChange={setColor}
  presets={["#dc2626", "#16a34a", "#0064f0", "#f59e0b"]}
  showHexInput
  showPresets
/>
```

> The SV spectrum uses a gradient functionally to represent color space (SV = saturation/value plane).

NAVIGATION

TABS

```tsx
<Tabs defaultValue="a">
  <TabsList>
    <TabsTrigger value="a">Tab A</TabsTrigger>
    <TabsTrigger value="b">Tab B</TabsTrigger>
  </TabsList>
  <TabsContent value="a">Content A</TabsContent>
  <TabsContent value="b">Content B</TabsContent>
</Tabs>
```

ACCORDION

```tsx
<Accordion type="single" collapsible>
  <AccordionItem value="1">
    <AccordionTrigger>Title</AccordionTrigger>
    <AccordionContent>Content</AccordionContent>
  </AccordionItem>
</Accordion>
```

Mode: `"single"` or `"multiple"`. `collapsible` allows closing all.

COLLAPSIBLE

Single open/close region with smooth height animation. Lighter than `Accordion` for one-shot toggles (filters, sections).

```tsx
import { Collapsible } from "@serayu/ui";

<Collapsible>
  <CollapsibleTrigger asChild>
    <Button variant="outline">Toggle</Button>
  </CollapsibleTrigger>
  <CollapsibleContent>
    <div className="p-3">Hidden content here.</div>
  </CollapsibleContent>
</Collapsible>
```

OVERLAYS

DIALOG

Solid modal with overlay.

```tsx
<Dialog>
  <DialogTrigger asChild><Button>Open</Button></DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Title</DialogTitle>
      <DialogDescription>Description</DialogDescription>
    </DialogHeader>
    {/* body */}
    <DialogFooter>
      <DialogClose asChild><Button>Cancel</Button></DialogClose>
      <Button>OK</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

ALERTDIALOG

Critical confirmation modal. Cannot be dismissed by outside click (except via escape).

```tsx
<AlertDialog>
  <AlertDialogTrigger asChild>
    <Button variant="danger">Delete</Button>
  </AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Delete permanently?</AlertDialogTitle>
      <AlertDialogDescription>Cannot be undone.</AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Cancel</AlertDialogCancel>
      <AlertDialogAction onClick={handleDelete}>Yes, delete</AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
```

SHEET

Drawer from any side.

```tsx
<Sheet>
  <SheetTrigger asChild><Button>Open</Button></SheetTrigger>
  <SheetContent side="bottom">  {/* left, right, top, bottom */}
    <SheetHeader>
      <SheetTitle>Title</SheetTitle>
      <SheetDescription>Description</SheetDescription>
    </SheetHeader>
    {/* body */}
  </SheetContent>
</Sheet>
```

POPOVER

Floating content with anchor.

```tsx
<Popover>
  <PopoverTrigger asChild><Button>Open</Button></PopoverTrigger>
  <PopoverContent>
    {/* body */}
  </PopoverContent>
</Popover>
```

DROPDOWNMENU

Menu with items, checkboxes, radios, labels, and separators.

```tsx
<DropdownMenu>
  <DropdownMenuTrigger asChild><Button>Actions</Button></DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuLabel>Account</DropdownMenuLabel>
    <DropdownMenuItem>Profile</DropdownMenuItem>
    <DropdownMenuItem>Settings</DropdownMenuItem>
    <DropdownMenuSeparator />
    <DropdownMenuItem variant="destructive">Delete</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

TOOLTIP

Short message on hover.

```tsx
<TooltipProvider>
  <Tooltip>
    <TooltipTrigger asChild><Button>Hover</Button></TooltipTrigger>
    <TooltipContent>Tooltip here</TooltipContent>
  </Tooltip>
</TooltipProvider>
```

Wrap with `TooltipProvider` once at root (default delay 300ms).

HOVERCARD

Floating content shown on hover. Slower open (200ms) than `Tooltip`, so suitable for richer previews like user cards.

```tsx
import { HoverCard, HoverCardTrigger, HoverCardContent } from "@serayu/ui";

<HoverCard>
  <HoverCardTrigger asChild>
    <a href="#">@username</a>
  </HoverCardTrigger>
  <HoverCardContent>
    <div className="space-y-1">
      <p className="text-sm font-medium">User Name</p>
      <p className="text-xs text-muted-foreground">Frontend engineer</p>
    </div>
  </HoverCardContent>
</HoverCard>
```

DATA

AVATAR

```tsx
<Avatar>
  <AvatarImage src="/user.jpg" alt="User" />
  <AvatarFallback>UN</AvatarFallback>
</Avatar>
```

Size via `className` (default 40px).

ANIMATEDNUMBER

Count-up animation with easing `cubic-bezier(0.2, 0, 0, 1)`. Format via `Intl.NumberFormat`. Respects `prefers-reduced-motion` (snaps directly to final value).

```tsx
import { AnimatedNumber } from "@serayu/ui";

<AnimatedNumber value={1234} locale="id-ID" duration={1200} prefix="Rp " />
```

PHOTOVIEWER

Fullscreen image viewer with pinch-zoom (2 fingers), double-tap zoom from 1x to 2x, and horizontal swipe prev/next.

```tsx
import { PhotoViewer } from "@serayu/ui";

<PhotoViewer
  open={open}
  onOpenChange={setOpen}
  images={["/a.jpg", "/b.jpg", "/c.jpg"]}
  alt="Product gallery"
  startIndex={0}
/>
```

VIRTUALLIST

Zero-deps virtualized list with manual windowing, measurement cache, and `scrollToIndex`. Suitable for lists > 100 items.

```tsx
import { VirtualList } from "@serayu/ui";

<VirtualList
  items={items}
  itemHeight={56}
  height={400}
  renderItem={(item) => <div className="px-3 py-2">{item.label}</div>}
  overscan={5}
/>
```

SCROLLAREA

Custom-styled scrollable region. Use for chat feeds, lists, and any content that may overflow visually.

```tsx
import { ScrollArea } from "@serayu/ui";

<ScrollArea className="h-48 w-full rounded-md border border-border">
  <div className="p-3">
    {Array.from({ length: 50 }).map((_, i) => (
      <p key={i} className="py-1 text-sm">Row {i + 1}</p>
    ))}
  </div>
</ScrollArea>
```

CHARTS

Zero-deps chart components (pure SVG). Does not add bundle size for additional chart libraries.

BARCHART

```tsx
import { BarChart } from "@serayu/ui";

<BarChart
  data={[
    { label: "Jan", value: 30 },
    { label: "Feb", value: 45, color: "brand" },
    { label: "Mar", value: 28 },
  ]}
  height={200}
  orientation="vertical"
  showValue
/>
```

LINECHART

```tsx
import { LineChart } from "@serayu/ui";

<LineChart
  data={[
    { x: "Jan", y: 30 },
    { x: "Feb", y: 45 },
    { x: "Mar", y: 28 },
  ]}
  height={200}
  smooth
  showDots
  showGrid
/>
```

HEATMAP

```tsx
import { Heatmap } from "@serayu/ui";

<Heatmap
  data={[
    [1, 2, 3, 4],
    [4, 5, 6, 7],
    [7, 8, 9, 10],
  ]}
  labels={{ x: ["Mon", "Tue", "Wed", "Thu"], y: ["Week 1", "Week 2", "Week 3"] }}
  cellSize={32}
/>
```

> Color intensity uses a gradient functionally to represent data values across the heatmap cells.

THEME

THEMETOGGLE

Button that cycles light/dark/system.

```tsx
<ThemeToggle ariaLabel="Toggle theme" />
```

Three-state cycle: light -> dark -> system -> light. Icon changes (Sun/Moon/Monitor).

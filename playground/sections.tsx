import * as React from "react";
import {
  Mail,
  Lock,
  Eye,
  Plus,
  Check,
  Trash2,
  Edit3,
  Settings,
  User,
  Bell,
  CreditCard,
  LogOut,
  MoreHorizontal,
  Filter,
  Inbox,
  Sun,
  Moon,
  Monitor,
  Smartphone,
  HelpCircle,
  Phone,
  Sliders,
  Menu as MenuIcon,
  Wallet as WalletIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SkeletonGroup } from "@/components/ui/skeleton-group";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Kbd } from "@/components/ui/kbd";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MobileHeader } from "@/components/patterns/mobile-header";
import { BottomNav } from "@/components/patterns/bottom-nav";
import { MobileNav } from "@/components/patterns/mobile-nav";
import { MobileSearch } from "@/components/patterns/mobile-search";
import { FilterBar } from "@/components/patterns/filter-bar";
import { FilterSheet } from "@/components/patterns/filter-sheet";
import { BottomSheet } from "@/components/patterns/bottom-sheet";
import { DataTable } from "@/components/patterns/data-table";
import { EmptyState } from "@/components/patterns/empty-state";
import { LoadingState } from "@/components/patterns/loading-state";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbCurrent,
} from "@/components/patterns/breadcrumb";
import { PhoneMockup } from "./components/landing/phone-mockup";
import { useToast } from "@/hooks/use-toast";
import { useTheme, type ThemePreference } from "@/hooks/use-theme";
import { useIsDesktop, useIsMobile, breakpoints } from "@/hooks/use-media-query";
import { cn } from "@/lib/cn";
import { DemoCard } from "./demo-card";

/* ============================================================
 * ACTIONS
 * ============================================================ */
export function ActionsSection() {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <DemoCard
        title="Button"
        description="6 variants, 5 sizes, with loading and icon slot support."
        code={`<Button>Primary</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="danger">Danger</Button>
<Button loading>Loading...</Button>
<Button leftIcon={<Plus className="h-4 w-4" />}>Add</Button>`}
      >
        <div className="flex flex-wrap items-center justify-center gap-2">
          <Button>Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="danger">Danger</Button>
          <Button variant="link">Link</Button>
          <Button loading>Loading...</Button>
        </div>
      </DemoCard>

      <DemoCard
        title="Button sizes & icon"
        description="Tap target minimum 44px on md and lg sizes."
        code={`<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>
<Button size="icon" aria-label="Add"><Plus /></Button>`}
      >
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button size="sm">Small</Button>
          <Button size="md">Medium</Button>
          <Button size="lg">Large</Button>
          <Button size="icon" aria-label="Add">
            <Plus className="h-4 w-4" />
          </Button>
          <Button size="icon-sm" variant="outline" aria-label="Edit">
            <Edit3 className="h-4 w-4" />
          </Button>
        </div>
      </DemoCard>

      <DemoCard
        title="Badge"
        description="7 color tones + 3 sizes for status, category, or count."
        code={`<Badge>Default</Badge>
<Badge variant="success">Success</Badge>
<Badge variant="warning">Warning</Badge>
<Badge variant="danger">Danger</Badge>
<Badge variant="info">Info</Badge>
<Badge variant="outline">Outline</Badge>`}
      >
        <div className="flex flex-wrap items-center justify-center gap-1.5">
          <Badge>Default</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="success">
            <Check className="h-3 w-3" /> Success
          </Badge>
          <Badge variant="warning">Warning</Badge>
          <Badge variant="danger">Danger</Badge>
          <Badge variant="info">Info</Badge>
          <Badge variant="outline">Outline</Badge>
        </div>
      </DemoCard>

      <DemoCard
        title="Badge sizes"
        description="Three sizes for different contexts."
        code={`<Badge size="sm">12</Badge>
<Badge size="md">128</Badge>
<Badge size="lg">1.248</Badge>`}
      >
        <div className="flex flex-wrap items-center justify-center gap-2">
          <Badge size="sm">12</Badge>
          <Badge size="md">128</Badge>
          <Badge size="lg">1.248</Badge>
        </div>
      </DemoCard>
    </div>
  );
}

/* ============================================================
 * LAYOUT
 * ============================================================ */
export function LayoutSection() {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <DemoCard
        title="Card"
        description="5 layout variants: elevated, outline, filled, brand, accent."
        code={`<Card variant="elevated">...</Card>
<Card variant="brand">...</Card>
<Card variant="accent">...</Card>`}
      >
        <div className="grid w-full max-w-md gap-2">
          <Card variant="elevated" className="p-3">
            <p className="text-xs font-medium">Elevated</p>
            <p className="text-[10px] text-muted-foreground">bg-card + shadow-md</p>
          </Card>
          <Card variant="outline" className="p-3">
            <p className="text-xs font-medium">Outline</p>
            <p className="text-[10px] text-muted-foreground">bg-card, border only</p>
          </Card>
          <Card variant="filled" className="p-3">
            <p className="text-xs font-medium">Filled</p>
            <p className="text-[10px] text-muted-foreground">bg-muted, no border</p>
          </Card>
          <Card variant="brand" className="p-3">
            <p className="text-xs font-semibold">Brand</p>
            <p className="text-[10px] opacity-80">solid bg-brand for hero or CTA</p>
          </Card>
          <Card variant="accent" className="p-3">
            <p className="text-xs font-medium">Accent</p>
            <p className="text-[10px] text-muted-foreground">4px brand left border</p>
          </Card>
        </div>
      </DemoCard>

      <DemoCard
        title="Card composition"
        description="Header, content, and footer as separate slots."
        code={`<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Short description</CardDescription>
  </CardHeader>
  <CardContent>Main content</CardContent>
  <CardFooter>Actions</CardFooter>
</Card>`}
      >
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle>Pro Plan</CardTitle>
            <CardDescription>For small to medium teams.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              Rp 99K
              <span className="text-sm font-normal text-muted-foreground">/month</span>
            </p>
            <ul className="mt-3 space-y-1.5 text-sm">
              <li className="flex items-center gap-2">
                <Check className="h-3.5 w-3.5 text-success" /> Unlimited projects
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-3.5 w-3.5 text-success" /> Priority support
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button className="w-full">Get started</Button>
          </CardFooter>
        </Card>
      </DemoCard>

      <DemoCard
        title="Separator"
        description="Horizontal and vertical divider lines."
        code={`<Separator />
<Separator orientation="vertical" />`}
      >
        <div className="flex w-full max-w-xs items-center gap-3">
          <span className="text-sm">Item A</span>
          <Separator orientation="vertical" className="h-5" />
          <span className="text-sm">Item B</span>
          <Separator orientation="vertical" className="h-5" />
          <span className="text-sm">Item C</span>
        </div>
      </DemoCard>

      <DemoCard
        title="Skeleton"
        description="Loading placeholder with subtle pulse animation."
        code={`<Skeleton className="h-4 w-3/4" />
<Skeleton className="h-32 w-full" />`}
      >
        <div className="flex w-full max-w-sm gap-3">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-3 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </div>
      </DemoCard>

      <DemoCard
        title="Kbd"
        description="Keyboard shortcut badge. Use in trigger copy or tooltip hints."
        code={`<p>Press <Kbd>Ctrl</Kbd> + <Kbd>K</Kbd> to open the palette.</p>`}
      >
        <div className="flex flex-col items-start gap-3">
          <p className="text-sm text-foreground">
            Press <Kbd>Ctrl</Kbd> + <Kbd>K</Kbd> to open the command palette.
          </p>
          <p className="text-sm text-foreground">
            Then <Kbd>Enter</Kbd> to run, <Kbd>Esc</Kbd> to dismiss.
          </p>
        </div>
      </DemoCard>

      <DemoCard
        title="ScrollArea"
        description="Styled scroll viewport for long lists (8.5x faster than default on touch)."
        code={`<ScrollArea className="h-48 w-full rounded-md border">
  <ul>...long list...</ul>
</ScrollArea>`}
      >
        <ScrollArea className="h-48 w-full max-w-xs rounded-md border border-border bg-background">
          <ul className="p-2">
            {Array.from({ length: 24 }).map((_, i) => (
              <li
                key={i}
                className="border-b border-border px-3 py-2 text-xs last:border-b-0"
              >
                Notification #{i + 1}: status update
              </li>
            ))}
          </ul>
        </ScrollArea>
      </DemoCard>
    </div>
  );
}

/* ============================================================
 * FEEDBACK
 * ============================================================ */
export function FeedbackSection() {
  const { toast } = useToast();
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <DemoCard
        title="Alert"
        description="4 solid tones (info/success/warning/danger)."
        code={`<Alert variant="success" title="Payment successful">
  Order #1234 confirmed.
</Alert>`}
      >
        <div className="flex w-full max-w-md flex-col gap-2">
          <Alert variant="info" title="Information">
            A new version is available, please refresh.
          </Alert>
          <Alert variant="success" title="Payment successful">
            Order #1234 is confirmed.
          </Alert>
          <Alert variant="warning" title="Limited stock">
            2 items left of this variant.
          </Alert>
          <Alert variant="danger" title="Save failed">
            Please try again in a moment.
          </Alert>
        </div>
      </DemoCard>

      <DemoCard
        title="Toast - variants"
        description="4 visual tones (info/success/warning/danger) via useToast()."
        code={`const { toast } = useToast();
toast({ title: "Saved", variant: "success" });`}
      >
        <div className="grid w-full max-w-sm grid-cols-2 gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              toast({ title: "Saved", description: "Data was saved successfully.", variant: "success" })
            }
          >
            Success
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              toast({ title: "New info", description: "Check your notifications.", variant: "info" })
            }
          >
            Info
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              toast({ title: "Warning", description: "Quota running low.", variant: "warning" })
            }
          >
            Warning
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              toast({ title: "Failed", description: "Could not reach the server.", variant: "danger" })
            }
          >
            Danger
          </Button>
        </div>
      </DemoCard>
    </div>
  );
}

/* ============================================================
 * FORMS
 * ============================================================ */
export function FormsSection() {
  const [agreed, setAgreed] = React.useState(false);
  const [pushNotif, setPushNotif] = React.useState(true);
  const [emailNotif, setEmailNotif] = React.useState(false);
  const [plan, setPlan] = React.useState("pro");
  const [category, setCategory] = React.useState("all");

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <DemoCard
        title="Input with icon slot"
        description="leftSlot and rightSlot for icons inside the input."
        code={`<Input
  leftSlot={<Mail className="h-4 w-4" />}
  placeholder="name@email.com"
/>
<Input
  type="password"
  leftSlot={<Lock className="h-4 w-4" />}
  rightSlot={<Eye className="h-4 w-4" />}
/>`}
      >
        <div className="flex w-full max-w-sm flex-col gap-3">
          <Input
            placeholder="name@email.com"
            leftSlot={<Mail className="h-4 w-4" />}
          />
          <Input
            type="password"
            placeholder="Password"
            leftSlot={<Lock className="h-4 w-4" />}
            rightSlot={<Eye className="h-4 w-4" />}
          />
        </div>
      </DemoCard>

      <DemoCard
        title="Input states & sizes"
        description="3 sizes + invalid and disabled states."
        code={`<Input inputSize="sm" placeholder="Small" />
<Input inputSize="md" placeholder="Medium" />
<Input inputSize="lg" placeholder="Large" />
<Input invalid placeholder="Invalid format" />`}
      >
        <div className="flex w-full max-w-sm flex-col gap-3">
          <Input inputSize="sm" placeholder="Small size" />
          <Input inputSize="md" placeholder="Medium size" />
          <Input inputSize="lg" placeholder="Large size" />
          <Input invalid placeholder="Invalid format" defaultValue="not an email" />
        </div>
      </DemoCard>

      <DemoCard
        title="Textarea"
        description="Multi-line input with invalid state."
        code={`<Textarea placeholder="Write a message..." rows={4} />`}
      >
        <Textarea
          placeholder="Write your message here..."
          rows={4}
          className="w-full max-w-sm"
        />
      </DemoCard>

      <DemoCard
        title="Checkbox & Switch"
        description="Checkbox with indeterminate state, Switch for toggles."
        code={`<Checkbox checked={agreed} onCheckedChange={setAgreed} />
<Switch checked={pushNotif} onCheckedChange={setPushNotif} />`}
      >
        <div className="flex w-full max-w-sm flex-col gap-4">
          <div className="flex items-center gap-3">
            <Checkbox
              id="agree"
              checked={agreed}
              onCheckedChange={(v) => setAgreed(v === true)}
            />
            <Label htmlFor="agree" className="cursor-pointer">
              I agree to the terms and conditions
            </Label>
          </div>

          <div className="flex items-center gap-3">
            <Checkbox id="indeterminate" checked="indeterminate" />
            <Label htmlFor="indeterminate">Pick some (indeterminate)</Label>
          </div>

          <div className="flex items-center justify-between rounded-md border border-border p-3">
            <div className="flex items-center gap-2">
              <Bell className="h-4 w-4 text-muted-foreground" />
              <Label htmlFor="push" className="cursor-pointer">
                Push notifications
              </Label>
            </div>
            <Switch
              id="push"
              checked={pushNotif}
              onCheckedChange={setPushNotif}
            />
          </div>

          <div className="flex items-center justify-between rounded-md border border-border p-3">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <Label htmlFor="email" className="cursor-pointer">
                Email notifications
              </Label>
            </div>
            <Switch
              id="email"
              checked={emailNotif}
              onCheckedChange={setEmailNotif}
            />
          </div>
        </div>
      </DemoCard>

      <DemoCard
        title="RadioGroup"
        description="Accessible radio button group with keyboard navigation."
        code={`<RadioGroup value={plan} onValueChange={setPlan}>
  <RadioGroupItem value="free" id="free" />
  <RadioGroupItem value="pro" id="pro" />
  <RadioGroupItem value="business" id="business" />
</RadioGroup>`}
      >
        <RadioGroup
          value={plan}
          onValueChange={setPlan}
          className="w-full max-w-sm"
        >
          {[
            { v: "free", l: "Free", d: "For personal use" },
            { v: "pro", l: "Pro", d: "Rp 99K/month, for professionals" },
            { v: "business", l: "Business", d: "Custom pricing, for teams" },
          ].map((p) => (
            <Label
              key={p.v}
              htmlFor={p.v}
              className="flex cursor-pointer items-start gap-3 rounded-md border border-border p-3 transition-colors hover:bg-muted has-[[data-state=checked]]:border-brand has-[[data-state=checked]]:bg-brand/5"
            >
              <RadioGroupItem value={p.v} id={p.v} className="mt-0.5" />
              <div>
                <div className="text-sm font-medium">{p.l}</div>
                <div className="text-xs text-muted-foreground">{p.d}</div>
              </div>
            </Label>
          ))}
        </RadioGroup>
      </DemoCard>

      <DemoCard
        title="Select"
        description="Dropdown select with search and keyboard navigation."
        code={`<Select value={category} onValueChange={setCategory}>
  <SelectTrigger>
    <SelectValue placeholder="Select category" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="all">All</SelectItem>
    <SelectItem value="food">Food</SelectItem>
    <SelectItem value="drink">Drinks</SelectItem>
  </SelectContent>
</Select>`}
      >
        <div className="w-full max-w-sm space-y-2">
          <Label htmlFor="category">Product category</Label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger id="category">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
              <SelectItem value="food">Food</SelectItem>
              <SelectItem value="drink">Drinks</SelectItem>
              <SelectItem value="snack">Snacks</SelectItem>
              <SelectItem value="dessert">Desserts</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </DemoCard>
    </div>
  );
}

/* ============================================================
 * NAVIGATION
 * ============================================================ */
export function NavigationSection() {
  return (
    <div className="grid gap-6">
      <DemoCard
        title="Tabs"
        description="Navigation tabs between content with state management."
        code={`<Tabs defaultValue="overview">
  <TabsList>
    <TabsTrigger value="overview">Overview</TabsTrigger>
    <TabsTrigger value="analytics">Analytics</TabsTrigger>
    <TabsTrigger value="settings">Settings</TabsTrigger>
  </TabsList>
  <TabsContent value="overview">Overview content</TabsContent>
  <TabsContent value="analytics">Analytics content</TabsContent>
  <TabsContent value="settings">Settings content</TabsContent>
</Tabs>`}
      >
        <Tabs defaultValue="overview" className="w-full max-w-xl">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="rounded-md border border-border bg-card p-4 text-sm">
            <p className="font-medium">Performance this week</p>
            <p className="mt-1 text-muted-foreground">
              12,480 visits - up 8.2% from last week.
            </p>
          </TabsContent>
          <TabsContent value="analytics" className="rounded-md border border-border bg-card p-4 text-sm">
            <p className="font-medium">Traffic sources</p>
            <p className="mt-1 text-muted-foreground">
              Organic 62%, Direct 24%, Social 14%.
            </p>
          </TabsContent>
          <TabsContent value="settings" className="rounded-md border border-border bg-card p-4 text-sm">
            <p className="font-medium">Account settings</p>
            <p className="mt-1 text-muted-foreground">
              Manage profile, notifications, and security.
            </p>
          </TabsContent>
        </Tabs>
      </DemoCard>

      <DemoCard
        title="Accordion"
        description="Collapsible content with subtle height animation."
        code={`<Accordion type="single" collapsible>
  <AccordionItem value="q1">
    <AccordionTrigger>What is Serayu UI?</AccordionTrigger>
    <AccordionContent>React component library...</AccordionContent>
  </AccordionItem>
</Accordion>`}
      >
        <Accordion
          type="single"
          collapsible
          defaultValue="q1"
          className="w-full max-w-xl rounded-md border border-border"
        >
          <AccordionItem value="q1">
            <AccordionTrigger className="px-4">What is Serayu UI?</AccordionTrigger>
            <AccordionContent className="px-4">
              Serayu UI is a mobile-first React component library built
              on top of Radix UI with Tailwind CSS styling.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="q2">
            <AccordionTrigger className="px-4">Is it free to use?</AccordionTrigger>
            <AccordionContent className="px-4">
              Yes, Serayu UI is released under the MIT license - free for
              commercial and personal use.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="q3">
            <AccordionTrigger className="px-4">How do I install it?</AccordionTrigger>
            <AccordionContent className="px-4">
              Just run <code className="rounded bg-muted px-1 py-0.5 text-xs">npm install @serayu/ui</code> and
              import the stylesheet from your application entry point.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </DemoCard>
    </div>
  );
}

/* ============================================================
 * OVERLAYS
 * ============================================================ */
export function OverlaysSection() {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <DemoCard
        title="Dialog"
        description="Modal dialog with focus trap and escape handling."
        code={`<Dialog>
  <DialogTrigger asChild>
    <Button>Open dialog</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Title</DialogTitle>
      <DialogDescription>Dialog description</DialogDescription>
    </DialogHeader>
    <DialogFooter>
      <Button>OK</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>`}
      >
        <Dialog>
          <DialogTrigger asChild>
            <Button>Open dialog</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm action</DialogTitle>
              <DialogDescription>
                This action will send notifications to every team member. Continue?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline">Cancel</Button>
              <Button>Send notifications</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </DemoCard>

      <DemoCard
        title="AlertDialog"
        description="Dialog for destructive actions with firm confirmation."
        code={`<AlertDialog>
  <AlertDialogTrigger asChild>
    <Button variant="danger">Delete</Button>
  </AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogTitle>Delete permanently?</AlertDialogTitle>
    <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
    <AlertDialogFooter>
      <AlertDialogCancel>Cancel</AlertDialogCancel>
      <AlertDialogAction>Yes, delete</AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>`}
      >
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="danger" leftIcon={<Trash2 className="h-4 w-4" />}>
              Delete project
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete project permanently?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. All data, files, and
                history will be permanently removed from the server.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction>Yes, delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </DemoCard>

      <DemoCard
        title="Sheet (Drawer)"
        description="Drawer from 4 sides with slide animation."
        code={`<Sheet>
  <SheetTrigger asChild>
    <Button variant="outline">Open from right</Button>
  </SheetTrigger>
  <SheetContent side="right">
    <SheetHeader>
      <SheetTitle>Drawer</SheetTitle>
    </SheetHeader>
    Drawer content here
  </SheetContent>
</Sheet>`}
      >
        <div className="flex flex-wrap items-center justify-center gap-2">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm">
                Bottom
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom">
              <SheetHeader>
                <SheetTitle>Sheet from bottom</SheetTitle>
                <SheetDescription>
                  Ideal for mobile-friendly actions.
                </SheetDescription>
              </SheetHeader>
              <div className="mt-4 space-y-2 text-sm">
                <p>Share to:</p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">WhatsApp</Button>
                  <Button variant="outline" size="sm">Telegram</Button>
                  <Button variant="outline" size="sm">Copy link</Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm">
                Right
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader>
                <SheetTitle>Right drawer</SheetTitle>
                <SheetDescription>For navigation or details.</SheetDescription>
              </SheetHeader>
              <div className="mt-4 text-sm">
                <p>This is the drawer content area.</p>
              </div>
              <SheetFooter>
                <SheetClose asChild>
                  <Button>Close</Button>
                </SheetClose>
              </SheetFooter>
            </SheetContent>
          </Sheet>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm">
                Left
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <SheetHeader>
                <SheetTitle>Left drawer</SheetTitle>
                <SheetDescription>Commonly used for the main menu.</SheetDescription>
              </SheetHeader>
              <div className="mt-4 text-sm">
                <p>Content area here.</p>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </DemoCard>

      <DemoCard
        title="Popover"
        description="Small floating content near the trigger."
        code={`<Popover>
  <PopoverTrigger asChild>
    <Button variant="outline">Open popover</Button>
  </PopoverTrigger>
  <PopoverContent>
    <h4>Title</h4>
    <p>Popover content here.</p>
  </PopoverContent>
</Popover>`}
      >
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline">Open popover</Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="space-y-2">
              <h4 className="text-sm font-semibold">Order details</h4>
              <p className="text-xs text-muted-foreground">
                Orders #1234 - Rp 250.000 - Paid
              </p>
              <Separator className="my-2" />
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">3 item</span>
                <span className="font-medium">Oct 12, 2026</span>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </DemoCard>

      <DemoCard
        title="DropdownMenu"
        description="Dropdown menu with submenu, checkbox and radio items."
        code={`<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="outline">Menu</Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuItem>Edit</DropdownMenuItem>
    <DropdownMenuItem>Duplicate</DropdownMenuItem>
    <DropdownMenuSeparator />
    <DropdownMenuItem variant="destructive">Delete</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>`}
      >
        <div className="flex flex-wrap items-center justify-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" leftIcon={<MoreHorizontal className="h-4 w-4" />}>
                Actions
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuLabel>Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="h-4 w-4" /> My profile
              </DropdownMenuItem>
              <DropdownMenuItem>
                <CreditCard className="h-4 w-4" /> Payments
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="h-4 w-4" /> Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant="destructive">
                <LogOut className="h-4 w-4" /> Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Sliders className="h-4 w-4" />
                Filter
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              <DropdownMenuLabel>Show</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem checked>Photos</DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem checked>Video</DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem>Documents</DropdownMenuCheckboxItem>
              <DropdownMenuSeparator />
              <DropdownMenuLabel>Sort by</DropdownMenuLabel>
              <DropdownMenuRadioGroup value="newest">
                <DropdownMenuRadioItem value="newest">Newest</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="oldest">Oldest</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="name">Name A-Z</DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </DemoCard>

      <DemoCard
        title="Tooltip"
        description="Short label on hover or focus."
        code={`<TooltipProvider>
  <Tooltip>
    <TooltipTrigger asChild>
      <Button size="icon"><Plus /></Button>
    </TooltipTrigger>
    <TooltipContent>Add new item</TooltipContent>
  </Tooltip>
</TooltipProvider>`}
      >
        <TooltipProvider delayDuration={200}>
          <div className="flex flex-wrap items-center justify-center gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button size="icon" variant="outline" aria-label="Add">
                  <Plus className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Add new item</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button size="icon" variant="outline" aria-label="Edit">
                  <Edit3 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Edit item</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button size="icon" variant="outline" aria-label="Delete">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Delete item</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" leftIcon={<HelpCircle className="h-4 w-4" />}>
                  Need help?
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                Open the documentation or contact support.
              </TooltipContent>
            </Tooltip>
          </div>
        </TooltipProvider>
      </DemoCard>

      <DemoCard
        title="Collapsible"
        description="Single show/hide section with smooth height animation. Pairs with Accordion."
        code={`<Collapsible>
  <CollapsibleTrigger asChild>
    <Button variant="outline">Toggle details</Button>
  </CollapsibleTrigger>
  <CollapsibleContent>
    Hidden content revealed here.
  </CollapsibleContent>
</Collapsible>`}
      >
        <Collapsible className="w-full max-w-sm">
          <CollapsibleTrigger asChild>
            <Button variant="outline">Show details</Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="text-sm text-muted-foreground">
            <div className="pt-2">
              The collapsible animates height using a CSS keyframe
              keyed off the Radix data-state attribute. Reduced-motion
              users see instant open/close.
            </div>
          </CollapsibleContent>
        </Collapsible>
      </DemoCard>

      <DemoCard
        title="HoverCard"
        description="Rich tooltip on hover or keyboard focus. Useful for user profile previews."
        code={`<HoverCard>
  <HoverCardTrigger asChild>
    <a href="#">@andi</a>
  </HoverCardTrigger>
  <HoverCardContent>Profile details</HoverCardContent>
</HoverCard>`}
      >
        <div className="flex items-center gap-2 text-sm">
          <span>Follow</span>
          <HoverCard>
            <HoverCardTrigger asChild>
              <a
                href="#"
                className="font-medium text-brand underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
              >
                @andi_wijaya
              </a>
            </HoverCardTrigger>
            <HoverCardContent>
              <div className="flex items-start gap-3">
                <div
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand text-sm font-semibold text-brand-foreground"
                  aria-hidden
                >
                  AW
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-foreground">
                    Andi Wijaya
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Frontend engineer at Serayu Digital
                  </p>
                </div>
              </div>
            </HoverCardContent>
          </HoverCard>
          <span>for updates.</span>
        </div>
      </DemoCard>
    </div>
  );
}

/* ============================================================
 * DATA
 * ============================================================ */
export function DataSection() {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <DemoCard
        title="Avatar"
        description="6 sizes + image with initial fallback."
        code={`<Avatar size="md">
  <AvatarImage src="/user.jpg" alt="Andi" />
  <AvatarFallback>AN</AvatarFallback>
</Avatar>`}
      >
        <div className="flex flex-wrap items-end justify-center gap-4">
          <Avatar size="xs">
            <AvatarFallback className="text-[10px]">XS</AvatarFallback>
          </Avatar>
          <Avatar size="sm">
            <AvatarFallback>SM</AvatarFallback>
          </Avatar>
          <Avatar size="md">
            <AvatarImage
              src="https://i.pravatar.cc/120?img=11"
              alt="Andi"
            />
            <AvatarFallback>AN</AvatarFallback>
          </Avatar>
          <Avatar size="lg">
            <AvatarImage
              src="https://i.pravatar.cc/160?img=32"
              alt="Budi"
            />
            <AvatarFallback>BD</AvatarFallback>
          </Avatar>
          <Avatar size="xl">
            <AvatarFallback className="bg-brand text-brand-foreground">
              CL
            </AvatarFallback>
          </Avatar>
          <Avatar size="2xl">
            <AvatarFallback className="bg-success text-success-foreground">
              DM
            </AvatarFallback>
          </Avatar>
        </div>
      </DemoCard>

      <DemoCard
        title="Avatar group"
        description="Stack multiple avatars with overlap."
        code={`<div className="flex -space-x-2">
  <Avatar>...</Avatar>
  <Avatar>...</Avatar>
  <Avatar>+5</Avatar>
</div>`}
      >
        <div className="flex items-center -space-x-2">
          {[
            { src: "https://i.pravatar.cc/80?img=1", alt: "User 1" },
            { src: "https://i.pravatar.cc/80?img=2", alt: "User 2" },
            { src: "https://i.pravatar.cc/80?img=3", alt: "User 3" },
            { src: "https://i.pravatar.cc/80?img=4", alt: "User 4" },
          ].map((u, i) => (
            <Avatar key={i} size="md" className="border-2 border-background">
              <AvatarImage src={u.src} alt={u.alt} />
              <AvatarFallback>U{i + 1}</AvatarFallback>
            </Avatar>
          ))}
          <div className="z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 border-background bg-muted text-xs font-medium text-muted-foreground">
            +5
          </div>
        </div>
      </DemoCard>

      <DemoCard
        title="SkeletonGroup"
        description="Pre-built skeleton rows: card, list, or profile."
        code={`<SkeletonGroup pattern="card" count={3} />
<SkeletonGroup pattern="list" count={4} />
<SkeletonGroup pattern="profile" count={1} />`}
      >
        <div className="grid w-full gap-4">
          <div>
            <div className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              card
            </div>
            <SkeletonGroup pattern="card" count={2} />
          </div>
          <div>
            <div className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              list
            </div>
            <SkeletonGroup pattern="list" count={3} />
          </div>
        </div>
      </DemoCard>
    </div>
  );
}

/* ============================================================
 * PATTERNS
 * ============================================================ */
export function PatternsSection() {
  const [bottomNavKey, setBottomNavKey] = React.useState("home");
  const [searchVal, setSearchVal] = React.useState("Sneaker limited");
  const [activeFilter, setActiveFilter] = React.useState("all");

  // Sample data for DataTable
  type Order = {
    id: string;
    customer: string;
    total: number;
    status: "paid" | "pending" | "failed";
    date: string;
  };
  const orders: Order[] = [
    { id: "ORD-001", customer: "Ayu Lestari", total: 250000, status: "paid", date: "Oct 12, 2026" },
    { id: "ORD-002", customer: "Budi Santoso", total: 150000, status: "pending", date: "Oct 12, 2026" },
    { id: "ORD-003", customer: "Citra Dewi", total: 480000, status: "paid", date: "Oct 11, 2026" },
    { id: "ORD-004", customer: "Dani Pratama", total: 95000, status: "failed", date: "Oct 11, 2026" },
    { id: "ORD-005", customer: "Eka Putri", total: 320000, status: "paid", date: "Oct 10, 2026" },
  ];

  const formatRupiah = (n: number) =>
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(n);

  const statusBadge = (s: Order["status"]) => {
    const map = {
      paid: { variant: "success" as const, label: "Paid" },
      pending: { variant: "warning" as const, label: "Pending" },
      failed: { variant: "danger" as const, label: "Failed" },
    };
    return <Badge variant={map[s].variant}>{map[s].label}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        {/* MobileHeader */}
        <DemoCard
          title="MobileHeader"
          description="Sticky header with 3 slots and safe area."
          code={`<MobileHeader
  back
  title="Orders"
  subtitle="24 item"
  right={<ThemeToggle />}
/>`}
        >
          <PhoneMockup size="sm" className="scale-[0.7] origin-top">
            <MobileHeader
              back
              title="Orders"
              subtitle="24 item"
              right={
                <button
                  type="button"
                  aria-label="Notifications"
                  className="inline-flex h-11 w-11 items-center justify-center rounded-md text-foreground sd-tap transition-colors hover:bg-muted"
                >
                  <Bell className="h-5 w-5" />
                </button>
              }
            />
            <div className="space-y-2 p-3">
              {orders.slice(0, 3).map((o) => (
                <div
                  key={o.id}
                  className="rounded-md border border-border bg-surface p-2 text-[10px]"
                >
                  <div className="font-medium">{o.customer}</div>
                  <div className="text-muted-foreground">{formatRupiah(o.total)}</div>
                </div>
              ))}
            </div>
          </PhoneMockup>
        </DemoCard>

        {/* BottomNav */}
        <DemoCard
          title="BottomNav"
          description="Bottom tab bar with 3-5 items and active state."
          code={`<BottomNav
  items={[
    { key: "home", label: "Home", icon: <Home /> },
    { key: "orders", label: "Orders", icon: <Inbox /> },
    { key: "wallet", label: "Wallet", icon: <CreditCard /> },
    { key: "profile", label: "Profile", icon: <User /> },
  ]}
  activeKey={bottomNavKey}
  onItemClick={setBottomNavKey}
/>`}
        >
          <PhoneMockup size="sm" className="scale-[0.7] origin-top">
            <div className="flex h-full flex-col bg-background">
              <div className="flex-1 p-3 text-[10px] text-muted-foreground">
                Pick a tab below to navigate.
              </div>
              {/*
                rounded-b-[32px] matches the BottomNav bottom corner with
                the PhoneMockup size sm inner screen border-radius (32px).
                Without this, the BottomNav corner appears off-line
                with the iPhone rounded frame.
              */}
              <BottomNav
                className="rounded-b-[32px]"
                items={[
                  { key: "home", label: "Home", icon: <Smartphone className="h-5 w-5" /> },
                  { key: "orders", label: "Orders", icon: <Inbox className="h-5 w-5" /> },
                  { key: "wallet", label: "Wallet", icon: <CreditCard className="h-5 w-5" /> },
                  { key: "profile", label: "Profile", icon: <User className="h-5 w-5" /> },
                ]}
                activeKey={bottomNavKey}
                onItemClick={setBottomNavKey}
              />
            </div>
          </PhoneMockup>
        </DemoCard>

        {/* MobileSearch */}
        <DemoCard
          title="MobileSearch"
          description="Search bar with optional clear and mic."
          code={`<MobileSearch
  value={searchVal}
  onChange={(e) => setSearchVal(e.target.value)}
  showMic
  placeholder="Search products..."
/>`}
        >
          <div className="w-full max-w-sm">
            <MobileSearch
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              showMic
              placeholder="Search products..."
            />
          </div>
        </DemoCard>

        {/* FilterBar */}
        <DemoCard
          title="FilterBar"
          description="Horizontally scrollable filter chip row with snap."
          code={`<FilterBar
  items={[
    { key: "all", label: "All", count: 124 },
    { key: "food", label: "Food", active: true },
    ...
  ]}
  onItemClick={setActiveFilter}
/>`}
        >
          <div className="w-full max-w-md">
            <FilterBar
              items={[
                { key: "all", label: "All", count: 124, active: activeFilter === "all" },
                { key: "food", label: "Food", count: 42, active: activeFilter === "food" },
                { key: "drink", label: "Drinks", count: 28, active: activeFilter === "drink" },
                { key: "snack", label: "Snack", count: 31, active: activeFilter === "snack" },
                { key: "dessert", label: "Dessert", count: 23, active: activeFilter === "dessert" },
              ]}
              onItemClick={(k) => setActiveFilter(k)}
            />
          </div>
        </DemoCard>
      </div>

      {/* FilterSheet */}
      <DemoCard
        title="FilterSheet"
        description="Sheet with filters and Apply/Reset footer."
        code={`<FilterSheet
  trigger={<Button variant="outline" leftIcon={<Filter />}>Filter</Button>}
  onApply={() => toast({ title: "Filter applied" })}
>
  <div className="space-y-4">
    {/* checkbox, switch, etc */}
  </div>
</FilterSheet>`}
      >
        <FilterSheet
          trigger={
            <Button variant="outline" leftIcon={<Filter className="h-4 w-4" />}>
              Open filter
            </Button>
          }
          title="Filter products"
        >
          <div className="space-y-5">
            <div>
              <Label className="mb-2 block">Category</Label>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Checkbox id="f-food" defaultChecked />
                  <Label htmlFor="f-food" className="cursor-pointer">Food</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox id="f-drink" />
                  <Label htmlFor="f-drink" className="cursor-pointer">Drinks</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox id="f-snack" defaultChecked />
                  <Label htmlFor="f-snack" className="cursor-pointer">Snack</Label>
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <Label className="mb-2 block">Price range</Label>
              <div className="flex items-center gap-2">
                <Input placeholder="Min" inputSize="sm" />
                <span className="text-muted-foreground">-</span>
                <Input placeholder="Max" inputSize="sm" />
              </div>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <Label htmlFor="available">Stock available</Label>
              <Switch id="available" defaultChecked />
            </div>
          </div>
        </FilterSheet>
      </DemoCard>

      {/* BottomSheet */}
      <DemoCard
        title="BottomSheet"
        description="Sheet with Android-style snap points."
        code={`<BottomSheet
  trigger={<Button>Open sheet</Button>}
  title="Select payment method"
  snapPoints={["small", "medium", "full"]}
>
  <div className="space-y-2">
    {methods.map((m) => <PaymentOption {...m} />)}
  </div>
</BottomSheet>`}
      >
        <BottomSheet
          trigger={
            <Button leftIcon={<CreditCard className="h-4 w-4" />}>
              Select payment method
            </Button>
          }
          title="Select payment method"
          description="Pick one payment method below."
          snapPoints={["small", "medium", "full"]}
          body={
            <div className="space-y-2">
              {[
                { icon: <WalletIcon className="h-4 w-4" />, name: "Wallet Serayu", desc: "Balance Rp 250.000" },
                { icon: <CreditCard className="h-4 w-4" />, name: "Debit card", desc: "BCA •••• 1234" },
                { icon: <Phone className="h-4 w-4" />, name: "QRIS", desc: "Scan to pay" },
              ].map((m, i) => (
                <button
                  key={i}
                  type="button"
                  className={cn(
                    "flex w-full items-center gap-3 rounded-md border p-3 text-left sd-tap transition-colors",
                    i === 0
                      ? "border-brand bg-brand/5"
                      : "border-border bg-surface hover:bg-muted"
                  )}
                >
                  <div
                    className={cn(
                      "inline-flex h-9 w-9 items-center justify-center rounded-full",
                      i === 0 ? "bg-brand text-brand-foreground" : "bg-muted text-muted-foreground"
                    )}
                  >
                    {m.icon}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{m.name}</p>
                    <p className="text-xs text-muted-foreground">{m.desc}</p>
                  </div>
                  {i === 0 && <Check className="h-4 w-4 text-brand" />}
                </button>
              ))}
            </div>
          }
          footer={
            <>
              <Button variant="outline">Cancel</Button>
              <Button>Use this method</Button>
            </>
          }
        />
      </DemoCard>

      {/* MobileNav */}
      <DemoCard
        title="MobileNav"
        description="Left and right drawer with sections and account footer."
        code={`<MobileNav
  trigger={<Button variant="outline"><MenuIcon /></Button>}
  title="Hi, Andi"
  subtitle="andi@email.com"
  sections={[...]}
/>`}
      >
        <MobileNav
          trigger={
            <Button variant="outline" leftIcon={<MenuIcon className="h-4 w-4" />}>
              Open menu
            </Button>
          }
          title="Hi, Andi"
          subtitle="andi@serayu.id"
          sections={[
            {
              title: "Primary",
              items: [
                { key: "home", label: "Home", icon: <Smartphone className="h-4 w-4" />, active: true },
                { key: "orders", label: "Orders", icon: <Inbox className="h-4 w-4" /> },
                { key: "wallet", label: "Wallet", icon: <WalletIcon className="h-4 w-4" /> },
              ],
            },
            {
              title: "Account",
              items: [
                { key: "profile", label: "Profile", icon: <User className="h-4 w-4" /> },
                { key: "settings", label: "Settings", icon: <Settings className="h-4 w-4" /> },
              ],
            },
          ]}
        />
      </DemoCard>

      {/* DataTable */}
      <DemoCard
        title="DataTable"
        description="Cards on mobile, table on desktop. Auto-responsive."
        code={`<DataTable
  columns={[
    { key: "id", header: "ID" },
    { key: "customer", header: "Customer" },
    { key: "total", header: "Total", render: (r) => formatRupiah(r.total) },
    { key: "status", header: "Status", render: (r) => <Badge>{r.status}</Badge> },
  ]}
  data={orders}
  keyExtractor={(r) => r.id}
/>`}
      >
        <div className="w-full">
          <DataTable
            columns={[
              { key: "id", header: "ID", width: "120px" },
              { key: "customer", header: "Customer" },
              {
                key: "total",
                header: "Total",
                render: (r: Order) => formatRupiah(r.total),
              },
              {
                key: "status",
                header: "Status",
                render: (r: Order) => statusBadge(r.status),
              },
              { key: "date", header: "Date", mobileHide: true },
            ]}
            data={orders}
            keyExtractor={(r) => r.id}
          />
        </div>
      </DemoCard>

      <div className="grid gap-6 md:grid-cols-2">
        {/* EmptyState */}
        <DemoCard
          title="EmptyState"
          description="Empty state with icon, title, description, and CTA."
          code={`<EmptyState
  icon={<Inbox className="h-6 w-6" />}
  title="No messages"
  description="No messages yet."
  action={<Button>Compose message</Button>}
/>`}
        >
          <Card className="w-full">
            <EmptyState
              icon={<Inbox className="h-6 w-6" />}
              title="No orders yet"
              description="Your incoming orders will appear here."
              action={
                <Button size="sm" leftIcon={<Plus className="h-4 w-4" />}>
                  Create order
                </Button>
              }
            />
          </Card>
        </DemoCard>

        {/* LoadingState */}
        <DemoCard
          title="LoadingState"
          description="Spinner plus label with role status for a11y."
          code={`<LoadingState label="Loading orders..." />
<LoadingState size="lg" label="Syncing..." />`}
        >
          <div className="grid w-full gap-4 md:grid-cols-2">
            <Card>
              <LoadingState label="Loading..." size="sm" fullscreen={false} />
            </Card>
            <Card>
              <LoadingState label="Syncing" size="lg" />
            </Card>
          </div>
        </DemoCard>

        <DemoCard
          title="Breadcrumb"
          description="Hierarchical navigation trail. Slot-based: link, separator, current."
          code={`<Breadcrumb>
  <BreadcrumbList>
    <BreadcrumbItem><BreadcrumbLink href="/">Home</BreadcrumbLink></BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem><BreadcrumbCurrent>Page</BreadcrumbCurrent></BreadcrumbItem>
  </BreadcrumbList>
</Breadcrumb>`}
        >
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="#">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="#">Docs</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbCurrent>Getting started</BreadcrumbCurrent>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </DemoCard>
      </div>
    </div>
  );
}

// WalletIcon is already imported from lucide-react with an alias above.

// MenuIcon is already imported from lucide-react with an alias above.

/* ============================================================
 * HOOKS
 * ============================================================ */
export function HooksSection() {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <DemoCard
        title="useTheme"
        description="Theme preference + cross-tab sync + system detection."
        code={`const { preference, resolved, setPreference, toggle } = useTheme();

setPreference("dark");    // force dark
setPreference("light");   // force light
setPreference("system");  // follow OS
toggle();                  // light <-> dark`}
      >
        <UseThemeDemo />
      </DemoCard>

      <DemoCard
        title="useMediaQuery"
        description="Reactive media query hook + breakpoint helpers."
        code={`const isMobile = useIsMobile();
const isDesktop = useIsDesktop();
const matches = useMediaQuery("(min-width: 1024px)");`}
      >
        <UseMediaQueryDemo />
      </DemoCard>

      <DemoCard
        title="useToast"
        description="API hook: title, description, action, and dismiss."
        code={`const { toast, dismiss } = useToast();

toast({
  title: "Saved",
  description: "Data saved successfully.",
  variant: "success",
});`}
      >
        <UseToastDemo />
      </DemoCard>

      <DemoCard
        title="ThemeToggle component"
        description="Ready-to-use button to cycle light/dark/system."
        code={`<ThemeToggle showSystem />`}
      >
        <div className="flex items-center gap-3">
          <ThemeToggle ariaLabel="Toggle theme" />
          <span className="text-xs text-muted-foreground">
            {"Click to switch theme (light -> dark -> system -> ...)"}
          </span>
        </div>
      </DemoCard>
    </div>
  );
}

function UseThemeDemo() {
  const { preference, resolved, setPreference, toggle } = useTheme();
  const options: { v: ThemePreference; l: string; icon: React.ReactNode }[] = [
    { v: "light", l: "Light", icon: <Sun className="h-3.5 w-3.5" /> },
    { v: "dark", l: "Dark", icon: <Moon className="h-3.5 w-3.5" /> },
    { v: "system", l: "System", icon: <Monitor className="h-3.5 w-3.5" /> },
  ];
  return (
    <div className="w-full space-y-3">
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <span>Preference:</span>
        <Badge>{preference}</Badge>
        <span>Resolved:</span>
        <Badge variant={resolved === "dark" ? "default" : "secondary"}>
          {resolved}
        </Badge>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {options.map((o) => (
          <Button
            key={o.v}
            size="sm"
            variant={preference === o.v ? "primary" : "outline"}
            onClick={() => setPreference(o.v)}
          >
            {o.icon}
            {o.l}
          </Button>
        ))}
        <Button size="sm" variant="ghost" onClick={toggle}>
          Toggle
        </Button>
      </div>
    </div>
  );
}

function UseMediaQueryDemo() {
  const isMobile = useIsMobile();
  const isDesktop = useIsDesktop();
  return (
    <div className="w-full space-y-3">
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="rounded-md border border-border p-3">
          <div className="text-muted-foreground">useIsMobile</div>
          <div className="mt-1 font-mono text-base">{String(isMobile)}</div>
        </div>
        <div className="rounded-md border border-border p-3">
          <div className="text-muted-foreground">useIsDesktop</div>
          <div className="mt-1 font-mono text-base">{String(isDesktop)}</div>
        </div>
      </div>
      <div className="rounded-md border border-border p-3 text-xs">
        <div className="mb-1.5 font-semibold">Breakpoints</div>
        <ul className="space-y-1 font-mono text-[11px] text-muted-foreground">
          <li>mobile: {breakpoints.mobile}</li>
          <li>tablet: {breakpoints.tablet}</li>
          <li>desktop: {breakpoints.desktop}</li>
        </ul>
      </div>
    </div>
  );
}

function UseToastDemo() {
  const { toast, dismiss } = useToast();
  return (
    <div className="w-full space-y-3">
      <div className="grid grid-cols-2 gap-2">
        <Button
          size="sm"
          variant="outline"
          onClick={() => toast({ title: "Info", variant: "info" })}
        >
          Info
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() =>
            toast({
              title: "Success",
              description: "Changes saved successfully.",
              variant: "success",
            })
          }
        >
          With description
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() =>
            toast({
              title: "Action available",
              description: "Click to see details.",
              variant: "default",
              action: (
                <button
                  type="button"
                  className="text-xs font-medium underline underline-offset-2"
                  onClick={() => dismiss()}
                >
                  View
                </button>
              ),
            })
          }
        >
          With action
        </Button>
        <Button size="sm" variant="ghost" onClick={() => dismiss()}>
          Dismiss all
        </Button>
      </div>
      <p className="text-xs text-muted-foreground">
        Toast appears in the top corner (desktop) or bottom corner (mobile).
      </p>
    </div>
  );
}

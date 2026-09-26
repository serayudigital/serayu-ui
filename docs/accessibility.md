# Accessibility (a11y)

Serayu UI is committed to accessibility by default. This page serves as a reference for developers consuming the library and contributors adding new components.

MINIMUM STANDARDS FOR EACH INTERACTIVE COMPONENT

1. ARIA role that matches (`button`, `listbox`, `slider`, `dialog`, etc). Use semantic elements first; add `role` only when the primitive does not provide one.
2. Keyboard support - Enter/Space for activation, Arrow keys for list/menu navigation, Escape to dismiss overlay.
3. Focus visible - `focus-visible:ring-2 focus-visible:ring-ring` ring on every interactive element (use the `var(--sd-ring)` token).
4. Tap target >= 44px for mobile - use the `sd-tap` utility or `min-h-[44px]`.
5. Label - `aria-label` or text content that explains the function. Avoid `aria-label=""` (placeholder-only) without helper text.
6. State announcements - `aria-live="polite"` for state changes the user must know about (toast, progress update, polling notification).

REFERENCE MATRIX PER COMPONENT

ACTIONS

| Component | Role | Keyboard | Notes |
| -------- | ---- | -------- | ------- |
| Button | `button` | Enter, Space | Disabled state via `aria-disabled`. Loading state announced via `aria-busy`. |
| Badge | - | - | Pure decorative span, no role needed. |
| Toggle / ToggleGroup | `button` + `aria-pressed` | Enter, Space, Arrow (group) | Group uses `role="group"`. |
| IconButton | `button` | Enter, Space | `aria-label` is required because there is no text. |

FORMS

| Component | Role | Keyboard | Notes |
| -------- | ---- | -------- | ------- |
| Input | `textbox` | Standard input | Label associated via `htmlFor`/`id`. Error via `aria-invalid` + `aria-describedby`. |
| Textarea | `textbox` | Standard input | Same as Input. |
| Checkbox | `checkbox` | Space to toggle | Indeterminate via `aria-checked="mixed"`. |
| Switch | `switch` | Space to toggle | Semantically different from checkbox. |
| RadioGroup | `radiogroup` + `radio` | Arrow for navigation | Tab does not enter other items while focused in the group. |
| Select | `combobox` (Radix) | Arrow, Enter, Escape | Trigger uses `aria-expanded`. |
| Combobox | `combobox` + `listbox` | Arrow, Enter, Escape | Use `aria-activedescendant` for highlight. |
| MultiSelectCombobox | `combobox` + `listbox` | Arrow, Enter, Escape, Backspace (remove chip) | Chip removable via button. |
| Slider | `slider` | Arrow (step), Home/End (min/max) | `aria-valuenow`, `aria-valuemin`, `aria-valuemax`. |
| Rating | `radiogroup` | Arrow for navigation | Item uses `aria-label` "Rating 4 of 5". |
| Stepper | `group` + `listitem` | Arrow | `aria-current="step"` on the active step. |
| ColorPicker | - | Input hex fallback | Spectrum SV slider uses `role="slider"`. |

FEEDBACK

| Component | Role | Keyboard | Notes |
| -------- | ---- | -------- | ------- |
| Alert | `alert` | - | Important alerts are automatically announced via `role=alert`. |
| Toast | `status` (polite) or `alert` (urgent) | - | Use the `useToast` queue. Auto-dismiss timer pauses on hover/focus. |
| Skeleton | `status` | - | Use `aria-busy="true"` while loading. |
| Progress | `progressbar` | - | `aria-valuenow`, `aria-valuemin`, `aria-valuemax`. |

OVERLAYS

| Component | Role | Keyboard | Notes |
| -------- | ---- | -------- | ------- |
| Dialog | `dialog` | Escape, Tab (trapped), Shift+Tab | Internal focus trap. `aria-modal="true"`. |
| AlertDialog | `alertdialog` | Escape (optional, default off) | Same as Dialog but the interaction is more emphatic. |
| Sheet | `dialog` | Escape, Tab (trapped) | Side direction in `aria-label` ("Right drawer"). |
| Popover | `dialog` | Escape | Close on click outside by default. |
| DropdownMenu | `menu` + `menuitem` | Arrow (vertical), Escape | `aria-haspopup` on the trigger. |
| Tooltip | `tooltip` | - | Appears on focus + hover. `role=tooltip` on content. |
| ContextMenu | `menu` | Arrow, Escape | Trigger via right-click + keyboard shortcut. |
| HoverCard | `dialog` | Escape | Similar to Popover but appears after a delay. |

DATA

| Component | Role | Keyboard | Notes |
| -------- | ---- | -------- | ------- |
| Avatar | - | - | `alt` is required for image. |
| Chip | - | - | Removable chip = inner button. |
| DataTable | `table` + `row` + `cell` | Arrow (focusable cell), Home/End | Sortable header = `aria-sort`. |
| Tabs | `tablist` + `tab` + `tabpanel` | Arrow (horizontal/vertical) | Activation mode: automatic / manual. |
| Accordion | `region` + `button` | Enter/Space, Arrow | `aria-expanded` on the trigger. |
| Timeline | `list` + `listitem` | - | Items in chronological order semantically. |

NAVIGATION

| Component | Role | Keyboard | Notes |
| -------- | ---- | -------- | ------- |
| BottomNav | `navigation` + `tab` | Arrow (horizontal) | Active item `aria-current="page"`. |
| Pagination | `navigation` | Tab, Enter | `aria-label` per page. |
| Menu | `menubar` + `menuitem` | Arrow, Enter | Roaming tabindex pattern. |

COMMON PATTERNS

FOCUS MANAGEMENT

- First focus - when an overlay (Dialog, Sheet, Popover, Dropdown) opens, focus moves to the first focusable element inside. If none, focus moves to the container (handled automatically by Radix).
- Focus return - when the overlay closes, focus returns to the trigger element (handled automatically by Radix).
- Focus trap - full-screen overlays (Dialog, Sheet) trap Tab inside. Radix implements this via focus-scope.

LIVE REGION

- `aria-live="polite"` for non-urgent updates (counter, status).
- `aria-live="assertive"` for urgent updates (error, network down).
- `role="status"` shorthand for polite.
- `role="alert"` shorthand for assertive.

SKIP LINKS

For efficient keyboard navigation, provide a skip link at the top of the page:

```tsx
<a href="#main" className="sr-only focus:not-sr-only focus:fixed
   focus:left-2 focus:top-2 focus:z-50 focus:rounded-md focus:bg-brand
   focus:px-3 focus:py-1.5 focus:text-sm focus:font-medium
   focus:text-brand-foreground">
  Skip to content
</a>
```

Use the `sd-tap` class so the tap target is >= 44px.

AUTOMATED TESTING

The `vitest-axe` library (optional, dev-only) to scan rendered components:

```bash
npm install -D vitest-axe
```

```ts
// src/components/ui/__tests__/button.test.tsx
import { axe, toHaveNoViolations } from "vitest-axe";
expect.extend(toHaveNoViolations);

const { container } = render(<Button>Click</Button>);
const results = await axe(container);
expect(results).toHaveNoViolations();
```

Conventions:

- Every `*.test.tsx` file in `src/components/ui/__tests__/` MUST have at least 1 `toHaveNoViolations()` test.
- Overriding attributes via JSX (e.g. `aria-label`) is better than suppressing the rule per test.

MANUAL CHECKLIST

Before release, manually test with:

- [ ] VoiceOver (iOS Safari) - swipe left/right, double tap, rotor navigation.
- [ ] TalkBack (Android Chrome) - same as VoiceOver.
- [ ] NVDA (Windows Firefox) - arrow navigation, forms mode.
- [ ] Keyboard only - Tab order makes sense, focus is clearly visible, Escape closes overlays.
- [ ] Zoom 200% - layout does not break, tap targets remain >= 44px.
- [ ] prefers-reduced-motion - non-essential animations are off.
- [ ] prefers-contrast: more - the high-contrast preset color is active.

RISKS & EXCEPTIONS

- Complex touch gestures (pinch, swipe) without a keyboard fallback MUST have a visible button. For example, PhotoViewer has +/- zoom buttons even though pinch-zoom works.
- Drag-and-drop must have a keyboard alternative (usually "Move up/down" buttons for list reordering).
- Custom widgets (ColorPicker spectrum, DatePicker calendar) whose ARIA is complex - test with NVDA + VoiceOver before merge.
- Auto-advance carousel/story (StoryReelsViewer) auto-pauses when the tab is hidden via the Page Visibility API (see the `useVisibilityPause` hook).

REFERENCES

- WCAG 2.2 - https://www.w3.org/TR/WCAG22/
- ARIA Authoring Practices - https://www.w3.org/WAI/ARIA/apg/
- Radix UI a11y docs - https://www.radix-ui.com/primitives/docs/overview/accessibility
- WebAIM contrast checker - https://webaim.org/resources/contrastchecker/

# Design Tokens

All Serayu UI tokens are prefixed with `sd-` (Serayu Digital) to prevent collisions with other libraries. Override on `:root` to customize without forking.

STRUCTURE

Tokens are split into 4 categories:

1. Color scale - semantic (background, foreground, brand, success, etc.) + internal neutrals
2. Geometry - radius, tap target, safe-area
3. Shadow - 3 elevation levels, 1 solid layer each
4. Motion - duration + easing

COLOR SCALE - SEMANTIC

Used directly by Serayu UI components and Tailwind utility classes.

| Token | Light | Dark | Tailwind class |
| ----- | ----- | ---- | -------------- |
| `--sd-background` | `#ffffff` | `#0b0b10` | `bg-background` |
| `--sd-foreground` | `#0a0a0a` | `#f4f4f5` | `text-foreground` |
| `--sd-surface` | `#f7f7f8` | `#15151b` | `bg-surface` |
| `--sd-surface-foreground` | `#0a0a0a` | `#f4f4f5` | `text-surface-foreground` |
| `--sd-card` | `#ffffff` | `#1c1c24` | `bg-card` |
| `--sd-card-foreground` | `#0a0a0a` | `#f4f4f5` | `text-card-foreground` |
| `--sd-muted` | `#f1f1f3` | `#1c1c24` | `bg-muted` |
| `--sd-muted-foreground` | `#52525b` | `#a1a1aa` | `text-muted-foreground` |
| `--sd-border` | `#e4e4e7` | `#2a2a33` | `border-border` |
| `--sd-input` | `#e4e4e7` | `#2a2a33` | `border-input` |
| `--sd-ring` | `#0064f0` | `#4d9aff` | `ring-ring` |
| `--sd-brand` | `#0064f0` | `#4d9aff` | `bg-brand` |
| `--sd-brand-foreground` | `#ffffff` | `#0b0b10` | `text-brand-foreground` |
| `--sd-success` | `#16a34a` | `#4ade80` | `bg-success` |
| `--sd-success-foreground` | `#ffffff` | `#0b0b10` | `text-success-foreground` |
| `--sd-warning` | `#d97706` | `#fbbf24` | `bg-warning` |
| `--sd-warning-foreground` | `#ffffff` | `#0b0b10` | `text-warning-foreground` |
| `--sd-danger` | `#dc2626` | `#f87171` | `bg-danger` |
| `--sd-danger-foreground` | `#ffffff` | `#0b0b10` | `text-danger-foreground` |
| `--sd-info` | `#2563eb` | `#60a5fa` | `bg-info` |
| `--sd-info-foreground` | `#ffffff` | `#0b0b10` | `text-info-foreground` |

INTERNAL NEUTRAL SCALE

Internal tokens for color composition. Not exposed to Tailwind utilities (to keep the API clean).

| Token | Light | Dark |
| ----- | ----- | ---- |
| `--sd-neutral-0` | `#ffffff` | `#0b0b10` |
| `--sd-neutral-50` | `#fafafa` | `#15151b` |
| `--sd-neutral-100` | `#f4f4f5` | `#1c1c24` |
| `--sd-neutral-200` | `#e4e4e7` | `#2a2a33` |
| `--sd-neutral-300` | `#d4d4d8` | `#3f3f46` |
| `--sd-neutral-400` | `#a1a1aa` | `#52525b` |
| `--sd-neutral-500` | `#71717a` | `#71717a` |
| `--sd-neutral-600` | `#52525b` | `#a1a1aa` |
| `--sd-neutral-700` | `#3f3f46` | `#d4d4d8` |
| `--sd-neutral-800` | `#27272a` | `#e4e4e7` |
| `--sd-neutral-900` | `#18181b` | `#f4f4f5` |

RADIUS

Modern mobile: slightly more rounded than traditional web.

| Token | Value | Tailwind |
| ----- | ----- | -------- |
| `--sd-radius-sm` | `8px` | `rounded-sm` |
| `--sd-radius-md` | `12px` | `rounded-md` |
| `--sd-radius-lg` | `16px` | `rounded-lg` |
| `--sd-radius-xl` | `20px` | `rounded-xl` |
| `--sd-radius-full` | `9999px` | `rounded-full` |

SHADOW

3 levels, all 1 solid layer with different opacity.

| Token | Value | Tailwind |
| ----- | ----- | -------- |
| `--sd-shadow-sm` | `0 1px 2px 0 rgba(0,0,0,0.05)` | `shadow-sm` |
| `--sd-shadow-md` | `0 2px 8px 0 rgba(0,0,0,0.08)` | `shadow-md` |
| `--sd-shadow-lg` | `0 8px 24px 0 rgba(0,0,0,0.12)` | `shadow-lg` |

Dark mode has heavier shadows (opacity increased).

MOTION

| Token | Value | Use for |
| ----- | ----- | ------- |
| `--sd-duration-micro` | `120ms` | Hover, focus ring |
| `--sd-duration-standard` | `200ms` | General transition (color, opacity) |
| `--sd-duration-enter` | `320ms` | Modal/sheet open |
| `--sd-easing-standard` | `cubic-bezier(0.2, 0, 0, 1)` | Default |
| `--sd-easing-emphasized` | `cubic-bezier(0.3, 0, 0, 1)` | Exit / dismiss |

Resets to `0ms` when `prefers-reduced-motion: reduce`.

Z-INDEX

Consistent scale for overlay stacking context.

| Token | Value | Used by |
| ----- | ----- | ------- |
| `--sd-z-base` | `1` | Default |
| `--sd-z-dropdown` | `1000` | Dropdown menu |
| `--sd-z-sticky` | `1100` | Sticky header / bottom-nav |
| `--sd-z-overlay` | `1300` | Modal backdrop |
| `--sd-z-modal` | `1400` | Modal content |
| `--sd-z-popover` | `1500` | Popover content |
| `--sd-z-toast` | `1600` | Toast |
| `--sd-z-tooltip` | `1700` | Tooltip |

SAFE-AREA INSET

For PWA / fullscreen apps with notch or home indicator.

```css
--sd-safe-top: env(safe-area-inset-top, 0px);
--sd-safe-right: env(safe-area-inset-right, 0px);
--sd-safe-bottom: env(safe-area-inset-bottom, 0px);
--sd-safe-left: env(safe-area-inset-left, 0px);
```

Ready-to-use utility class:

```html
<div class="sd-safe-top sd-safe-bottom">
  Content that respects notch & home indicator
</div>
```

TAP TARGET

```css
--sd-tap-target: 44px;
```

Equivalent to HIG (Apple) and Material Design standards. Used as `min-h-[--sd-tap-target]` on interactive components.

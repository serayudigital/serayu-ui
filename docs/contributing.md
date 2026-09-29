# Contributing

Thank you for considering contributing to Serayu UI. A brief guide to local setup, workflow, and contribution rules.

CODE OF CONDUCT

This project follows the [Contributor Covenant](https://www.contributor-covenant.org/). By participating, you are expected to uphold this code of conduct.

LOCAL SETUP

PREREQUISITES

- Node.js >= 18
- npm >= 9 (or pnpm/yarn)

STEPS

```bash
git clone https://github.com/serayudigital/serayu-ui.git
cd serayu-ui
npm install
npm run dev
```

Open `http://localhost:5173` for the landing page and `http://localhost:5173/playground/` for the playground.

AVAILABLE SCRIPTS

| Command | Function |
| ------- | -------- |
| `npm run dev` | Dev server + playground |
| `npm run build` | Type-check + production build |
| `npm run typecheck` | TypeScript no-emit check |
| `npm run generate:icons` | Regenerate PWA icons |

STRUCTURE

```
serayu-ui/
├── src/
│   ├── components/
│   │   ├── ui/        # 56 primitive UI components
│   │   └── patterns/  # 30 mobile-first patterns
│   ├── hooks/         # useTheme, useMediaQuery, useToast
│   ├── lib/           # cn, utils, format
│   ├── styles/        # tokens + utilities
│   ├── App.tsx        # Landing page
│   ├── main.tsx       # Entry
│   └── index.ts       # Public barrel export
├── playground/
│   ├── components/    # Demo helpers (phone-mockup, etc.)
│   ├── sections.tsx   # 9 base sections
│   ├── sections-extended.tsx  # 5 new sidebar categories
│   ├── sections-addons.tsx    # sub-sections inside existing categories
│   └── App.tsx        # TopBar + Sidebar + Hero
├── public/            # PWA icons + favicon
├── docs/              # Markdown documentation
├── tools/             # eslint-plugin-serayu internal tool
└── scripts/           # analyze, generate-icons
```

CONTRIBUTION RULES

NEW COMPONENTS

1. Location - UI primitives go in `src/components/ui/`, patterns go in `src/components/patterns/`.
2. API - props must be clear and minimal; use `VariantProps<typeof cva>` when variants exist.
3. TypeScript - strict, generic-friendly, avoid `any`.
4. Tokens - use `var(--sd-*)` for colors. Do not use raw hex values.
5. Accessibility - follow [docs/accessibility.md](https://github.com/serayudigital/serayu-ui/blob/main/docs/accessibility.md) for the role, keyboard, focus, label, and tap target matrix.

NEW PATTERNS

Patterns must be mobile-first and satisfy at least one of:

- Sticky positioning (header/nav)
- Touch-optimized (swipe, snap, pull-to-refresh)
- Safe-area aware
- Bottom-anchored (sheet, bottom-nav, FAB)

STYLE

- Format: Prettier default (2 spaces, single quote, trailing comma)
- Lint: ESLint TypeScript
- Type-check: `npm run typecheck` must pass

COMMIT

Conventional Commits:

```
feat(ui): add Slider component
fix(patterns): fix FilterBar snap on iOS
docs: add theming guide
chore(deps): bump radix-ui to 1.2.0
```

PULL REQUEST

1. Branch from `main`.
2. Make your changes.
3. Run `npm run typecheck` and `npm run build` - both must pass.
4. Update documentation if needed.
5. Open a PR with a clear description (what, why, how).
6. Wait for review.

ISSUES

Use the appropriate issue template:

- Bug report - reproduction steps, expected, actual, screenshot.
- Feature request - problem to solve, alternative solutions, mockup if available.
- Question - check the docs and existing issues first.

LICENSE

By contributing, you agree that your contributions will be licensed under the [MIT License](https://github.com/serayudigital/serayu-ui/blob/main/LICENSE).

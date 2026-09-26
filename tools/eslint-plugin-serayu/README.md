# eslint-plugin-serayu

Internal ESLint plugin for enforcing Serayu UI design conventions in TypeScript / TSX source.

## Rules

| Rule | Default | Goal |
|---|---|---|
| `serayu/no-hardcoded-color` | error | Forbid hex/rgb/hsl/CSS-named in JSX `style` / `color` / `fill` / `stroke`. Use `var(--sd-*)`. |
| `serayu/no-gradient` | error | Forbid Tailwind `bg-gradient-*` + CSS `linear-gradient` / `radial-gradient` / `conic-gradient`. |
| `serayu/tap-target` | warn | Report interactive elements (`button`/`a`/`input`/`select`/`textarea`/`label`) whose className lacks `h-11` / `sd-tap` / `min-w-[44px]`. |
| `serayu/sd-namespace` | warn | Report unrecognized `sd-*` classes (built-in exported utilities: `sd-tap`, `sd-safe-*`). |

## How to use

This plugin is **internal** (not published to npm). Consumers can:

```bash
# Copy this folder to your project
cp -r tools/eslint-plugin-serayu ./eslint-plugin-serayu

# Or use it via relative path in the eslint config
```

Add to `.eslintrc.json`:

```json
{
  "parser": "@typescript-eslint/parser",
  "plugins": ["serayu"],
  "rules": {
    "serayu/no-hardcoded-color": "error",
    "serayu/no-gradient": "error",
    "serayu/tap-target": "warn",
    "serayu/sd-namespace": "warn"
  }
}
```

Because this plugin lives in `tools/`, run with the resolve flag:

```bash
npx eslint --resolve-plugins-relative-to . "src/**/*.{ts,tsx}"
```

## Exceptions

For documented functional exceptions (e.g. `ColorPicker` needs a spectrum gradient, `Heatmap` needs intensity), add a per-line disable comment:

```tsx
// eslint-disable-next-line serayu/no-gradient, serayu/no-hardcoded-color
style={{ background: "linear-gradient(to right, #ff0000, ...)" }}
```

## Tests

The plugin has an internal test suite using ESLint's built-in `RuleTester`:

```bash
node tools/eslint-plugin-serayu/tests/run.js
```

Output:
```
=== eslint-plugin-serayu ===
Rules tested : 4
Total cases  : 32 (valid+invalid)
Passed       : 32
Failed       : 0
```

## Notes

- The rules **do not** report string literals outside JSX (to avoid false positives from import paths, JSON, etc.).
- The `sd-namespace` whitelist: valid utilities in Serayu UI are `sd-tap`, `sd-safe-pt`, `sd-safe-pb`, `sd-safe-pl`, `sd-safe-pr`. For other `sd-*` utilities (e.g. `sd-pan-y`, `sd-scroll-*` from built-in Tailwind), add them to the `KNOWN_SD_UTILS` whitelist in `rules/sd-namespace.js`.
- The `tap-target` rule only *warns* - it is treated as OK by default when the className does not mention a size (a design system component may override via a wrapper).

## License

MIT - by Serayu Digital (www.serayudigital.com).

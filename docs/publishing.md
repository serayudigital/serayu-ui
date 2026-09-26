# Publishing @serayu/ui to npm

Step-by-step guide for maintainers publishing a new version to the npm registry.

PREREQUISITES

1. An npm account with access to the `@serayu` scope.
2. Login in the terminal: `npm login` (check `.npmrc` in home for auth token).
3. Make sure you have write access to the `@serayu/ui` package (run `npm owner ls @serayu/ui`).

PUBLISH WORKFLOW FOR A SINGLE VERSION

1. UPDATE VERSION

Use `npm version` to bump and auto-tag in git:

```bash
# Patch (1.3.0 → 1.3.1) - small bugfix
npm version patch

# Minor (1.3.0 → 1.4.0) - new feature, backward-compat
npm version minor

# Major (1.3.0 → 2.0.0) - breaking change
npm version major

# Prerelease (1.3.0 → 1.4.0-beta.1)
npm version prerelease --preid=beta
```

This will:
- Update `package.json` version.
- Create a git commit with the message "v1.x.y".
- Create a git tag `v1.x.y`.

2. CHECK BEFORE PUBLISH

The `prepublishOnly` script runs automatically before publish. But you can run it manually:

```bash
npm run lint            # ESLint via serayu plugin
npm run typecheck       # tsc --noEmit
npm run test            # 131 vitest passes
npm run build:lib       # vite library mode + tsc declarations
```

Make sure everything is green.

3. PUBLISH

```bash
# For stable version (default tag 'latest')
npm publish --access public

# For prerelease (tag 'beta')
npm publish --access public --tag beta

# Dry-run to see what will be uploaded
npm publish --dry-run --access public
```

`--access public` is required for scoped package `@serayu/ui` (default is private).

4. VERIFY

```bash
# Check the package page
open https://www.npmjs.com/package/@serayu/ui

# Test install in a tester project
mkdir /tmp/test-sd && cd /tmp/test-sd
npm init -y
npm install @serayu/ui
echo 'import("@serayu/ui"); console.log("ok");' > test.js
node --experimental-vm-modules -e "import('test.js')"
```

PUBLISHED ARTIFACT STRUCTURE

```
@serayu/ui/
├── dist/
│   ├── index.js          ESM entry
│   ├── index.cjs         CJS entry
│   ├── index.d.ts        Types entry
│   ├── style.css         Tailwind-compiled CSS
│   ├── components/       Per-file .d.ts for tree-shake types
│   │   ├── ui/
│   │   ├── patterns/
│   │   └── serayu-logo.d.ts
│   ├── hooks/
│   ├── lib/
│   └── *.d.ts (all modules)
├── README.md
├── LICENSE
└── package.json
```

What is NOT published (via `.npmignore`):
- `src/` - source code (consumers don't need it)
- `playground/` - internal demo
- `tools/` - internal ESLint plugin
- `docs/` - internal documentation
- `*.config.*` - Vite/Tailwind/PostCSS config
- `node_modules/`, `coverage/`, `.env*`, etc.

CONSUMER CONFIGURATION

Minimum consumer-side config:

```bash
npm install @serayu/ui
npm install react react-dom  # peerDependency, must be installed manually
```

```tsx
// main.tsx
import "@serayu/ui/styles.css";  // IMPORTANT: Tailwind tokens are active
import { Button } from "@serayu/ui";
```

Make sure the installed `react` version matches `peerDependencies` (`^18.3.1`). React 19 may break due to changes in `forwardRef` behavior.

TROUBLESHOOTING

"Package name already exists" / "Permission denied"

Account does not have access to scope `@serayu`. Ask a maintainer to invite you:
```bash
npm owner add <username> @serayu/ui
```

Bundle too large (>500 KB)

Library mode in Vite externalizes all runtime deps. Check the `rollupOptions.external` section in `vite.config.lib.ts` - if a new dep is not externalized, it will be bundled in.

TypeScript error during build

```bash
npx tsc -p tsconfig.lib.json --noEmit
```

The root cause is usually a component source that returns `ReactNode` without an explicit type. Fix it in the source, not in the build script.

CSS missing --sd-* variables

Make sure the consumer imports `@serayu/ui/styles.css`. The `--sd-*` variables are defined there. If using Tailwind in your own project, `var(--sd-*)` can also be overridden in `:root`.

React 19 incompatibility

This library is written for React 18.3. For React 19, check whether there are breaking changes in `forwardRef` or `useId`. Not yet supported - downgrade to React 18.3.1 in the consumer project.

NOTES

- Do not publish from a feature branch. Always from `main` (or the default branch) that is clean.
- Always check the `npm run prepublishOnly` output before pushing to publish. Failed tests = abort.
- Back up the npm token in `.npmrc` with secure storage (not in the repo).
- For urgent patches, use `npm version patch` - do not edit `package.json` manually.
- Git tag `v*` is pushed separately: `git push origin v<version>` after publishing (if CI/CD auto-publishes, this tag is the trigger).

REFERENCES

- [npm publish docs](https://docs.npmjs.com/cli/v10/commands/npm-publish)
- [npm version docs](https://docs.npmjs.com/cli/v10/commands/npm-version)
- [Scoped packages](https://docs.npmjs.com/cli/v10/configuring-npm/package-json#publishconfig)
- Vite library mode: <https://vitejs.dev/guide/build.html#library-mode>

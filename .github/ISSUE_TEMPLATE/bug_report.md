---
name: Bug report
about: Report incorrect behavior so we can fix it
title: "[bug] "
labels: bug
assignees: ''
---

## Summary

A clear and concise description of what the bug is.

## Reproduction

A minimal code snippet, CodeSandbox link, or step-by-step reproduction:

```tsx
import { Button } from "@serayu/ui";

export function App() {
  return <Button onClick={() => console.log("clicked")}>Click me</Button>;
}
```

## Expected behavior

What you expected to happen.

## Actual behavior

What actually happened.

## Environment

- `@serayu/ui` version: <!-- e.g. 1.0.0 -->
- React version: <!-- e.g. 18.3.1 -->
- Browser: <!-- e.g. Chrome 120 -->
- OS: <!-- e.g. macOS 14, iOS 17 -->
- Build tool: <!-- e.g. Vite 5.4 -->

## Screenshots / Recordings

If applicable.

## Additional context

Anything else that might help diagnose the issue.

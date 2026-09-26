/*
 * Serayu UI - Library mode entry (internal).
 *
 * This file is only used by `vite.config.lib.ts` as the entry point for the
 * library build. It triggers Vite to extract `src/styles/index.css` into
 * `dist/style.css` during build, while re-exporting everything from the
 * public barrel `src/index.ts`.
 *
 * Consumers of the package DO NOT import this file. They use:
 *   import { Button } from "@serayu/ui";        // public barrel
 *   import "@serayu/ui/styles.css";             // Tailwind tokens
 *
 * Or deep import:
 *   import { Button } from "@serayu/ui/components/ui/button";
 */
import "./styles/index.css";
export * from "./index";


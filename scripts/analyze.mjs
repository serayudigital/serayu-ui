#!/usr/bin/env node
/**
 * Wraps vite build with ANALYZE=true. Cross-platform (Windows + POSIX).
 * Uses shell=true so .cmd files can be spawned on Windows.
 */
process.env["ANALYZE"] = "true";
import { spawn } from "node:child_process";

const cmd = process.platform === "win32" ? "vite build" : "vite build";
const child = spawn(cmd, { stdio: "inherit", env: process.env, shell: true });
child.on("exit", (code) => process.exit(code ?? 0));

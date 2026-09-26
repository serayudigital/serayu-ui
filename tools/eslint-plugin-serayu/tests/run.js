/**
 * Minimal test runner for eslint-plugin-serayu.
 *
 * Uses the ESLint built-in RuleTester - no extra dependency required.
 * Run: node tests/run.js
 */

"use strict";

const { RuleTester } = require("eslint");
const path = require("path");

const rules = require("../index.js");

const tester = new RuleTester({
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    ecmaFeatures: { jsx: true },
  },
});

let pass = 0;
let fail = 0;
const results = [];

function test(ruleName, valid, invalid) {
  const rule = rules.rules[ruleName];
  if (!rule) {
    console.error(`Rule '${ruleName}' not found.`);
    process.exit(1);
  }
  try {
    tester.run(`serayu/${ruleName}`, rule, { valid, invalid });
    pass += valid.length + invalid.length;
    results.push({ rule: ruleName, ok: true });
  } catch (err) {
    fail += 1;
    results.push({ rule: ruleName, ok: false, error: err.message });
    console.error(`[FAIL] serayu/${ruleName}`);
    console.error(err.message);
  }
}

/* ============================================================
 * no-hardcoded-color
 * ============================================================ */
test(
  "no-hardcoded-color",
  // valid
  [
    { code: `<div style={{ color: "var(--sd-brand)" }} />` },
    { code: `<div style={{ background: "transparent" }} />` },
    { code: `<div style={{ color: "currentColor" }} />` },
    { code: `<div className="text-brand bg-surface" />` },
    { code: `<span style={{ background: "var(--sd-surface)" }} />` },
    { code: `<div style={{ fill: "none" }} />` },
    // Allow hex inside JSDoc / example / documentation
    { code: `// #ff0000 is a sample color` },
    { code: `const brandColor = "var(--sd-brand)"; // #0064f0 reference` },
  ],
  // invalid
  [
    {
      code: `<div style={{ color: "#ff0000" }} />`,
      errors: [{ messageId: "hardcoded" }],
    },
    {
      code: `<div style={{ background: "rgb(0,0,0)" }} />`,
      errors: [{ messageId: "hardcoded" }],
    },
    {
      code: `<span style={{ fill: "white" }} />`,
      errors: [{ messageId: "hardcoded" }],
    },
  ]
);

/* ============================================================
 * no-gradient
 * ============================================================ */
test(
  "no-gradient",
  [
    { code: `<div className="bg-brand" />` },
    { code: `<div style={{ background: "var(--sd-brand)" }} />` },
    { code: `// gradient is fancy` },
    { code: `const heatmapIntensity = "intensity"; // heatmap uses gradient` },
  ],
  [
    {
      code: `<div className="bg-gradient-to-r from-brand to-accent" />`,
      errors: [{ messageId: "tailwind" }],
    },
    {
      code: `<div className="bg-gradient-conic" />`,
      errors: [{ messageId: "tailwind" }],
    },
    {
      code: `<div style={{ background: "linear-gradient(to right, #fff, #000)" }} />`,
      errors: [{ messageId: "style" }],
    },
    {
      code: `<div style={{ background: "radial-gradient(circle, white, black)" }} />`,
      errors: [{ messageId: "style" }],
    },
  ]
);

/* ============================================================
 * tap-target
 * ============================================================ */
test(
  "tap-target",
  [
    // With sd-tap - OK.
    { code: `<button className="sd-tap">Click</button>` },
    { code: `<a className="h-11 min-w-[44px]">Link</a>` },
    { code: `<button className="h-11 px-4">Click</button>` },
    // input hidden is not interactive.
    { code: `<input type="hidden" />` },
    // No className - default considered OK (component wrap).
    { code: `<button>Click</button>` },
  ],
  [
    // button without sd-/h-11 - flag.
    {
      code: `<button className="px-2 text-xs">Click</button>`,
      errors: [{ messageId: "tooSmall" }],
    },
    {
      code: `<a className="text-brand" href="/home">Link</a>`,
      errors: [{ messageId: "tooSmall" }],
    },
    {
      code: `<input className="border" />`,
      errors: [{ messageId: "tooSmall" }],
    },
  ]
);

/* ============================================================
 * sd-namespace
 * ============================================================ */
test(
  "sd-namespace",
  // valid - known utility
  [
    { code: `<div className="sd-tap" />` },
    { code: `<div className="sd-safe-pt sd-safe-pb" />` },
    { code: `<div className="px-4 text-sm" />` },
  ],
  // invalid - unrecognized sd- prefix
  [
    {
      code: `<div className="sd-unknown" />`,
      errors: [{ messageId: "unknown" }],
    },
    {
      code: `<div className="px-4 sd-foo-bar" />`,
      errors: [{ messageId: "unknown" }],
    },
  ]
);

/* ============================================================
 * Report
 * ============================================================ */
console.log("\n=== eslint-plugin-serayu ===");
console.log(`Rules tested : ${results.length}`);
console.log(`Total cases  : ${pass + fail} (valid+invalid)`);
console.log(`Passed       : ${pass}`);
console.log(`Failed       : ${fail}`);
console.log("");
for (const r of results) {
  const tag = r.ok ? "[OK]  " : "[FAIL]";
  console.log(`${tag} serayu/${r.rule}`);
}
if (fail > 0) process.exit(1);

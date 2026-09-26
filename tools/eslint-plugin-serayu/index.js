/**
 * eslint-plugin-serayu
 *
 * Rules enforcing Serayu UI design conventions:
 *   - no-hardcoded-color : forbid hex/rgb/hsl in JSX, allow only var(--sd-*).
 *   - no-gradient        : forbid Tailwind bg-gradient-* + style linear/radialGradient.
 *   - tap-target         : report interactive JSX (button/a/input) smaller than 44px.
 *   - sd-namespace       : prefer classes with the sd- prefix for custom utilities.
 *
 * Usage:
 *   // .eslintrc.json
 *   {
 *     "plugins": ["serayu"],
 *     "rules": {
 *       "serayu/no-hardcoded-color": "error",
 *       "serayu/no-gradient": "error",
 *       "serayu/tap-target": "warn",
 *       "serayu/sd-namespace": "warn"
 *     }
 *   }
 *
 * Or import directly from the repo (flat config):
 *   import serayu from "./tools/eslint-plugin-serayu/index.js";
 *   export default [
 *     { plugins: { serayu }, rules: { ... } }
 *   ];
 */

"use strict";

const noHardcodedColor = require("./rules/no-hardcoded-color");
const noGradient = require("./rules/no-gradient");
const tapTarget = require("./rules/tap-target");
const sdNamespace = require("./rules/sd-namespace");

module.exports = {
  meta: {
    name: "eslint-plugin-serayu",
    version: "1.3.0",
  },
  rules: {
    "no-hardcoded-color": noHardcodedColor,
    "no-gradient": noGradient,
    "tap-target": tapTarget,
    "sd-namespace": sdNamespace,
  },
};

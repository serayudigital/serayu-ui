/**
 * @fileoverview Prefer classes with the sd- prefix for custom utilities.
 *
 * Detects the use of "sd-*" classes in non-styling files (TSX/JSX).
 * Currently this rule only reports elements that USE an "sd-" class but
 * have a similar Tailwind utility - this is for documentation
 * consistency, not an error.
 *
 * Goal: keep the sd- prefix used only for custom utilities actually
 * exported by Serayu UI (sd-tap, sd-safe-*, etc.). For now this rule is
 * informational (warn).
 */

"use strict";

const KNOWN_SD_UTILS = [
  "sd-tap",
  "sd-safe-pt",
  "sd-safe-pb",
  "sd-safe-pl",
  "sd-safe-pr",
];

module.exports = {
  meta: {
    type: "suggestion",
    docs: {
      description: "Prefer sd-* classes for Serayu UI custom utilities.",
      category: "Stylistic Issues",
      recommended: false,
    },
    schema: [],
    messages: {
      unknown:
        "Class '{{value}}' uses the sd- prefix but is not recognized. Use a utility exported by Serayu UI.",
    },
  },
  create(context) {
    return {
      // Only handle JSXAttribute - skip general Literals so we do not
      // false-positive on strings in non-JSX code.
      JSXAttribute(node) {
        const name = node.name && node.name.name;
        if (name !== "className") return;
        if (!node.value) return;
        if (node.value.type === "Literal" && typeof node.value.value === "string") {
          const classes = node.value.value.split(/\s+/);
          for (const c of classes) {
            if (!c.startsWith("sd-")) continue;
            if (KNOWN_SD_UTILS.some((u) => c === u || c.startsWith(u + ":"))) continue;
            context.report({ node, messageId: "unknown", data: { value: c } });
          }
        } else if (node.value.type === "JSXExpressionContainer") {
          const expr = node.value.expression;
          if (expr.type === "Literal" && typeof expr.value === "string") {
            const classes = expr.value.split(/\s+/);
            for (const c of classes) {
              if (!c.startsWith("sd-")) continue;
              if (KNOWN_SD_UTILS.some((u) => c === u || c.startsWith(u + ":"))) continue;
              context.report({ node, messageId: "unknown", data: { value: c } });
            }
          }
        }
      },
    };
  },
};

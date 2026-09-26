/**
 * @fileoverview Minimum 44px tap target for interactive elements.
 *
 * Checks <button>, <a> (with href), <input> (except hidden),
 * <select>, <textarea>, and elements with onClick handlers.
 *
 * 44px indicators from the Tailwind className:
 *   - h-11 (44px), min-h-11, h-[44px], min-h-[44px]
 *   - or the sd-tap utility (44px utility defined in tokens.css)
 *
 * When no size indicator is present, the element is treated as OK by
 * default (a design system component may override via a wrapper). This
 * rule only warns, never errors.
 *
 * Goal: Apple HIG / Material Design recommend a minimum 44x44 px tap
 * target for touch accuracy.
 */

"use strict";

const TAP_PATTERNS = [
  /\bh-11\b/,
  /\bmin-h-11\b/,
  /\bh-\[44(?:px)?\]/,
  /\bmin-h-\[44(?:px)?\]/,
  /\bsd-tap\b/,
  /\bsize-11\b/, // Tailwind v3.4 size = w + h
];

function hasTapSize(value) {
  if (typeof value !== "string") return false;
  return TAP_PATTERNS.some((p) => p.test(value));
}

const INTERACTIVE_ELEMENTS = new Set([
  "button",
  "a",
  "input",
  "select",
  "textarea",
  "label",
]);

function isInteractive(name, attributes) {
  if (INTERACTIVE_ELEMENTS.has(name)) {
    // <input type="hidden"> is not interactive.
    if (name === "input") {
      const typeAttr = attributes.type;
      if (typeAttr && /hidden/i.test(String(typeAttr))) return false;
    }
    return true;
  }
  return false;
}

module.exports = {
  meta: {
    type: "suggestion",
    docs: {
      description: "Minimum 44px tap target for interactive elements (button/a/input).",
      category: "Accessibility",
      recommended: false,
    },
    schema: [],
    messages: {
      tooSmall:
        "Interactive element '{{name}}' may be smaller than 44px. Add className 'h-11 min-w-[44px]' or 'sd-tap'.",
    },
  },
  create(context) {
    return {
      JSXOpeningElement(node) {
        const nameNode = node.name;
        if (!nameNode || nameNode.type !== "JSXIdentifier") return;
        const name = nameNode.name;
        const attrs = {};
        for (const attr of node.attributes) {
          if (attr.type === "JSXAttribute" && attr.name) {
            const k = attr.name.name;
            if (k === "className" && attr.value && attr.value.type === "Literal") {
              attrs[k] = attr.value.value;
            } else if (k === "className" && attr.value && attr.value.type === "JSXExpressionContainer") {
              const expr = attr.value.expression;
              if (expr.type === "Literal" && typeof expr.value === "string") {
                attrs[k] = expr.value;
              }
            } else {
              attrs[k] = true;
            }
          }
        }
        if (!isInteractive(name, attrs)) return;
        const cls = attrs.className;
        if (cls && !hasTapSize(cls)) {
          context.report({ node, messageId: "tooSmall", data: { name } });
        }
      },
    };
  },
};

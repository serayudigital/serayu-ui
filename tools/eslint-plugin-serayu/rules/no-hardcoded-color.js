/**
 * @fileoverview Forbid hardcoded colors (hex / rgb / hsl / named) in JSX.
 *
 * Exceptions (allowed):
 *   - var(--sd-*) token references
 *   - "transparent", "currentColor", "inherit", "none"
 *   - Style overrides inside JSDoc / examples / documentation arguments
 *   - Files ignored via /* eslint-disable serayu/no-hardcoded-color *\/
 *
 * Goal: ensure colors always flow through the sd- token namespace so the
 * light/dark theme and ThemeCustomizer custom presets stay consistent.
 */

"use strict";

const HEX = /#(?:[0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})\b/i;
const RGB = /\brgba?\s*\(/i;
const HSL = /\bhsla?\s*\(/i;
// CSS named colors that often appear but still must use a token.
const NAMED = /\b(?:white|black|red|blue|green|yellow|orange|pink|purple|gray|grey|cyan|magenta|silver|gold)\b/i;

const ALLOW = /var\(--sd-|transparent|currentColor|inherit|none|initial|unset/;

module.exports = {
  meta: {
    type: "problem",
    docs: {
      description:
        "Forbid hardcoded colors (hex / rgb / hsl / CSS named) in JSX. Use var(--sd-*).",
      category: "Stylistic Issues",
      recommended: true,
    },
    schema: [],
    messages: {
      hardcoded: "Use the var(--sd-*) token instead of hardcoded color '{{value}}'.",
    },
  },
  create(context) {
    function checkValue(value, node) {
      if (typeof value !== "string") return;
      if (ALLOW.test(value)) return;
      const m = value.match(HEX) || value.match(RGB) || value.match(HSL) || value.match(NAMED);
      if (m) {
        context.report({
          node,
          messageId: "hardcoded",
          data: { value: m[0] },
        });
      }
    }
    return {
      // Skip general string Literals - too many false positives from
      // import paths, JSON, etc. Only filter specific JSXAttributes
      // (style, color) and template literals.
      TemplateElement(node) {
        if (node.value && typeof node.value.cooked === "string") {
          checkValue(node.value.cooked, node);
        }
      },
      JSXAttribute(node) {
        const name = node.name && node.name.name;
        if (name !== "style" && name !== "color" && name !== "fill" && name !== "stroke") return;
        if (!node.value) return;
        if (node.value.type === "Literal" && typeof node.value.value === "string") {
          checkValue(node.value.value, node);
        } else if (node.value.type === "JSXExpressionContainer") {
          const expr = node.value.expression;
          if (expr.type === "ObjectExpression") {
            for (const prop of expr.properties) {
              if (
                prop.type === "Property" &&
                prop.value.type === "Literal" &&
                typeof prop.value.value === "string"
              ) {
                checkValue(prop.value.value, prop.value);
              }
            }
          }
        }
      },
    };
  },
};

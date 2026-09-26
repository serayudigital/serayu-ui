/**
 * @fileoverview Forbid gradients (Tailwind bg-gradient-* + style gradients).
 *
 * Exceptions:
 *   - The word "gradient" in non-className identifiers (variable, prop names)
 *   - Documented functional exceptions (ColorPicker spectrum, Heatmap
 *     intensity) - use
 *     /* eslint-disable-next-line serayu/no-gradient *\/  in the file
 *     that needs it.
 *
 * Goal: solid color is the Serayu UI convention; gradients are reserved
 * for data representation (intensity, spectrum).
 */

"use strict";

const TAILWIND_GRADIENT = /\bbg-gradient-(?:to-[a-z]+|conic|radial)\b/;
const STYLE_GRADIENT = /\b(?:linear|radial|conic)-gradient\s*\(/i;

module.exports = {
  meta: {
    type: "problem",
    docs: {
      description:
        "Forbid gradients (Tailwind bg-gradient-* + CSS linear/radial/conic-gradient).",
      category: "Stylistic Issues",
      recommended: true,
    },
    schema: [],
    messages: {
      tailwind: "Tailwind gradient '{{value}}' is forbidden. Use a solid color token.",
      style: "CSS gradient '{{value}}' is forbidden. Use a solid color token.",
    },
  },
  create(context) {
    function checkValue(value, node) {
      if (typeof value !== "string") return;
      const t = value.match(TAILWIND_GRADIENT);
      if (t) {
        context.report({ node, messageId: "tailwind", data: { value: t[0] } });
        return;
      }
      const s = value.match(STYLE_GRADIENT);
      if (s) {
        context.report({ node, messageId: "style", data: { value: s[0] } });
      }
    }
    return {
      // Only handle JSXAttribute + object style - skip general Literals
      // to avoid too many false positives from plain text.
      JSXAttribute(node) {
        const name = node.name && node.name.name;
        if (name !== "style" && name !== "className") return;
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
          } else if (expr.type === "Literal" && typeof expr.value === "string") {
            checkValue(expr.value, expr);
          }
        }
      },
    };
  },
};

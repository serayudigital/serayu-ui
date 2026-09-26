import * as React from "react";
import { Check, Copy } from "lucide-react";
import { Card } from "@/components/ui/card";

/**
 * DemoCard - preview card with code toggle and copy button.
 *
 * Used by every section in the playground to wrap a component demo
 * with a title, description, preview area, and a copyable code block.
 *
 * Props:
 *  - title: card title (required).
 *  - description: short subtitle (optional).
 *  - code: code snippet shown when the "Code" button is pressed and
 *    that can be copied via the copy button. When empty, the code
 *    block is hidden.
 *  - children: preview content inside the card.
 */
export interface DemoCardProps {
  title: string;
  description?: string;
  code?: string;
  children: React.ReactNode;
}

export function DemoCard({
  title,
  description,
  code,
  children,
}: DemoCardProps) {
  const [showCode, setShowCode] = React.useState(false);
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    if (!code) return;
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    } catch {
      // no-op
    }
  };

  return (
    <Card className="overflow-hidden">
      <div className="flex items-start justify-between gap-3 border-b border-border px-4 py-3 md:px-5">
        <div className="min-w-0">
          <h3 className="text-sm font-semibold text-foreground md:text-base">
            {title}
          </h3>
          {description && (
            <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
          )}
        </div>
        {code && (
          <div className="flex shrink-0 items-center gap-1">
            <button
              type="button"
              onClick={() => setShowCode((v) => !v)}
              className="inline-flex h-8 items-center gap-1.5 rounded-md border border-border bg-background px-2.5 text-xs font-medium text-foreground sd-tap transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {showCode ? "Preview" : "Code"}
            </button>
            <button
              type="button"
              onClick={handleCopy}
              aria-label="Copy code"
              className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border bg-background text-foreground sd-tap transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {copied ? (
                <Check className="h-3.5 w-3.5 text-success" />
              ) : (
                <Copy className="h-3.5 w-3.5" />
              )}
            </button>
          </div>
        )}
      </div>

      <div className="grid min-h-[120px] place-items-center bg-surface p-6 md:min-h-[140px] md:p-8">
        {children}
      </div>

      {code && showCode && (
        <div className="border-t border-border bg-card">
          <pre className="overflow-x-auto p-4 text-[11px] leading-relaxed text-foreground md:text-xs">
            <code>{code}</code>
          </pre>
        </div>
      )}
    </Card>
  );
}

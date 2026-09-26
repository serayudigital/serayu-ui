import * as React from "react";
import { Search, X, Mic } from "lucide-react";
import { cn } from "@/lib/cn";

export interface MobileSearchProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  /** Show the clear (X) button when there is a value. Default: true. */
  clearable?: boolean;
  /** Show the mic button for voice input. Default: false. */
  showMic?: boolean;
  /** Handler when the mic button is pressed. */
  onMicClick?: () => void;
  /** Handler when the clear button is pressed. */
  onClear?: () => void;
}

/**
 * MobileSearch - search bar with a search icon, clear button, and optional mic.
 */
const MobileSearch = React.forwardRef<HTMLInputElement, MobileSearchProps>(
  (
    {
      className,
      value,
      onChange,
      clearable = true,
      showMic = false,
      onMicClick,
      onClear,
      placeholder = "Search...",
      ...props
    },
    ref
  ) => {
    const hasValue = value !== undefined && String(value).length > 0;
    const handleClear = () => {
      onClear?.();
      if (onChange) {
        const event = {
          target: { value: "" },
        } as React.ChangeEvent<HTMLInputElement>;
        onChange(event);
      }
    };
    return (
      <div
        className={cn(
          "flex h-11 items-center gap-2 rounded-md border border-input bg-muted px-3 transition-colors focus-within:border-ring focus-within:bg-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:ring-offset-background",
          className
        )}
      >
        <Search
          className="h-4 w-4 shrink-0 text-muted-foreground"
          aria-hidden
        />
        <input
          ref={ref}
          type="search"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="h-full min-w-0 flex-1 border-0 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
          {...props}
        />
        {clearable && hasValue && (
          <button
            type="button"
            onClick={handleClear}
            aria-label="Clear search"
            className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-muted-foreground sd-tap transition-colors hover:bg-border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
        {showMic && (
          <button
            type="button"
            onClick={onMicClick}
            aria-label="Search with voice"
            className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-foreground sd-tap transition-colors hover:bg-border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Mic className="h-4 w-4" />
          </button>
        )}
      </div>
    );
  }
);
MobileSearch.displayName = "MobileSearch";

export { MobileSearch };

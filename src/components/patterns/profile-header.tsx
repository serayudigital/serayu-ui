import * as React from "react";
import { MessageCircle, UserPlus, UserCheck } from "lucide-react";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "@/components/ui/avatar";
import { cn } from "@/lib/cn";

export interface ProfileStat {
  /** Static label (e.g. "Posts"). */
  label: string;
  /** Static value (e.g. "123" or 123). */
  value: number | string;
  /** Click handler (for interactive stats). */
  onClick?: () => void;
}

export interface ProfileHeaderProps {
  /** Avatar image URL. */
  avatarUrl?: string;
  /** Fallback text when avatar fails (usually initials). */
  fallback?: string;
  /** Display name. */
  name: string;
  /** Bio / short description. */
  bio?: React.ReactNode;
  /** Cover image URL (optional). */
  coverUrl?: string;
  /** Stats row (posts, followers, etc). */
  stats?: ProfileStat[];
  /** Current following state. */
  following?: boolean;
  /** Toggle handler for the Follow button. */
  onFollowToggle?: () => void;
  /** Label when not yet following. */
  followLabel?: string;
  /** Label when already following. */
  followingLabel?: string;
  /** Message button label. */
  messageLabel?: string;
  /** Message button handler. */
  onMessage?: () => void;
  className?: string;
}

/**
 * ProfileHeader - profile header in the style of social media / marketplace.
 *
 * - Large avatar (lg/2xl) + name + bio.
 * - Stats row: 3-4 numbers (posts, followers, following).
 * - Buttons: Follow (toggle) + Message.
 * - Optional cover image with avatar overlap below.
 * - Solid tone (NOT a gradient).
 *
 * Example:
 *   <ProfileHeader
 *     name="Andi Saputra"
 *     fallback="AS"
 *     avatarUrl="https://..."
 *     bio="Web developer from Jakarta."
 *     stats={[
 *       { label: "Posts", value: 124 },
 *       { label: "Followers", value: "12.3K" },
 *       { label: "Following", value: 256 },
 *     ]}
 *     following={false}
 *     onFollowToggle={() => setFollowing(v => !v)}
 *     onMessage={() => openChat()}
 *   />
 */
export function ProfileHeader({
  avatarUrl,
  fallback,
  name,
  bio,
  coverUrl,
  stats = [],
  following = false,
  onFollowToggle,
  followLabel = "Follow",
  followingLabel = "Following",
  messageLabel = "Message",
  onMessage,
  className,
}: ProfileHeaderProps) {
  return (
    <section
      aria-label={`Profile ${name}`}
      className={cn("bg-background", className)}
    >
      {coverUrl ? (
        <div
          aria-hidden
          className="relative h-32 w-full overflow-hidden bg-muted sm:h-40"
        >
          <img
            src={coverUrl}
            alt=""
            className="h-full w-full object-cover"
          />
        </div>
      ) : null}

      <div
        className={cn(
          "flex flex-col gap-3 px-4 pb-4",
          coverUrl ? "-mt-10" : "pt-6"
        )}
      >
        <div className="flex items-end gap-4">
          <Avatar
            size={coverUrl ? "2xl" : "xl"}
            className={cn(
              "border-4 border-background shadow-sm",
              coverUrl ? "" : "self-start"
            )}
          >
            {avatarUrl ? (
              <AvatarImage src={avatarUrl} alt={name} />
            ) : null}
            <AvatarFallback>
              {fallback ?? (name.slice(0, 2) || "?").toUpperCase()}
            </AvatarFallback>
          </Avatar>

          {(onFollowToggle || onMessage) && (
            <div className="ml-auto flex flex-wrap items-center gap-2">
              {onFollowToggle ? (
                <button
                  type="button"
                  onClick={onFollowToggle}
                  aria-pressed={following}
                  className={cn(
                    "inline-flex h-9 items-center gap-1.5 rounded-md px-3 text-sm font-medium sd-tap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                    following
                      ? "border border-border bg-surface text-foreground hover:bg-muted"
                      : "bg-brand text-brand-foreground hover:bg-brand/90"
                  )}
                >
                  {following ? (
                    <UserCheck className="h-4 w-4" aria-hidden />
                  ) : (
                    <UserPlus className="h-4 w-4" aria-hidden />
                  )}
                  {following ? followingLabel : followLabel}
                </button>
              ) : null}
              {onMessage ? (
                <button
                  type="button"
                  onClick={onMessage}
                  className="inline-flex h-9 items-center gap-1.5 rounded-md border border-border bg-surface px-3 text-sm font-medium text-foreground sd-tap hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                  <MessageCircle className="h-4 w-4" aria-hidden />
                  {messageLabel}
                </button>
              ) : null}
            </div>
          )}
        </div>

        <div className="space-y-0.5">
          <h1 className="text-lg font-semibold leading-tight text-foreground">
            {name}
          </h1>
          {bio ? (
            <div className="text-sm text-muted-foreground">{bio}</div>
          ) : null}
        </div>

        {stats.length > 0 ? (
          <ul
            className="mt-2 flex items-center gap-4 border-t border-border pt-3"
            aria-label="Profile statistics"
          >
            {stats.map((s, i) => (
              <li key={i} className="flex-1">
                {s.onClick ? (
                  <button
                    type="button"
                    onClick={s.onClick}
                    className="-mx-1 block w-full rounded px-1 py-1 text-left sd-tap hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <StatInner label={s.label} value={s.value} />
                  </button>
                ) : (
                  <div className="px-1">
                    <StatInner label={s.label} value={s.value} />
                  </div>
                )}
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </section>
  );
}

function StatInner({
  label,
  value,
}: {
  label: string;
  value: number | string;
}) {
  return (
    <div className="flex flex-col items-start">
      <span className="text-base font-semibold tabular-nums text-foreground">
        {value}
      </span>
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>
  );
}

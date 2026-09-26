import * as React from "react";
import { MapPin } from "lucide-react";
import { cn } from "@/lib/cn";

/**
 * MapPreview - renders a static map tile grid with a pin overlay. Not
 * interactive except for tap (which opens an external map via the
 * onTap handler). Adapter-friendly: tileProvider 'osm' = openstreetmap
 * tile, 'mapbox' = Mapbox static API (requires a token), 'none' = solid
 * gray (safe offline mode).
 *
 * Example:
 *   <MapPreview
 *     lat={-6.2088}
 *     lng={106.8456}
 *     zoom={15}
 *     markerLabel="Serayu Office"
 *     onTap={() => openGoogleMaps(-6.2088, 106.8456)}
 *   />
 */

export type MapPreviewProvider = "osm" | "mapbox" | "none";

export interface MapPreviewProps {
  /** Latitude (WGS84, -90..90). */
  lat: number;
  /** Longitude (WGS84, -180..180). */
  lng: number;
  /** Zoom level (1..19). Default 14. */
  zoom?: number;
  /** Container width. Default "100%". */
  width?: number | string;
  /** Container height. Default 200 (px). */
  height?: number | string;
  /** Tile provider. Default "osm". */
  tileProvider?: MapPreviewProvider;
  /** Mapbox token (required when tileProvider="mapbox"). */
  mapboxToken?: string;
  /** Mapbox style ID (default "mapbox/streets-v12"). */
  mapboxStyle?: string;
  /** Tooltip label for the pin (used as the title attribute). */
  markerLabel?: string;
  /** Tap handler (e.g. open external Google Maps). */
  onTap?: () => void;
  /** Additional class. */
  className?: string;
  /** aria-label for the entire preview. */
  ariaLabel?: string;
}

const TILE_SIZE = 256;

interface TileCoord {
  x: number;
  y: number;
}

/** Convert lng to tile X at a given zoom. */
function lngToTileX(lng: number, zoom: number): number {
  const n = Math.pow(2, zoom);
  return ((lng + 180) / 360) * n;
}

/** Convert lat to tile Y at a given zoom (Mercator). */
function latToTileY(lat: number, zoom: number): number {
  const n = Math.pow(2, zoom);
  const latRad = (lat * Math.PI) / 180;
  return (
    ((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2) *
    n
  );
}

/** Pixel position of the pin within a 2x2 grid around the target tile. */
function pinOffsetPx(
  lat: number,
  lng: number,
  zoom: number
): { leftPct: number; topPct: number } {
  const tx = lngToTileX(lng, zoom);
  const ty = latToTileY(lat, zoom);
  // Fractional position within tile (0..1).
  const fx = tx - Math.floor(tx);
  const fy = ty - Math.floor(ty);
  // Compose 2x2 grid: top-left tile = (-1, -1).
  // Map 2x2 tile image grid into pin position as % of the total 2x2 = 512x512.
  const leftPct = (fx + 1) * 50;
  const topPct = (1 - fy) * 50; // Y axis inverted because tile Y grows downward
  return { leftPct, topPct };
}

function makeOsmTileCoords(lat: number, lng: number, zoom: number): TileCoord[] {
  const tx = lngToTileX(lng, zoom);
  const ty = latToTileY(lat, zoom);
  const cx = Math.floor(tx);
  const cy = Math.floor(ty);
  // Compose a 3x3 grid for visual context (around the location).
  const tiles: TileCoord[] = [];
  for (let dy = -1; dy <= 1; dy++) {
    for (let dx = -1; dx <= 1; dx++) {
      tiles.push({ x: cx + dx, y: cy + dy });
    }
  }
  return tiles;
}

function makeMapboxUrl(
  lat: number,
  lng: number,
  zoom: number,
  width: number,
  height: number,
  token: string,
  style = "mapbox/streets-v12"
): string {
  const url = new URL(
    `https://api.mapbox.com/styles/v1/${style}/static/${lng},${lat},${zoom},0/${width}x${height}@2x`
  );
  url.searchParams.set("access_token", token);
  return url.toString();
}

export function MapPreview({
  lat,
  lng,
  zoom = 14,
  width = "100%",
  height = 200,
  tileProvider = "osm",
  mapboxToken,
  mapboxStyle,
  markerLabel,
  onTap,
  className,
  ariaLabel,
}: MapPreviewProps) {
  const safeZoom = Math.min(19, Math.max(1, Math.floor(zoom)));
  const ariaTxt = ariaLabel ?? `Map at ${lat.toFixed(4)}, ${lng.toFixed(4)}`;

  const numericWidth =
    typeof width === "number" ? width : 400;
  const numericHeight =
    typeof height === "number" ? height : 200;

  // Compute pin position.
  const pin = pinOffsetPx(lat, lng, safeZoom);

  // Tile rendering strategy per provider.
  let body: React.ReactNode = null;

  if (tileProvider === "osm") {
    const tiles = makeOsmTileCoords(lat, lng, safeZoom);
    body = (
      <div
        className="grid h-full w-full grid-cols-3 grid-rows-3"
        aria-hidden
      >
        {tiles.map((t, i) => (
          <img
            key={i}
            src={`https://tile.openstreetmap.org/${safeZoom}/${t.x}/${t.y}.png`}
            alt=""
            width={TILE_SIZE}
            height={TILE_SIZE}
            className="block h-full w-full object-cover"
            loading="lazy"
            crossOrigin="anonymous"
          />
        ))}
      </div>
    );
  } else if (tileProvider === "mapbox" && mapboxToken) {
    const src = makeMapboxUrl(
      lat,
      lng,
      safeZoom,
      numericWidth,
      numericHeight,
      mapboxToken,
      mapboxStyle
    );
    body = (
      <img
        src={src}
        alt=""
        className="block h-full w-full object-cover"
        loading="lazy"
      />
    );
  } else {
    // "none" or mapbox without a token: solid surface with a grid pattern.
    // Use linear-gradient to draw grid lines (functional, not brand styling -
    // visual representation of a grid pattern).
    body = (
      <div
        className="h-full w-full bg-muted"
        aria-hidden
        // Grid pattern CSS for placeholder map tiles. Not a brand gradient -
        // this is a 2D pattern representing a map.
        /* eslint-disable serayu/no-gradient */
        style={{
          backgroundImage:
            "linear-gradient(var(--sd-border) 1px, transparent 1px), linear-gradient(90deg, var(--sd-border) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
          backgroundPosition: "-1px -1px",
        }}
        /* eslint-enable serayu/no-gradient */
      />
    );
  }

  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (!onTap) return;
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        onTap();
      }
    },
    [onTap]
  );

  return (
    <div
      role={onTap ? "button" : "img"}
      tabIndex={onTap ? 0 : undefined}
      aria-label={ariaTxt}
      onClick={onTap}
      onKeyDown={handleKeyDown}
      className={cn(
        "relative overflow-hidden rounded-md border border-border bg-muted",
        onTap &&
          "sd-tap transition-opacity hover:opacity-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        className
      )}
      style={{ width, height }}
    >
      {body}
      {/* Pin overlay. */}
      <div
        className="pointer-events-none absolute"
        style={{
          left: `${pin.leftPct}%`,
          top: `${pin.topPct}%`,
          transform: "translate(-50%, -100%)",
        }}
        aria-hidden
      >
        <div className="relative">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-brand text-brand-foreground shadow-md ring-2 ring-surface">
            <MapPin className="h-4 w-4" />
          </div>
          {markerLabel && (
            <span className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-full whitespace-nowrap rounded bg-foreground px-1.5 py-0.5 text-[10px] font-medium text-background shadow-sm">
              {markerLabel}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

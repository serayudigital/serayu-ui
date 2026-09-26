import * as React from "react";
import { cn } from "@/lib/cn";

/**
 * Mini chart components built on raw SVG. Zero dependencies,
 * theme-aware via `currentColor` and the `--sd-*` CSS variables.
 *
 * - Sparkline: line or area-fill chart from `number[]` data.
 * - ProgressRing: 0-100 progress ring with an optional center label.
 * - Donut: multi-segment donut with a centered label.
 * - BarChart: vertical or horizontal bars, optional per-datum color.
 * - LineChart: multi-point line with smooth curves, dots, and
 *   optional area fill.
 * - Heatmap: calendar grid where cell opacity encodes value
 *   intensity. The opacity ramp is a functional data representation,
 *   NOT brand styling - documented exception.
 *
 * Animations: stroke-dashoffset for ring/donut, opacity for sparkline,
 * width/height transition for bar.
 * Solid tones (no brand-gradient styling - the Heatmap opacity ramp
 * is the only documented exception and it represents data intensity).
 */

/* ============================================================
 * Sparkline
 * ============================================================ */

export interface SparklineProps {
  /** Series of numeric values. */
  data: number[];
  /** SVG width (default 120). */
  width?: number;
  /** SVG height (default 32). */
  height?: number;
  /** Fill the area under the line. */
  fill?: boolean;
  /** Stroke color (CSS color or var). Default: `currentColor`. */
  stroke?: string;
  /** Area fill color (CSS color or var). Default: `currentColor` at 20% opacity. */
  fillColor?: string;
  /** Line width (default 1.5). */
  strokeWidth?: number;
  /** Additional class. */
  className?: string;
  /** Accessible label for the chart (default "Chart"). */
  ariaLabel?: string;
}

export function Sparkline({
  data,
  width = 120,
  height = 32,
  fill = false,
  stroke = "currentColor",
  fillColor,
  strokeWidth = 1.5,
  className,
  ariaLabel = "Line chart",
}: SparklineProps) {
  if (data.length < 2) {
    return (
      <div
        role="img"
        aria-label={ariaLabel}
        className={cn("inline-block", className)}
        style={{ width, height }}
      />
    );
  }

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((v - min) / range) * height;
    return [x, y] as const;
  });

  const linePath = points
    .map(([x, y], i) => (i === 0 ? `M${x.toFixed(2)},${y.toFixed(2)}` : `L${x.toFixed(2)},${y.toFixed(2)}`))
    .join(" ");

  const areaPath = `${linePath} L${width},${height} L0,${height} Z`;
  const fillStyle = fillColor ?? "currentColor";

  return (
    <svg
      role="img"
      aria-label={ariaLabel}
      viewBox={`0 0 ${width} ${height}`}
      width={width}
      height={height}
      preserveAspectRatio="none"
      className={cn("text-brand", className)}
    >
      {fill ? (
        <path
          d={areaPath}
          fill={fillStyle}
          fillOpacity={0.18}
          stroke="none"
        />
      ) : null}
      <path
        d={linePath}
        fill="none"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ============================================================
 * ProgressRing
 * ============================================================ */

export interface ProgressRingProps {
  /** Value 0-100. */
  value: number;
  /** SVG diameter in px (default 64). */
  size?: number;
  /** Stroke width (default 4). */
  strokeWidth?: number;
  /** Track color (default: `currentColor` at 25% opacity). */
  trackColor?: string;
  /** Progress color (default: brand via Tailwind class). */
  progressColor?: string;
  /** Center label (string or ReactNode). */
  label?: React.ReactNode;
  /** Additional class. */
  className?: string;
}

export function ProgressRing({
  value,
  size = 64,
  strokeWidth = 4,
  trackColor = "currentColor",
  progressColor,
  label,
  className,
}: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2;
  const cx = size / 2;
  const cy = size / 2;
  const circumference = 2 * Math.PI * radius;
  const safe = Math.max(0, Math.min(100, value));
  const offset = circumference * (1 - safe / 100);

  return (
    <div
      className={cn("relative inline-flex items-center justify-center", className)}
      style={{ width: size, height: size }}
      role="progressbar"
      aria-valuenow={safe}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Progress"
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="-rotate-90 text-muted"
      >
        <circle
          cx={cx}
          cy={cy}
          r={radius}
          fill="none"
          stroke={trackColor}
          strokeOpacity={0.25}
          strokeWidth={strokeWidth}
        />
        <circle
          cx={cx}
          cy={cy}
          r={radius}
          fill="none"
          stroke={progressColor ?? "currentColor"}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className={cn(
            !progressColor && "text-brand",
            "transition-[stroke-dashoffset] duration-500 ease-out"
          )}
        />
      </svg>
      {label !== undefined ? (
        <div className="absolute inset-0 flex items-center justify-center text-xs font-semibold tabular-nums text-foreground">
          {label}
        </div>
      ) : null}
    </div>
  );
}

/* ============================================================
 * Donut
 * ============================================================ */

export interface DonutSegment {
  /** Segment value (used for proportion). */
  value: number;
  /** Color token name: brand, success, warning, danger, info, muted. */
  colorToken?:
    | "brand"
    | "success"
    | "warning"
    | "danger"
    | "info"
    | "muted"
    | string;
  /** Custom Tailwind class for stroke (overrides colorToken). */
  strokeClass?: string;
  /** Label for the legend (not rendered in the chart). */
  label?: string;
}

const SEGMENT_TOKEN_TO_VAR: Record<string, string> = {
  brand: "var(--sd-brand)",
  success: "var(--sd-success)",
  warning: "var(--sd-warning)",
  danger: "var(--sd-danger)",
  info: "var(--sd-info)",
  muted: "var(--sd-muted)",
};

export interface DonutProps {
  segments: DonutSegment[];
  /** Diameter in px (default 96). */
  size?: number;
  /** Stroke width (default 12). */
  strokeWidth?: number;
  /** Gap between segments in px (default 1). */
  gap?: number;
  /** Center label (string or ReactNode). */
  label?: React.ReactNode;
  /** Additional class. */
  className?: string;
}

export function Donut({
  segments,
  size = 96,
  strokeWidth = 12,
  gap = 1,
  label,
  className,
}: DonutProps) {
  const radius = (size - strokeWidth) / 2;
  const cx = size / 2;
  const cy = size / 2;
  const circumference = 2 * Math.PI * radius;

  const total = segments.reduce((sum, seg) => sum + Math.max(0, seg.value), 0);
  if (total <= 0 || segments.length === 0) {
    return (
      <div
        className={cn("relative inline-flex items-center justify-center", className)}
        style={{ width: size, height: size }}
        role="img"
        aria-label="Empty donut chart"
      />
    );
  }

  const gapLen = (gap * Math.PI * radius) / (Math.PI * radius); // gap length in circumference units

  let cursor = 0;
  return (
    <div
      className={cn("relative inline-flex items-center justify-center", className)}
      style={{ width: size, height: size }}
      role="img"
      aria-label={`Donut chart with ${segments.length} segments`}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="-rotate-90"
      >
        {segments.map((seg, i) => {
          const length = (Math.max(0, seg.value) / total) * circumference;
          const segOffset = circumference - cursor;
          cursor += length;
          const stroke =
            seg.colorToken && SEGMENT_TOKEN_TO_VAR[seg.colorToken]
              ? SEGMENT_TOKEN_TO_VAR[seg.colorToken]
              : "var(--sd-brand)";
          return (
            <circle
              key={i}
              cx={cx}
              cy={cy}
              r={radius}
              fill="none"
              stroke={stroke}
              strokeWidth={strokeWidth}
              strokeDasharray={`${Math.max(0, length - gapLen)} ${circumference}`}
              strokeDashoffset={segOffset}
              className="transition-[stroke-dasharray] duration-500 ease-out"
            />
          );
        })}
      </svg>
      {label !== undefined ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-foreground">
          {label}
        </div>
      ) : null}
    </div>
  );
}

/* ============================================================
 * BarChart
 * ============================================================ */

/**
 * BarChart - vertical or horizontal bars of numeric data.
 *
 * - Vertical (default) or horizontal via the `horizontal` prop.
 * - Default color can be overridden per datum with `color` (see
 *   `BarChartDatum.color`).
 * - Optionally show numeric values above or beside each bar.
 * - Accessibility: SVG with `role="img"` + `aria-label`.
 *
 * Example:
 *   <BarChart
 *     data={[
 *       { label: "Jan", value: 32 },
 *       { label: "Feb", value: 48, color: "success" },
 *     ]}
 *     showValues
 *   />
 */

export type BarColorToken =
  | "brand"
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "muted";

const COLOR_TOKEN_TO_VAR: Record<BarColorToken, string> = {
  brand: "var(--sd-brand)",
  success: "var(--sd-success)",
  warning: "var(--sd-warning)",
  danger: "var(--sd-danger)",
  info: "var(--sd-info)",
  muted: "var(--sd-muted)",
};

export interface BarChartDatum {
  label: string;
  value: number;
  /** Override bar color for this datum (default: the `color` prop). */
  color?: BarColorToken;
}

export interface BarChartProps {
  /** Bar data (minimum 1 item). */
  data: BarChartDatum[];
  /** Container width (default 100%). */
  width?: number | string;
  /** Chart height in px (default 160). */
  height?: number;
  /** Default bar color. Overrideable per datum via `BarChartDatum.color`. */
  color?: BarColorToken;
  /** Show value above each bar (default false). */
  showValues?: boolean;
  /** Horizontal mode (default vertical). */
  horizontal?: boolean;
  /** Additional class. */
  className?: string;
  /** Aria label for screen readers. */
  ariaLabel?: string;
}

const BAR_GAP = 8;
const AXIS_PADDING = 24;

export function BarChart({
  data,
  width = "100%",
  height = 160,
  color = "brand",
  showValues = false,
  horizontal = false,
  className,
  ariaLabel = "Bar chart",
}: BarChartProps) {
  const numericWidth = typeof width === "number" ? width : 400;
  const max = Math.max(...data.map((d) => d.value), 1);

  if (data.length === 0) {
    return (
      <div
        role="img"
        aria-label={`${ariaLabel} empty`}
        className={cn("inline-block", className)}
        style={{ width, height }}
      />
    );
  }

  if (horizontal) {
    const labelWidth = 80;
    const valueWidth = 40;
    const chartWidth = numericWidth - labelWidth - valueWidth - AXIS_PADDING;
    const barHeightUnit = (height - AXIS_PADDING - 16) / data.length;
    return (
      <svg
        role="img"
        aria-label={ariaLabel}
        width={numericWidth}
        height={height}
        viewBox={`0 0 ${numericWidth} ${height}`}
        className={cn("text-foreground", className)}
      >
        <line
          x1={labelWidth}
          y1={0}
          x2={labelWidth}
          y2={height - AXIS_PADDING}
          stroke="currentColor"
          strokeOpacity={0.2}
        />
        {data.map((d, i) => {
          const y = i * barHeightUnit + BAR_GAP / 2;
          const barH = barHeightUnit - BAR_GAP;
          const len = Math.max(0, (d.value / max) * chartWidth);
          const fillVar = d.color
            ? COLOR_TOKEN_TO_VAR[d.color]
            : COLOR_TOKEN_TO_VAR[color];
          return (
            <g key={i}>
              <text
                x={labelWidth - 6}
                y={y + barH / 2}
                fontSize="11"
                fill="currentColor"
                fillOpacity={0.7}
                textAnchor="end"
                dominantBaseline="middle"
              >
                {d.label}
              </text>
              <rect
                x={labelWidth}
                y={y}
                width={len}
                height={barH}
                fill={fillVar}
                rx={3}
                className="transition-[width] duration-300 ease-out"
              >
                {showValues && (
                  <title>{`${d.label}: ${d.value}`}</title>
                )}
              </rect>
              {showValues && (
                <text
                  x={labelWidth + len + 4}
                  y={y + barH / 2}
                  fontSize="11"
                  fill="currentColor"
                  textAnchor="start"
                  dominantBaseline="middle"
                  className="tabular-nums"
                >
                  {d.value}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    );
  }

  // Vertical (default).
  const chartHeight = height - AXIS_PADDING;
  const barWidth = (numericWidth - AXIS_PADDING) / data.length - BAR_GAP;
  return (
    <svg
      role="img"
      aria-label={ariaLabel}
      width={numericWidth}
      height={height}
      viewBox={`0 0 ${numericWidth} ${height}`}
      className={cn("text-foreground", className)}
    >
      <line
        x1={AXIS_PADDING / 2}
        y1={chartHeight}
        x2={numericWidth - 4}
        y2={chartHeight}
        stroke="currentColor"
        strokeOpacity={0.2}
      />
      {data.map((d, i) => {
        const len = Math.max(0, (d.value / max) * (chartHeight - 8));
        const x = AXIS_PADDING / 2 + i * (barWidth + BAR_GAP);
        const y = chartHeight - len;
        const fillVar = d.color
          ? COLOR_TOKEN_TO_VAR[d.color]
          : COLOR_TOKEN_TO_VAR[color];
        return (
          <g key={i}>
            <rect
              x={x}
              y={y}
              width={barWidth}
              height={len}
              fill={fillVar}
              rx={3}
              className="transition-[height] duration-300 ease-out"
            />
            <text
              x={x + barWidth / 2}
              y={height - 4}
              fontSize="11"
              fill="currentColor"
              fillOpacity={0.7}
              textAnchor="middle"
            >
              {d.label}
            </text>
            {showValues && (
              <text
                x={x + barWidth / 2}
                y={y - 4}
                fontSize="11"
                fill="currentColor"
                textAnchor="middle"
                className="tabular-nums"
              >
                {d.value}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}

/* ============================================================
 * LineChart
 * ============================================================ */

/**
 * LineChart - data trend line with smooth curve, dots, and area
 * options.
 *
 * - `smooth`: smooth curve (Catmull-Rom-style via quadratic Bezier).
 * - `showDots`: small circle at each point (default true).
 * - `showArea`: transparent fill below the line (default false).
 * - X axis shows the label for each datum; Y axis auto-scales from
 *   the value range.
 *
 * Example:
 *   <LineChart
 *     data={[
 *       { label: "Mon", value: 12 },
 *       { label: "Tue", value: 18 },
 *     ]}
 *     showArea
 *   />
 */

export interface LineChartDatum {
  label: string;
  value: number;
}

export interface LineChartProps {
  data: LineChartDatum[];
  width?: number | string;
  height?: number;
  /** Smooth curve (default true). */
  smooth?: boolean;
  /** Show dot at each point (default true). */
  showDots?: boolean;
  /** Area fill below the line. */
  showArea?: boolean;
  /** Accessible label for the chart. */
  ariaLabel?: string;
  /** Additional class. */
  className?: string;
}

function buildSmoothPath(points: Array<readonly [number, number]>): string {
  if (points.length === 0) return "";
  if (points.length === 1) {
    const [x, y] = points[0];
    return `M${x.toFixed(2)},${y.toFixed(2)}`;
  }
  let d = `M${points[0][0].toFixed(2)},${points[0][1].toFixed(2)}`;
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1];
    const curr = points[i];
    const cpx = (prev[0] + curr[0]) / 2;
    const cpy = (prev[1] + curr[1]) / 2;
    d += ` Q${prev[0].toFixed(2)},${prev[1].toFixed(2)} ${cpx.toFixed(2)},${cpy.toFixed(2)}`;
  }
  const [lx, ly] = points[points.length - 1];
  d += ` T${lx.toFixed(2)},${ly.toFixed(2)}`;
  return d;
}

export function LineChart({
  data,
  width = "100%",
  height = 200,
  smooth = true,
  showDots = true,
  showArea = false,
  ariaLabel = "Line chart",
  className,
}: LineChartProps) {
  const numericWidth = typeof width === "number" ? width : 400;
  if (data.length < 2) {
    return (
      <div
        role="img"
        aria-label={`${ariaLabel} not enough data`}
        className={cn("inline-block", className)}
        style={{ width, height }}
      />
    );
  }

  const min = Math.min(...data.map((d) => d.value));
  const max = Math.max(...data.map((d) => d.value));
  const range = max - min || 1;
  const chartHeight = height - AXIS_PADDING;
  const chartWidth = numericWidth - AXIS_PADDING;
  const points = data.map((d, i) => {
    const x = AXIS_PADDING / 2 + (i / (data.length - 1)) * (chartWidth - AXIS_PADDING / 2);
    const y = chartHeight - ((d.value - min) / range) * (chartHeight - 8);
    return [x, y] as const;
  });

  const path = smooth ? buildSmoothPath(points) : points
    .map(([x, y], i) =>
      i === 0 ? `M${x.toFixed(2)},${y.toFixed(2)}` : `L${x.toFixed(2)},${y.toFixed(2)}`
    )
    .join(" ");

  const areaPath = `${path} L${points[points.length - 1][0].toFixed(2)},${chartHeight} L${points[0][0].toFixed(2)},${chartHeight} Z`;

  return (
    <svg
      role="img"
      aria-label={ariaLabel}
      width={numericWidth}
      height={height}
      viewBox={`0 0 ${numericWidth} ${height}`}
      className={cn("text-foreground", className)}
    >
      <line
        x1={AXIS_PADDING / 2}
        y1={chartHeight}
        x2={numericWidth - 4}
        y2={chartHeight}
        stroke="currentColor"
        strokeOpacity={0.2}
      />
      {showArea && (
        <path d={areaPath} fill="currentColor" fillOpacity={0.15} />
      )}
      <path
        d={path}
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-brand"
      />
      {showDots &&
        points.map(([x, y], i) => (
          <circle
            key={i}
            cx={x}
            cy={y}
            r={3}
            fill="var(--sd-background)"
            stroke="currentColor"
            strokeWidth={1.5}
            className="text-brand"
          />
        ))}
      {data.map((d, i) => {
        const x = AXIS_PADDING / 2 + (i / (data.length - 1)) * (chartWidth - AXIS_PADDING / 2);
        return (
          <text
            key={i}
            x={x}
            y={height - 4}
            fontSize="11"
            fill="currentColor"
            fillOpacity={0.7}
            textAnchor="middle"
          >
            {d.label}
          </text>
        );
      })}
    </svg>
  );
}

/* ============================================================
 * Heatmap
 * ============================================================ */

/**
 * Heatmap - GitHub-style calendar grid. Each cell represents a day,
 * and opacity encodes the value (intensity).
 *
 * - Date snapshot: data may be incomplete (missing days render
 *   transparent).
 * - Vertical axis: day of week (Sun=0, Sat=6, `en-US` locale).
 * - Horizontal axis: weeks (snapped to the Sunday before startDate).
 * - `levels`: number of intensity buckets (default 5). Final opacity
 *   is 0 for value 0, climbing to ~95% for the max value.
 *
 * The opacity ramp is a functional representation of data (intensity),
 * NOT a brand-gradient styling - documented exception.
 *
 * Example:
 *   <Heatmap
 *     data={[
 *       { date: "2026-01-01", value: 3 },
 *       { date: "2026-01-02", value: 7 },
 *     ]}
 *     startDate="2025-12-29"
 *     endDate="2026-01-31"
 *   />
 */

export interface HeatmapDatum {
  /** ISO date string (YYYY-MM-DD) or Date. */
  date: string | Date;
  /** Numeric value. */
  value: number;
}

export interface HeatmapProps {
  data: HeatmapDatum[];
  /** Start the grid from this date (default: earliest date in data). */
  startDate?: string | Date;
  /** End the grid at this date (default: latest date in data). */
  endDate?: string | Date;
  /** Cell width in px (default 12). */
  cellSize?: number;
  /** Gap between cells (default 2). */
  cellGap?: number;
  /** Number of intensity levels (default 5). */
  levels?: number;
  /** ClassName on the root wrapper. */
  className?: string;
  /** aria-label. */
  ariaLabel?: string;
}

function toDate(d: string | Date): Date {
  return d instanceof Date ? d : new Date(d);
}
function toIsoDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

/** Choose cell opacity based on the value's ratio to the max. */
function levelOpacity(value: number, max: number, levels: number): number {
  if (max <= 0) return 0;
  if (value <= 0) return 0;
  const ratio = value / max;
  // Bucket: 0 = transparent, levels = full opacity ~95%
  const step = 1 / levels;
  const bucket = Math.min(levels, Math.floor(ratio / step) + 1);
  return bucket / (levels + 1);
}

export function Heatmap({
  data,
  startDate,
  endDate,
  cellSize = 12,
  cellGap = 2,
  levels = 5,
  className,
  ariaLabel = "Heatmap",
}: HeatmapProps) {
  const map = new Map<string, number>();
  data.forEach((d) => {
    const key = toIsoDate(toDate(d.date));
    map.set(key, (map.get(key) ?? 0) + d.value);
  });

  const effectiveStart = startDate
    ? toDate(startDate)
    : data.length > 0
      ? new Date(Math.min(...data.map((d) => toDate(d.date).getTime())))
      : new Date();
  const effectiveEnd = endDate
    ? toDate(endDate)
    : data.length > 0
      ? new Date(Math.max(...data.map((d) => toDate(d.date).getTime())))
      : new Date();

  // Snap to start of week (Sunday = 0).
  const startWeekday = effectiveStart.getDay();
  const gridStart = new Date(effectiveStart);
  gridStart.setDate(effectiveStart.getDate() - startWeekday);

  const totalDays = Math.ceil(
    (effectiveEnd.getTime() - gridStart.getTime()) / (1000 * 60 * 60 * 24)
  );
  const weeks = Math.ceil(totalDays / 7) + 1;
  const max = Math.max(...Array.from(map.values()), 1);

  const width = weeks * (cellSize + cellGap);
  const height = 7 * (cellSize + cellGap);

  return (
    <div
      role="img"
      aria-label={ariaLabel}
      className={cn("inline-block overflow-x-auto", className)}
    >
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        {Array.from({ length: weeks * 7 }).map((_, i) => {
          const dayOffset = i;
          const date = new Date(gridStart);
          date.setDate(gridStart.getDate() + dayOffset);
          if (date > effectiveEnd) return null;
          const iso = toIsoDate(date);
          const value = map.get(iso);
          const week = Math.floor(i / 7);
          const day = i % 7;
          const x = week * (cellSize + cellGap);
          const y = day * (cellSize + cellGap);
          const opacity = value !== undefined ? levelOpacity(value, max, levels) : 0;
          return (
            <rect
              key={i}
              x={x}
              y={y}
              width={cellSize}
              height={cellSize}
              rx={2}
              fill="currentColor"
              fillOpacity={opacity}
              className="text-brand"
            >
              <title>
                {iso}
                {value !== undefined ? `: ${value}` : " (empty)"}
              </title>
            </rect>
          );
        })}
      </svg>
    </div>
  );
}

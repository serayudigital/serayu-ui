// @vitest-environment happy-dom
import { describe, it, expect, afterEach } from "vitest";
import { render, fireEvent, cleanup } from "@testing-library/react";
import { DateRangePicker, type DateRangePreset } from "../date-range-picker";

afterEach(() => {
  cleanup();
});

function makeRange(start: Date, end: Date) {
  return {
    start: new Date(start.getFullYear(), start.getMonth(), start.getDate()),
    end: new Date(end.getFullYear(), end.getMonth(), end.getDate()),
  };
}

describe("DateRangePicker", () => {
  it("renders default 'Select date range' label", () => {
    const { container } = render(<DateRangePicker />);
    expect(container.textContent).toContain("Select date range");
  });

  it("renders 42 day cells", () => {
    const { container } = render(<DateRangePicker />);
    const dayButtons = container.querySelectorAll('button[aria-label]');
    // 42 date buttons + nav buttons + clear (when range) + presets
    expect(dayButtons.length).toBeGreaterThanOrEqual(42);
  });

  it("renders Monday-first day names for id locale", () => {
    const { container } = render(<DateRangePicker />);
    expect(container.textContent).toContain("Sen");
    expect(container.textContent).toContain("Sel");
  });

  it("first click sets start, second click sets end", () => {
    const calls: any[] = [];
    const handle = (r: any) => calls.push(r);
    const { container } = render(<DateRangePicker onChange={handle} />);
    const dateButtons = Array.from(
      container.querySelectorAll('button[aria-label]')
    ).filter((b) => b.getAttribute("aria-label")?.match(/^\w+, /));

    // Click day 10
    const day10 = dateButtons.find((b) => b.textContent === "10");
    expect(day10).toBeDefined();
    fireEvent.click(day10!);
    expect(calls[0].start.getDate()).toBe(10);

    // Click day 15 (after day 10)
    const day15 = dateButtons.find((b) => b.textContent === "15");
    expect(day15).toBeDefined();
    fireEvent.click(day15!);
    expect(calls[1].start.getDate()).toBe(10);
    expect(calls[1].end.getDate()).toBe(15);
  });

  it("swaps when second click < start", () => {
    const calls: any[] = [];
    const { container } = render(<DateRangePicker onChange={(r) => calls.push(r)} />);
    const dateButtons = Array.from(
      container.querySelectorAll('button[aria-label]')
    ).filter((b) => b.getAttribute("aria-label")?.match(/^\w+, /));

    fireEvent.click(dateButtons.find((b) => b.textContent === "20")!);
    fireEvent.click(dateButtons.find((b) => b.textContent === "10")!);
    // After swap, calls[1] should be sorted: start=10, end=20
    expect(calls[1].start.getDate()).toBe(10);
    expect(calls[1].end.getDate()).toBe(20);
  });

  it("third click resets start", () => {
    const calls: any[] = [];
    const { container } = render(<DateRangePicker onChange={(r) => calls.push(r)} />);
    const dateButtons = Array.from(
      container.querySelectorAll('button[aria-label]')
    ).filter((b) => b.getAttribute("aria-label")?.match(/^\w+, /));

    fireEvent.click(dateButtons.find((b) => b.textContent === "5")!);
    fireEvent.click(dateButtons.find((b) => b.textContent === "10")!);
    fireEvent.click(dateButtons.find((b) => b.textContent === "20")!);
    // After third click, start=20, end=20
    expect(calls[2].start.getDate()).toBe(20);
    expect(calls[2].end.getDate()).toBe(20);
  });

  it("renders controlled value when provided", () => {
    const range = makeRange(new Date(2026, 0, 5), new Date(2026, 0, 15));
    const { container } = render(<DateRangePicker value={range} />);
    // Header should display the range
    expect(container.textContent).toMatch(/5/);
    expect(container.textContent).toMatch(/15/);
  });

  it("renders presets and applies preset range", () => {
    const presets: DateRangePreset[] = [
      {
        label: "This month",
        range: () => makeRange(new Date(2026, 0, 1), new Date(2026, 0, 31)),
      },
    ];
    const calls: any[] = [];
    const { container } = render(
      <DateRangePicker onChange={(r) => calls.push(r)} presets={presets} />
    );
    expect(container.textContent).toContain("This month");
    const presetBtn = Array.from(container.querySelectorAll("button")).find(
      (b) => b.textContent === "This month"
    );
    fireEvent.click(presetBtn!);
    expect(calls.length).toBeGreaterThan(0);
    expect(calls[0].start.getMonth()).toBe(0);
    expect(calls[0].end.getMonth()).toBe(0);
  });

  it("clear button removes range", () => {
    const range = makeRange(new Date(2026, 0, 5), new Date(2026, 0, 15));
    const calls: any[] = [];
    const { container } = render(
      <DateRangePicker value={range} onChange={(r) => calls.push(r)} />
    );
    const clearBtn = container.querySelector('button[aria-label="Clear"]');
    expect(clearBtn).toBeDefined();
    fireEvent.click(clearBtn!);
    expect(calls[calls.length - 1]).toBeUndefined();
  });

  it("respects disabledDates predicate", () => {
    const { container } = render(
      <DateRangePicker
        disabledDates={(d) => d.getDay() === 0 || d.getDay() === 6}
      />
    );
    const buttons = container.querySelectorAll('button[aria-label][disabled]');
    expect(buttons.length).toBeGreaterThan(0);
  });

  it("navigates months via prev/next buttons", () => {
    const { container } = render(<DateRangePicker />);
    const initialMonth = container.querySelector("h2")?.textContent ?? "";
    const nextBtn = container.querySelector('button[aria-label="Next month"]');
    fireEvent.click(nextBtn!);
    const newMonth = container.querySelector("h2")?.textContent ?? "";
    expect(newMonth).not.toBe(initialMonth);
  });
});

// @vitest-environment happy-dom
import { describe, expect, it, afterEach } from "vitest";
import { render, screen, fireEvent, act, cleanup } from "@testing-library/react";
import { Tour, useTour, type TourStep } from "../tour";

afterEach(() => cleanup());

const sampleSteps: TourStep[] = [
  {
    id: "create",
    target: "[data-tour=create]",
    title: "Create button",
    description: "Press to create new",
    placement: "bottom",
  },
  {
    id: "notif",
    target: "[data-tour=notif]",
    title: "Notifications",
    description: "View notifications",
  },
];

function Demo({ tour }: { tour: ReturnType<typeof useTour> }) {
  return (
    <>
      <button data-tour="create">Create</button>
      <button data-tour="notif">Notif</button>
      <Tour steps={sampleSteps} tour={tour} />
    </>
  );
}

describe("useTour", () => {
  it("starts closed", () => {
    let captured!: ReturnType<typeof useTour>;
    function Probe() {
      captured = useTour(sampleSteps);
      return null;
    }
    render(<Probe />);
    expect(captured.open).toBe(false);
    expect(captured.step).toBe(-1);
  });

  it("start() opens at step 0", () => {
    let captured!: ReturnType<typeof useTour>;
    function Probe() {
      captured = useTour(sampleSteps);
      return null;
    }
    render(<Probe />);
    act(() => captured.start());
    expect(captured.open).toBe(true);
    expect(captured.step).toBe(0);
  });

  it("close() closes without changing step to -1", () => {
    let captured!: ReturnType<typeof useTour>;
    function Probe() {
      captured = useTour(sampleSteps);
      return null;
    }
    render(<Probe />);
    act(() => captured.start());
    act(() => captured.close());
    expect(captured.open).toBe(false);
    expect(captured.step).toBe(-1);
  });

  it("goTo() jumps to specific step", () => {
    let captured!: ReturnType<typeof useTour>;
    function Probe() {
      captured = useTour(sampleSteps);
      return null;
    }
    render(<Probe />);
    act(() => captured.start());
    act(() => captured.goTo(1));
    expect(captured.step).toBe(1);
  });

  it("finish() closes tour", () => {
    let captured!: ReturnType<typeof useTour>;
    function Probe() {
      captured = useTour(sampleSteps);
      return null;
    }
    render(<Probe />);
    act(() => captured.start());
    act(() => captured.finish());
    expect(captured.open).toBe(false);
  });
});

describe("Tour render", () => {
  it("does not render when closed", () => {
    let captured!: ReturnType<typeof useTour>;
    function Probe() {
      captured = useTour(sampleSteps);
      return <Demo tour={captured} />;
    }
    render(<Probe />);
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("renders bubble with step 0 title when opened", () => {
    let captured!: ReturnType<typeof useTour>;
    function Probe() {
      captured = useTour(sampleSteps);
      return <Demo tour={captured} />;
    }
    render(<Probe />);
    act(() => captured.start());
    expect(screen.getByRole("dialog")).toBeDefined();
    expect(screen.getByText("Create button")).toBeDefined();
    expect(screen.getByText("Press to create new")).toBeDefined();
  });

  it("prev() disabled at step 0", () => {
    let captured!: ReturnType<typeof useTour>;
    function Probe() {
      captured = useTour(sampleSteps);
      return <Demo tour={captured} />;
    }
    render(<Probe />);
    act(() => captured.start());
    const backBtn = screen.getByLabelText("Back") as HTMLButtonElement;
    expect(backBtn.disabled).toBe(true);
  });

  it("Next button on non-final step, Finish on final step", () => {
    let captured!: ReturnType<typeof useTour>;
    function Probe() {
      captured = useTour(sampleSteps);
      return <Demo tour={captured} />;
    }
    render(<Probe />);
    act(() => captured.start());
    expect(screen.getByText("Next")).toBeDefined();
    act(() => captured.next());
    expect(screen.getByText("Finish")).toBeDefined();
  });

  it("Escape closes tour", () => {
    let captured!: ReturnType<typeof useTour>;
    function Probe() {
      captured = useTour(sampleSteps);
      return <Demo tour={captured} />;
    }
    render(<Probe />);
    act(() => captured.start());
    expect(screen.queryByRole("dialog")).toBeDefined();
    fireEvent.keyDown(document, { key: "Escape" });
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(captured.open).toBe(false);
  });

  it("clicking X closes tour", () => {
    let captured!: ReturnType<typeof useTour>;
    function Probe() {
      captured = useTour(sampleSteps);
      return <Demo tour={captured} />;
    }
    render(<Probe />);
    act(() => captured.start());
    fireEvent.click(screen.getByLabelText("Close tour"));
    expect(captured.open).toBe(false);
  });

  it("progress label format 'Step N of M'", () => {
    let captured!: ReturnType<typeof useTour>;
    function Probe() {
      captured = useTour(sampleSteps);
      return <Demo tour={captured} />;
    }
    render(<Probe />);
    act(() => captured.start());
    expect(screen.getByText(/Step 1 of 2/)).toBeDefined();
    act(() => captured.next());
    expect(screen.getByText(/Step 2 of 2/)).toBeDefined();
  });
});

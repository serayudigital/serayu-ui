// @vitest-environment happy-dom
import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import {
  Form,
  FormField,
  FormErrorSummary,
  useFormField,
} from "../form";
import { Input } from "../input";

describe("FormField exports", () => {
  it("Form, FormField, FormErrorSummary, useFormField are defined", () => {
    expect(Form).toBeDefined();
    expect(FormField).toBeDefined();
    expect(FormErrorSummary).toBeDefined();
    expect(useFormField).toBeDefined();
  });
});

describe("FormField render", () => {
  it("renders label with required indicator", () => {
    render(
      <FormField
        name="email"
        label="Email"
        required
      >
        {(ctx) => <Input id={ctx.id} aria-describedby={ctx.describedBy} />}
      </FormField>
    );
    expect(screen.getByText(/Email/)).toBeDefined();
    expect(screen.getByLabelText(/Email/).tagName).toBe("INPUT");
  });

  it("renders helper text as description", () => {
    render(
      <FormField name="hp" helper="Format: 08xx">
        {(ctx) => <Input id={ctx.id} aria-describedby={ctx.describedBy} />}
      </FormField>
    );
    expect(screen.getByText("Format: 08xx")).toBeDefined();
  });

  it("renders error message with role=alert when error prop is set", () => {
    render(
      <FormField name="hp" error="Required">
        {(ctx) => <Input id={ctx.id} aria-describedby={ctx.describedBy} />}
      </FormField>
    );
    const alert = screen.getByRole("alert");
    expect(alert.textContent).toBe("Required");
  });

  it("ctx.invalid is true when there is an error", () => {
    let captured: { invalid: boolean; describedBy: string | undefined } | null =
      null;
    render(
      <FormField name="hp" error="Required">
        {(ctx) => {
          captured = { invalid: ctx.invalid, describedBy: ctx.describedBy };
          return <Input id={ctx.id} aria-describedby={ctx.describedBy} />;
        }}
      </FormField>
    );
    expect(captured!.invalid).toBe(true);
    expect(captured!.describedBy).toBeDefined();
  });

  it("ctx.invalid is false when without error", () => {
    let captured: boolean | null = null;
    render(
      <FormField name="hp">
        {(ctx) => {
          captured = ctx.invalid;
          return <Input id={ctx.id} aria-describedby={ctx.describedBy} />;
        }}
      </FormField>
    );
    expect(captured).toBe(false);
  });
});

describe("Form submit validation", () => {
  it("runs validator and rejects submit on failure", () => {
    const validate = vi.fn(() => "Invalid");
    const handleSubmit = vi.fn();

    const { container } = render(
      <Form onSubmit={handleSubmit}>
        <FormField name="email" validate={validate}>
          {(ctx) => <Input id={ctx.id} aria-describedby={ctx.describedBy} />}
        </FormField>
        <button type="submit">Submit</button>
      </Form>
    );

    const form = container.querySelector("form") as HTMLFormElement;
    form.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
    expect(validate).toHaveBeenCalled();
    // handleSubmit is NOT called because validation fails.
    expect(handleSubmit).not.toHaveBeenCalled();
  });
});

describe("FormErrorSummary", () => {
  it("does not render when there is no error", () => {
    const { container } = render(
      <Form>
        <FormErrorSummary />
      </Form>
    );
    expect(container.querySelector('[role="alert"]')).toBeNull();
  });
});

import * as React from "react";
import { cn } from "@/lib/cn";
import { Label } from "./label";
import { uid } from "@/lib/utils";

/* ============================================================
 * Form context (internal)
 * ============================================================ */

interface FormContextValue {
  /** Map of field name to error message. */
  errors: Record<string, string | undefined>;
  /** Set or clear a single field's error. */
  setError: (name: string, error: string | undefined) => void;
  /** Set many errors at once. */
  setErrors: (next: Record<string, string | undefined>) => void;
  /** Register a validator for a single field. Returns an unsubscribe function. */
  registerValidator: (
    name: string,
    validator: () => string | undefined
  ) => () => void;
  /** Register the DOM id of a field (for anchoring the error summary). */
  registerFieldId: (name: string, id: string) => () => void;
  /** Run all validators. Returns true if all pass. */
  runValidation: () => boolean;
  /** Unique id for the summary label (a11y). */
  summaryId: string;
  /** Map of field name to DOM id. */
  fieldIds: Map<string, string>;
}

const FormContext = React.createContext<FormContextValue | undefined>(undefined);

/** Internal hook for accessing FormContext. */
function useFormContext(): FormContextValue | undefined {
  return React.useContext(FormContext);
}

/* ============================================================
 * Form (provider + submit handler)
 * ============================================================ */

export interface FormProps
  extends Omit<React.FormHTMLAttributes<HTMLFormElement>, "onSubmit"> {
  /** Submit handler. Called only when all validators pass. */
  onSubmit?: (
    event: React.FormEvent<HTMLFormElement>
  ) => void | Promise<void>;
}

/**
 * Form - Serayu UI form root with error management and simple validation.
 *
 * - No external library (zero deps).
 * - Per-field validation via the `validate` prop (zero-arg, reads closure).
 * - Submit: run validators, block onSubmit if any fail, focus the
 *   first invalid field.
 *
 * NOTE: field values are NOT tracked automatically (zero deps). Manage
 * state via useState in the caller, then pass it to FormField through
 * the render prop. For auto-bound defaultValues, use
 * react-hook-form + an adapter (documented separately).
 *
 * Example:
 *   <Form onSubmit={handleSubmit} className="space-y-4">
 *     <FormField
 *       name="email"
 *       label="Email"
 *       required
 *       validate={() => isValidEmail(email) ? undefined : "Invalid email"}
 *     >
 *       {(ctx) => (
 *         <Input
 *           id={ctx.id}
 *           aria-describedby={ctx.describedBy}
 *           invalid={ctx.invalid}
 *           value={email}
 *           onChange={(e) => setEmail(e.target.value)}
 *         />
 *       )}
 *     </FormField>
 *     <Button type="submit">Send</Button>
 *   </Form>
 */
const Form = React.forwardRef<HTMLFormElement, FormProps>(
  ({ onSubmit, className, children, ...rest }, ref) => {
    const [errors, setErrorsState] = React.useState<
      Record<string, string | undefined>
    >({});
    const validatorsRef = React.useRef<Map<string, () => string | undefined>>(
      new Map()
    );
    const fieldIdsRef = React.useRef<Map<string, string>>(new Map());
    const lastRunErrorsRef = React.useRef<Record<string, string | undefined>>(
      {}
    );
    const summaryIdRef = React.useRef<string>();
    if (!summaryIdRef.current) summaryIdRef.current = uid("form");

    const setError = React.useCallback(
      (name: string, error: string | undefined) => {
        setErrorsState((prev) => {
          if (error === undefined) {
            if (!(name in prev)) return prev;
            const next = { ...prev };
            delete next[name];
            return next;
          }
          return { ...prev, [name]: error };
        });
      },
      []
    );

    const setErrors = React.useCallback(
      (next: Record<string, string | undefined>) => {
        setErrorsState(next);
      },
      []
    );

    const registerValidator = React.useCallback(
      (name: string, validator: () => string | undefined) => {
        validatorsRef.current.set(name, validator);
        return () => {
          if (validatorsRef.current.get(name) === validator) {
            validatorsRef.current.delete(name);
          }
        };
      },
      []
    );

    const registerFieldId = React.useCallback(
      (name: string, id: string) => {
        fieldIdsRef.current.set(name, id);
        return () => {
          if (fieldIdsRef.current.get(name) === id) {
            fieldIdsRef.current.delete(name);
          }
        };
      },
      []
    );

    const runValidation = React.useCallback(() => {
      const next: Record<string, string | undefined> = {};
      for (const [name, validator] of validatorsRef.current) {
        const err = validator();
        if (err) next[name] = err;
      }
      lastRunErrorsRef.current = next;
      setErrorsState(next);
      return Object.keys(next).length === 0;
    }, []);

    const focusFirstInvalid = React.useCallback(() => {
      for (const [name, error] of Object.entries(lastRunErrorsRef.current)) {
        if (!error) continue;
        const id = fieldIdsRef.current.get(name);
        if (!id) continue;
        const el = document.getElementById(id);
        if (el && typeof (el as HTMLElement).focus === "function") {
          (el as HTMLElement).focus();
          return;
        }
      }
    }, []);

    const handleSubmit = React.useCallback(
      async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const ok = runValidation();
        if (!ok) {
          // Use rAF so the DOM commits before querySelector runs.
          requestAnimationFrame(focusFirstInvalid);
          return;
        }
        await onSubmit?.(event);
      },
      [runValidation, focusFirstInvalid, onSubmit]
    );

    const ctx: FormContextValue = {
      errors,
      setError,
      setErrors,
      registerValidator,
      registerFieldId,
      runValidation,
      summaryId: summaryIdRef.current,
      fieldIds: fieldIdsRef.current,
    };

    return (
      <FormContext.Provider value={ctx}>
        <form
          ref={ref}
          onSubmit={handleSubmit}
          noValidate
          className={cn(className)}
          {...rest}
        >
          {children}
        </form>
      </FormContext.Provider>
    );
  }
);
Form.displayName = "Form";

/* ============================================================
 * useFormField
 * ============================================================ */

export interface UseFormFieldReturn {
  /** Unique field id (tied to <label htmlFor> and aria-describedby). */
  id: string;
  /** id of the helper text element (for aria-describedby when no error). */
  helperId: string;
  /** id of the error message element (for aria-describedby when there is one). */
  errorId: string;
  /** Field name (for cross-referencing). */
  name: string;
  /** Combined helperId + errorId to attach to the control. */
  describedBy: string | undefined;
  /** True when there is an error. */
  invalid: boolean;
  /** Current error message. */
  error: string | undefined;
}

/**
 * useFormField - hook for custom controls that want auto-wiring
 * to Form (id, aria-describedby, invalid state).
 *
 * Returns a stable field id for the component lifetime. When called
 * outside a Form provider, the id is still generated locally (to
 * support aria wiring without Form).
 *
 * Example (custom Select component):
 *   function MySelect({ name, ...rest }) {
 *     const ctx = useFormField(name);
 *     return (
 *       <>
 *         <select
 *           id={ctx.id}
 *           aria-describedby={ctx.describedBy}
 *           aria-invalid={ctx.invalid || undefined}
 *           {...rest}
 *         />
 *         {ctx.error && <p id={ctx.errorId}>{ctx.error}</p>}
 *       </>
 *     );
 *   }
 */
function useFormField(name: string): UseFormFieldReturn {
  const ctx = useFormContext();
  const localIdRef = React.useRef<string>();
  if (!localIdRef.current) localIdRef.current = uid("field");

  const error = ctx?.errors[name];
  const id = ctx?.fieldIds.get(name) ?? localIdRef.current;
  const helperId = `${id}-helper`;
  const errorId = `${id}-error`;
  const describedBy = error ? errorId : undefined;

  return {
    id,
    helperId,
    errorId,
    name,
    describedBy,
    invalid: !!error,
    error,
  };
}

/* ============================================================
 * FormField
 * ============================================================ */

export interface FormFieldRenderProps {
  /** Field id (tied to <label htmlFor>). */
  id: string;
  /** Field name. */
  name: string;
  /** id for aria-describedby (helper or error). */
  describedBy: string | undefined;
  /** True when there is an error. */
  invalid: boolean;
  /** Error message. */
  error: string | undefined;
}

/** Render prop for FormField. */
export type FormFieldChildren = (
  ctx: FormFieldRenderProps
) => React.ReactElement;

export interface FormFieldProps {
  /** Unique field name (key for error and anchor). */
  name: string;
  /** Field label. */
  label?: React.ReactNode;
  /** Helper text below the field. */
  helper?: React.ReactNode;
  /** Override error from Form context (for imperative errors). */
  error?: string;
  /** Show required mark on the label. */
  required?: boolean;
  /**
   * Validator. Zero-arg because the field does not auto-bind values (zero deps).
   * Read values via closure. Example:
   *   const [email, setEmail] = useState("");
   *   <FormField validate={() => isValidEmail(email) ? undefined : "..."} />
   */
  validate?: () => string | undefined;
  /** Render prop with field context. */
  children: FormFieldChildren;
  /** ClassName for the wrapper. */
  className?: string;
}

/**
 * FormField - wrapper that provides a stable id, label, helper text,
 * and error message for a form control.
 *
 * Works standalone (without Form provider) and with Form provider.
 * With Form: validators are auto-registered and run on submit; errors
 * are synced via context.
 *
 * Example:
 *   <Form onSubmit={handleSubmit}>
 *     <FormField
 *       name="email"
 *       label="Email"
 *       required
 *       validate={() => isValidEmail(email) ? undefined : "Invalid email"}
 *     >
 *       {(ctx) => (
 *         <Input
 *           id={ctx.id}
 *           aria-describedby={ctx.describedBy}
 *           invalid={ctx.invalid}
 *           value={email}
 *           onChange={(e) => setEmail(e.target.value)}
 *         />
 *       )}
 *     </FormField>
 *   </Form>
 */
function FormField({
  name,
  label,
  helper,
  error: errorProp,
  required,
  validate,
  className,
  children,
}: FormFieldProps) {
  const ctx = useFormContext();

  // id is stable for the component lifetime.
  const idRef = React.useRef<string>();
  if (!idRef.current) idRef.current = uid("field");
  const id = idRef.current;
  const helperId = `${id}-helper`;
  const errorId = `${id}-error`;

  // Error: prop override > context error.
  const error = errorProp ?? ctx?.errors[name];
  const describedBy = error ? errorId : helper ? helperId : undefined;

  // Register id with Form (for anchor links in error summary).
  // Safe to call without Form provider (registerFieldId is undefined).
  React.useEffect(() => {
    if (!ctx?.registerFieldId) return;
    return ctx.registerFieldId(name, id);
  }, [ctx?.registerFieldId, name, id]);

  // Validator is wrapped in a ref so it always reads the latest closure.
  const validateRef = React.useRef(validate);
  validateRef.current = validate;

  React.useEffect(() => {
    if (!ctx?.registerValidator || !validate) return;
    return ctx.registerValidator(name, () => validateRef.current?.());
  }, [ctx?.registerValidator, name, validate]);

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {label && (
        <Label htmlFor={id}>
          {label}
          {required && (
            <span className="ml-0.5 text-danger" aria-hidden>
              *
            </span>
          )}
        </Label>
      )}
      {children({ id, name, describedBy, invalid: !!error, error })}
      {helper && !error && (
        <p
          id={helperId}
          className="text-xs text-muted-foreground"
        >
          {helper}
        </p>
      )}
      {error && (
        <p id={errorId} role="alert" className="text-xs text-danger">
          {error}
        </p>
      )}
    </div>
  );
}

/* ============================================================
 * FormErrorSummary
 * ============================================================ */

export interface FormErrorSummaryProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  /** Label / short title. */
  label?: string;
  /** Custom renderer for an item (default: anchor link to field id). */
  renderItem?: (item: { name: string; message: string }) => React.ReactNode;
}

/**
 * FormErrorSummary - concise error list to place at the top of a form.
 *
 * - Renders only when at least one error exists.
 * - Default: anchor link to field id (via Form context registerFieldId),
 *   with auto-focus on click.
 * - Accessible: role="alert" + aria-labelledby with a unique id.
 *
 * Example:
 *   <Form onSubmit={handleSubmit}>
 *     <FormErrorSummary />
 *     <FormField name="email" ...>...</FormField>
 *     <Button type="submit">Send</Button>
 *   </Form>
 */
function FormErrorSummary({
  label = "Please review your input",
  renderItem,
  className,
  ...rest
}: FormErrorSummaryProps) {
  const ctx = useFormContext();

  if (!ctx) return null;

  const errorList = Object.entries(ctx.errors)
    .filter((entry): entry is [string, string] => Boolean(entry[1]))
    .map(([name, message]) => ({ name, message }));

  if (errorList.length === 0) return null;

  const handleClick = (
    event: React.MouseEvent<HTMLAnchorElement>,
    name: string
  ) => {
    event.preventDefault();
    const id = ctx.fieldIds.get(name);
    if (!id) return;
    const el = document.getElementById(id);
    if (el && typeof (el as HTMLElement).focus === "function") {
      (el as HTMLElement).focus();
      (el as HTMLElement).scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  };

  return (
    <div
      role="alert"
      aria-labelledby={ctx.summaryId}
      className={cn(
        "rounded-md border border-danger bg-danger/10 p-3 text-sm text-danger",
        className
      )}
      {...rest}
    >
      <p id={ctx.summaryId} className="font-semibold">
        {label}
      </p>
      <ul className="mt-1.5 list-disc space-y-0.5 pl-5">
        {errorList.map((item) => (
          <li key={item.name}>
            {renderItem ? (
              renderItem(item)
            ) : (
              <a
                href={`#${ctx.fieldIds.get(item.name) ?? item.name}`}
                onClick={(e) => handleClick(e, item.name)}
                className="underline underline-offset-2 hover:no-underline"
              >
                {item.message}
              </a>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export { Form, FormField, FormErrorSummary, useFormField };

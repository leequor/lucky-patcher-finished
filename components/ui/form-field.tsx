import type { InputHTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/utils";

export type FormFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  labelExtra?: ReactNode;
};

export function FormField({
  id,
  label,
  hint,
  error,
  labelExtra,
  className,
  ...inputProps
}: FormFieldProps) {
  const describedBy =
    [hint ? `${id}-hint` : null, error ? `${id}-error` : null]
      .filter(Boolean)
      .join(" ") || undefined;

  return (
    <div className="space-y-1.5">
      <div className="flex items-baseline justify-between gap-3">
        <label htmlFor={id} className="text-[13px] font-medium text-ink">
          {label}
        </label>
        {labelExtra ? (
          <span className="text-[12.5px] text-muted">{labelExtra}</span>
        ) : hint ? (
          <span id={`${id}-hint`} className="text-[12.5px] text-muted">
            {hint}
          </span>
        ) : null}
      </div>
      <input
        id={id}
        aria-invalid={Boolean(error)}
        aria-describedby={describedBy}
        className={cn(
          "h-10 w-full rounded-none border border-white/10 bg-transparent px-3 text-[14px] text-ink outline-none transition-colors placeholder:text-muted/60 hover:border-white/20 focus:border-accent",
          error ? "border-negative focus:border-negative" : null,
          className,
        )}
        {...inputProps}
      />
      {hint && labelExtra ? (
        <p id={`${id}-hint`} className="text-[12px] leading-5 text-muted">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={`${id}-error`} role="alert" className="text-[12.5px] leading-5 text-negative">
          {error}
        </p>
      ) : null}
    </div>
  );
}

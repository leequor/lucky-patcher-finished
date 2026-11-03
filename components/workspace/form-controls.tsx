import type { ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

const FIELD =
  "w-full rounded-none border border-white/10 bg-transparent text-ink outline-none transition-colors placeholder:text-muted/60 hover:border-white/20 focus:border-accent";

export function SelectField({
  id,
  label,
  children,
  className,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement> & {
  id: string;
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="text-[13px] font-medium text-ink">
        {label}
      </label>
      <select
        id={id}
        className={cn("select-control h-10 px-2.5 pr-8 text-[13px]", FIELD, className)}
        {...props}
      >
        {children}
      </select>
    </div>
  );
}

export function TextAreaField({
  id,
  label,
  hint,
  className,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement> & {
  id: string;
  label: string;
  hint?: string;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-baseline justify-between gap-3">
        <label htmlFor={id} className="text-[13px] font-medium text-ink">
          {label}
        </label>
        {hint ? <span className="text-[12px] text-muted">{hint}</span> : null}
      </div>
      <textarea
        id={id}
        className={cn("min-h-[104px] px-3 py-2.5 text-[13px] leading-5", FIELD, className)}
        {...props}
      />
    </div>
  );
}

export function CheckboxField({
  id,
  label,
  description,
  defaultChecked,
}: {
  id: string;
  label: string;
  description?: string;
  defaultChecked?: boolean;
}) {
  return (
    <label
      htmlFor={id}
      className="flex items-start gap-3 border-b border-white/10 py-3"
    >
      <input
        id={id}
        name={id}
        type="checkbox"
        defaultChecked={defaultChecked}
        className="mt-0.5 h-4 w-4 rounded-none border-white/20 bg-transparent accent-accent"
      />
      <span>
        <span className="block text-[13px] font-medium text-ink">{label}</span>
        {description ? (
          <span className="mt-0.5 block text-[12px] leading-4 text-muted">{description}</span>
        ) : null}
      </span>
    </label>
  );
}

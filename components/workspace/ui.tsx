import Link from "next/link";
import type { ReactNode } from "react";

import {
  INVOICE_STATUS_META,
  PRIORITY_META,
  TICKET_STATUS_META,
} from "@/lib/repair/format";
import type {
  InvoiceStatus,
  TicketPriority,
  TicketStatus,
} from "@/lib/repair/types";
import { cn } from "@/lib/utils";

const PILL =
  "inline-flex shrink-0 items-center gap-2 font-mono text-[10px] uppercase leading-none tracking-[0.14em]";

export function StatusPill({
  status,
  className,
}: {
  status: TicketStatus;
  className?: string;
}) {
  const meta = TICKET_STATUS_META[status];
  return (
    <span className={cn(PILL, "text-muted", className)}>
      <span className={cn("h-1.5 w-1.5 shrink-0 rounded-full", meta.dot)} aria-hidden="true" />
      {meta.label}
    </span>
  );
}

export function PriorityPill({ priority }: { priority: TicketPriority }) {
  const meta = PRIORITY_META[priority];
  return (
    <span className={cn(PILL, meta.tone)}>
      <span className={cn("h-1.5 w-1.5 shrink-0 rounded-full", meta.dot)} aria-hidden="true" />
      {meta.label}
    </span>
  );
}

export function InvoicePill({ status, className }: { status: InvoiceStatus; className?: string }) {
  const meta = INVOICE_STATUS_META[status];
  return (
    <span className={cn(PILL, "text-muted", className)}>
      <span className={cn("h-1.5 w-1.5 shrink-0 rounded-full", meta.dot)} aria-hidden="true" />
      {meta.label}
    </span>
  );
}

export function PageHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <header className="border-b border-white/10 pb-4">
      <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-4">
        <div className="min-w-0">
          <h1 className="font-heading text-[30px] font-semibold leading-[0.96] tracking-[-0.045em] text-ink sm:text-[34px]">
            {title}
          </h1>
          {description ? (
            <p className="mt-2 max-w-[80ch] text-[13px] leading-5 text-muted">{description}</p>
          ) : null}
        </div>
        {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
      </div>
    </header>
  );
}

export function Feedback({
  notice,
  error,
}: {
  notice?: string;
  error?: string;
}) {
  if (!notice && !error) return null;
  return (
    <div
      className={cn(
        "mt-4 border-l-2 py-1 pl-3 text-[13px] leading-5",
        error ? "border-negative text-negative-ink" : "border-positive text-positive-ink",
      )}
      role={error ? "alert" : "status"}
    >
      {error || notice}
    </div>
  );
}

export function EmptyState({
  title,
  body,
  action,
}: {
  title: string;
  body: string;
  action?: ReactNode;
}) {
  return (
    <div className="border-t border-white/10 py-10 text-center">
      <p className="text-[14px] font-medium text-ink">{title}</p>
      <p className="mx-auto mt-1.5 max-w-[52ch] text-[13px] leading-5 text-muted">{body}</p>
      {action ? <div className="mt-4 flex justify-center">{action}</div> : null}
    </div>
  );
}

export function SecondaryLink({
  href,
  children,
  className,
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex h-9 items-center justify-center border border-white/10 px-3 text-[13px] font-medium text-ink transition-colors hover:border-white/25 hover:bg-white/5",
        className,
      )}
    >
      {children}
    </Link>
  );
}

export function PrimaryLink({
  href,
  children,
  className,
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex h-9 items-center justify-center bg-accent px-3.5 text-[13px] font-semibold text-[#09090B] transition-colors hover:bg-[#FF7F4D]",
        className,
      )}
    >
      {children}
    </Link>
  );
}

export function Panel({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={cn("border-t border-white/10", className)}>{children}</div>;
}

export function PanelHeader({
  title,
  detail,
  action,
  className,
}: {
  title: string;
  detail?: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-start justify-between gap-3 border-b border-white/10 px-4 py-3",
        className,
      )}
    >
      <div className="min-w-0">
        <h2 className="text-[13px] font-semibold leading-5 text-ink">{title}</h2>
        {detail ? <p className="mt-0.5 text-[12px] leading-4 text-muted">{detail}</p> : null}
      </div>
      {action}
    </div>
  );
}

export function DataBar({
  value,
  max,
  tone = "bg-ink",
}: {
  value: number;
  max: number;
  tone?: string;
}) {
  const width = max <= 0 ? 0 : Math.max(0, Math.min(100, Math.round((value / max) * 100)));
  return (
    <div className="h-[2px] w-full overflow-hidden bg-white/10">
      <div className={cn("h-full", tone)} style={{ width: `${width}%` }} />
    </div>
  );
}

export type StatTone = "default" | "signal" | "ink";

export type StatItem = {
  label: string;
  value: string;
  note?: string;
  tone?: StatTone;
};

export function StatStrip({
  items,
  className,
  featured = false,
}: {
  items: StatItem[];
  className?: string;
  featured?: boolean;
}) {
  if (featured) {
    const [lead, ...rest] = items;
    return (
      <section className={cn("border-y border-white/10 py-5", className)}>
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-white/50">
              {lead.label}
            </p>
            <p className="mt-2 font-heading text-[68px] font-medium leading-[0.82] tracking-[-0.07em] text-ink sm:text-[76px]">
              {lead.value}
            </p>
          </div>
          {lead.note ? (
            <p className="pb-1.5 font-mono text-[10px] uppercase tracking-[0.12em] text-muted">
              {lead.note}
            </p>
          ) : null}
        </div>

        <dl className="mt-5 grid grid-cols-1 border-t border-white/10 sm:grid-cols-3">
          {rest.map((item) => (
            <div
              key={item.label}
              className="border-t border-white/10 py-3 sm:border-l sm:border-t-0 sm:pl-5 sm:first:border-l-0 sm:first:pl-0"
            >
              <dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-white/50">
                {item.label}
              </dt>
              <dd className="mt-2 font-heading text-[24px] font-medium leading-none tracking-[-0.045em] text-ink">
                {item.value}
              </dd>
              {item.note ? (
                <dd className="mt-1.5 text-[11px] leading-4 text-muted">{item.note}</dd>
              ) : null}
            </div>
          ))}
        </dl>
      </section>
    );
  }

  return (
    <dl
      className={cn(
        "grid divide-y divide-white/10 border-y border-white/10 sm:grid-cols-3 sm:divide-x sm:divide-y-0",
        className,
      )}
    >
      {items.map((item) => (
        <div key={item.label} className="py-3 sm:px-4 sm:py-4 sm:first:pl-0 sm:last:pr-0">
          <dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-white/50">
            {item.label}
          </dt>
          <dd className="mt-2 font-heading text-[26px] font-medium leading-none tracking-[-0.045em] text-ink">
            {item.value}
          </dd>
          {item.note ? (
            <dd className="mt-1.5 text-[11px] leading-4 text-muted">{item.note}</dd>
          ) : null}
        </div>
      ))}
    </dl>
  );
}

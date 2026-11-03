import type { Metadata } from "next";
import Link from "next/link";

import { RepairBench } from "@/components/patchwork/repair-bench";
import {
  DataBar,
  PageHeader,
  Panel,
  PanelHeader,
  PrimaryLink,
  PriorityPill,
  SecondaryLink,
  StatStrip,
} from "@/components/workspace/ui";
import {
  formatCompactMoney,
  formatRelative,
  openStatuses,
  ROLE_LABELS,
  TICKET_STATUS_META,
} from "@/lib/repair/format";
import { getDashboardData } from "@/lib/repair/queries";
import type { TicketRow, TicketStatus } from "@/lib/repair/types";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Repair desk" };

type BoardColumn = {
  status: TicketStatus;
  count: number;
  tickets: TicketRow[];
};

export default async function DashboardPage() {
  const data = await getDashboardData();
  const dateLabel = new Intl.DateTimeFormat("en", {
    weekday: "long",
    month: "long",
    day: "numeric",
  }).format(new Date());
  const blocked = data.counts.waiting_parts;
  const finding =
    data.readyCount > 0
      ? `${data.readyCount} ready to collect · ${blocked} waiting on parts`
      : `Nothing waiting for pickup · ${blocked} waiting on parts`;

  const columns: BoardColumn[] = [
    {
      status: "diagnosing",
      count: data.counts.diagnosing,
      tickets: data.queue.filter((ticket) => ticket.status === "diagnosing"),
    },
    {
      status: "waiting_parts",
      count: data.counts.waiting_parts,
      tickets: data.queue.filter((ticket) => ticket.status === "waiting_parts"),
    },
    {
      status: "in_repair",
      count: data.counts.in_repair,
      tickets: data.queue.filter((ticket) => ticket.status === "in_repair"),
    },
    {
      status: "ready",
      count: data.counts.ready,
      tickets: data.readyTickets,
    },
  ];

  const openCount = openStatuses().reduce((total, status) => total + data.counts[status], 0);

  return (
    <div>
      <PageHeader
        title="Repair desk"
        description={`${dateLabel} · ${finding}`}
        actions={
          <>
            <SecondaryLink href="/track">Open tracker</SecondaryLink>
            <PrimaryLink href="/tickets/new">New ticket</PrimaryLink>
          </>
        }
      />

      <StatStrip
        featured
        className="mt-6"
        items={[
          {
            label: "Open jobs",
            value: String(data.openCount),
            note: `${openCount} on the bench`,
          },
          {
            label: "Ready to collect",
            value: String(data.readyCount),
            note: data.readyCount === 1 ? "one customer waiting" : "for pickup",
            tone: data.readyCount > 0 ? "signal" : "default",
          },
          {
            label: "Paid this month",
            value: formatCompactMoney(data.revenueMtd),
            note: "across paid invoices",
          },
          {
            label: "Low stock",
            value: String(data.lowStock.length),
            note: data.lowStock.length === 1 ? "part to reorder" : "parts to reorder",
          },
        ]}
      />

      <section className="mt-4 grid gap-4 xl:grid-cols-[1.62fr_0.38fr]">
        <RepairBench className="reveal min-h-[380px] xl:min-h-[400px]" />

        <Panel className="reveal reveal-delay-1 flex min-h-[380px] flex-col xl:min-h-[400px]">
          <PanelHeader
            title="Next out the door"
            detail="Repairs the customer can collect."
            action={
              <Link
                href="/tickets?status=ready"
                className="text-[12px] font-medium text-muted transition-colors hover:text-ink"
              >
                All ready
              </Link>
            }
          />
          <div className="divide-y divide-line">
            {data.readyTickets.length === 0 ? (
              <p className="px-4 py-5 text-[12.5px] text-muted">Nothing waiting for pickup.</p>
            ) : (
              data.readyTickets.slice(0, 3).map((ticket) => (
                <Link
                  key={ticket.id}
                  href={`/tickets/${ticket.id}`}
                  className="block px-4 py-3 transition-colors hover:bg-white/5"
                >
                  <div className="flex items-baseline justify-between gap-3">
                    <p className="truncate text-[13px] font-medium text-ink">
                      {ticket.customer.full_name}
                    </p>
                    <span className="figure shrink-0 text-[12px] text-muted">
                      {ticket.ticket_number}
                    </span>
                  </div>
                  <p className="mt-0.5 truncate text-[12px] text-muted">
                    {ticket.device.brand} {ticket.device.model}
                  </p>
                </Link>
              ))
            )}
          </div>

          <div className="mt-4 border-t border-line">
            <p className="flex items-baseline justify-between gap-3 px-4 py-2.5 text-[12.5px] font-medium text-ink">
              Blocked on parts
              <span className="figure text-[12px] text-muted">{blocked}</span>
            </p>
            {columns[1].tickets.slice(0, 2).map((ticket) => (
              <Link
                key={ticket.id}
                href={`/tickets/${ticket.id}`}
                className="flex items-baseline justify-between gap-3 px-4 py-1.5 text-[12.5px] text-muted transition-colors hover:bg-white/5 hover:text-ink"
              >
                <span className="truncate">{ticket.customer.full_name}</span>
                <span className="figure shrink-0">{ticket.ticket_number}</span>
              </Link>
            ))}
            {blocked === 0 ? (
              <p className="px-4 pb-3 text-[12.5px] text-muted">No repair is waiting on a part.</p>
            ) : null}
          </div>

          <Link
            href="/tickets"
            className="mt-auto flex items-center justify-between gap-3 border-t border-line px-4 py-2.5 text-[12px] text-muted transition-colors hover:bg-white/5 hover:text-ink"
          >
            All open jobs
            <span className="figure">{openCount}</span>
          </Link>
        </Panel>
      </section>

      <section className="mt-8">
        <div className="flex flex-wrap items-end justify-between gap-3 border-b border-line pb-2.5">
          <div>
            <h2 className="display text-[17px] font-semibold tracking-[-0.035em] text-ink">
              Bench board
            </h2>
            <p className="mt-0.5 text-[12.5px] text-muted">
              Open work by stage. The oldest repair is on the left of each stage.
            </p>
          </div>
          <Link
            href="/tickets"
            className="text-[12px] font-medium text-muted transition-colors hover:text-ink"
          >
            All tickets
          </Link>
        </div>

        <div className="grid gap-x-5 gap-y-6 md:grid-cols-2 xl:grid-cols-4">
          {columns.map((column) => {
            const meta = TICKET_STATUS_META[column.status];
            return (
              <section key={column.status} aria-label={meta.label}>
                <div className="flex items-baseline justify-between gap-2 border-t border-white/10 pt-2">
                  <h3 className="flex items-center gap-1.5 text-[13px] font-semibold text-ink">
                    <span className={`h-[5px] w-[5px] ${meta.dot}`} aria-hidden="true" />
                    {meta.label}
                  </h3>
                  <span className="figure text-[12.5px] text-muted">{column.count}</span>
                </div>

                <div className="divide-y divide-line">
                  {column.tickets.length === 0 ? (
                    <p className="py-6 text-[12px] text-muted">Nothing in this stage.</p>
                  ) : (
                    column.tickets.map((ticket) => (
                      <Link
                        key={ticket.id}
                        href={`/tickets/${ticket.id}`}
                        className="block py-3 transition-colors hover:bg-white/5"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="figure text-[12px] text-muted">
                            {ticket.ticket_number}
                          </span>
                          <PriorityPill priority={ticket.priority} />
                        </div>
                        <p className="mt-1 truncate text-[13px] font-medium text-ink">
                          {ticket.customer.full_name}
                        </p>
                        <p className="mt-0.5 truncate text-[12px] text-muted">
                          {ticket.device.brand} {ticket.device.model}
                        </p>
                        <div className="mt-2 flex items-center justify-between gap-2 text-[12px] text-muted">
                          <span className="truncate">{ticket.assignee?.full_name || "Unassigned"}</span>
                          <span className="figure shrink-0">{formatRelative(ticket.updated_at)}</span>
                        </div>
                      </Link>
                    ))
                  )}
                </div>
              </section>
            );
          })}
        </div>
      </section>

      <section className="mt-8 grid items-start gap-4 xl:grid-cols-2">
        <Panel className="reveal overflow-hidden">
          <PanelHeader title="Bench load" detail="Open jobs by technician." />
          <div className="divide-y divide-line">
            {data.teamLoad.length === 0 ? (
              <p className="px-4 py-5 text-[12.5px] text-muted">No staff profiles yet.</p>
            ) : (
              data.teamLoad.slice(0, 5).map((member) => (
                <div
                  key={member.id}
                  className="grid gap-x-4 gap-y-1.5 px-4 py-3 sm:grid-cols-[1fr_auto]"
                >
                  <div className="min-w-0">
                    <p className="truncate text-[13px] font-medium text-ink">
                      {member.full_name || member.email}
                    </p>
                    <p className="mt-0.5 text-[12px] text-muted">{ROLE_LABELS[member.role]}</p>
                  </div>
                  <span className="figure text-[13px] text-ink sm:text-right">{member.open}</span>
                  <div className="sm:col-span-2">
                    <DataBar
                      value={member.open}
                      max={Math.max(1, data.openCount)}
                      tone={member.open > 0 ? "bg-ink" : "bg-line"}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </Panel>

        <Panel className="reveal reveal-delay-1 overflow-hidden">
          <PanelHeader
            title="Low stock"
            detail="At or below reorder level."
            action={
              <Link
                href="/inventory"
                className="text-[12px] font-medium text-muted transition-colors hover:text-ink"
              >
                Inventory
              </Link>
            }
          />
          {data.lowStock.length === 0 ? (
            <p className="px-4 py-5 text-[12.5px] text-muted">Stock levels are healthy.</p>
          ) : (
            <ul className="divide-y divide-line">
              {data.lowStock.slice(0, 4).map((part) => (
                <li key={part.id} className="flex items-center justify-between gap-3 px-4 py-3">
                  <div className="min-w-0">
                    <p className="truncate text-[13px] font-medium text-ink">{part.name}</p>
                    <p className="mt-0.5 text-[12px] text-muted">{part.sku}</p>
                  </div>
                  <span
                    className={`figure shrink-0 text-[13px] ${
                      part.stock === 0 ? "text-negative" : "text-warn"
                    }`}
                  >
                    {part.stock} left
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </section>
    </div>
  );
}

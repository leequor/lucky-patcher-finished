import type { Metadata } from "next";
import Link from "next/link";

import {
  EmptyState,
  Feedback,
  PageHeader,
  PrimaryLink,
  PriorityPill,
  StatusPill,
} from "@/components/workspace/ui";
import { formatRelative, PRIORITY_META, TICKET_STATUS_META } from "@/lib/repair/format";
import { getStaffProfiles, getTickets } from "@/lib/repair/queries";
import { TICKET_PRIORITIES, TICKET_STATUSES } from "@/lib/repair/types";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Tickets" };

type SearchParams = Promise<{
  q?: string;
  status?: string;
  priority?: string;
  assigned?: string;
  notice?: string;
  error?: string;
}>;

const CONTROL =
  "h-9 w-full border border-white/10 bg-transparent px-2.5 text-[13px] text-ink outline-none transition-colors placeholder:text-muted/60 hover:border-white/20 focus:border-accent";

const SELECT = `${CONTROL} select-control pr-8`;

export default async function TicketsPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const [tickets, staff] = await Promise.all([
    getTickets({
      search: params.q,
      status: params.status,
      priority: params.priority,
      assigned: params.assigned,
    }),
    getStaffProfiles(),
  ]);

  const active = Boolean(
    params.q ||
      (params.status && params.status !== "all") ||
      (params.priority && params.priority !== "all") ||
      (params.assigned && params.assigned !== "all"),
  );
  const leadTicket =
    tickets.find((ticket) => ticket.priority === "urgent") ??
    tickets.find((ticket) => ticket.priority === "high");

  return (
    <div>
      <PageHeader
        title="Tickets"
        description="Every device on the bench, from intake to collection."
        actions={<PrimaryLink href="/tickets/new">New ticket</PrimaryLink>}
      />
      <Feedback notice={params.notice} error={params.error} />

      <form className="mt-5 grid gap-2 border-y border-white/10 py-3 lg:grid-cols-[1.6fr_0.9fr_0.8fr_1fr_auto]">
        <label className="relative flex items-center">
          <span className="sr-only">Search tickets</span>
          <input
            name="q"
            defaultValue={params.q}
            placeholder="Search ticket, customer, phone, device"
            className={CONTROL}
          />
        </label>
        <label>
          <span className="sr-only">Status</span>
          <select name="status" defaultValue={params.status ?? "all"} className={SELECT}>
            <option value="all">All statuses</option>
            {TICKET_STATUSES.map((status) => (
              <option key={status} value={status}>
                {TICKET_STATUS_META[status].label}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span className="sr-only">Priority</span>
          <select name="priority" defaultValue={params.priority ?? "all"} className={SELECT}>
            <option value="all">All priorities</option>
            {TICKET_PRIORITIES.map((priority) => (
              <option key={priority} value={priority}>
                {PRIORITY_META[priority].label}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span className="sr-only">Technician</span>
          <select name="assigned" defaultValue={params.assigned ?? "all"} className={SELECT}>
            <option value="all">Any technician</option>
            {staff.map((member) => (
              <option key={member.id} value={member.id}>
                {member.full_name || member.email}
              </option>
            ))}
          </select>
        </label>
        <div className="flex gap-2">
          <button
            type="submit"
            className="inline-flex h-9 items-center justify-center bg-accent px-4 text-[13px] font-semibold text-[#09090B] transition-colors hover:bg-[#FF7F4D]"
          >
            Filter
          </button>
          {active ? (
            <Link
              href="/tickets"
              className="inline-flex h-9 items-center justify-center border border-white/10 px-3 text-[13px] text-muted hover:border-white/25 hover:text-ink"
            >
              Clear
            </Link>
          ) : null}
        </div>
      </form>

      {tickets.length === 0 ? (
        <div className="mt-5">
          <EmptyState
            title={active ? "No matching tickets" : "No tickets yet"}
            body={
              active
                ? "Change the filters or search term and try again."
                : "Log the first device and Counter will start building the queue."
            }
            action={<PrimaryLink href="/tickets/new">New ticket</PrimaryLink>}
          />
        </div>
      ) : (
        <>
          <div className="hidden grid-cols-[0.7fr_1fr_1.4fr_0.75fr_0.7fr_0.9fr_0.65fr] gap-4 border-b border-white/10 py-2.5 pl-3 font-mono text-[10px] uppercase tracking-widest text-white/50 lg:grid">
            <span>Ticket</span>
            <span>Customer / device</span>
            <span>Issue</span>
            <span>Status</span>
            <span>Priority</span>
            <span>Technician</span>
            <span className="text-right">Updated</span>
          </div>
          <div>
            {tickets.map((ticket) => (
              <Link
                key={ticket.id}
                href={`/tickets/${ticket.id}`}
                className={`group block border-b border-l-2 py-3 pl-3 transition-colors hover:bg-white/5 lg:grid lg:grid-cols-[0.7fr_1fr_1.4fr_0.75fr_0.7fr_0.9fr_0.65fr] lg:items-center lg:gap-4 lg:py-3.5 ${
                  ticket.id === leadTicket?.id ? "border-l-accent" : "border-l-transparent"
                }`}
              >
                <div className="lg:hidden">
                  <div className="flex items-center justify-between gap-2">
                    <span className="figure text-[11px] text-muted">
                      {ticket.ticket_number} · {ticket.public_code}
                    </span>
                    <StatusPill status={ticket.status} />
                  </div>
                  <p className="mt-1 truncate text-[13px] font-medium text-ink">
                    {ticket.customer.full_name}
                  </p>
                  <p className="mt-0.5 truncate text-[12px] text-muted">
                    {ticket.device.brand} {ticket.device.model}
                  </p>
                  <p className="mt-1 line-clamp-1 text-[12.5px] text-muted">{ticket.issue}</p>
                  <div className="mt-1.5 flex items-center justify-between gap-2 text-[12px] text-muted">
                    <PriorityPill priority={ticket.priority} />
                    <span className="truncate">
                      {ticket.assignee?.full_name || "Unassigned"} · {formatRelative(ticket.updated_at)}
                    </span>
                  </div>
                </div>

                <div className="hidden lg:contents">
                  <div>
                    <p className="figure text-[13px] font-medium text-ink">
                      {ticket.ticket_number}
                    </p>
                    <p className="mt-0.5 text-[12px] text-muted">{ticket.public_code}</p>
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-[13px] font-medium text-ink">
                      {ticket.customer.full_name}
                    </p>
                    <p className="mt-0.5 truncate text-[12px] text-muted">
                      {ticket.device.brand} {ticket.device.model}
                    </p>
                  </div>
                  <p className="line-clamp-2 text-[13px] leading-5 text-muted">{ticket.issue}</p>
                  <div>
                    <StatusPill status={ticket.status} />
                  </div>
                  <PriorityPill priority={ticket.priority} />
                  <p className="truncate text-[13px] text-ink">
                    {ticket.assignee?.full_name || <span className="text-muted">Unassigned</span>}
                  </p>
                  <p className="figure text-[12px] text-muted lg:text-right">
                    {formatRelative(ticket.updated_at)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </>
      )}

      <p className="mt-4 text-[12px] text-muted">
        {tickets.length} ticket{tickets.length === 1 ? "" : "s"} shown.
      </p>
    </div>
  );
}

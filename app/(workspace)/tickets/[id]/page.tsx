import Link from "next/link";
import { notFound } from "next/navigation";

import {
  addTicketNoteAction,
  addTicketPartAction,
  createInvoiceAction,
  markInvoicePaidAction,
  updateTicketDetailsAction,
  updateTicketStatusAction,
} from "@/app/actions/repair";
import { FormField } from "@/components/ui/form-field";
import { SubmitButton } from "@/components/ui/submit-button";
import { CopyButton } from "@/components/workspace/copy-button";
import { SelectField, TextAreaField } from "@/components/workspace/form-controls";
import {
  Feedback,
  InvoicePill,
  Panel,
  PanelHeader,
  PriorityPill,
  StatusPill,
} from "@/components/workspace/ui";
import {
  DEVICE_CATEGORY_LABELS,
  formatDate,
  formatMoney,
  formatRelative,
  PRIORITY_META,
  TICKET_STATUS_META,
} from "@/lib/repair/format";
import { getInventory, getStaffProfiles, getTicketDetail } from "@/lib/repair/queries";
import { getStaff as getCurrentStaff } from "@/lib/repair/session";
import { TICKET_PRIORITIES, TICKET_STATUSES } from "@/lib/repair/types";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ notice?: string; error?: string }>;
};

export default async function TicketDetailPage({ params, searchParams }: PageProps) {
  const { id } = await params;
  const query = await searchParams;
  const [ticket, staff, parts, currentStaff] = await Promise.all([
    getTicketDetail(id),
    getStaffProfiles(),
    getInventory(),
    getCurrentStaff(),
  ]);

  if (!ticket) notFound();

  const partsTotal = ticket.parts.reduce(
    (total, part) => total + part.quantity * part.unit_price_cents,
    0,
  );
  const subtotal = ticket.labour_cents + partsTotal;
  const tax = Math.round(subtotal * 0.12);
  const total = subtotal + tax;
  const invoice = ticket.invoice;
  const canAddPart = parts.some((part) => part.stock > 0);
  const canManageInvoices = currentStaff?.role !== "user";

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          href="/tickets"
          className="inline-flex items-center gap-2 text-[12.5px] text-muted transition-colors hover:text-ink"
        >
          <span aria-hidden="true">←</span>
          All tickets
        </Link>
        <div className="flex items-center gap-2">
          <CopyButton value={ticket.public_code} label="Copy code" />
          <Link
            href="/tickets/new"
            className="inline-flex h-9 items-center justify-center bg-accent px-3.5 text-[13px] font-semibold text-[#09090B] transition-colors hover:bg-[#FF7F4D]"
          >
            New ticket
          </Link>
        </div>
      </div>

      <Feedback notice={query.notice} error={query.error} />

      <div className="mt-5 border-b border-white/10 pb-4">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="figure display text-[34px] font-semibold leading-none tracking-[-0.05em] text-ink sm:text-[38px]">
                {ticket.ticket_number}
              </h1>
              <StatusPill status={ticket.status} />
              <PriorityPill priority={ticket.priority} />
            </div>
            <p className="mt-3 max-w-[82ch] text-[13px] leading-5 text-muted">{ticket.issue}</p>
          </div>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-[12px] text-muted">
            <p>Opened {formatRelative(ticket.created_at)}</p>
            <p>
              Tracking <span className="figure text-ink">{ticket.public_code}</span>
            </p>
          </div>
        </div>
      </div>

      <dl className="mt-4 grid grid-cols-2 gap-px bg-white/10 sm:grid-cols-4">
        <div className="min-w-0 bg-paper px-4 py-3">
          <dt className="text-[12px] text-muted">Customer</dt>
          <dd className="mt-1 truncate text-[13px] font-medium text-ink">
            <Link href={`/customers/${ticket.customer.id}`} className="transition-colors hover:text-ink">
              {ticket.customer.full_name}
            </Link>
          </dd>
          <dd className="mt-0.5 truncate text-[12px] text-muted">{ticket.customer.phone}</dd>
        </div>
        <div className="min-w-0 bg-paper px-4 py-3">
          <dt className="text-[12px] text-muted">Device</dt>
          <dd className="mt-1 truncate text-[13px] font-medium text-ink">
            {ticket.device.brand} {ticket.device.model}
          </dd>
          <dd className="mt-0.5 truncate text-[12px] text-muted">
            {DEVICE_CATEGORY_LABELS[ticket.device.category] ?? ticket.device.category}
            {ticket.device.serial ? ` · ${ticket.device.serial}` : ""}
          </dd>
        </div>
        <div className="min-w-0 bg-paper px-4 py-3">
          <dt className="text-[12px] text-muted">Assigned</dt>
          <dd className="mt-1 truncate text-[13px] font-medium text-ink">
            {ticket.assignee?.full_name || "Unassigned"}
          </dd>
          <dd className="mt-0.5 text-[12px] text-muted">
            {ticket.assignee ? "Bench owner" : "Set in bench controls"}
          </dd>
        </div>
        <div className="min-w-0 bg-paper px-4 py-3">
          <dt className="text-[12px] text-muted">Target</dt>
          <dd className="mt-1 text-[13px] font-medium text-ink">{formatDate(ticket.due_at)}</dd>
          <dd className="mt-0.5 text-[12px] text-muted">
            Estimate {formatMoney(ticket.estimate_cents)}
          </dd>
        </div>
      </dl>

      <div className="mt-4 grid gap-4 xl:grid-cols-[1.4fr_0.6fr]">
        <div className="space-y-4">
          <Panel className="reveal overflow-hidden">
            <PanelHeader title="Repair brief" detail="What came in and what the bench found." />
            <div className="grid gap-4 p-4 sm:grid-cols-2 sm:p-5">
              <div>
                <p className="text-[12px] text-muted">Reported issue</p>
                <p className="mt-1.5 text-[13px] leading-6 text-ink">{ticket.issue}</p>
              </div>
              <div>
                <p className="text-[12px] text-muted">Diagnosis</p>
                <p className="mt-1.5 text-[13px] leading-6 text-muted">
                  {ticket.diagnosis || "No diagnosis recorded yet."}
                </p>
              </div>
            </div>
          </Panel>

          <Panel className="reveal reveal-delay-1 overflow-hidden">
            <PanelHeader
              title="Parts on this repair"
              detail={`${ticket.parts.length} part${ticket.parts.length === 1 ? "" : "s"} · ${formatMoney(partsTotal)} in parts`}
            />
            {ticket.parts.length === 0 ? (
              <p className="px-4 py-5 text-[12.5px] text-muted">No parts attached yet.</p>
            ) : (
              <div className="divide-y divide-white/10">
                {ticket.parts.map((part) => (
                  <div key={part.part.id} className="flex items-center justify-between gap-4 px-4 py-3">
                    <div className="min-w-0">
                      <p className="truncate text-[13px] font-medium text-ink">{part.part.name}</p>
                      <p className="mt-0.5 text-[12px] text-muted">
                        {part.part.sku} · {part.quantity} × {formatMoney(part.unit_price_cents)}
                      </p>
                    </div>
                    <p className="figure shrink-0 text-[13px] text-ink">
                      {formatMoney(part.quantity * part.unit_price_cents)}
                    </p>
                  </div>
                ))}
              </div>
            )}
            <form
              action={addTicketPartAction}
              className="grid gap-3 border-t border-white/10 bg-white/[0.02] p-4 sm:grid-cols-[1fr_88px_auto]"
            >
              <input type="hidden" name="ticket_id" value={ticket.id} />
              <SelectField id="part_id" name="part_id" label="Add a part" defaultValue="">
                <option value="">Choose inventory part</option>
                {parts.map((part) => (
                  <option key={part.id} value={part.id} disabled={part.stock < 1}>
                    {part.name} · {part.stock} in stock · {formatMoney(part.price_cents)}
                  </option>
                ))}
              </SelectField>
              <FormField id="quantity" name="quantity" type="number" min={1} defaultValue={1} label="Qty" />
              <div className="flex items-end">
                <SubmitButton size="md" pendingText="Adding...">
                  Add part
                </SubmitButton>
              </div>
            </form>
            {!canAddPart ? (
              <p className="border-t border-line px-4 py-3 text-[12px] text-warn">
                No parts have stock. Restock from the inventory page first.
              </p>
            ) : null}
          </Panel>

          <Panel className="reveal reveal-delay-2 overflow-hidden">
            <PanelHeader title="Timeline" detail="Every status change and note, newest first." />
            <div className="divide-y divide-line">
              {ticket.events.length === 0 ? (
                <p className="px-4 py-5 text-[12.5px] text-muted">No activity recorded.</p>
              ) : (
                ticket.events.map((event) => (
                  <div key={event.id} className="flex gap-3 px-4 py-3.5">
                    <span className="mt-1.5 h-[5px] w-[5px] shrink-0 bg-accent" aria-hidden="true" />
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-[13px] font-medium text-ink">
                          {event.actor?.full_name || "System"}
                        </p>
                        {event.status ? <StatusPill status={event.status} /> : null}
                        <span className="text-[12px] text-muted">
                          {formatRelative(event.created_at)}
                        </span>
                        {event.is_customer_visible ? (
                          <span className="border border-line px-1.5 py-0.5 text-[11.5px] text-muted">
                            customer visible
                          </span>
                        ) : null}
                      </div>
                      {event.body ? (
                        <p className="mt-1.5 text-[13px] leading-5 text-muted">{event.body}</p>
                      ) : null}
                    </div>
                  </div>
                ))
              )}
            </div>
            <form action={addTicketNoteAction} className="space-y-3 border-t border-white/10 bg-white/[0.02] p-4">
              <input type="hidden" name="ticket_id" value={ticket.id} />
              <TextAreaField
                id="body"
                name="body"
                label="Add a bench note"
                placeholder="Explain what changed or what the customer needs to know."
              />
              <div className="flex flex-wrap items-center justify-between gap-3">
                <label className="flex items-center gap-2 text-[12px] text-muted">
                  <input
                    type="checkbox"
                    name="customer_visible"
                    defaultChecked
                    className="h-4 w-4 rounded-none border-line bg-surface accent-accent"
                  />
                  Show this note to the customer
                </label>
                <SubmitButton size="md" pendingText="Saving...">
                  Add note
                </SubmitButton>
              </div>
            </form>
          </Panel>
        </div>

        <div className="space-y-4">
          <Panel className="reveal reveal-delay-1 overflow-hidden">
            <PanelHeader title="Bench controls" detail="Move the job and keep the numbers current." />
            <form action={updateTicketStatusAction} className="space-y-3 border-b border-line p-4">
              <input type="hidden" name="ticket_id" value={ticket.id} />
              <SelectField id="status" name="status" label="Move status" defaultValue={ticket.status}>
                {TICKET_STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {TICKET_STATUS_META[status].label}
                  </option>
                ))}
              </SelectField>
              <TextAreaField
                id="note"
                name="note"
                label="Status note"
                placeholder="What changed?"
                className="min-h-[64px]"
              />
              <SubmitButton size="md" pendingText="Updating..." className="w-full">
                Update status
              </SubmitButton>
            </form>

            <form action={updateTicketDetailsAction} className="space-y-3 p-4">
              <input type="hidden" name="ticket_id" value={ticket.id} />
              <div className="grid grid-cols-2 gap-3">
                <SelectField id="priority" name="priority" label="Priority" defaultValue={ticket.priority}>
                  {TICKET_PRIORITIES.map((priority) => (
                    <option key={priority} value={priority}>
                      {PRIORITY_META[priority].label}
                    </option>
                  ))}
                </SelectField>
                <SelectField
                  id="assigned_to"
                  name="assigned_to"
                  label="Technician"
                  defaultValue={ticket.assigned_to ?? ""}
                >
                  <option value="">Unassigned</option>
                  {staff.map((member) => (
                    <option key={member.id} value={member.id}>
                      {member.full_name || member.email}
                    </option>
                  ))}
                </SelectField>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <FormField
                  id="estimate"
                  name="estimate"
                  label="Estimate"
                  defaultValue={(ticket.estimate_cents / 100).toFixed(2)}
                  inputMode="decimal"
                />
                <FormField
                  id="labour"
                  name="labour"
                  label="Labour"
                  defaultValue={(ticket.labour_cents / 100).toFixed(2)}
                  inputMode="decimal"
                />
              </div>
              <FormField
                id="due_at"
                name="due_at"
                type="date"
                label="Target date"
                defaultValue={ticket.due_at ?? ""}
              />
              <TextAreaField
                id="diagnosis"
                name="diagnosis"
                label="Diagnosis"
                defaultValue={ticket.diagnosis ?? ""}
                placeholder="What did the bench find?"
                className="min-h-[76px]"
              />
              <SubmitButton size="md" pendingText="Saving..." className="w-full">
                Save details
              </SubmitButton>
            </form>
          </Panel>

          <Panel className="reveal reveal-delay-2 p-4">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-[13px] font-semibold text-ink">Customer</h2>
              <Link
                href={`/customers/${ticket.customer.id}`}
                className="text-[12px] text-muted transition-colors hover:text-ink"
              >
                Open profile
              </Link>
            </div>
            <p className="mt-3 text-[13px] font-medium text-ink">{ticket.customer.full_name}</p>
            <p className="mt-1 text-[12.5px] text-muted">{ticket.customer.phone}</p>
            {ticket.customer.email ? (
              <p className="mt-0.5 break-all text-[12.5px] text-muted">{ticket.customer.email}</p>
            ) : null}
            {ticket.customer.company ? (
              <p className="mt-2 text-[12px] text-muted">{ticket.customer.company}</p>
            ) : null}
            <p className="mt-3 border-t border-line pt-3 text-[12px] leading-5 text-muted">
              {ticket.customer.email
                ? "Public tracking is available with the code on this job."
                : "No email on file, so tracking is code-only."}
            </p>
          </Panel>

          <Panel className="reveal reveal-delay-3 overflow-hidden">
            <PanelHeader
              title="Invoice"
              detail={invoice ? invoice.invoice_number : "Not generated yet"}
              action={invoice ? <InvoicePill status={invoice.status} /> : undefined}
            />
            <div className="space-y-2 p-4 text-[13px]">
              <Row label="Labour" value={formatMoney(invoice?.labour_cents ?? ticket.labour_cents)} />
              <Row label="Parts" value={formatMoney(invoice?.parts_cents ?? partsTotal)} />
              <Row label="Tax (12%)" value={formatMoney(invoice?.tax_cents ?? tax)} />
              <div className="flex items-center justify-between border-t border-line pt-2 text-[14px] font-medium text-ink">
                <span>Total</span>
                <span className="figure">{formatMoney(invoice?.total_cents ?? total)}</span>
              </div>
            </div>
            {invoice ? (
              <div className="border-t border-line p-4">
                {invoice.status === "paid" ? (
                  <p className="text-[13px] text-positive-ink">Paid {formatDate(invoice.paid_at)}</p>
                ) : canManageInvoices ? (
                  <form action={markInvoicePaidAction}>
                    <input type="hidden" name="invoice_id" value={invoice.id} />
                    <input type="hidden" name="return_to" value={`/tickets/${ticket.id}`} />
                    <SubmitButton size="md" pendingText="Recording..." className="w-full">
                      Mark paid + collected
                    </SubmitButton>
                  </form>
                ) : (
                  <p className="text-[13px] text-muted">Awaiting manager collection.</p>
                )}
              </div>
            ) : canManageInvoices ? (
              <form action={createInvoiceAction} className="border-t border-line p-4">
                <input type="hidden" name="ticket_id" value={ticket.id} />
                <SubmitButton size="md" pendingText="Generating..." className="w-full">
                  Generate invoice
                </SubmitButton>
              </form>
            ) : (
              <p className="border-t border-line p-4 text-[12.5px] text-muted">
                A manager generates the invoice when the repair is ready.
              </p>
            )}
          </Panel>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-muted">{label}</span>
      <span className="figure text-ink">{value}</span>
    </div>
  );
}

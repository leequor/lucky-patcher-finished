import Link from "next/link";
import { notFound } from "next/navigation";

import { addDeviceAction } from "@/app/actions/repair";
import { FormField } from "@/components/ui/form-field";
import { SubmitButton } from "@/components/ui/submit-button";
import { SelectField } from "@/components/workspace/form-controls";
import {
  EmptyState,
  Feedback,
  Panel,
  PanelHeader,
  PrimaryLink,
  PriorityPill,
  StatusPill,
} from "@/components/workspace/ui";
import {
  DEVICE_CATEGORY_LABELS,
  formatDate,
  formatRelative,
} from "@/lib/repair/format";
import { getCustomerDetail } from "@/lib/repair/queries";
import { DEVICE_CATEGORIES } from "@/lib/repair/types";
import { initials } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function CustomerDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ notice?: string; error?: string }>;
}) {
  const { id } = await params;
  const query = await searchParams;
  const customer = await getCustomerDetail(id);

  if (!customer) notFound();

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link href="/customers" className="inline-flex items-center gap-2 text-[13px] text-muted hover:text-ink">
          <span aria-hidden="true">←</span>
          All customers
        </Link>
        <PrimaryLink href="/tickets/new">New ticket</PrimaryLink>
      </div>
      <Feedback notice={query.notice} error={query.error} />

      <div className="mt-5 flex flex-wrap items-end justify-between gap-4 border-b border-white/10 pb-4">
        <div className="flex min-w-0 items-center gap-4">
          <div className="grid h-14 w-14 shrink-0 place-items-center bg-white/10 text-[15px] font-semibold text-ink">
            {initials(customer.full_name)}
          </div>
          <div className="min-w-0">
            <h1 className="display text-[28px] font-semibold leading-[0.98] tracking-[-0.045em] text-ink sm:text-[32px]">
              {customer.full_name}
            </h1>
            <p className="mt-1.5 text-[13px] text-muted">
              {customer.phone}
              {customer.email ? ` · ${customer.email}` : ""}
            </p>
            <p className="mt-0.5 text-[12px] text-muted">
              Customer since {formatDate(customer.created_at)} · {customer.devices.length} device
              {customer.devices.length === 1 ? "" : "s"} · {customer.tickets.length} ticket
              {customer.tickets.length === 1 ? "" : "s"}
            </p>
          </div>
        </div>
        <div className="text-right text-[12px] text-muted">
          <p>{customer.company || "Individual customer"}</p>
          {customer.notes ? <p className="mt-1 max-w-[36ch]">{customer.notes}</p> : null}
        </div>
      </div>

      <div className="mt-5 grid gap-4 xl:grid-cols-[1.35fr_0.65fr]">
        <div className="space-y-4">
          <Panel className="reveal overflow-hidden">
            <PanelHeader title="Repair history" detail="Every ticket for this customer." />
            {customer.tickets.length === 0 ? (
              <div className="p-5">
                <EmptyState
                  title="No repairs yet"
                  body="Attach a device below, then open the first ticket."
                  action={<PrimaryLink href="/tickets/new">New ticket</PrimaryLink>}
                />
              </div>
            ) : (
              <div className="divide-y divide-line">
                {customer.tickets.map((ticket) => (
                  <Link
                    key={ticket.id}
                    href={`/tickets/${ticket.id}`}
                    className="grid gap-2 px-5 py-4 transition-colors hover:bg-white/5 sm:grid-cols-[0.7fr_1.2fr_1fr_0.6fr] sm:items-center"
                  >
                    <p className="figure text-[13px] font-medium text-ink">{ticket.ticket_number}</p>
                    <div className="min-w-0">
                      <p className="truncate text-[13px] text-ink">{ticket.device.brand} {ticket.device.model}</p>
                      <p className="mt-0.5 truncate text-[12px] text-muted">{ticket.issue}</p>
                    </div>
                    <StatusPill status={ticket.status} className="justify-self-start" />
                    <div className="flex items-center justify-between gap-2 sm:justify-end">
                      <PriorityPill priority={ticket.priority} />
                      <span className="figure text-[12px] text-muted">{formatRelative(ticket.created_at)}</span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </Panel>

          <Panel className="reveal reveal-delay-1 overflow-hidden">
            <PanelHeader title="Devices" detail="Attach a device before opening its ticket." />
            {customer.devices.length === 0 ? (
              <p className="px-5 py-5 text-[13px] text-muted">No devices attached.</p>
            ) : (
              <div className="divide-y divide-white/10">
                {customer.devices.map((device) => (
                  <div
                    key={device.id}
                    className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 px-4 py-3 transition-colors hover:bg-white/5"
                  >
                    <div className="min-w-0">
                      <p className="text-[11.5px] text-muted">
                        {DEVICE_CATEGORY_LABELS[device.category] ?? device.category}
                      </p>
                      <p className="mt-0.5 truncate text-[13px] font-medium text-ink">
                        {device.brand} {device.model}
                      </p>
                    </div>
                    <div className="text-[12px] text-muted sm:text-right">
                      <p>
                        {device.serial || "No serial"}
                        {device.color ? ` · ${device.color}` : ""}
                      </p>
                      <p className="mt-0.5">Added {formatDate(device.created_at)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <form action={addDeviceAction} className="space-y-4 border-t border-white/10 p-5">
              <input type="hidden" name="customer_id" value={customer.id} />
              <div className="grid gap-4 sm:grid-cols-3">
                <SelectField id="category" name="category" label="Device type" defaultValue="phone">
                  {DEVICE_CATEGORIES.map((category) => (
                    <option key={category} value={category}>
                      {DEVICE_CATEGORY_LABELS[category]}
                    </option>
                  ))}
                </SelectField>
                <FormField id="brand" name="brand" label="Brand" placeholder="Apple" required />
                <FormField id="model" name="model" label="Model" placeholder="iPhone 15 Pro" required />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField id="serial" name="serial" label="Serial / IMEI" placeholder="Optional" />
                <FormField id="color" name="color" label="Color" placeholder="Optional" />
              </div>
              <div className="flex justify-end">
                <SubmitButton pendingText="Adding...">Add device</SubmitButton>
              </div>
            </form>
          </Panel>
        </div>

        <div className="space-y-4">
          <Panel className="reveal reveal-delay-1 p-5">
            <h2 className="text-[14px] font-medium text-ink">Contact</h2>
            <dl className="mt-4 space-y-3 text-[13px]">
              <div>
                <dt className="text-muted">Phone</dt>
                <dd className="mt-0.5 text-ink">{customer.phone}</dd>
              </div>
              <div>
                <dt className="text-muted">Email</dt>
                <dd className="mt-0.5 break-all text-ink">{customer.email || "Not provided"}</dd>
              </div>
              <div>
                <dt className="text-muted">Company</dt>
                <dd className="mt-0.5 text-ink">{customer.company || "—"}</dd>
              </div>
              <div>
                <dt className="text-muted">Notes</dt>
                <dd className="mt-0.5 leading-5 text-ink">{customer.notes || "No notes."}</dd>
              </div>
            </dl>
          </Panel>

          <Panel className="reveal reveal-delay-2 p-5">
            <h2 className="text-[14px] font-medium text-ink">Quick numbers</h2>
            <div className="mt-4 grid grid-cols-3 border-y border-white/10">
              <div className="border-l border-white/10 px-3 py-3 first:border-l-0">
                <p className="figure text-[24px] font-medium leading-none tracking-[-0.04em] text-ink">
                  {customer.devices.length}
                </p>
                <p className="mt-1.5 text-[12px] text-muted">Devices</p>
              </div>
              <div className="border-l border-white/10 px-3 py-3 first:border-l-0">
                <p className="figure text-[24px] font-medium leading-none tracking-[-0.04em] text-ink">
                  {customer.tickets.length}
                </p>
                <p className="mt-1.5 text-[12px] text-muted">Tickets</p>
              </div>
              <div className="border-l border-white/10 bg-accent px-3 py-3">
                <p className="figure text-[24px] font-medium leading-none tracking-[-0.04em] text-[#09090B]">
                  {customer.tickets.filter((ticket) => ["intake", "diagnosing", "waiting_parts", "in_repair"].includes(ticket.status)).length}
                </p>
                <p className="mt-1.5 text-[12px] text-[#09090B]/70">Open</p>
              </div>
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
}

import type { Metadata } from "next";
import Link from "next/link";

import {
  EmptyState,
  Feedback,
  PageHeader,
  Panel,
  PrimaryLink,
} from "@/components/workspace/ui";
import { getCustomers } from "@/lib/repair/queries";
import { initials } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Customers" };

export default async function CustomersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; notice?: string; error?: string }>;
}) {
  const params = await searchParams;
  const customers = await getCustomers(params.q);

  return (
    <div>
      <PageHeader
        title="Customers"
        description="Contact details, devices, and every repair attached to the person."
        actions={<PrimaryLink href="/customers/new">New customer</PrimaryLink>}
      />
      <Feedback notice={params.notice} error={params.error} />

      <Panel className="mt-5 overflow-hidden">
        <form className="flex flex-wrap items-center gap-2 border-b border-line p-4">
          <label className="relative min-w-[220px] flex-1">
            <span className="sr-only">Search customers</span>
            <input
              name="q"
              defaultValue={params.q}
              placeholder="Search name, email, phone, or company"
              className="h-9 w-full rounded-none border border-white/10 bg-transparent px-3 text-[13px] text-ink outline-none transition-colors placeholder:text-muted/60 hover:border-white/20 focus:border-accent"
            />
          </label>
          <button
            type="submit"
            className="inline-flex h-9 items-center justify-center rounded-none bg-accent px-4 text-[13px] font-semibold text-[#09090B] hover:bg-[#FF7F4D]"
          >
            Search
          </button>
          {params.q ? (
            <Link href="/customers" className="inline-flex h-9 items-center rounded-none border border-white/10 px-3 text-[13px] text-muted hover:border-white/25 hover:text-ink">
              Clear
            </Link>
          ) : null}
        </form>

        {customers.length === 0 ? (
          <div className="p-5">
            <EmptyState
              title={params.q ? "No matching customers" : "No customers yet"}
              body={
                params.q
                  ? "Try a different name, email, or phone number."
                  : "Add the first customer, attach their device, and open a ticket."
              }
              action={<PrimaryLink href="/customers/new">New customer</PrimaryLink>}
            />
          </div>
        ) : (
          <>
            <div className="hidden grid-cols-[1.5fr_1fr_0.55fr_0.55fr_0.55fr] gap-4 border-b border-white/10 px-5 py-2.5 font-mono text-[10px] uppercase tracking-widest text-white/50 md:grid">
              <span>Customer</span>
              <span>Company</span>
              <span>Devices</span>
              <span>Open</span>
              <span className="text-right">All tickets</span>
            </div>
            <div className="divide-y divide-line">
              {customers.map((customer) => (
                <Link
                  key={customer.id}
                  href={`/customers/${customer.id}`}
                  className="grid gap-3 px-5 py-4 transition-colors hover:bg-white/5 md:grid-cols-[1.5fr_1fr_0.55fr_0.55fr_0.55fr] md:items-center md:gap-4"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="grid h-9 w-9 shrink-0 place-items-center bg-white/10 text-[12px] font-semibold text-ink">
                      {initials(customer.full_name)}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-[13px] font-medium text-ink">{customer.full_name}</p>
                      <p className="mt-0.5 truncate text-[12px] text-muted">
                        {customer.phone}
                        {customer.email ? ` · ${customer.email}` : ""}
                      </p>
                    </div>
                  </div>
                  <p className="truncate text-[13px] text-muted">{customer.company || "—"}</p>
                  <p className="figure text-[13px] text-ink">{customer.device_count}</p>
                  <p className="figure text-[13px] text-ink">{customer.open_count}</p>
                  <p className="figure text-[13px] text-muted md:text-right">{customer.ticket_count}</p>
                </Link>
              ))}
            </div>
          </>
        )}
      </Panel>

      <p className="mt-4 text-[12px] text-muted">{customers.length} customer{customers.length === 1 ? "" : "s"} shown.</p>
    </div>
  );
}

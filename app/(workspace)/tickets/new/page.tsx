import type { Metadata } from "next";
import Link from "next/link";

import {
  Feedback,
  PageHeader,
  Panel,
  SecondaryLink,
} from "@/components/workspace/ui";
import { TicketIntakeForm } from "@/components/workspace/ticket-intake-form";
import { getCustomerOptions, getStaffProfiles } from "@/lib/repair/queries";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "New ticket" };

type SearchParams = Promise<{ error?: string; mode?: string }>;

export default async function NewTicketPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const [customers, staff] = await Promise.all([getCustomerOptions(), getStaffProfiles()]);

  return (
    <div>
      <PageHeader
        title="New intake"
        description="Log the device, record the fault, and put it in the queue."
        actions={<SecondaryLink href="/tickets">Back to tickets</SecondaryLink>}
      />
      <Feedback error={params.error} />

      <div className="mt-5 grid gap-4 xl:grid-cols-[1.5fr_0.5fr]">
        <Panel className="reveal p-5 sm:p-6">
          <TicketIntakeForm
            customers={customers}
            staff={staff}
            initialMode={params.mode === "new" ? "new" : "existing"}
          />
        </Panel>

        <div className="reveal reveal-delay-1 self-start border-t border-white/10">
          <section className="border-b border-line p-5">
            <h2 className="text-[13px] font-semibold text-ink">Intake checklist</h2>
            <p className="mt-1 text-[12.5px] text-muted">
              Before the device leaves the counter.
            </p>
            <ul className="mt-3 space-y-2.5">
              {[
                "Confirm the customer's phone and email.",
                "Record the exact fault and any existing damage.",
                "Photograph the device if it is already damaged.",
                "Give the customer the tracking code from the ticket page.",
              ].map((item) => (
                <li key={item} className="flex gap-2.5">
                  <span className="mt-[7px] h-[3px] w-[3px] shrink-0 bg-accent" aria-hidden="true" />
                  <p className="text-[12.5px] leading-5 text-ink">{item}</p>
                </li>
              ))}
            </ul>
          </section>

          <section className="border-b border-line p-5">
            <h2 className="text-[13px] font-semibold text-ink">What the customer gets</h2>
            <p className="mt-1.5 text-[12.5px] leading-5 text-muted">
              Every ticket gets a tracking code. The customer opens{" "}
              <Link href="/track" className="text-ink underline decoration-white/20 underline-offset-2 transition-colors hover:decoration-accent">
                /track
              </Link>{" "}
              and enters the code. No email or phone number is needed.
            </p>
            <div className="mt-3 border-l-2 border-accent bg-white/[0.03] p-3">
              <p className="text-[11.5px] text-muted">Customer sees</p>
              <p className="mt-1 text-[12.5px] leading-5 text-ink">
                Status, device, issue, and visible timeline notes.
              </p>
            </div>
          </section>

          <section className="p-5">
            <h2 className="text-[13px] font-semibold text-ink">Billing default</h2>
            <p className="mt-1.5 text-[12.5px] leading-5 text-muted">
              Invoices add labour plus parts and apply a 12% tax. You can edit labour and the
              estimate from the ticket after diagnosis.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

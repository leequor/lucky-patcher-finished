import Link from "next/link";
import type { Metadata } from "next";

import { RepairBench } from "@/components/patchwork/repair-bench";
import { Logo } from "@/components/ui/logo";
import { Feedback, Panel, StatusPill } from "@/components/workspace/ui";
import {
  DEVICE_CATEGORY_LABELS,
  formatDate,
  formatRelative,
  TICKET_STATUS_META,
} from "@/lib/repair/format";
import { getTrackedTicket } from "@/lib/repair/queries";
import type { TicketStatus } from "@/lib/repair/types";
import { cn } from "@/lib/utils";

const TRACK_STAGES = ["Intake", "Diagnosis", "Repair", "Ready"] as const;

function trackStage(status: TicketStatus) {
  if (status === "intake") return 0;
  if (status === "diagnosing" || status === "waiting_parts") return 1;
  if (status === "in_repair") return 2;
  if (status === "ready") return 3;
  if (status === "picked_up") return 4;
  return 0;
}

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Track your repair",
  description: "Check repair progress with the tracking code from your intake receipt.",
};

type SearchParams = Promise<{
  code?: string;
  error?: string;
}>;

export default async function TrackPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const code = params.code?.trim() ?? "";
  const hasQuery = Boolean(code);
  const ticket = hasQuery ? await getTrackedTicket(code) : null;

  return (
    <main className="flex min-h-[100dvh] flex-col bg-paper">
      <header className="border-b border-line">
        <div className="mx-auto flex h-16 max-w-canvas items-center justify-between px-5 sm:px-8">
          <Logo href="/" />
          <div className="flex items-center gap-4">
            <Link
              href="/status"
              className="hidden text-[12.5px] text-muted transition-colors hover:text-ink sm:block"
            >
              System status
            </Link>
            <Link
              href="/login"
              className="inline-flex h-9 items-center bg-accent px-3.5 text-[13px] font-semibold text-[#09090B] transition-colors hover:bg-[#FF7F4D]"
            >
              Staff sign in
            </Link>
          </div>
        </div>
      </header>

      <div className="mx-auto w-full max-w-canvas flex-1 px-5 pb-16 pt-8 sm:px-8 sm:pt-10">
        <div className="grid gap-6 lg:grid-cols-[0.98fr_1.02fr] lg:items-stretch">
          <div className="flex flex-col justify-between">
            <div>
              <p className="text-[12px] text-muted">Public tracker</p>
              <h1 className="display mt-2 text-[clamp(2.7rem,5vw,4.4rem)] font-semibold leading-[0.87] tracking-[-0.06em] text-ink">
                Track your{" "}
                <span className="block">repair.</span>
              </h1>
              <p className="mt-5 max-w-[42ch] text-[14px] leading-6 text-muted">
                Enter the tracking code from your intake receipt. No email, phone number or
                account needed.
              </p>

              <form className="mt-7 max-w-[420px]" method="get">
                <label className="block">
                  <span className="mb-1.5 block text-[13px] font-medium text-ink">
                    Tracking code
                  </span>
                  <input
                    name="code"
                    defaultValue={code}
                    placeholder="TRACK••••"
                    aria-describedby="tracking-code-help"
                    className="h-12 w-full border border-white/10 bg-transparent px-3.5 font-mono text-[14px] font-medium uppercase tracking-[0.08em] text-ink outline-none transition-colors placeholder:font-sans placeholder:font-normal placeholder:normal-case placeholder:tracking-normal placeholder:text-muted/60 hover:border-white/20 focus:border-accent"
                    required
                  />
                </label>
                <div className="mt-1.5 flex items-baseline justify-between gap-3">
                  <p id="tracking-code-help" className="text-[12px] leading-5 text-muted">
                    The 10-character code, not the PW- number.
                  </p>
                </div>
                <button
                  type="submit"
                  className="mt-3 inline-flex h-11 w-full items-center justify-center bg-accent text-[13px] font-semibold text-[#09090B] transition-colors hover:bg-[#FF7F4D]"
                >
                  Check status
                </button>
              </form>

              <Feedback
                error={
                  params.error ||
                  (hasQuery && !ticket
                    ? "No ticket matched that code. Check the 10-character code on your receipt."
                    : undefined)
                }
              />
            </div>

            <p className="mt-8 border-t border-line pt-3 text-[12px] leading-5 text-muted">
              The code is printed on the intake receipt, next to the ticket number. Contact the
              shop if you cannot find it.
            </p>
          </div>

          <RepairBench className="reveal min-h-[360px]" />
        </div>

        {ticket ? (
          <section className="mt-5 grid gap-4 lg:grid-cols-[0.98fr_1.02fr]">
            <Panel className="reveal">
              <div className="flex flex-wrap items-start justify-between gap-3 border-b border-white/10 p-5 sm:p-6">
                <div className="min-w-0">
                  <p className="figure text-[12px] text-muted">{ticket.ticket_number}</p>
                  <h2 className="display mt-1.5 text-[24px] font-semibold leading-[1.02] tracking-[-0.045em] text-ink">
                    {ticket.device.brand} {ticket.device.model}
                  </h2>
                  <p className="mt-1.5 text-[12px] text-muted">
                    {DEVICE_CATEGORY_LABELS[ticket.device.category] ?? ticket.device.category} ·
                    opened {formatDate(ticket.created_at)} · updated{" "}
                    {formatRelative(ticket.updated_at)}
                  </p>
                </div>
                <StatusPill status={ticket.status} />
              </div>

              <div className="border-b border-line px-5 py-4 sm:px-6">
                {ticket.status === "cancelled" ? (
                  <p className="text-[12.5px] leading-5 text-muted">
                    This repair was closed without a fix. Call the shop if it needs to be
                    reopened.
                  </p>
                ) : (
                  <div
                    className="grid grid-cols-4 gap-2"
                    aria-label={`Progress: ${TICKET_STATUS_META[ticket.status].label}`}
                  >
                    {TRACK_STAGES.map((stage, index) => {
                      const current = trackStage(ticket.status);
                      const done = index < current;
                      const active = index === current;
                      return (
                        <div key={stage} className="min-w-0">
                          <span
                            className={cn(
                              "block h-[4px]",
                              done ? "bg-ink" : active ? "bg-accent" : "bg-line",
                            )}
                          />
                          <span
                            className={cn(
                              "mt-2 block truncate text-[12px]",
                              active
                                ? "font-semibold text-ink"
                                : done
                                  ? "text-ink"
                                  : "text-muted",
                            )}
                          >
                            {stage}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="grid gap-4 p-5 sm:grid-cols-2 sm:p-6">
                <div>
                  <p className="text-[12px] text-muted">Reported fault</p>
                  <p className="mt-1.5 text-[13px] leading-6 text-ink">{ticket.issue}</p>
                </div>
                <div>
                  <p className="text-[12px] text-muted">Current stage</p>
                  <p className="mt-1.5 text-[14px] font-medium text-ink">
                    {TICKET_STATUS_META[ticket.status].label}
                  </p>
                  <p className="mt-1 text-[12.5px] leading-5 text-muted">
                    {TICKET_STATUS_META[ticket.status].description}
                  </p>
                </div>
              </div>

              <p className="border-t border-line p-5 text-[12.5px] leading-5 text-muted sm:px-6">
                Hi {ticket.customer_name}. If something looks wrong, call the shop and quote{" "}
                <span className="font-medium text-ink">{ticket.ticket_number}</span>.
              </p>
            </Panel>

            <Panel className="reveal reveal-delay-1 overflow-hidden">
              <div className="border-b border-line px-4 py-3">
                <h2 className="text-[13px] font-semibold text-ink">Repair timeline</h2>
                <p className="mt-0.5 text-[12.5px] text-muted">
                  Updates the bench has shared with you.
                </p>
              </div>
              <div className="divide-y divide-white/10">
                {ticket.events.length === 0 ? (
                  <p className="px-4 py-5 text-[12.5px] text-muted">No updates yet.</p>
                ) : (
                  ticket.events.map((event, index) => (
                    <div key={`${event.created_at}-${index}`} className="flex gap-3 px-4 py-3.5">
                      <span className="mt-1.5 h-[5px] w-[5px] shrink-0 bg-accent" aria-hidden="true" />
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          {event.status ? <StatusPill status={event.status} /> : null}
                          <span className="text-[12px] text-muted">
                            {formatRelative(event.created_at)}
                          </span>
                        </div>
                        {event.body ? (
                          <p className="mt-1.5 text-[13px] leading-5 text-muted">{event.body}</p>
                        ) : null}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </Panel>
          </section>
        ) : (
          <section className="mt-8 grid gap-x-8 gap-y-6 border-t border-white/10 pt-5 sm:grid-cols-3">
            {[
              [
                "Find your code",
                "The 10-character code is printed on the intake receipt, next to the ticket number.",
              ],
              [
                "Check the stage",
                "Open the tracker any time; the stage and timeline update as the bench works.",
              ],
              [
                "Keep it private",
                "The code is the key. Anyone who has it sees status only, never payment details.",
              ],
            ].map(([title, body]) => (
              <div key={title}>
                <p className="text-[13px] font-medium text-ink">{title}</p>
                <p className="mt-1.5 max-w-[36ch] text-[12.5px] leading-5 text-muted">{body}</p>
              </div>
            ))}
          </section>
        )}
      </div>

      <footer className="border-t border-line">
        <div className="mx-auto flex max-w-canvas flex-wrap items-center justify-between gap-2 px-5 py-4 text-[12px] text-muted sm:px-8">
          <p>Counter · Repair operations</p>
          <p>Customers see status only. Staff manage the rest.</p>
        </div>
      </footer>
    </main>
  );
}

import Link from "next/link";
import type { ReactNode } from "react";

import { Logo } from "@/components/ui/logo";
import { cn } from "@/lib/utils";

const PROOF = [
  {
    title: "One queue",
    note: "Intake, diagnosis, parts and status on the same sheet.",
  },
  {
    title: "Counted once",
    note: "Stock, labour and tax move with the repair, not beside it.",
  },
  {
    title: "Tracked by code",
    note: "Customers follow progress without an account or a phone number.",
  },
];

const STAGES = ["Intake", "Diagnosis", "Repair", "Ready"] as const;
const CURRENT = 2;

// Specimen docket. No customer name, phone or tracking code belongs on a page
// that renders before anyone has signed in.
const FIELDS = [
  ["Customer", "Walk-in"],
  ["Device", "iPhone 15 Pro"],
  ["Work", "Display assembly"],
  ["Estimate", "$320.00"],
] as const;

function Docket({ className }: { className?: string }) {
  return (
    <div className={className}>
      <div className="relative">
        <div aria-hidden="true" className="absolute inset-0 translate-x-2 translate-y-2 border border-white/10 bg-white/[0.03]" />

        <div className="relative border border-white/10 bg-surface">
          <div className="flex items-stretch border-b border-white/10">
            <div className="min-w-0 flex-1 px-4 py-2.5">
              <p className="text-[11.5px] text-muted">Job docket</p>
              <p className="figure mt-1 text-[18px] font-medium leading-none tracking-[-0.035em] text-ink">
                PW-1041
              </p>
            </div>
            <div className="hidden border-l border-line px-4 py-2.5 sm:block">
              <p className="text-[11.5px] text-muted">Received</p>
              <p className="mt-1 text-[13px] leading-none text-ink">27 Oct</p>
            </div>
            <div className="flex flex-col justify-center border-l border-white/10 bg-accent px-4">
              <p className="text-[11.5px] leading-none text-[#09090B]/70">Stage</p>
              <p className="mt-1 text-[13px] font-semibold leading-none text-[#09090B]">Repair</p>
            </div>
          </div>

          <dl className="grid grid-cols-2 sm:grid-cols-4">
            {FIELDS.map(([label, value], index) => (
              <div
                key={label}
                className={cn(
                  "min-w-0 px-4 py-2.5",
                  index % 2 === 1 && "border-l border-line sm:border-l",
                  index > 0 && !(index % 2 === 1) && "sm:border-l sm:border-line",
                  index > 1 && "border-t border-line sm:border-t-0",
                )}
              >
                <dt className="text-[11.5px] text-muted">{label}</dt>
                <dd className="mt-0.5 truncate text-[13px] text-ink">{value}</dd>
              </div>
            ))}
          </dl>

          <div className="border-t border-line px-4 py-3" aria-label="Current stage: repair">
            <div className="grid grid-cols-4 gap-1.5">
              {STAGES.map((stage, index) => (
                <div key={stage} className="min-w-0">
                  <span
                    className={cn(
                      "block h-[3px]",
                      index < CURRENT ? "bg-ink" : index === CURRENT ? "bg-accent" : "bg-line",
                    )}
                  />
                  <span
                    className={cn(
                      "mt-1.5 block truncate text-[11.5px]",
                      index === CURRENT
                        ? "font-medium text-ink"
                        : index < CURRENT
                          ? "text-ink"
                          : "text-muted",
                    )}
                  >
                    {stage}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-line bg-paper px-4 py-2.5">
            <p className="text-[11.5px] leading-5 text-muted">
              Customer tracking · no account needed · code printed on the receipt
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function AuthShell({ children }: { children: ReactNode }) {
  return (
    <main className="min-h-[100dvh] bg-paper">
      <div className="mx-auto flex min-h-[100dvh] w-full max-w-[1440px] flex-col">
        <header className="flex h-[68px] shrink-0 items-center justify-between border-b border-line px-5 sm:px-8 lg:px-12">
          <Logo />
          <div className="flex items-center gap-5 text-[12.5px] text-muted">
            <Link href="/status" className="hidden transition-colors hover:text-ink sm:block">
              System status
            </Link>
            <Link href="/track" className="transition-colors hover:text-ink">
              Track a repair
            </Link>
          </div>
        </header>

        <div className="grid flex-1 items-start lg:grid-cols-[1.08fr_0.92fr] lg:items-stretch">
          <section className="flex flex-col justify-between px-5 py-9 sm:px-8 lg:px-12 lg:py-12 xl:px-14">
            <div>
              <h1 className="display reveal max-w-[13ch] text-[clamp(3rem,6vw,5.4rem)] font-semibold leading-[0.85] tracking-[-0.06em] text-ink">
                Every repair.
                <br />
                One counter.
              </h1>
              <p className="reveal reveal-delay-1 mt-5 max-w-[42ch] text-[14px] leading-6 text-muted">
                Counter keeps intake, parts, invoices and customer updates in one working system.
                The queue and the shelf read the same numbers.
              </p>

              <Docket className="reveal reveal-delay-2 mt-9 max-w-[560px]" />
            </div>

            <ul className="mt-12 hidden border-t border-white/10 pt-4 lg:grid lg:grid-cols-3 lg:gap-7">
              {PROOF.map((item) => (
                <li key={item.title}>
                  <p className="text-[13px] font-medium text-ink">{item.title}</p>
                  <p className="mt-1 text-[12.5px] leading-5 text-muted">{item.note}</p>
                </li>
              ))}
            </ul>
          </section>

          <section className="flex flex-col border-t border-line bg-surface px-5 py-8 sm:px-8 lg:border-l lg:border-t-0 lg:px-12 xl:px-14">
            <div className="flex flex-1 items-center justify-center py-6 sm:py-10">{children}</div>

            <footer className="flex flex-wrap items-center justify-between gap-2 border-t border-line pt-4 text-[12px] text-muted">
              <p>Counter · Repair operations</p>
              <p>Staff accounts are invite-only</p>
            </footer>
          </section>
        </div>
      </div>
    </main>
  );
}

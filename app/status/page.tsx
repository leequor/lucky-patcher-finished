import type { Metadata } from "next";
import Link from "next/link";

import { StatusPanel } from "@/components/landing/status-panel";
import { Logo } from "@/components/ui/logo";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "System status",
};

const RUNBOOK = [
  {
    title: "The app is unreachable",
    body: "Check that the deployment is live and that /api/health returns 200, then reload this page.",
  },
  {
    title: "Supabase is unavailable",
    body: "Confirm the project URL and anon key on the deployment, then run the check again.",
  },
  {
    title: "Before service",
    body: "Open this page on the front-desk machine so both checks are warm before customers arrive.",
  },
];

export default function StatusPage() {
  return (
    <main className="flex min-h-[100dvh] flex-col bg-paper">
      <header className="border-b border-line">
        <div className="mx-auto flex h-16 max-w-canvas items-center justify-between px-5 sm:px-8">
          <Logo />
          <Link
            href="/"
            className="inline-flex h-[34px] items-center border border-line px-3 text-[12.5px] text-muted transition-colors hover:border-ink hover:text-ink"
          >
            Back to desk
          </Link>
        </div>
      </header>

      <div className="mx-auto w-full max-w-canvas flex-1 px-5 pb-16 pt-8 sm:px-8 sm:pt-12">
        <div className="grid items-start gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14">
          <div className="reveal">
            <h1 className="display text-[clamp(2.6rem,4.8vw,4.2rem)] font-semibold leading-[0.88] tracking-[-0.055em] text-ink">
              System
              <br />
              status.
            </h1>
            <p className="mt-5 max-w-[46ch] text-[14px] leading-6 text-muted">
              Checks the Next.js app and the configured Supabase project. Run this before service
              so the environment is known.
            </p>
            <div className="mt-8 border-t border-white/10 pt-5">
              <StatusPanel />
            </div>
          </div>

          <aside className="reveal reveal-delay-1 lg:border-l lg:border-line lg:pl-10">
            <div className="border-t border-white/10 pt-4">
              <h2 className="display text-[19px] font-semibold tracking-[-0.04em] text-ink">
                If a check fails
              </h2>
              <p className="mt-1.5 max-w-[38ch] text-[12.5px] leading-5 text-muted">
                Work top to bottom. Each entry names the one thing to confirm.
              </p>
            </div>

            <div>
              {RUNBOOK.map((item) => (
                <div key={item.title} className="border-b border-line py-4">
                  <p className="text-[13px] font-medium text-ink">{item.title}</p>
                  <p className="mt-1 max-w-[44ch] text-[12.5px] leading-5 text-muted">
                    {item.body}
                  </p>
                </div>
              ))}
            </div>

            <p className="mt-4 text-[12px] leading-5 text-muted">
              A failed row names the reason. Both endpoints run again on reload.
            </p>
          </aside>
        </div>
        <section className="reveal reveal-delay-2 mt-12 border-t border-white/10 pt-5">
          <h2 className="display text-[19px] font-semibold tracking-[-0.04em] text-ink">
            What the rows mean
          </h2>
          <p className="mt-1.5 max-w-[56ch] text-[12.5px] leading-5 text-muted">
            Both checks report one of four states. Only the last two need a person.
          </p>
          <dl className="mt-5 grid border-y border-white/10 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                label: "Checking",
                tone: "bg-wash text-muted",
                dot: "bg-steel",
                body: "The request is in flight. Rows settle in under a second once the deployment is warm.",
              },
              {
                label: "Ready",
                tone: "bg-positive-soft text-positive-ink",
                dot: "bg-positive",
                body: "The endpoint answered. The row names the service and the latency it measured.",
              },
              {
                label: "Warning",
                tone: "bg-warn-soft text-warn",
                dot: "bg-warn",
                body: "Reachable but unconfigured. Check the Supabase URL and anon key on the deployment.",
              },
              {
                label: "Down",
                tone: "bg-negative-soft text-negative-ink",
                dot: "bg-negative",
                body: "No answer. Work the runbook above, then reload this page to run both checks again.",
              },
            ].map((state) => (
              <div key={state.label} className="border-t border-white/10 px-4 py-4 sm:border-l sm:border-t-0 sm:first:border-l-0">
                <span className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
                  <span className={cn("h-1.5 w-1.5 shrink-0 rounded-full", state.dot)} aria-hidden="true" />
                  {state.label}
                </span>
                <p className="mt-2.5 text-[12.5px] leading-5 text-muted">{state.body}</p>
              </div>
            ))}
          </dl>
        </section>
      </div>

      <footer className="border-t border-line">
        <div className="mx-auto flex w-full max-w-canvas flex-wrap items-center justify-between gap-2 px-5 py-4 text-[12px] text-muted sm:px-8">
          <p>Counter · Repair operations</p>
          <p>Health checks run on demand and are never cached.</p>
        </div>
      </footer>
    </main>
  );
}

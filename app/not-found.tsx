import Link from "next/link";
import type { Metadata } from "next";

import { RepairBench } from "@/components/patchwork/repair-bench";
import { Logo } from "@/components/ui/logo";

export const metadata: Metadata = {
  title: "Page not found",
};

export default function NotFound() {
  return (
    <main className="min-h-[100dvh] bg-paper px-5 py-5 sm:px-8">
      <div className="mx-auto flex min-h-[calc(100dvh-2.5rem)] w-full max-w-canvas flex-col">
        <header className="flex h-12 items-center justify-between border-b border-white/10">
          <Logo />
          <Link href="/track" className="text-[12.5px] text-muted hover:text-ink">
            Track a repair
          </Link>
        </header>

        <div className="grid flex-1 items-center gap-8 py-12 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="text-[12px] text-muted">404</p>
            <h1 className="display mt-2 text-[clamp(2.6rem,5vw,4.4rem)] font-semibold leading-[0.88] tracking-[-0.06em] text-ink">
              Off the
              <br />
              bench.
            </h1>
            <p className="mt-5 max-w-[40ch] text-[13px] leading-6 text-muted">
              The link may be old, or the page moved. Head back to the desk and pick up from the
              queue.
            </p>
            <div className="mt-7">
              <Link
                href="/"
                className="inline-flex h-11 items-center justify-center bg-accent px-5 text-[13px] font-semibold text-[#09090B] transition-colors hover:bg-[#FF7F4D]"
              >
                Back to the desk
              </Link>
            </div>
          </div>

          <RepairBench compact className="min-h-[280px]" />
        </div>

        <p className="border-t border-line pt-3 text-[12px] text-muted">
          Counter · Repair operations
        </p>
      </div>
    </main>
  );
}

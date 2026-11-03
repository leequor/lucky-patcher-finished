import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type AlertTone = "error" | "success" | "info";

const TONES: Record<AlertTone, string> = {
  error: "border-l-negative text-negative-ink",
  success: "border-l-positive text-positive-ink",
  info: "border-l-accent text-ink",
};

export function Alert({
  tone = "info",
  children,
  className,
}: {
  tone?: AlertTone;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      role={tone === "error" ? "alert" : "status"}
      className={cn(
        "border-l-2 py-1 pl-3 text-[13px] leading-5",
        TONES[tone],
        className,
      )}
    >
      {children}
    </div>
  );
}

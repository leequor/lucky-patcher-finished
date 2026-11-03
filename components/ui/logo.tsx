import Link from "next/link";

import { APP_NAME } from "@/lib/config";
import { cn } from "@/lib/utils";

function CounterMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={cn("h-[22px] w-[22px]", className)}
      fill="none"
    >
      <rect x="1" y="17" width="22" height="4" fill="currentColor" />
      <rect x="4" y="4" width="8" height="10" fill="currentColor" />
      <rect x="15" y="8" width="6" height="6" fill="#FF6B35" />
    </svg>
  );
}

export function Logo({
  className,
  href = "/",
  markOnly = false,
  inverse = false,
}: {
  className?: string;
  href?: string;
  markOnly?: boolean;
  inverse?: boolean;
}) {
  const content = (
    <>
      <span className={cn("shrink-0", inverse ? "text-paper" : "text-ink")}>
        <CounterMark />
      </span>
      {!markOnly ? (
        <span
          className={cn(
            "display text-[19px] font-bold leading-none tracking-[-0.045em]",
            inverse ? "text-paper" : "text-ink",
          )}
        >
          {APP_NAME}
        </span>
      ) : null}
    </>
  );

  if (!href) {
    return <div className={cn("flex items-center gap-2", className)}>{content}</div>;
  }

  return (
    <Link
      href={href}
      className={cn("flex items-center gap-2", className)}
      aria-label={`${APP_NAME} home`}
    >
      {content}
    </Link>
  );
}

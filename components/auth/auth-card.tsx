import type { ReactNode } from "react";

export function AuthCard({
  title,
  description,
  children,
  footer,
}: {
  title: string;
  description: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <div className="w-full max-w-form">
      <div className="border-t border-white/10 pt-5">
        <p className="text-[12px] text-muted">Staff access</p>
        <h1 className="display mt-2 text-[26px] font-semibold leading-[1.02] tracking-[-0.045em] text-ink">
          {title}
        </h1>
        <p className="mt-2 text-[13px] leading-5 text-muted">{description}</p>

        <div className="mt-6">{children}</div>

        {footer ? (
          <div className="mt-6 border-t border-line pt-4 text-[12.5px] leading-5 text-muted">
            {footer}
          </div>
        ) : null}
      </div>
    </div>
  );
}

import type { ButtonHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost" | "signal";
type ButtonSize = "sm" | "md" | "lg";

const VARIANTS: Record<ButtonVariant, string> = {
  primary: "bg-accent text-[#09090B] hover:bg-[#FF7F4D] active:bg-[#E85A28]",
  secondary:
    "border border-white/10 bg-transparent text-ink hover:border-white/25 hover:bg-white/5",
  ghost: "bg-transparent text-muted hover:bg-white/5 hover:text-ink",
  signal: "bg-accent text-[#09090B] hover:bg-[#FF7F4D] active:bg-[#E85A28]",
};

const SIZES: Record<ButtonSize, string> = {
  sm: "h-[30px] px-2.5 text-[12px]",
  md: "h-[34px] px-3.5 text-[13px]",
  lg: "h-11 px-4 text-[13px]",
};

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
};

export function Button({
  className,
  variant = "primary",
  size = "md",
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-none font-medium transition-colors duration-150 active:translate-y-px disabled:pointer-events-none disabled:opacity-40",
        VARIANTS[variant],
        SIZES[size],
        className,
      )}
      {...props}
    />
  );
}

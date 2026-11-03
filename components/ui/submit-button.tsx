"use client";

import { useFormStatus } from "react-dom";

import { cn } from "@/lib/utils";

import { Button } from "./button";

export function SubmitButton({
  children,
  pendingText = "Working...",
  className,
  size = "lg",
  variant,
}: {
  children: React.ReactNode;
  pendingText?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
  variant?: "primary" | "secondary" | "ghost" | "signal";
}) {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      size={size}
      variant={variant}
      className={cn("w-full", className)}
      disabled={pending}
      aria-live="polite"
    >
      {pending ? pendingText : children}
    </Button>
  );
}

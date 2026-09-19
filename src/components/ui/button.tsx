"use client";

import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "ghost" | "outline";

const variants: Record<Variant, string> = {
  primary:
    "bg-primary text-primary-foreground hover:brightness-110 shadow-[0_0_0_1px_rgba(212,160,23,0.35)]",
  ghost: "bg-transparent text-foreground hover:bg-muted",
  outline: "border border-border bg-transparent text-foreground hover:bg-muted",
};

export const Button = forwardRef<
  HTMLButtonElement,
  ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }
>(function Button({ className, variant = "primary", type = "button", ...props }, ref) {
  return (
    <button
      ref={ref}
      type={type}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition duration-150 ease-out disabled:opacity-50 disabled:pointer-events-none",
        variants[variant],
        className,
      )}
      {...props}
    />
  );
});

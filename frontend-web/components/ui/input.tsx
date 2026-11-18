import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, leftIcon, rightIcon, error, className, ...props }, ref) => {
    return (
      <div className="flex w-full flex-col gap-1.5">
        {label && (
          <label className="text-xs font-bold uppercase tracking-[.14em] text-white/70">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {leftIcon && (
            <div className="pointer-events-none absolute left-3.5 text-white/40">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            className={cn(
              "w-full rounded-xl border bg-white/[.04] px-3.5 py-2.5 text-sm text-white placeholder:text-white/35 transition focus:outline-none focus:ring-2",
              error
                ? "border-rose-500/70 focus:border-rose-400 focus:ring-rose-400/20"
                : "border-white/10 focus:border-cyan-300/70 focus:ring-cyan-300/20",
              leftIcon && "pl-10",
              rightIcon && "pr-10",
              className
            )}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3.5 text-white/45">{rightIcon}</div>
          )}
        </div>
        {error && <span className="text-xs text-rose-400">{error}</span>}
      </div>
    );
  }
);

Input.displayName = "Input";

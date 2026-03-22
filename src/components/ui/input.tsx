import * as React from "react";
import { cn } from "@/lib/cn";

const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          "flex h-11 w-full rounded-2xl border border-white/20 bg-white/5 px-4 text-sm text-zinc-50 shadow-inner shadow-black/30 outline-none transition focus-visible:border-cyan-300 focus-visible:ring-2 focus-visible:ring-cyan-300/40",
          className,
        )}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export { Input };

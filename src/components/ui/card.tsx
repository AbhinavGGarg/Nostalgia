import { cn } from "@/lib/cn";
import * as React from "react";

export const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "rounded-3xl border border-white/10 bg-[radial-gradient(circle_at_20%_20%,rgba(34,211,238,0.2),transparent_45%),rgba(5,8,16,0.75)] p-6 backdrop-blur-xl",
        className,
      )}
      {...props}
    />
  ),
);
Card.displayName = "Card";

import * as React from "react";
import { cn } from "@/lib/cn";

const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={cn(
          "min-h-[130px] w-full rounded-2xl border border-white/20 bg-black/30 px-4 py-3 text-sm text-zinc-50 shadow-inner shadow-black/30 outline-none transition placeholder:text-zinc-500 focus-visible:border-cyan-300 focus-visible:ring-2 focus-visible:ring-cyan-300/40",
          className,
        )}
        {...props}
      />
    );
  },
);
Textarea.displayName = "Textarea";

export { Textarea };

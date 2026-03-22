import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";
import { Slot } from "@radix-ui/react-slot";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-full text-sm font-semibold tracking-wide transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-black disabled:pointer-events-none disabled:opacity-40",
  {
    variants: {
      variant: {
        primary:
          "bg-[var(--drop-accent)] px-6 py-3 text-black shadow-[0_0_30px_rgba(34,211,238,0.5)] hover:translate-y-[-1px] hover:bg-[var(--drop-accent-2)] focus-visible:ring-cyan-300",
        ghost:
          "border border-white/20 bg-white/5 px-5 py-3 text-white hover:bg-white/12 focus-visible:ring-white/80",
        destructive:
          "bg-rose-500 px-6 py-3 text-white hover:bg-rose-400 focus-visible:ring-rose-300",
      },
      size: {
        sm: "h-9 px-4 text-xs",
        md: "h-11 px-5",
        lg: "h-14 px-8 text-base",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp ref={ref} className={cn(buttonVariants({ variant, size }), className)} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };

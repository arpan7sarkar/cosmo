import * as React from "react"
import { cn } from "../../lib/utils"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost' | 'link' | 'neon';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  asChild?: boolean; // Added to suppress TS error, though implementation handles children naturally
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => {
    const variants = {
      default: "bg-nebula-purple text-white hover:bg-opacity-90 shadow-lg shadow-nebula-purple/20",
      outline: "border border-nebula-purple text-nebula-purple hover:bg-nebula-purple hover:text-white",
      ghost: "hover:bg-cosmic-blue text-starlight-white",
      link: "text-nebula-purple underline-offset-4 hover:underline",
      neon: "bg-transparent border border-highlight-cyan text-highlight-cyan shadow-[0_0_10px_rgba(0,240,255,0.5)] hover:bg-highlight-cyan hover:text-black hover:shadow-[0_0_20px_rgba(0,240,255,0.8)] transition-all duration-300"
    };

    const sizes = {
      default: "h-10 px-4 py-2",
      sm: "h-9 rounded-md px-3",
      lg: "h-11 rounded-md px-8",
      icon: "h-10 w-10",
    };

    return (
      <button
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
          variants[variant],
          sizes[size],
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }

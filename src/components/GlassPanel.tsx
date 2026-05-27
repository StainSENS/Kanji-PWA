import { cn } from "@/lib/utils";

export function GlassPanel({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "backdrop-blur-md bg-white/20 border border-white/30 shadow-xl rounded-2xl",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}


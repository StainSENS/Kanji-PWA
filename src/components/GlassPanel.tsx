import { cn } from "@/lib/utils";

export function GlassPanel({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        [
          "backdrop-blur-md shadow-xl rounded-2xl",
          // Soft (default)
          "bg-white/20 border border-white/30",
          // Dark
          "group-data-[theme=dark]:bg-white/12 group-data-[theme=dark]:border-white/20",
        ].join(" "),
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}


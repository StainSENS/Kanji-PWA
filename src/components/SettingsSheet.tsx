"use client";

import { AnimatePresence, motion } from "framer-motion";
import { GlassPanel } from "@/components/GlassPanel";

export type ThemeVariant = "soft" | "dark";

export function SettingsSheet({
  open,
  onClose,
  theme,
  onThemeChange,
}: {
  open: boolean;
  onClose: () => void;
  theme: ThemeVariant;
  onThemeChange: (t: ThemeVariant) => void;
}) {
  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <button
            type="button"
            aria-label="Close settings"
            onClick={onClose}
            className="absolute inset-0 bg-black/35"
          />

          <motion.div
            className="absolute left-0 right-0 bottom-0 p-4 pb-[calc(env(safe-area-inset-bottom)+1rem)]"
            initial={{ y: 24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 24, opacity: 0 }}
            transition={{ type: "spring", stiffness: 520, damping: 44, mass: 0.9 }}
          >
            <GlassPanel className="p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="text-sm text-white/80">Settings</div>
                  <div className="text-base font-semibold tracking-tight">
                    Theme
                  </div>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="h-10 px-3 rounded-xl font-semibold border shadow-sm transition active:scale-[0.99]
                  bg-white/10 border-white/15 hover:bg-white/18
                  group-data-[theme=dark]:bg-white/10 group-data-[theme=dark]:border-white/15 group-data-[theme=dark]:hover:bg-white/18"
                >
                  Done
                </button>
              </div>

              <div className="mt-4 inline-flex w-full rounded-2xl bg-white/15 border border-white/20 p-1">
                {(
                  [
                    { id: "soft", label: "Soft" },
                    { id: "dark", label: "Dark" },
                  ] as const
                ).map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => onThemeChange(t.id)}
                    className={[
                      "h-11 flex-1 rounded-xl font-semibold transition text-sm",
                      theme === t.id ? "bg-white/30" : "hover:bg-white/15",
                    ].join(" ")}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </GlassPanel>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}


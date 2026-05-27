"use client";

import { motion } from "framer-motion";
import { GlassPanel } from "@/components/GlassPanel";

export function FlipFlashcard({
  kanji,
  meaning,
  flipped,
  onToggle,
}: {
  kanji: string;
  meaning: string;
  flipped: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="w-full" style={{ perspective: 1400 }}>
      <motion.button
        type="button"
        onClick={onToggle}
        className="relative w-full text-left"
        style={{
          transformStyle: "preserve-3d",
        }}
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{
          type: "spring",
          stiffness: 520,
          damping: 44,
          mass: 0.9,
        }}
      >
        <GlassPanel
          className="relative w-full min-h-[240px] p-6 select-none"
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
          }}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="text-xs font-semibold tracking-wide text-white/80 group-data-[theme=light]:text-slate-600">
              FRONT
            </div>
          </div>
          <div className="mt-10 text-center">
            <div className="text-6xl font-semibold tracking-tight">{kanji}</div>
            <div className="mt-4 text-sm text-white/75 group-data-[theme=light]:text-slate-600">
              Tap to flip
            </div>
          </div>
        </GlassPanel>

        <GlassPanel
          className="absolute inset-0 w-full min-h-[240px] p-6"
          style={{
            transform: "rotateY(180deg)",
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
          }}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="text-xs font-semibold tracking-wide text-white/80 group-data-[theme=light]:text-slate-600">
              BACK
            </div>
            <div className="text-xs text-white/70 group-data-[theme=light]:text-slate-500">
              Tap to flip
            </div>
          </div>
          <div className="mt-10 text-center">
            <div className="text-sm font-semibold text-white/70 group-data-[theme=light]:text-slate-600">
              Meaning
            </div>
            <div className="mt-2 text-2xl font-semibold tracking-tight">
              {meaning}
            </div>
          </div>
        </GlassPanel>
      </motion.button>
    </div>
  );
}


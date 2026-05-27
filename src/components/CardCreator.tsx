"use client";

import { useMemo, useState } from "react";
import type { Flashcard } from "@/lib/deckTypes";
import { GlassPanel } from "@/components/GlassPanel";

export function CardCreator({ onAdd }: { onAdd: (card: Flashcard) => void }) {
  const [kanji, setKanji] = useState("");
  const [meaning, setMeaning] = useState("");

  const canSubmit = useMemo(() => {
    return kanji.trim().length > 0 && meaning.trim().length > 0;
  }, [kanji, meaning]);

  function add() {
    if (!canSubmit) return;
    const now = Date.now();
    onAdd({
      id: `${now}-${Math.random().toString(16).slice(2)}`,
      kanji: kanji.trim(),
      meaning: meaning.trim(),
      createdAt: now,
    });
    setKanji("");
    setMeaning("");
  }

  return (
    <GlassPanel className="p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="text-sm/5 text-white/80">
            Create card
          </div>
          <div className="text-base font-semibold tracking-tight">Add to deck</div>
        </div>
      </div>

      <div className="mt-4 grid gap-3">
        <label className="grid gap-1.5">
          <div className="text-sm text-white/85">
            Kanji
          </div>
          <textarea
            value={kanji}
            onChange={(e) => setKanji(e.target.value)}
            rows={2}
            inputMode="text"
            placeholder="例: 食べる / 猫"
            className="w-full resize-none rounded-xl px-3 py-2 text-lg leading-7 outline-none transition
            bg-white/15 border border-white/25 placeholder:text-white/45 focus:border-white/45 focus:bg-white/20
            group-data-[theme=dark]:bg-white/12 group-data-[theme=dark]:border-white/20 group-data-[theme=dark]:placeholder:text-white/40 group-data-[theme=dark]:focus:bg-white/16"
          />
        </label>

        <label className="grid gap-1.5">
          <div className="text-sm text-white/85">
            English meaning
          </div>
          <input
            value={meaning}
            onChange={(e) => setMeaning(e.target.value)}
            inputMode="text"
            placeholder="e.g. to eat / cat"
            className="w-full rounded-xl px-3 py-2 text-base outline-none transition
            bg-white/15 border border-white/25 placeholder:text-white/45 focus:border-white/45 focus:bg-white/20
            group-data-[theme=dark]:bg-white/12 group-data-[theme=dark]:border-white/20 group-data-[theme=dark]:placeholder:text-white/40 group-data-[theme=dark]:focus:bg-white/16"
          />
        </label>

        <button
          type="button"
          onClick={add}
          disabled={!canSubmit}
          className={[
            "mt-1 h-12 rounded-xl font-semibold tracking-tight transition",
            "border shadow-lg active:scale-[0.99]",
            "bg-white/25 border-white/30 hover:bg-white/35",
            "group-data-[theme=dark]:bg-white/14 group-data-[theme=dark]:border-white/20 group-data-[theme=dark]:hover:bg-white/18",
            canSubmit ? "" : "opacity-50 cursor-not-allowed hover:bg-white/25",
          ].join(" ")}
        >
          Add to Deck
        </button>
      </div>
    </GlassPanel>
  );
}


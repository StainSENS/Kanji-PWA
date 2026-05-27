"use client";

import { useMemo, useState } from "react";
import type { CardType, Flashcard } from "@/lib/deckTypes";
import { GlassPanel } from "@/components/GlassPanel";

export function CardCreator({ onAdd }: { onAdd: (card: Flashcard) => void }) {
  const [kanji, setKanji] = useState("");
  const [type, setType] = useState<CardType>("Verb");
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
      type,
      meaning: meaning.trim(),
      createdAt: now,
    });
    setKanji("");
    setMeaning("");
    setType("Verb");
  }

  return (
    <GlassPanel className="p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="text-sm/5 text-white/80">Create card</div>
          <div className="text-base font-semibold tracking-tight">Add to deck</div>
        </div>
        <div className="inline-flex rounded-full bg-white/15 p-1 border border-white/20">
          {(["Verb", "Noun"] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setType(t)}
              className={[
                "px-3 py-1.5 text-sm font-semibold rounded-full transition",
                type === t ? "bg-white/35" : "hover:bg-white/15",
              ].join(" ")}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 grid gap-3">
        <label className="grid gap-1.5">
          <div className="text-sm text-white/85">Kanji</div>
          <textarea
            value={kanji}
            onChange={(e) => setKanji(e.target.value)}
            rows={2}
            inputMode="text"
            placeholder="例: 食べる / 猫"
            className="w-full resize-none rounded-xl bg-white/15 border border-white/25 px-3 py-2 text-lg leading-7 placeholder:text-white/45 outline-none focus:border-white/45 focus:bg-white/20"
          />
        </label>

        <label className="grid gap-1.5">
          <div className="text-sm text-white/85">English meaning</div>
          <input
            value={meaning}
            onChange={(e) => setMeaning(e.target.value)}
            inputMode="text"
            placeholder="e.g. to eat / cat"
            className="w-full rounded-xl bg-white/15 border border-white/25 px-3 py-2 text-base placeholder:text-white/45 outline-none focus:border-white/45 focus:bg-white/20"
          />
        </label>

        <button
          type="button"
          onClick={add}
          disabled={!canSubmit}
          className={[
            "mt-1 h-12 rounded-xl font-semibold tracking-tight transition",
            "bg-white/25 border border-white/30 shadow-lg active:scale-[0.99]",
            canSubmit ? "hover:bg-white/35" : "opacity-50 cursor-not-allowed",
          ].join(" ")}
        >
          Add to Deck
        </button>
      </div>
    </GlassPanel>
  );
}


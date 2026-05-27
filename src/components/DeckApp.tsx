"use client";

import { useEffect, useMemo, useState } from "react";
import type { Flashcard } from "@/lib/deckTypes";
import { loadDeck, saveDeck } from "@/lib/deckStorage";
import { CardCreator } from "@/components/CardCreator";
import { FlashcardReviewer } from "@/components/FlashcardReviewer";
import { GlassPanel } from "@/components/GlassPanel";

type Mode = "Create" | "Review";

export function DeckApp() {
  const [deck, setDeck] = useState<Flashcard[]>([]);
  const [mode, setMode] = useState<Mode>("Review");

  useEffect(() => {
    setDeck(loadDeck());
  }, []);

  useEffect(() => {
    saveDeck(deck);
  }, [deck]);

  const sortedDeck = useMemo(() => {
    return [...deck].sort((a, b) => b.createdAt - a.createdAt);
  }, [deck]);

  return (
    <div className="min-h-dvh flex flex-col items-center px-4 py-6 pt-[calc(env(safe-area-inset-top)+1.5rem)] pb-[calc(env(safe-area-inset-bottom)+1.5rem)]">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-white/80">Kanji Flashcards</div>
            <div className="text-2xl font-semibold tracking-tight">
              Kanji Deck
            </div>
          </div>
          <div className="text-right text-sm text-white/80">
            <div className="font-semibold text-white">{deck.length}</div>
            <div>cards</div>
          </div>
        </div>

        <div className="mt-4 inline-flex w-full rounded-2xl bg-white/15 border border-white/20 p-1">
          {(["Review", "Create"] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              className={[
                "h-11 flex-1 rounded-xl font-semibold transition",
                mode === m ? "bg-white/30" : "hover:bg-white/15",
              ].join(" ")}
            >
              {m}
            </button>
          ))}
        </div>

        <div className="mt-4">
          {mode === "Create" ? (
            <div className="grid gap-4">
              <CardCreator
                onAdd={(card) => setDeck((d) => [card, ...d])}
              />
              {sortedDeck.length > 0 ? (
                <GlassPanel className="p-4">
                  <div className="text-sm text-white/80">Deck preview</div>
                  <div className="mt-3 grid gap-2">
                    {sortedDeck.slice(0, 6).map((c) => (
                      <div
                        key={c.id}
                        className="flex items-center justify-between gap-3 rounded-xl bg-white/10 border border-white/15 px-3 py-2"
                      >
                        <div className="min-w-0">
                          <div className="truncate font-semibold">
                            {c.kanji}
                          </div>
                          <div className="truncate text-sm text-white/75">
                            {c.meaning}
                          </div>
                        </div>
                        <div className="shrink-0 rounded-full bg-white/15 border border-white/20 px-3 py-1 text-xs font-semibold">
                          {c.type}
                        </div>
                      </div>
                    ))}
                  </div>
                  {sortedDeck.length > 6 ? (
                    <div className="mt-3 text-xs text-white/70">
                      Showing latest 6 cards.
                    </div>
                  ) : null}
                </GlassPanel>
              ) : null}
            </div>
          ) : (
            <FlashcardReviewer deck={sortedDeck} />
          )}
        </div>

        <div className="mt-6 pb-6 text-center text-xs text-white/65">
          Tip: Add this to your home screen for a full-screen, app-like feel.
        </div>
      </div>
    </div>
  );
}


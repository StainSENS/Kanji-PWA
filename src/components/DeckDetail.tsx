"use client";

import { useMemo, useState } from "react";
import type { DeckFolder } from "@/lib/appState";
import { GlassPanel } from "@/components/GlassPanel";
import { CardCreator } from "@/components/CardCreator";

export function DeckDetail({
  deck,
  onBack,
  onAddCard,
  onRemoveCard,
  onClearDeck,
  onStartReview,
}: {
  deck: DeckFolder;
  onBack: () => void;
  onAddCard: Parameters<typeof CardCreator>[0]["onAdd"];
  onRemoveCard: (cardId: string) => void;
  onClearDeck: () => void;
  onStartReview: () => void;
}) {
  const [showCreate, setShowCreate] = useState(true);
  const sortedCards = useMemo(() => {
    return [...deck.cards].sort((a, b) => b.createdAt - a.createdAt);
  }, [deck.cards]);

  return (
    <div className="grid gap-4">
      <GlassPanel className="p-4">
        <div className="flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onBack}
            className="h-10 px-3 rounded-xl font-semibold border shadow-sm transition active:scale-[0.99]
            bg-white/10 border-white/15 hover:bg-white/18"
          >
            Back
          </button>
          <div className="min-w-0 text-center">
            <div className="truncate font-semibold">{deck.name}</div>
            <div className="text-xs text-white/75">{deck.cards.length} cards</div>
          </div>
          <button
            type="button"
            onClick={onStartReview}
            disabled={deck.cards.length === 0}
            className="h-10 px-3 rounded-xl font-semibold border shadow-sm transition active:scale-[0.99]
            bg-white/20 border-white/25 hover:bg-white/30 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Study
          </button>
        </div>
      </GlassPanel>

      <GlassPanel className="p-3">
        <button
          type="button"
          onClick={() => setShowCreate((v) => !v)}
          className="w-full flex items-center justify-between gap-3"
        >
          <div className="text-sm font-semibold">
            {showCreate ? "Hide" : "Show"} create card
          </div>
          <div className="text-xs text-white/75">Tap</div>
        </button>
      </GlassPanel>

      {showCreate ? <CardCreator onAdd={onAddCard} /> : null}

      <GlassPanel className="p-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="text-sm text-white/80">Cards</div>
            <div className="text-base font-semibold tracking-tight">
              In this deck
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              if (
                typeof window !== "undefined" &&
                window.confirm("Clear all cards in this deck?")
              ) {
                onClearDeck();
              }
            }}
            disabled={deck.cards.length === 0}
            className="h-10 px-3 rounded-xl font-semibold border shadow-sm transition active:scale-[0.99]
            bg-white/10 border-white/15 hover:bg-white/18 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Clear
          </button>
        </div>

        <div className="mt-3 max-h-[44dvh] overflow-y-auto pr-1 grid gap-2">
          {sortedCards.length === 0 ? (
            <div className="text-sm text-white/75 text-center py-6">
              No cards yet. Add one above.
            </div>
          ) : (
            sortedCards.map((c) => (
              <div
                key={c.id}
                className="flex items-center justify-between gap-3 rounded-xl px-3 py-2 bg-white/10 border border-white/15"
              >
                <div className="min-w-0">
                  <div className="truncate font-semibold">{c.kanji}</div>
                  <div className="truncate text-sm text-white/75">{c.meaning}</div>
                </div>
                <button
                  type="button"
                  onClick={() => onRemoveCard(c.id)}
                  className="shrink-0 h-9 w-9 rounded-xl font-semibold border shadow-sm transition active:scale-[0.99]
                  bg-white/10 border-white/15 hover:bg-white/18"
                >
                  ×
                </button>
              </div>
            ))
          )}
        </div>
      </GlassPanel>
    </div>
  );
}


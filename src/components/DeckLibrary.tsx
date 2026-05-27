"use client";

import type { DeckFolder } from "@/lib/appState";
import { GlassPanel } from "@/components/GlassPanel";

export function DeckLibrary({
  decks,
  activeDeckId,
  onOpenDeck,
  onNewDeck,
  onRenameDeck,
  onDeleteDeck,
}: {
  decks: DeckFolder[];
  activeDeckId: string;
  onOpenDeck: (id: string) => void;
  onNewDeck: () => void;
  onRenameDeck: (id: string) => void;
  onDeleteDeck: (id: string) => void;
}) {
  return (
    <div className="grid gap-4">
      <GlassPanel className="p-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="text-sm/5 text-white/80">Deck library</div>
            <div className="text-base font-semibold tracking-tight">
              Your folders
            </div>
          </div>
          <button
            type="button"
            onClick={onNewDeck}
            className="h-10 px-4 rounded-xl font-semibold border shadow-sm transition active:scale-[0.99]
            bg-white/10 border-white/15 hover:bg-white/18
            group-data-[theme=dark]:bg-white/10 group-data-[theme=dark]:border-white/15 group-data-[theme=dark]:hover:bg-white/18"
          >
            New
          </button>
        </div>
      </GlassPanel>

      <div className="grid gap-3">
        {decks.map((d) => (
          <GlassPanel key={d.id} className="p-3">
            <button
              type="button"
              onClick={() => onOpenDeck(d.id)}
              className="w-full text-left"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="truncate font-semibold">{d.name}</div>
                  <div className="text-sm text-white/75">
                    {d.cards.length} cards
                    {d.id === activeDeckId ? " • Active" : ""}
                  </div>
                </div>
                <div className="shrink-0 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      onRenameDeck(d.id);
                    }}
                    className="h-9 px-3 rounded-xl font-semibold border shadow-sm transition active:scale-[0.99]
                    bg-white/10 border-white/15 hover:bg-white/18"
                  >
                    Rename
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      onDeleteDeck(d.id);
                    }}
                    disabled={decks.length <= 1}
                    className="h-9 px-3 rounded-xl font-semibold border shadow-sm transition active:scale-[0.99]
                    bg-white/10 border-white/15 hover:bg-white/18 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </button>
          </GlassPanel>
        ))}
      </div>
    </div>
  );
}


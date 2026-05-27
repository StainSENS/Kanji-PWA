"use client";

import { useEffect, useMemo, useState } from "react";
import type { Flashcard } from "@/lib/deckTypes";
import { shuffle } from "@/lib/shuffle";
import { GlassPanel } from "@/components/GlassPanel";
import { FlipFlashcard } from "@/components/FlipFlashcard";

function insertBack(queueRest: string[], id: string, positions: number) {
  const idx = Math.min(positions, queueRest.length);
  const next = [...queueRest];
  next.splice(idx, 0, id);
  return next;
}

export function FlashcardReviewer({ deck }: { deck: Flashcard[] }) {
  const deckById = useMemo(() => {
    return new Map(deck.map((c) => [c.id, c]));
  }, [deck]);

  const [queue, setQueue] = useState<string[]>([]);
  const [sessionSeed, setSessionSeed] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const active = queue.length > 0 ? deckById.get(queue[0]) : undefined;

  useEffect(() => {
    // If deck changed (deleted/added), prune queue to valid ids.
    setQueue((q) => q.filter((id) => deckById.has(id)));
  }, [deckById]);

  function startSession() {
    const ids = shuffle(deck.map((c) => c.id));
    setQueue(ids);
    setFlipped(false);
    setSessionSeed((s) => s + 1);
  }

  function rate(positions: number) {
    if (!active) return;
    const [, ...rest] = queue;
    const next = insertBack(rest, active.id, positions);
    setQueue(next);
    setFlipped(false);
  }

  const canStudy = deck.length > 0;
  const queueCount = queue.length;

  return (
    <div className="grid gap-4">
      <GlassPanel className="p-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="text-sm/5 text-white/80">
              Review
            </div>
            <div className="text-base font-semibold tracking-tight">
              Spaced repetition queue
            </div>
          </div>
          <button
            type="button"
            onClick={startSession}
            disabled={!canStudy}
            className={[
              "h-10 px-4 rounded-xl font-semibold transition",
              "shadow-lg active:scale-[0.99] border",
              "bg-white/20 border-white/30 hover:bg-white/30",
              "group-data-[theme=dark]:bg-white/12 group-data-[theme=dark]:border-white/20 group-data-[theme=dark]:hover:bg-white/18",
              canStudy ? "" : "opacity-50 cursor-not-allowed hover:bg-white/20",
            ].join(" ")}
          >
            {queueCount > 0 ? "Reshuffle" : "Start"}
          </button>
        </div>

        <div className="mt-3 flex items-center justify-between gap-3 text-sm text-white/80">
          <div>
            Deck:{" "}
            <span className="font-semibold text-white">{deck.length}</span>
          </div>
          <div>
            Queue:{" "}
            <span className="font-semibold text-white">
              {queueCount > 0 ? queueCount : "—"}
            </span>
          </div>
        </div>
      </GlassPanel>

      <div key={sessionSeed} className="grid gap-3">
        {active ? (
          <>
            <FlipFlashcard
              kanji={active.kanji}
              meaning={active.meaning}
              flipped={flipped}
              onToggle={() => setFlipped((f) => !f)}
            />

            <div className="min-h-[56px]">
              {flipped ? (
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => rate(4)}
                    className="h-12 rounded-xl font-semibold border shadow-sm transition active:scale-[0.99]
                    bg-white/20 border-white/30 hover:bg-white/28
                    group-data-[theme=dark]:bg-white/12 group-data-[theme=dark]:border-white/20 group-data-[theme=dark]:hover:bg-white/18"
                  >
                    Hard
                  </button>
                  <button
                    type="button"
                    onClick={() => rate(7)}
                    className="h-12 rounded-xl font-semibold border shadow-sm transition active:scale-[0.99]
                    bg-white/30 border-white/35 hover:bg-white/40
                    group-data-[theme=dark]:bg-white/18 group-data-[theme=dark]:border-white/22 group-data-[theme=dark]:hover:bg-white/24"
                  >
                    Easy
                  </button>
                </div>
              ) : (
                <div className="text-center text-sm text-white/75">
                  Flip the card to rate it.
                </div>
              )}
            </div>
          </>
        ) : (
          <GlassPanel className="p-6 text-center">
            <div className="text-lg font-semibold">No active session</div>
            <div className="mt-1 text-sm text-white/80">
              {deck.length === 0
                ? "Add a card to start studying."
                : "Tap Start to shuffle the deck into a fresh queue."}
            </div>
          </GlassPanel>
        )}
      </div>
    </div>
  );
}


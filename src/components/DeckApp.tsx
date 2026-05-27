"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import type { Flashcard } from "@/lib/deckTypes";
import type { DeckFolder } from "@/lib/appState";
import { loadAppState, saveAppState } from "@/lib/appState";
import { FlashcardReviewer } from "@/components/FlashcardReviewer";
import { GlassPanel } from "@/components/GlassPanel";
import { DeckLibrary } from "@/components/DeckLibrary";
import { DeckDetail } from "@/components/DeckDetail";
import { SettingsSheet, type ThemeVariant } from "@/components/SettingsSheet";
import { GearIcon } from "@/components/icons";

type Screen = "library" | "deck" | "review";

const THEME_KEY = "kanjiDeckThemeV1";

function loadTheme(): ThemeVariant {
  if (typeof window === "undefined") return "soft";
  const t = window.localStorage.getItem(THEME_KEY);
  if (t === "dark" || t === "soft") return t;
  // Back-compat: remove "light" variant but keep users on soft.
  if (t === "light") return "soft";
  return "soft";
}

function saveTheme(theme: ThemeVariant) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(THEME_KEY, theme);
}

export function DeckApp() {
  const [decks, setDecks] = useState<DeckFolder[]>([]);
  const [activeDeckId, setActiveDeckId] = useState("");
  const [screen, setScreen] = useState<Screen>("library");
  const [theme, setTheme] = useState<ThemeVariant>("soft");
  const [settingsOpen, setSettingsOpen] = useState(false);

  useEffect(() => {
    const state = loadAppState();
    setDecks(state.decks);
    setActiveDeckId(state.activeDeckId);
    setTheme(loadTheme());
  }, []);

  useEffect(() => {
    if (!activeDeckId) return;
    saveAppState({ version: 1, activeDeckId, decks });
  }, [decks, activeDeckId]);

  useEffect(() => {
    saveTheme(theme);
  }, [theme]);

  const activeDeck = useMemo(() => {
    return decks.find((d) => d.id === activeDeckId) ?? decks[0];
  }, [decks, activeDeckId]);

  const sortedCards = useMemo(() => {
    const cards = activeDeck?.cards ?? [];
    return [...cards].sort((a, b) => b.createdAt - a.createdAt);
  }, [activeDeck]);

  const textClass = "text-white";

  function newDeck() {
    const name =
      typeof window !== "undefined"
        ? window.prompt("New deck name?", "New Deck")
        : null;
    if (!name) return;
    const now = Date.now();
    const id = `${now}-${Math.random().toString(16).slice(2)}`;
    const next: DeckFolder = {
      id,
      name: name.trim() || "New Deck",
      cards: [],
      createdAt: now,
      updatedAt: now,
    };
    setDecks((d) => [next, ...d]);
    setActiveDeckId(id);
    setScreen("deck");
  }

  function renameDeck(id: string) {
    const deck = decks.find((d) => d.id === id);
    if (!deck) return;
    const name =
      typeof window !== "undefined"
        ? window.prompt("Rename deck to…", deck.name)
        : null;
    if (!name) return;
    setDecks((ds) =>
      ds.map((d) =>
        d.id === id ? { ...d, name: name.trim() || d.name, updatedAt: Date.now() } : d,
      ),
    );
  }

  function deleteDeck(id: string) {
    const deck = decks.find((d) => d.id === id);
    if (!deck) return;
    if (decks.length <= 1) return;
    if (
      typeof window !== "undefined" &&
      window.confirm(`Delete deck "${deck.name}"?`)
    ) {
      setDecks((ds) => ds.filter((d) => d.id !== id));
      setActiveDeckId((cur) => {
        if (cur !== id) return cur;
        const remaining = decks.filter((d) => d.id !== id);
        return remaining[0]?.id ?? "";
      });
      setScreen("library");
    }
  }

  return (
    <div
      className={[
        "group relative overflow-hidden min-h-dvh flex flex-col items-center px-4 py-6",
        "pt-[calc(env(safe-area-inset-top)+1.5rem)] pb-[calc(env(safe-area-inset-bottom)+1.5rem)]",
        textClass,
      ].join(" ")}
      data-theme={theme}
    >
      {/* Animated theme backdrops (visible change) */}
      <div className="fixed inset-0 -z-10">
        <motion.div
          className="absolute inset-0 bg-[#2aa9a8] bg-[radial-gradient(1200px_circle_at_20%_10%,rgba(34,211,238,0.35),transparent_55%),radial-gradient(900px_circle_at_80%_20%,rgba(45,212,191,0.30),transparent_50%),linear-gradient(160deg,rgba(20,184,166,0.28),rgba(56,189,248,0.22))]"
          animate={{ opacity: theme === "soft" ? 1 : 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
        />
        <motion.div
          className="absolute inset-0 bg-slate-950 bg-[radial-gradient(1200px_circle_at_20%_10%,rgba(56,189,248,0.18),transparent_60%),radial-gradient(900px_circle_at_80%_20%,rgba(45,212,191,0.14),transparent_55%),linear-gradient(180deg,rgba(2,6,23,1),rgba(2,6,23,0.92))]"
          animate={{ opacity: theme === "dark" ? 1 : 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
        />
        <motion.div
          className="absolute inset-0 pointer-events-none"
          animate={{ opacity: 0 }}
          transition={{ duration: 0 }}
        />
      </div>

      <div className="w-full max-w-md">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div
              className={[
                "text-sm",
                "text-white/80",
              ].join(" ")}
            >
              Kanji Flashcards
            </div>
            <div className="text-2xl font-semibold tracking-tight">
              Kanji Deck
            </div>
          </div>
          <button
            type="button"
            onClick={() => setSettingsOpen(true)}
            aria-label="Settings"
            className="h-11 w-11 rounded-2xl border shadow-sm transition active:scale-[0.99]
            bg-white/10 border-white/15 hover:bg-white/18"
          >
            <GearIcon className="mx-auto h-5 w-5" />
          </button>
        </div>

        <div className="mt-4">
          {screen === "library" ? (
            <DeckLibrary
              decks={decks}
              activeDeckId={activeDeckId}
              onOpenDeck={(id) => {
                setActiveDeckId(id);
                setScreen("deck");
              }}
              onNewDeck={newDeck}
              onRenameDeck={renameDeck}
              onDeleteDeck={deleteDeck}
            />
          ) : screen === "deck" ? (
            activeDeck ? (
              <DeckDetail
                deck={activeDeck}
                onBack={() => setScreen("library")}
                onStartReview={() => setScreen("review")}
                onAddCard={(card: Flashcard) => {
                  setDecks((ds) =>
                    ds.map((d) =>
                      d.id === activeDeck.id
                        ? {
                            ...d,
                            cards: [card, ...d.cards],
                            updatedAt: Date.now(),
                          }
                        : d,
                    ),
                  );
                }}
                onRemoveCard={(cardId) => {
                  setDecks((ds) =>
                    ds.map((d) =>
                      d.id === activeDeck.id
                        ? {
                            ...d,
                            cards: d.cards.filter((x) => x.id !== cardId),
                            updatedAt: Date.now(),
                          }
                        : d,
                    ),
                  );
                }}
                onClearDeck={() => {
                  setDecks((ds) =>
                    ds.map((d) =>
                      d.id === activeDeck.id
                        ? { ...d, cards: [], updatedAt: Date.now() }
                        : d,
                    ),
                  );
                }}
              />
            ) : (
              <GlassPanel className="p-6 text-center">
                <div className="text-lg font-semibold">No deck selected</div>
                <div className="mt-1 text-sm text-white/80">
                  Create a new deck to begin.
                </div>
              </GlassPanel>
            )
          ) : (
            <div className="grid gap-4">
              <GlassPanel className="p-4">
                <div className="flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => setScreen("deck")}
                    className="h-10 px-3 rounded-xl font-semibold border shadow-sm transition active:scale-[0.99]
                    bg-white/10 border-white/15 hover:bg-white/18"
                  >
                    Back
                  </button>
                  <div className="min-w-0 text-center">
                    <div className="truncate font-semibold">
                      {activeDeck?.name ?? "Review"}
                    </div>
                    <div className="text-xs text-white/75">
                      {sortedCards.length} cards
                    </div>
                  </div>
                  <div className="w-[74px]" />
                </div>
              </GlassPanel>
              <FlashcardReviewer deck={sortedCards} />
            </div>
          )}
        </div>

        <div
          className={[
            "mt-6 pb-6 text-center text-xs",
            "text-white/65",
          ].join(" ")}
        >
          Tip: Add this to your home screen for a full-screen, app-like feel.
        </div>
      </div>

      <SettingsSheet
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        theme={theme}
        onThemeChange={setTheme}
      />
    </div>
  );
}


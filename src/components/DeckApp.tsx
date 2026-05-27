"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import type { Flashcard } from "@/lib/deckTypes";
import type { DeckFolder } from "@/lib/appState";
import { loadAppState, saveAppState } from "@/lib/appState";
import { CardCreator } from "@/components/CardCreator";
import { FlashcardReviewer } from "@/components/FlashcardReviewer";
import { GlassPanel } from "@/components/GlassPanel";

type Mode = "Create" | "Review";
type ThemeVariant = "soft" | "dark" | "light";

const THEME_KEY = "kanjiDeckThemeV1";

function loadTheme(): ThemeVariant {
  if (typeof window === "undefined") return "soft";
  const t = window.localStorage.getItem(THEME_KEY);
  return t === "dark" || t === "light" || t === "soft" ? t : "soft";
}

function saveTheme(theme: ThemeVariant) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(THEME_KEY, theme);
}

export function DeckApp() {
  const [decks, setDecks] = useState<DeckFolder[]>([]);
  const [activeDeckId, setActiveDeckId] = useState("");
  const [mode, setMode] = useState<Mode>("Review");
  const [theme, setTheme] = useState<ThemeVariant>("soft");

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

  const textClass = theme === "light" ? "text-slate-900" : "text-white";

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
      <div className="absolute inset-0 -z-10">
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
          className="absolute inset-0 bg-white bg-[radial-gradient(1200px_circle_at_20%_10%,rgba(56,189,248,0.20),transparent_60%),radial-gradient(900px_circle_at_80%_20%,rgba(45,212,191,0.16),transparent_55%),linear-gradient(180deg,rgba(255,255,255,1),rgba(255,255,255,0.90))]"
          animate={{ opacity: theme === "light" ? 1 : 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
        />
      </div>

      <div className="w-full max-w-md">
        <div className="flex items-center justify-between">
          <div>
            <div
              className={[
                "text-sm",
                theme === "light" ? "text-slate-600" : "text-white/80",
              ].join(" ")}
            >
              Kanji Flashcards
            </div>
            <div className="text-2xl font-semibold tracking-tight">
              Kanji Deck
            </div>
          </div>
          <div
            className={[
              "text-right text-sm",
              theme === "light" ? "text-slate-600" : "text-white/80",
            ].join(" ")}
          >
            <div className="font-semibold">{sortedCards.length}</div>
            <div>cards</div>
          </div>
        </div>

        <div className="mt-3">
          <GlassPanel className="p-3">
            <div className="flex items-center justify-between gap-2">
              <div className="min-w-0">
                <div className="text-xs text-white/80 group-data-[theme=light]:text-slate-600">
                  Deck
                </div>
                <div className="truncate font-semibold">
                  {activeDeck?.name ?? "—"}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
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
                    setMode("Create");
                  }}
                  className="h-10 px-3 rounded-xl font-semibold border shadow-sm transition active:scale-[0.99]
                  bg-white/10 border-white/15 hover:bg-white/18
                  group-data-[theme=light]:bg-slate-900/5 group-data-[theme=light]:border-slate-900/10 group-data-[theme=light]:hover:bg-slate-900/8
                  group-data-[theme=dark]:bg-white/10 group-data-[theme=dark]:border-white/15 group-data-[theme=dark]:hover:bg-white/18"
                >
                  New
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (!activeDeck) return;
                    const name =
                      typeof window !== "undefined"
                        ? window.prompt("Rename deck to…", activeDeck.name)
                        : null;
                    if (!name) return;
                    setDecks((ds) =>
                      ds.map((d) =>
                        d.id === activeDeck.id
                          ? { ...d, name: name.trim() || d.name, updatedAt: Date.now() }
                          : d,
                      ),
                    );
                  }}
                  className="h-10 px-3 rounded-xl font-semibold border shadow-sm transition active:scale-[0.99]
                  bg-white/10 border-white/15 hover:bg-white/18
                  group-data-[theme=light]:bg-slate-900/5 group-data-[theme=light]:border-slate-900/10 group-data-[theme=light]:hover:bg-slate-900/8
                  group-data-[theme=dark]:bg-white/10 group-data-[theme=dark]:border-white/15 group-data-[theme=dark]:hover:bg-white/18"
                >
                  Rename
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (!activeDeck) return;
                    if (decks.length <= 1) return;
                    if (
                      typeof window !== "undefined" &&
                      window.confirm(`Delete deck "${activeDeck.name}"?`)
                    ) {
                      setDecks((ds) => ds.filter((d) => d.id !== activeDeck.id));
                      setActiveDeckId((id) => {
                        const remaining = decks.filter((d) => d.id !== activeDeck.id);
                        return remaining[0]?.id ?? id;
                      });
                    }
                  }}
                  disabled={decks.length <= 1}
                  className="h-10 px-3 rounded-xl font-semibold border shadow-sm transition active:scale-[0.99]
                  bg-white/10 border-white/15 hover:bg-white/18 disabled:opacity-50 disabled:cursor-not-allowed
                  group-data-[theme=light]:bg-slate-900/5 group-data-[theme=light]:border-slate-900/10 group-data-[theme=light]:hover:bg-slate-900/8
                  group-data-[theme=dark]:bg-white/10 group-data-[theme=dark]:border-white/15 group-data-[theme=dark]:hover:bg-white/18"
                >
                  Delete
                </button>
              </div>
            </div>

            {decks.length > 1 ? (
              <div className="mt-3 flex gap-2 overflow-x-auto pb-1 [-webkit-overflow-scrolling:touch]">
                {decks.map((d) => (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => setActiveDeckId(d.id)}
                    className={[
                      "shrink-0 h-9 px-3 rounded-xl font-semibold border transition",
                      d.id === activeDeckId
                        ? "bg-white/25 border-white/30"
                        : "bg-white/10 border-white/15 hover:bg-white/18",
                      "group-data-[theme=dark]:bg-white/10 group-data-[theme=dark]:border-white/15",
                      "group-data-[theme=light]:bg-slate-900/5 group-data-[theme=light]:border-slate-900/10 group-data-[theme=light]:text-slate-900",
                    ].join(" ")}
                  >
                    {d.name}
                  </button>
                ))}
              </div>
            ) : null}
          </GlassPanel>
        </div>

        <div
          className={[
            "mt-4 grid grid-cols-2 gap-3",
            theme === "light" ? "text-slate-900" : "text-white",
          ].join(" ")}
        >
          <div
            className={[
              "inline-flex w-full rounded-2xl p-1 border shadow-sm",
              theme === "light"
                ? "bg-slate-900/5 border-slate-900/10"
                : "bg-white/15 border-white/20",
            ].join(" ")}
          >
          {(["Review", "Create"] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              className={[
                "h-11 flex-1 rounded-xl font-semibold transition",
                mode === m
                  ? theme === "light"
                    ? "bg-white shadow-sm"
                    : "bg-white/30"
                  : theme === "light"
                    ? "hover:bg-white/60"
                    : "hover:bg-white/15",
              ].join(" ")}
            >
              {m}
            </button>
          ))}
          </div>

          <div
            className={[
              "inline-flex w-full rounded-2xl p-1 border shadow-sm",
              theme === "light"
                ? "bg-slate-900/5 border-slate-900/10"
                : "bg-white/15 border-white/20",
            ].join(" ")}
          >
            {(
              [
                { id: "soft", label: "Soft" },
                { id: "dark", label: "Dark" },
                { id: "light", label: "Light" },
              ] as const
            ).map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTheme(t.id)}
                className={[
                  "h-11 flex-1 rounded-xl font-semibold transition text-sm",
                  theme === t.id
                    ? theme === "light"
                      ? "bg-white shadow-sm"
                      : "bg-white/30"
                    : theme === "light"
                      ? "hover:bg-white/60"
                      : "hover:bg-white/15",
                ].join(" ")}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-4">
          {mode === "Create" ? (
            <div className="grid gap-4">
              <CardCreator
                onAdd={(card) => {
                  if (!activeDeck) return;
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
              />
              {sortedCards.length > 0 ? (
                <GlassPanel className="p-4">
                  <div className="text-sm text-white/80 group-data-[theme=light]:text-slate-600 group-data-[theme=dark]:text-white/80">
                    Deck preview
                  </div>
                  <div className="mt-3 max-h-[38dvh] overflow-y-auto pr-1 grid gap-2">
                    {sortedCards.map((c) => (
                      <div
                        key={c.id}
                        className="flex items-center justify-between gap-3 rounded-xl px-3 py-2 bg-white/10 border border-white/15 group-data-[theme=light]:bg-slate-900/5 group-data-[theme=light]:border-slate-900/10 group-data-[theme=dark]:bg-white/10 group-data-[theme=dark]:border-white/15"
                      >
                        <div className="min-w-0">
                          <div className="truncate font-semibold">
                            {c.kanji}
                          </div>
                          <div className="truncate text-sm text-white/75 group-data-[theme=light]:text-slate-600 group-data-[theme=dark]:text-white/75">
                            {c.meaning}
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            setDecks((ds) =>
                              ds.map((d) =>
                                d.id === activeDeckId
                                  ? {
                                      ...d,
                                      cards: d.cards.filter((x) => x.id !== c.id),
                                      updatedAt: Date.now(),
                                    }
                                  : d,
                              ),
                            )
                          }
                          aria-label="Remove card"
                          className="shrink-0 h-9 w-9 rounded-xl font-semibold border shadow-sm transition active:scale-[0.99]
                          bg-white/10 border-white/15 hover:bg-white/18
                          group-data-[theme=light]:bg-slate-900/5 group-data-[theme=light]:border-slate-900/10 group-data-[theme=light]:hover:bg-slate-900/8
                          group-data-[theme=dark]:bg-white/10 group-data-[theme=dark]:border-white/15 group-data-[theme=dark]:hover:bg-white/18"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3">
                    <button
                      type="button"
                      onClick={() => {
                        if (
                          typeof window !== "undefined" &&
                          window.confirm("Remove all cards from this device?")
                        ) {
                          setDecks((ds) =>
                            ds.map((d) =>
                              d.id === activeDeckId
                                ? { ...d, cards: [], updatedAt: Date.now() }
                                : d,
                            ),
                          );
                        }
                      }}
                      className="w-full h-11 rounded-xl font-semibold border shadow-sm transition active:scale-[0.99]
                      bg-white/10 border-white/15 hover:bg-white/18
                      group-data-[theme=light]:bg-slate-900/5 group-data-[theme=light]:border-slate-900/10 group-data-[theme=light]:hover:bg-slate-900/8
                      group-data-[theme=dark]:bg-white/10 group-data-[theme=dark]:border-white/15 group-data-[theme=dark]:hover:bg-white/18"
                    >
                      Clear this deck
                    </button>
                  </div>
                </GlassPanel>
              ) : null}
            </div>
          ) : (
            <FlashcardReviewer deck={sortedCards} />
          )}
        </div>

        <div
          className={[
            "mt-6 pb-6 text-center text-xs",
            theme === "light" ? "text-slate-500" : "text-white/65",
          ].join(" ")}
        >
          Tip: Add this to your home screen for a full-screen, app-like feel.
        </div>
      </div>
    </div>
  );
}


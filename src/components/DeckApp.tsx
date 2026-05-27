"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import type { Flashcard } from "@/lib/deckTypes";
import { loadDeck, saveDeck } from "@/lib/deckStorage";
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
  const [deck, setDeck] = useState<Flashcard[]>([]);
  const [mode, setMode] = useState<Mode>("Review");
  const [theme, setTheme] = useState<ThemeVariant>("soft");

  useEffect(() => {
    setDeck(loadDeck());
    setTheme(loadTheme());
  }, []);

  useEffect(() => {
    saveDeck(deck);
  }, [deck]);

  useEffect(() => {
    saveTheme(theme);
  }, [theme]);

  const sortedDeck = useMemo(() => {
    return [...deck].sort((a, b) => b.createdAt - a.createdAt);
  }, [deck]);

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
            <div className="font-semibold">{deck.length}</div>
            <div>cards</div>
          </div>
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
                onAdd={(card) => setDeck((d) => [card, ...d])}
              />
              {sortedDeck.length > 0 ? (
                <GlassPanel className="p-4">
                  <div className="text-sm text-white/80 group-data-[theme=light]:text-slate-600 group-data-[theme=dark]:text-white/80">
                    Deck preview
                  </div>
                  <div className="mt-3 grid gap-2">
                    {sortedDeck.slice(0, 6).map((c) => (
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
                            setDeck((d) => d.filter((x) => x.id !== c.id))
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
                  {sortedDeck.length > 6 ? (
                    <div
                      className={[
                        "mt-3 text-xs",
                        theme === "light" ? "text-slate-500" : "text-white/70",
                      ].join(" ")}
                    >
                      Showing latest 6 cards.
                    </div>
                  ) : null}
                  <div className="mt-3">
                    <button
                      type="button"
                      onClick={() => {
                        if (
                          typeof window !== "undefined" &&
                          window.confirm("Remove all cards from this device?")
                        ) {
                          setDeck([]);
                        }
                      }}
                      className="w-full h-11 rounded-xl font-semibold border shadow-sm transition active:scale-[0.99]
                      bg-white/10 border-white/15 hover:bg-white/18
                      group-data-[theme=light]:bg-slate-900/5 group-data-[theme=light]:border-slate-900/10 group-data-[theme=light]:hover:bg-slate-900/8
                      group-data-[theme=dark]:bg-white/10 group-data-[theme=dark]:border-white/15 group-data-[theme=dark]:hover:bg-white/18"
                    >
                      Clear deck
                    </button>
                  </div>
                </GlassPanel>
              ) : null}
            </div>
          ) : (
            <FlashcardReviewer deck={sortedDeck} />
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


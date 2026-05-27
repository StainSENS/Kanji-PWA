import type { Flashcard } from "@/lib/deckTypes";
import { loadDeck } from "@/lib/deckStorage";

export type DeckFolder = {
  id: string;
  name: string;
  cards: Flashcard[];
  createdAt: number;
  updatedAt: number;
};

export type AppState = {
  version: 1;
  activeDeckId: string;
  decks: DeckFolder[];
};

const STORAGE_KEY = "kanjiDeckAppStateV1";

function newId() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function defaultDeck(cards: Flashcard[]): DeckFolder {
  const now = Date.now();
  return {
    id: newId(),
    name: "Default",
    cards,
    createdAt: now,
    updatedAt: now,
  };
}

export function loadAppState(): AppState {
  if (typeof window === "undefined") {
    return { version: 1, activeDeckId: "", decks: [] };
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as any;
      if (
        parsed &&
        parsed.version === 1 &&
        Array.isArray(parsed.decks) &&
        typeof parsed.activeDeckId === "string"
      ) {
        const decks: DeckFolder[] = parsed.decks
          .filter((d: any) => d && typeof d === "object")
          .map((d: any) => ({
            id: String(d.id ?? newId()),
            name: String(d.name ?? "Deck"),
            cards: Array.isArray(d.cards) ? (d.cards as Flashcard[]) : [],
            createdAt: Number(d.createdAt ?? Date.now()),
            updatedAt: Number(d.updatedAt ?? Date.now()),
          }));

        const activeDeckId =
          decks.find((d) => d.id === parsed.activeDeckId)?.id ?? decks[0]?.id ?? "";

        return { version: 1, activeDeckId, decks };
      }
    }
  } catch {
    // fallthrough to migration
  }

  // Migration: older single-deck storage (kanjiDeckV1)
  const legacy = loadDeck();
  const starter = defaultDeck(legacy);
  return { version: 1, activeDeckId: starter.id, decks: [starter] };
}

export function saveAppState(state: AppState) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}


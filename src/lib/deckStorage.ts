import type { CardType, Flashcard } from "@/lib/deckTypes";

const STORAGE_KEY = "kanjiDeckV1";

export function loadDeck(): Flashcard[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((c) => c && typeof c === "object")
      .map((c: any) => {
        const type: CardType = c.type === "Verb" ? "Verb" : "Noun";
        return {
          id: String(c.id ?? ""),
          kanji: String(c.kanji ?? ""),
          type,
          meaning: String(c.meaning ?? ""),
          createdAt: Number(c.createdAt ?? Date.now()),
        } satisfies Flashcard;
      })
      .filter((c) => c.id && c.kanji && c.meaning);
  } catch {
    return [];
  }
}

export function saveDeck(deck: Flashcard[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(deck));
}


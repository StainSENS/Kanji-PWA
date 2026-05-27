export type CardType = "Verb" | "Noun";

export type Flashcard = {
  id: string;
  kanji: string;
  type: CardType;
  meaning: string;
  createdAt: number;
};


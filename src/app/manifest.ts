import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Kanji Deck",
    short_name: "Kanji Deck",
    description: "Kanji flashcard PWA with spaced repetition",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#2aa9a8",
    theme_color: "#2aa9a8",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "maskable",
      },
    ],
  };
}


"use client";

import { useState } from "react";

const TRAVEL_EMOJIS = ["✈️", "🗼", "⛩️", "🗾", "🎌", "🍣", "🚅", "🌸", "🏯", "🎎"];

function getRandomEmoji() {
  return TRAVEL_EMOJIS[Math.floor(Math.random() * TRAVEL_EMOJIS.length)];
}

export default function Header() {
  const [emoji] = useState(getRandomEmoji);

  return (
    <header
      className="h-14 flex items-center justify-center px-[16px] relative"
      style={{ backgroundColor: "var(--canvas)" }}
    >
      <div className="flex items-center gap-[8px]">
        <span className="text-xl">{emoji}</span>
        <h1
          className="tracking-tight"
          style={{
            color: "var(--ink)",
            fontFamily: "var(--font-display), sans-serif",
            fontWeight: 600,
            fontSize: "24px",
          }}
        >
          Japan Trip Tracker
        </h1>
      </div>
    </header>
  );
}

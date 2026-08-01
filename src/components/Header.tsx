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
      className="h-20 flex items-center justify-center px-[16px] relative"
      style={{
        backgroundColor: "var(--memphis-bg)",
        borderBottom: "3px solid var(--ink)",
      }}
    >
      <div className="flex items-center gap-[8px]">
        <span className="text-3xl">{emoji}</span>
        <h1
          className="tracking-wide uppercase"
          style={{
            color: "var(--ink)",
            fontFamily: "var(--font-bangers), cursive",
            fontWeight: 400,
            fontSize: "36px",
            letterSpacing: "3px",
            textShadow: "3px 3px 0px var(--memphis-yellow)",
          }}
        >
          Travel Planner
        </h1>
      </div>
    </header>
  );
}

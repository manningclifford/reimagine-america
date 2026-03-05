"use client";

// Duplicated so the loop is perfectly seamless (animate -50% = one full copy)
const STARS = Array(200).fill("★").join(" ");

type Props = { themeId: string };

export default function StarTicker({ themeId }: Props) {
  const isParchment = themeId === "parchment";
  const isSlate     = themeId === "slate";

  const bg     = isParchment ? "#7a5018" : isSlate ? "#0f172a" : "#030712";
  const border = isParchment ? "#9a7030" : isSlate ? "#1e293b" : "#1f2937";
  const color  = isParchment ? "#fde68a" : isSlate ? "#64748b" : "#4b5563";

  return (
    <div
      className="flex-shrink-0 overflow-hidden select-none"
      style={{ height: 26, borderTop: `1px solid ${border}`, background: bg }}
    >
      {/* inline-block so translateX(-50%) = exactly one copy width → seamless */}
      <span
        className="ticker-track"
        style={{ color, fontSize: 11, lineHeight: "26px", letterSpacing: "0.05em" }}
      >
        {STARS} {STARS}
      </span>
    </div>
  );
}

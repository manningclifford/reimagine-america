"use client";

// Decorative elements that appear only in Parchment theme:
// 1. A banner of twinkling stars running along the top of the header
// 2. A small waving American flag in the top-right corner

const STAR_DELAYS = [
  0, 0.4, 0.9, 1.3, 0.2, 1.7, 0.6, 1.1, 0.35, 1.9,
  0.8, 1.4, 0.1, 1.6, 0.55, 1.0, 0.25, 1.8, 0.7, 1.2,
  0.45, 0.95, 1.55, 0.15, 1.35,
];

export function StarBanner() {
  return (
    <div
      className="w-full flex items-center justify-center gap-1 py-0.5"
      style={{ background: "linear-gradient(90deg, #5a3a0a, #7a5018 20%, #9a7030 50%, #7a5018 80%, #5a3a0a)" }}
      aria-hidden
    >
      {STAR_DELAYS.map((delay, i) => (
        <span
          key={i}
          className="star-twinkle text-xs select-none"
          style={{ animationDelay: `${delay}s` }}
        >
          ★
        </span>
      ))}
    </div>
  );
}

// Simplified American flag as SVG — 13 stripes + blue canton with stars
export function WavingFlag() {
  const W = 84;
  const H = 44;
  const stripeH = H / 13;
  const cantonW = W * 0.38;
  const cantonH = stripeH * 7;

  // 6 white stripes overlaid on red base (stripes 2,4,6,8,10,12 counting from 1)
  const whiteStripes = [1, 3, 5, 7, 9, 11].map((n) => n * stripeH);

  // Stars in canton: alternating rows of 6 and 5, 5 rows
  const stars: { x: number; y: number }[] = [];
  const colsA = 6, colsB = 5, rows = 5;
  const padX = cantonW * 0.08, padY = cantonH * 0.09;
  const spaceX = (cantonW - 2 * padX) / (colsA - 1);
  const spaceY = (cantonH - 2 * padY) / (rows - 0.5);

  for (let r = 0; r < rows; r++) {
    const cols = r % 2 === 0 ? colsA : colsB;
    const offsetX = r % 2 === 0 ? 0 : spaceX / 2;
    for (let c = 0; c < cols; c++) {
      stars.push({
        x: padX + offsetX + c * spaceX,
        y: padY + r * spaceY,
      });
    }
  }

  return (
    <div className="flag-wave" style={{ display: "inline-block", lineHeight: 0 }}>
      {/* Flagpole */}
      <div style={{ display: "flex", alignItems: "stretch", gap: 0 }}>
        <div style={{ width: 3, background: "linear-gradient(180deg, #c0a040, #8b6010, #c0a040)", borderRadius: "2px 2px 0 0", flexShrink: 0 }} />
        <svg
          width={W}
          height={H}
          viewBox={`0 0 ${W} ${H}`}
          style={{ display: "block", shapeRendering: "crispEdges" }}
        >
          {/* Red base */}
          <rect width={W} height={H} fill="#B22234" />
          {/* White stripes */}
          {whiteStripes.map((y, i) => (
            <rect key={i} x={0} y={y} width={W} height={stripeH} fill="#FFFFFF" />
          ))}
          {/* Blue canton */}
          <rect x={0} y={0} width={cantonW} height={cantonH} fill="#3C3B6E" />
          {/* Stars */}
          {stars.map((s, i) => (
            <circle key={i} cx={s.x} cy={s.y} r={1.1} fill="#FFFFFF" />
          ))}
        </svg>
      </div>
    </div>
  );
}

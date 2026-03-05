"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { toPng } from "html-to-image";
import { Nation } from "@/data/scenarios";
import { STATE_DATA } from "@/data/stateData";
import { ThemeId } from "@/data/themes";

const USMap = dynamic(() => import("@/components/USMap"), { ssr: false });

type Props = {
  nations: Nation[];
  scenarioName: string;
  stateColors: Record<string, string>;
  stateNations: Record<string, string>;
  themeId: ThemeId;
  onClose: () => void;
};

type Stats = {
  id: string; name: string; color: string; stateCount: number; areaSqMi: number;
  population: number; gdp: number; gdpPerCapita: number; demPct: number;
  raceWhite: number; raceBlack: number; raceHispanic: number; raceAsian: number; raceOther: number;
};

function compute(nation: Nation): Stats {
  let pop = 0, gdp = 0, area = 0, dv = 0, rv = 0;
  let rW = 0, rB = 0, rH = 0, rA = 0, rO = 0;
  for (const fips of nation.states) {
    const d = STATE_DATA[fips]; if (!d) continue;
    pop += d.population; gdp += d.gdp; area += d.areaSqMi ?? 0;
    dv += d.demPct * d.population; rv += (100 - d.demPct) * d.population;
    rW += d.raceWhite*d.population; rB += d.raceBlack*d.population;
    rH += d.raceHispanic*d.population; rA += d.raceAsian*d.population; rO += d.raceOther*d.population;
  }
  const tv = dv + rv;
  if (pop > 0) { rW=Math.round(rW/pop); rB=Math.round(rB/pop); rH=Math.round(rH/pop); rA=Math.round(rA/pop); rO=Math.round(rO/pop); }
  return {
    id: nation.id, name: nation.name, color: nation.color, stateCount: nation.states.length, areaSqMi: area,
    population: pop, gdp, gdpPerCapita: pop > 0 ? (gdp*1e9)/pop : 0,
    demPct: tv > 0 ? Math.round((dv/tv)*100) : 50,
    raceWhite:rW, raceBlack:rB, raceHispanic:rH, raceAsian:rA, raceOther:rO,
  };
}

const fmtPop  = (n: number) => n >= 1e6 ? (n/1e6).toFixed(1)+"M" : n >= 1e3 ? Math.round(n/1e3)+"K" : String(n);
const fmtGdp  = (n: number) => n >= 1000 ? "$"+(n/1000).toFixed(1)+"T" : "$"+n.toFixed(0)+"B";
const fmtCap  = (n: number) => "$"+Math.round(n/1000).toLocaleString()+"K";
const fmtArea = (n: number) => n >= 1e6 ? (n/1e6).toFixed(2)+"M mi²" : Math.round(n/1000)+"K mi²";

const RACE_SEGMENTS = [
  { key: "raceWhite"    as const, color: "#d1d5db", label: "White"    },
  { key: "raceHispanic" as const, color: "#fbbf24", label: "Hispanic" },
  { key: "raceBlack"    as const, color: "#60a5fa", label: "Black"    },
  { key: "raceAsian"    as const, color: "#f472b6", label: "Asian"    },
  { key: "raceOther"    as const, color: "#6b7280", label: "Other"    },
];

const MODAL_THEME = {
  dark: {
    bg: "#0a0f1e", border: "#1e2d4a",
    headerBg: "linear-gradient(135deg, #0f1f3d 0%, #0a1628 100%)",
    headerBorder: "#1e2d4a", footerBg: "#070d1a", footerBorder: "#1e2d4a",
    rowEven: "#0a0f1e", rowOdd: "#0d1526", theadBg: "#070d1a", theadBorder: "#1e2d4a",
    mapBg: "#070d1a", mapFill: "#1a2744", mapStroke: "#0a1020",
    text: "#ffffff", muted: "#4b6fa8", subtext: "#e2e8f0", barTrack: "#0f1b30",
    btnBg: "#1e3a5f", btnText: "#93c5fd", btnBorder: "#2d5a8e",
    flagFilter: "invert(1)",
  },
  parchment: {
    bg: "#fdf6e3", border: "#c8a96e",
    headerBg: "linear-gradient(135deg, #f0ddb0 0%, #e8d098 100%)",
    headerBorder: "#c8a96e", footerBg: "#ede0b0", footerBorder: "#c8a96e",
    rowEven: "#fdf6e3", rowOdd: "#f5ecd0", theadBg: "#e8d098", theadBorder: "#c8a96e",
    mapBg: "#f5ecd0", mapFill: "#d6cbb5", mapStroke: "#a89880",
    text: "#1c1710", muted: "#8b6030", subtext: "#3d2e1a", barTrack: "#e8d8b0",
    btnBg: "#c8a96e", btnText: "#1c1710", btnBorder: "#a08040",
    flagFilter: "none",
  },
};

function Bar({ pct, color, value, track }: { pct: number; color: string; value: string; track: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <div style={{ height: 16, borderRadius: 4, background: track, overflow: "hidden" }}>
        <div style={{ width: `${Math.max(pct, 2)}%`, height: "100%", background: color, borderRadius: 4 }} />
      </div>
      <div style={{ fontSize: 10, fontWeight: 700, fontFamily: "monospace" }}>{value}</div>
    </div>
  );
}

export default function StatsModal({ nations, scenarioName, stateColors, stateNations, themeId, onClose }: Props) {
  const active = nations.filter(n => n.states.length > 0);
  const allStats = active.map(compute);
  const t = MODAL_THEME[themeId];
  const cardRef = useRef<HTMLDivElement>(null);
  const [copying, setCopying] = useState(false);

  const maxPop  = Math.max(...allStats.map(s => s.population), 1);
  const maxGdp  = Math.max(...allStats.map(s => s.gdp), 1);
  const maxCap  = Math.max(...allStats.map(s => s.gdpPerCapita), 1);
  const maxArea = Math.max(...allStats.map(s => s.areaSqMi), 1);

  useEffect(() => {
    const fn = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [onClose]);

  async function handleCopyImage() {
    if (!cardRef.current) return;
    setCopying(true);
    try {
      const dataUrl = await toPng(cardRef.current, { pixelRatio: 2 });
      const res = await fetch(dataUrl);
      const blob = await res.blob();
      await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
    } catch (err) {
      console.error("Copy failed", err);
    } finally {
      setCopying(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: "rgba(0,0,0,0.85)", backdropFilter: "blur(8px)", padding: 12 }}
      onClick={onClose}
    >
      <div
        ref={cardRef}
        onClick={e => e.stopPropagation()}
        style={{
          width: "calc(100vw - 24px)",
          maxHeight: "calc(100vh - 24px)",
          display: "flex", flexDirection: "column",
          background: t.bg,
          border: `1px solid ${t.border}`,
          borderRadius: 16,
          overflow: "hidden",
          boxShadow: "0 32px 80px rgba(0,0,0,0.8)",
        }}
      >
        {/* ── Header ── */}
        <div style={{ background: t.headerBg, padding: "14px 20px 12px", borderBottom: `1px solid ${t.headerBorder}`, flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/flag.png" alt="US Flag"
                style={{ width: 42, height: 28, objectFit: "cover", borderRadius: 4, flexShrink: 0, filter: t.flagFilter }} />
              <div>
                <p style={{ fontSize: 9, letterSpacing: "0.18em", textTransform: "uppercase", color: t.muted, margin: 0 }}>Redraw America</p>
                <h2 style={{ fontSize: 22, fontWeight: 700, color: t.text, margin: 0, lineHeight: 1.2 }}>{scenarioName}</h2>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: t.muted, letterSpacing: "0.04em" }}>usa.clifford.works</span>
              <button
                onClick={(e) => { e.stopPropagation(); handleCopyImage(); }}
                style={{ fontSize: 11, padding: "4px 10px", borderRadius: 6, background: t.btnBg, color: t.btnText, border: `1px solid ${t.btnBorder}`, cursor: "pointer", flexShrink: 0 }}
              >
                {copying ? "Copying…" : "📋 Copy image"}
              </button>
              <button onClick={onClose} style={{ color: t.muted, fontSize: 22, lineHeight: 1, background: "none", border: "none", cursor: "pointer", padding: "0 4px" }}>×</button>
            </div>
          </div>
        </div>

        {/* ── Body ── */}
        <div style={{ flex: 1, overflow: "auto", display: "flex", minHeight: 0 }}>

          {/* Map column — no legend */}
          <div style={{ flex: "0 0 280px", background: t.mapBg, padding: "12px 0 12px 12px", borderRight: `1px solid ${t.border}` }}>
            <USMap
              stateColors={stateColors}
              stateNations={stateNations}
              onStateClick={() => {}}
              mapBg={t.mapFill}
              mapStroke={t.mapStroke}
            />
          </div>

          {/* Stats table */}
          <div style={{ flex: 1, overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: t.theadBg, borderBottom: `1px solid ${t.theadBorder}` }}>
                  {["Nation", "States", "Population", "GDP (Total)", "GDP / Capita", "Area", "Political Lean", "Racial Breakdown"].map(h => (
                    <th key={h} style={{ padding: "10px 12px", fontSize: 9, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.12em", color: t.muted, textAlign: "left", whiteSpace: "nowrap" }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {allStats.map((s, i) => (
                  <tr key={s.id} style={{ borderBottom: `1px solid ${t.border}`, background: i % 2 === 0 ? t.rowEven : t.rowOdd }}>
                    <td style={{ padding: "12px 12px", whiteSpace: "nowrap" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                        <span style={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: s.color, flexShrink: 0 }} />
                        <span style={{ fontWeight: 700, fontSize: 13, color: t.text }}>{s.name}</span>
                      </div>
                    </td>
                    <td style={{ padding: "12px 12px" }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: t.subtext, fontFamily: "monospace", textAlign: "center" }}>{s.stateCount}</div>
                    </td>
                    <td style={{ padding: "12px 12px", minWidth: 140 }}>
                      <Bar pct={(s.population/maxPop)*100} color={s.color} value={fmtPop(s.population)} track={t.barTrack} />
                    </td>
                    <td style={{ padding: "12px 12px", minWidth: 140 }}>
                      <Bar pct={(s.gdp/maxGdp)*100} color={s.color} value={fmtGdp(s.gdp)} track={t.barTrack} />
                    </td>
                    <td style={{ padding: "12px 12px", minWidth: 140 }}>
                      <Bar pct={(s.gdpPerCapita/maxCap)*100} color={s.color} value={fmtCap(s.gdpPerCapita)} track={t.barTrack} />
                    </td>
                    <td style={{ padding: "12px 12px", minWidth: 130 }}>
                      <Bar pct={(s.areaSqMi/maxArea)*100} color={s.color} value={fmtArea(s.areaSqMi)} track={t.barTrack} />
                    </td>
                    {/* D/R — bar first, labels below */}
                    <td style={{ padding: "12px 12px", minWidth: 140 }}>
                      <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                        <div style={{ display: "flex", height: 16, borderRadius: 4, overflow: "hidden" }}>
                          <div style={{ width: `${s.demPct}%`, background: "#3b82f6" }} />
                          <div style={{ width: `${100-s.demPct}%`, background: "#ef4444" }} />
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9 }}>
                          <span style={{ color: "#60a5fa", fontWeight: 700 }}>D {s.demPct}%</span>
                          <span style={{ color: "#f87171", fontWeight: 700 }}>R {100-s.demPct}%</span>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: "12px 12px", minWidth: 160 }}>
                      <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                        <div style={{ display: "flex", height: 16, borderRadius: 4, overflow: "hidden" }}>
                          {RACE_SEGMENTS.map(seg =>
                            s[seg.key] > 0 ? <div key={seg.key} title={`${seg.label}: ${s[seg.key]}%`} style={{ width: `${s[seg.key]}%`, backgroundColor: seg.color }} /> : null
                          )}
                        </div>
                        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                          {RACE_SEGMENTS.filter(seg => s[seg.key] >= 5).map(seg => (
                            <span key={seg.key} style={{ fontSize: 8, color: seg.color }}>{seg.label[0]} {s[seg.key]}%</span>
                          ))}
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── Footer ── */}
        <div style={{ padding: "6px 20px", background: t.footerBg, borderTop: `1px solid ${t.footerBorder}`, display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0 }}>
          <span style={{ fontSize: 8, color: t.muted, letterSpacing: "0.12em" }}>★ REDRAW AMERICA ★</span>
          <div style={{ display: "flex", gap: 12 }}>
            {RACE_SEGMENTS.map(seg => (
              <span key={seg.key} style={{ display: "flex", alignItems: "center", gap: 3, fontSize: 8, color: t.muted }}>
                <span style={{ width: 7, height: 7, borderRadius: 2, backgroundColor: seg.color }} />
                {seg.label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

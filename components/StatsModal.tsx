"use client";

import { useEffect } from "react";
import dynamic from "next/dynamic";
import { Nation } from "@/data/scenarios";
import { STATE_DATA } from "@/data/stateData";

const USMap = dynamic(() => import("@/components/USMap"), { ssr: false });

type Props = {
  nations: Nation[];
  scenarioName: string;
  stateColors: Record<string, string>;
  stateNations: Record<string, string>;
  onClose: () => void;
};

type Stats = {
  id: string; name: string; color: string; stateCount: number;
  population: number; gdp: number; gdpPerCapita: number;
  demPct: number;
  raceWhite: number; raceBlack: number; raceHispanic: number; raceAsian: number; raceOther: number;
};

function compute(nation: Nation): Stats {
  let pop = 0, gdp = 0, dv = 0, rv = 0;
  let rW = 0, rB = 0, rH = 0, rA = 0, rO = 0;
  for (const fips of nation.states) {
    const d = STATE_DATA[fips]; if (!d) continue;
    pop += d.population; gdp += d.gdp;
    dv += d.demPct * d.population; rv += (100 - d.demPct) * d.population;
    rW += d.raceWhite*d.population; rB += d.raceBlack*d.population;
    rH += d.raceHispanic*d.population; rA += d.raceAsian*d.population; rO += d.raceOther*d.population;
  }
  const tv = dv + rv;
  if (pop > 0) { rW=Math.round(rW/pop); rB=Math.round(rB/pop); rH=Math.round(rH/pop); rA=Math.round(rA/pop); rO=Math.round(rO/pop); }
  return {
    id: nation.id, name: nation.name, color: nation.color, stateCount: nation.states.length,
    population: pop, gdp, gdpPerCapita: pop > 0 ? (gdp*1e9)/pop : 0,
    demPct: tv > 0 ? Math.round((dv/tv)*100) : 50,
    raceWhite:rW, raceBlack:rB, raceHispanic:rH, raceAsian:rA, raceOther:rO,
  };
}

const fmtPop = (n: number) => n >= 1e6 ? (n/1e6).toFixed(1)+"M" : n >= 1e3 ? Math.round(n/1e3)+"K" : String(n);
const fmtGdp = (n: number) => n >= 1000 ? "$"+(n/1000).toFixed(1)+"T" : "$"+n.toFixed(0)+"B";
const fmtCap = (n: number) => "$"+Math.round(n/1000).toLocaleString()+"K";

const RACE_SEGMENTS = [
  { key: "raceWhite" as const,    color: "#d1d5db", label: "White"    },
  { key: "raceHispanic" as const, color: "#fbbf24", label: "Hispanic" },
  { key: "raceBlack" as const,    color: "#60a5fa", label: "Black"    },
  { key: "raceAsian" as const,    color: "#f472b6", label: "Asian"    },
  { key: "raceOther" as const,    color: "#6b7280", label: "Other"    },
];

export default function StatsModal({ nations, scenarioName, stateColors, stateNations, onClose }: Props) {
  const active = nations.filter(n => n.states.length > 0);
  const allStats = active.map(compute);

  useEffect(() => {
    const fn = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.85)", backdropFilter: "blur(6px)" }}
      onClick={onClose}
    >
      {/* ── Share card — fixed width for consistent screenshotting ── */}
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: 900,
          background: "#0a0f1e",
          border: "1px solid #1e2d4a",
          borderRadius: 16,
          overflow: "hidden",
          boxShadow: "0 32px 80px rgba(0,0,0,0.7)",
          flexShrink: 0,
        }}
      >
        {/* Header */}
        <div style={{ background: "linear-gradient(135deg, #0f1f3d 0%, #0a1628 100%)", padding: "14px 20px 11px", borderBottom: "1px solid #1e2d4a" }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span style={{ fontSize: 20, color: "#93c5fd" }}>★</span>
              <div>
                <p style={{ fontSize: 9, letterSpacing: "0.18em", textTransform: "uppercase", color: "#4b6fa8", margin: 0 }}>Reimagine America</p>
                <h2 style={{ fontSize: 20, fontWeight: 700, color: "#fff", margin: 0, lineHeight: 1.2 }}>{scenarioName}</h2>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span style={{ fontSize: 9, color: "#4b6fa8", letterSpacing: "0.1em" }}>usa.clifford.works</span>
              <button onClick={onClose} style={{ color: "#4b6fa8", fontSize: 18, lineHeight: 1, background: "none", border: "none", cursor: "pointer", padding: "0 4px" }}>×</button>
            </div>
          </div>
        </div>

        {/* Map + nation rows */}
        <div style={{ display: "flex", gap: 0 }}>
          {/* Map column */}
          <div style={{ flex: "0 0 380px", background: "#070d1a", padding: "10px 0 6px 10px" }}>
            <USMap
              stateColors={stateColors}
              stateNations={stateNations}
              onStateClick={() => {}}
              mapBg="#1a2744"
              mapStroke="#0a1020"
            />
            {/* Legend pills */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 4, padding: "5px 10px 8px" }}>
              {active.map(n => (
                <span key={n.id} style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "2px 8px", borderRadius: 99, fontSize: 9, color: "#fff", background: n.color + "33", border: `1px solid ${n.color}66` }}>
                  <span style={{ width: 5, height: 5, borderRadius: "50%", backgroundColor: n.color, flexShrink: 0 }} />
                  {n.name}
                </span>
              ))}
            </div>
          </div>

          {/* Nation rows — one per nation, no scroll */}
          <div style={{ flex: 1, padding: "10px 14px 10px 10px", display: "flex", flexDirection: "column", gap: 5, justifyContent: "center" }}>
            {allStats.map(s => (
              <div
                key={s.id}
                style={{ display: "flex", alignItems: "center", gap: 7, padding: "6px 10px", borderRadius: 8, border: `1px solid ${s.color}33`, background: s.color + "10", flexShrink: 0 }}
              >
                {/* Dot + name + state count */}
                <span style={{ width: 7, height: 7, borderRadius: "50%", backgroundColor: s.color, flexShrink: 0 }} />
                <span style={{ fontWeight: 700, fontSize: 11, color: "#fff", width: 90, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flexShrink: 0 }}>{s.name}</span>
                <span style={{ fontSize: 8, color: s.color + "99", flexShrink: 0, width: 30 }}>{s.stateCount} st</span>

                {/* Key stats */}
                <div style={{ display: "flex", gap: 4, flex: 1 }}>
                  {([["Pop", fmtPop(s.population)], ["GDP", fmtGdp(s.gdp)], ["/cap", fmtCap(s.gdpPerCapita)]] as [string,string][]).map(([l, v]) => (
                    <div key={l} style={{ background: s.color + "18", borderRadius: 4, padding: "2px 6px", flexShrink: 0 }}>
                      <span style={{ fontSize: 7, color: "#64748b" }}>{l} </span>
                      <span style={{ fontSize: 10, fontWeight: 700, color: "#f1f5f9", fontFamily: "monospace" }}>{v}</span>
                    </div>
                  ))}
                </div>

                {/* D/R bar */}
                <div style={{ width: 64, flexShrink: 0 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 7, marginBottom: 2 }}>
                    <span style={{ color: "#60a5fa", fontWeight: 600 }}>D {s.demPct}%</span>
                    <span style={{ color: "#f87171", fontWeight: 600 }}>R {100-s.demPct}%</span>
                  </div>
                  <div style={{ display: "flex", height: 4, borderRadius: 99, overflow: "hidden" }}>
                    <div style={{ width: `${s.demPct}%`, background: "#3b82f6" }} />
                    <div style={{ width: `${100-s.demPct}%`, background: "#ef4444" }} />
                  </div>
                </div>

                {/* Race bar */}
                <div style={{ width: 48, flexShrink: 0 }}>
                  <div style={{ display: "flex", height: 4, borderRadius: 99, overflow: "hidden" }}>
                    {RACE_SEGMENTS.map(seg =>
                      s[seg.key] > 0 ? <div key={seg.key} style={{ width: `${s[seg.key]}%`, backgroundColor: seg.color }} /> : null
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div style={{ padding: "6px 20px", background: "#070d1a", borderTop: "1px solid #1e2d4a", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", gap: 10 }}>
            {RACE_SEGMENTS.map(seg => (
              <span key={seg.key} style={{ display: "flex", alignItems: "center", gap: 3, fontSize: 8, color: "#4b6fa8" }}>
                <span style={{ width: 6, height: 6, borderRadius: 2, backgroundColor: seg.color }} />
                {seg.label}
              </span>
            ))}
          </div>
          <span style={{ fontSize: 8, color: "#2d4470", letterSpacing: "0.1em" }}>
            ★ REIMAGINE AMERICA ★
          </span>
        </div>
      </div>
    </div>
  );
}

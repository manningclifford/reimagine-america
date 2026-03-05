"use client";

import { useState, useEffect, useRef } from "react";
import { Nation } from "@/data/scenarios";
import { STATE_DATA } from "@/data/stateData";
import { Theme } from "@/data/themes";

const PRESET_COLORS = [
  "#f43f5e","#ef4444","#f97316","#f59e0b","#eab308",
  "#84cc16","#22c55e","#10b981","#06b6d4",
  "#0ea5e9","#3b82f6","#6366f1","#8b5cf6","#a855f7",
  "#d946ef","#ec4899","#6b7280",
];

const RACE_SEGS = [
  { key: "raceWhite"    as const, color: "#d1d5db", label: "White"    },
  { key: "raceHispanic" as const, color: "#fbbf24", label: "Hispanic" },
  { key: "raceBlack"    as const, color: "#60a5fa", label: "Black"    },
  { key: "raceAsian"    as const, color: "#f472b6", label: "Asian"    },
  { key: "raceOther"    as const, color: "#6b7280", label: "Other"    },
];

type Stats = {
  id: string; name: string; color: string; stateCount: number;
  population: number; gdp: number; gdpPerCapita: number; areaSqMi: number; demPct: number;
  raceWhite: number; raceBlack: number; raceHispanic: number; raceAsian: number; raceOther: number;
};

function compute(nation: Nation): Stats {
  let pop = 0, gdp = 0, area = 0, dv = 0, rv = 0;
  let rW = 0, rB = 0, rH = 0, rA = 0, rO = 0;
  for (const fips of nation.states) {
    const d = STATE_DATA[fips]; if (!d) continue;
    pop += d.population; gdp += d.gdp; area += d.areaSqMi;
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
const fmtArea = (n: number) => n >= 1e6 ? (n/1e6).toFixed(1)+"M" : Math.round(n/1000)+"K";

type Props = {
  nations: Nation[];
  unassignedFips: string[];
  theme: Theme;
  onNationRename: (id: string, name: string) => void;
  onNationColorChange: (id: string, color: string) => void;
  onAddNation: () => void;
  onRemoveNation: (id: string) => void;
};

export default function NationBottomPanel({ nations, unassignedFips, theme, onNationRename, onNationColorChange, onAddNation, onRemoveNation }: Props) {
  const [openPickerId, setOpenPickerId] = useState<string | null>(null);
  const pickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onDown(e: MouseEvent) {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) setOpenPickerId(null);
    }
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  const allStats = nations.map(compute);
  const active = allStats.filter(s => s.stateCount > 0);
  const maxPop  = Math.max(...active.map(s => s.population), 1);
  const maxGdp  = Math.max(...active.map(s => s.gdp), 1);
  const maxCap  = Math.max(...active.map(s => s.gdpPerCapita), 1);
  const maxArea = Math.max(...active.map(s => s.areaSqMi), 1);

  return (
    <div className={`flex-shrink-0 border-t ${theme.sidebarBorder} ${theme.sidebar}`} ref={pickerRef}>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 900 }}>
          <thead>
            <tr className={`${theme.statsCard}`}>
              <th className={`px-3 py-1.5 text-left text-xs font-semibold uppercase tracking-widest ${theme.sidebarHeading} whitespace-nowrap`} style={{ width: 180 }}>Nation</th>
              <th className={`px-2 py-1.5 text-left text-xs font-semibold uppercase tracking-widest ${theme.sidebarHeading} whitespace-nowrap`} style={{ width: 44 }}>St</th>
              <th className={`px-3 py-1.5 text-left text-xs font-semibold uppercase tracking-widest ${theme.sidebarHeading} whitespace-nowrap`} style={{ minWidth: 120 }}>Population</th>
              <th className={`px-3 py-1.5 text-left text-xs font-semibold uppercase tracking-widest ${theme.sidebarHeading} whitespace-nowrap`} style={{ minWidth: 110 }}>GDP</th>
              <th className={`px-3 py-1.5 text-left text-xs font-semibold uppercase tracking-widest ${theme.sidebarHeading} whitespace-nowrap`} style={{ minWidth: 110 }}>GDP / Cap</th>
              <th className={`px-3 py-1.5 text-left text-xs font-semibold uppercase tracking-widest ${theme.sidebarHeading} whitespace-nowrap`} style={{ minWidth: 110 }}>Area (mi²)</th>
              <th className={`px-3 py-1.5 text-left text-xs font-semibold uppercase tracking-widest ${theme.sidebarHeading} whitespace-nowrap`} style={{ minWidth: 120 }}>Political</th>
              <th className={`px-3 py-1.5 text-left text-xs font-semibold uppercase tracking-widest ${theme.sidebarHeading} whitespace-nowrap`} style={{ minWidth: 130 }}>Race</th>
              <th style={{ width: 28 }} />
            </tr>
          </thead>
          <tbody>
            {allStats.map((s) => {
              const isPickerOpen = openPickerId === s.id;
              return (
                <tr key={s.id} className={`border-t ${theme.statsCardDivide}`} style={{ height: 40 }}>
                  {/* Nation name + color picker */}
                  <td className="px-2 py-1" style={{ position: "relative" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <button
                        title="Change color"
                        onClick={() => setOpenPickerId(isPickerOpen ? null : s.id)}
                        style={{ width: 14, height: 14, borderRadius: "50%", backgroundColor: s.color, flexShrink: 0, border: "none", cursor: "pointer", padding: 0 }}
                      />
                      <input
                        className={`flex-1 text-sm bg-transparent focus:outline-none min-w-0 ${theme.nationInput}`}
                        value={s.name}
                        onChange={(e) => onNationRename(s.id, e.target.value)}
                        title="✏ Click to rename"
                      />
                    </div>
                    {/* Color picker popover */}
                    {isPickerOpen && (
                      <div className={`absolute bottom-full left-0 mb-1 z-30 p-2 rounded-lg shadow-xl border ${theme.statsCard} ${theme.sidebarBorder}`} style={{ width: 180 }}>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                          {PRESET_COLORS.map((c) => (
                            <button
                              key={c}
                              onClick={() => { onNationColorChange(s.id, c); setOpenPickerId(null); }}
                              style={{ width: 20, height: 20, borderRadius: "50%", backgroundColor: c, border: c === s.color ? "2px solid white" : "2px solid transparent", cursor: "pointer", padding: 0 }}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </td>

                  {/* State count */}
                  <td className={`px-2 py-1 text-xs font-mono text-center ${theme.statValue}`}>{s.stateCount}</td>

                  {/* Population */}
                  <td className="px-3 py-1" style={{ minWidth: 120 }}>
                    {s.stateCount > 0 ? <MiniBar pct={s.population/maxPop*100} color={s.color} label={fmtPop(s.population)} theme={theme} /> : null}
                  </td>

                  {/* GDP */}
                  <td className="px-3 py-1" style={{ minWidth: 110 }}>
                    {s.stateCount > 0 ? <MiniBar pct={s.gdp/maxGdp*100} color={s.color} label={fmtGdp(s.gdp)} theme={theme} /> : null}
                  </td>

                  {/* GDP/cap */}
                  <td className="px-3 py-1" style={{ minWidth: 110 }}>
                    {s.stateCount > 0 ? <MiniBar pct={s.gdpPerCapita/maxCap*100} color={s.color} label={fmtCap(s.gdpPerCapita)} theme={theme} /> : null}
                  </td>

                  {/* Area */}
                  <td className="px-3 py-1" style={{ minWidth: 110 }}>
                    {s.stateCount > 0 ? <MiniBar pct={s.areaSqMi/maxArea*100} color={s.color} label={fmtArea(s.areaSqMi)} theme={theme} /> : null}
                  </td>

                  {/* Political */}
                  <td className="px-3 py-1" style={{ minWidth: 120 }}>
                    {s.stateCount > 0 && (
                      <div>
                        <div style={{ display: "flex", height: 10, borderRadius: 99, overflow: "hidden", marginBottom: 2 }}>
                          <div style={{ width: `${s.demPct}%`, background: "#3b82f6" }} />
                          <div style={{ width: `${100-s.demPct}%`, background: "#ef4444" }} />
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                          <span style={{ fontSize: 8, color: "#60a5fa", fontWeight: 700 }}>D {s.demPct}%</span>
                          <span style={{ fontSize: 8, color: "#f87171", fontWeight: 700 }}>R {100-s.demPct}%</span>
                        </div>
                      </div>
                    )}
                  </td>

                  {/* Race */}
                  <td className="px-3 py-1" style={{ minWidth: 130 }}>
                    {s.stateCount > 0 && (
                      <div>
                        <div style={{ display: "flex", height: 10, borderRadius: 99, overflow: "hidden", marginBottom: 2 }}>
                          {RACE_SEGS.map(seg => s[seg.key] > 0 ? <div key={seg.key} style={{ width: `${s[seg.key]}%`, backgroundColor: seg.color }} title={`${seg.label}: ${s[seg.key]}%`} /> : null)}
                        </div>
                        <div style={{ display: "flex", gap: 4 }}>
                          {RACE_SEGS.filter(seg => s[seg.key] >= 5).map(seg => (
                            <span key={seg.key} style={{ fontSize: 7, color: seg.color }}>{seg.label[0]}{s[seg.key]}%</span>
                          ))}
                        </div>
                      </div>
                    )}
                  </td>

                  {/* Remove */}
                  <td className="px-1 py-1">
                    {nations.length > 1 && (
                      <button className="text-xs text-red-500/40 hover:text-red-400" onClick={() => onRemoveNation(s.id)} title="Remove nation">✕</button>
                    )}
                  </td>
                </tr>
              );
            })}

            {/* Unassigned row */}
            {unassignedFips.length > 0 && (
              <tr className={`border-t ${theme.statsCardDivide}`} style={{ height: 36 }}>
                <td className="px-2 py-1" colSpan={2}>
                  <span className={`text-xs italic ${theme.statLabel}`}>Unassigned ({unassignedFips.length} states)</span>
                </td>
                <td colSpan={7} />
              </tr>
            )}

            {/* Add nation row */}
            {nations.length < 8 && (
              <tr className={`border-t ${theme.statsCardDivide}`}>
                <td colSpan={9} className="px-2 py-1">
                  <button
                    onClick={onAddNation}
                    className={`text-xs transition-colors ${theme.addNationBtn} px-3 py-1 rounded-lg border`}
                  >
                    + Add nation
                  </button>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function MiniBar({ pct, color, label, theme }: { pct: number; color: string; label: string; theme: Theme }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
      <div style={{ flex: 1, height: 10, borderRadius: 99, overflow: "hidden", background: "rgba(100,116,139,0.15)" }}>
        <div style={{ width: `${Math.max(pct, 2)}%`, height: "100%", background: color, borderRadius: 99 }} />
      </div>
      <span className={`text-xs font-mono flex-shrink-0 ${theme.statValue}`} style={{ fontSize: 9, minWidth: 36, textAlign: "right" }}>{label}</span>
    </div>
  );
}

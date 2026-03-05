"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { Nation, Scenario } from "@/data/scenarios";
import { STATE_DATA } from "@/data/stateData";
import { Theme, ThemeId } from "@/data/themes";

const USMap = dynamic(() => import("@/components/USMap"), { ssr: false });

const PRESET_COLORS = [
  "#f43f5e","#ef4444","#f97316","#f59e0b","#eab308",
  "#84cc16","#22c55e","#10b981","#06b6d4",
  "#0ea5e9","#3b82f6","#6366f1","#8b5cf6","#a855f7",
  "#d946ef","#ec4899","#6b7280",
];

type Tab = "nations" | "states" | "map" | "summary";

function computeStats(nation: Nation) {
  let pop = 0, gdp = 0, area = 0, dv = 0, rv = 0;
  for (const fips of nation.states) {
    const d = STATE_DATA[fips]; if (!d) continue;
    pop += d.population; gdp += d.gdp; area += d.areaSqMi;
    dv += d.demPct * d.population; rv += (100 - d.demPct) * d.population;
  }
  const tv = dv + rv;
  return {
    ...nation,
    stateCount: nation.states.length,
    population: pop, gdp, areaSqMi: area,
    demPct: tv > 0 ? Math.round((dv / tv) * 100) : 50,
  };
}

const fmtPop = (n: number) => n >= 1e6 ? (n / 1e6).toFixed(1) + "M" : n >= 1e3 ? Math.round(n / 1e3) + "K" : String(n);
const fmtGdp = (n: number) => n >= 1000 ? "$" + (n / 1000).toFixed(1) + "T" : "$" + n.toFixed(0) + "B";
const fmtArea = (n: number) => Math.round(n / 1000) + "K mi²";

const SORTED_STATES = Object.entries(STATE_DATA)
  .map(([fips, d]) => ({ fips, name: d.name, abbr: d.abbr }))
  .sort((a, b) => a.name.localeCompare(b.name));

type Props = {
  nations: Nation[];
  scenarios: Scenario[];
  scenarioNames: Record<string, string>;
  activeScenarioId: string;
  theme: Theme;
  themeId: ThemeId;
  stateColors: Record<string, string>;
  stateNations: Record<string, string>;
  unassignedCount: number;
  onNationRename: (id: string, name: string) => void;
  onNationColorChange: (id: string, color: string) => void;
  onAddNation: () => void;
  onRemoveNation: (id: string) => void;
  onStateAssign: (fips: string, nationId: string | null) => void;
  onStateClick: (fips: string) => void;
  onSelectScenario: (id: string) => void;
  onResetScenario: () => void;
  onRandomize: () => void;
  onThemeToggle: () => void;
};

export default function MobileLayout({
  nations, scenarios, scenarioNames, activeScenarioId,
  theme, themeId, stateColors, stateNations, unassignedCount,
  onNationRename, onNationColorChange, onAddNation, onRemoveNation,
  onStateAssign, onStateClick, onSelectScenario, onResetScenario, onRandomize, onThemeToggle,
}: Props) {
  const [tab, setTab] = useState<Tab>("nations");
  const [openColorId, setOpenColorId] = useState<string | null>(null);

  // fips → nationId lookup
  const fipsNation: Record<string, string> = {};
  for (const n of nations) for (const f of n.states) fipsNation[f] = n.id;

  const stats = nations.map(computeStats);

  const TABS: { id: Tab; label: string; emoji: string }[] = [
    { id: "nations", label: "Nations", emoji: "🏳" },
    { id: "states",  label: "States",  emoji: "📋" },
    { id: "map",     label: "Map",     emoji: "🗺" },
    { id: "summary", label: "Summary", emoji: "📊" },
  ];

  return (
    <div className={`h-screen flex flex-col overflow-hidden ${theme.root}`}>

      {/* Header */}
      <header className={`flex-shrink-0 px-3 py-2 flex items-center gap-2 ${theme.header}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/flag.png" alt=""
          style={{ width: 26, height: 17, objectFit: "cover", borderRadius: 2,
            filter: themeId === "parchment" ? "none" : "invert(1)", flexShrink: 0 }}
        />
        <span className={`text-sm font-bold tracking-tight ${theme.headerText}`}>Redraw America</span>
        <div className="ml-auto flex gap-1">
          <button onClick={onThemeToggle} className={`text-xs px-2 py-1 rounded border ${theme.resetBtn}`}>
            {themeId === "dark" ? "☀" : "🌙"}
          </button>
          <button onClick={onRandomize} className={`text-xs px-2 py-1 rounded border ${theme.resetBtn}`}>🎲</button>
          <button onClick={onResetScenario} className={`text-xs px-2 py-1 rounded border ${theme.resetBtn}`}>Reset</button>
        </div>
      </header>

      {/* Scenario pill scroller */}
      <div
        className={`flex-shrink-0 flex gap-1.5 px-2 py-1.5 overflow-x-auto border-b ${theme.sidebarBorder}`}
        style={{ scrollbarWidth: "none" }}
      >
        {scenarios.map(s => (
          <button
            key={s.id}
            onClick={() => onSelectScenario(s.id)}
            className={`text-xs px-3 py-1 rounded-full whitespace-nowrap flex-shrink-0 transition-colors ${
              activeScenarioId === s.id ? theme.scenarioBtnActive : theme.scenarioBtn
            }`}
          >
            {scenarioNames[s.id] ?? s.name}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-hidden relative">

        {/* ── NATIONS ── */}
        {tab === "nations" && (
          <div className="h-full overflow-y-auto p-3 space-y-2">
            {nations.map(n => (
              <div
                key={n.id}
                className={`rounded-lg px-3 py-2.5 border ${theme.sidebarBorder} ${theme.statsCard} flex items-center gap-2`}
              >
                {/* Color dot + picker */}
                <div style={{ position: "relative", flexShrink: 0 }}>
                  <button
                    onClick={() => setOpenColorId(openColorId === n.id ? null : n.id)}
                    style={{ width: 20, height: 20, borderRadius: "50%", backgroundColor: n.color,
                      border: "none", cursor: "pointer", display: "block" }}
                    title="Change color"
                  />
                  {openColorId === n.id && (
                    <div
                      className={`absolute top-full left-0 mt-1 z-30 p-2 rounded-lg shadow-xl border ${theme.statsCard} ${theme.sidebarBorder}`}
                      style={{ width: 168 }}
                    >
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                        {PRESET_COLORS.map(c => (
                          <button
                            key={c}
                            onClick={() => { onNationColorChange(n.id, c); setOpenColorId(null); }}
                            style={{ width: 22, height: 22, borderRadius: "50%", backgroundColor: c,
                              border: c === n.color ? "2px solid white" : "2px solid transparent",
                              cursor: "pointer", padding: 0 }}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Name */}
                <input
                  className={`flex-1 text-sm bg-transparent focus:outline-none min-w-0 ${theme.nationInput}`}
                  value={n.name}
                  onChange={e => onNationRename(n.id, e.target.value)}
                  title="✏ Rename"
                />
                <span className="text-xs opacity-30 pointer-events-none">✏</span>

                {/* State count badge */}
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-mono flex-shrink-0 ${theme.scenarioBtnActive}`}
                  style={{ fontSize: 10 }}
                >
                  {n.states.length}
                </span>

                {/* Remove */}
                {nations.length > 1 && (
                  <button
                    onClick={() => onRemoveNation(n.id)}
                    className="text-red-400/60 hover:text-red-500 font-bold flex-shrink-0"
                    style={{ fontSize: 14 }}
                  >✕</button>
                )}
              </div>
            ))}

            {nations.length < 8 && (
              <button
                onClick={onAddNation}
                className={`w-full text-xs py-2.5 rounded-lg border transition-colors ${theme.addNationBtn}`}
              >
                + Add nation
              </button>
            )}

            <p className={`text-xs text-center pt-1 pb-2 opacity-60 ${theme.statLabel}`}>
              Set up your nations, then head to States →
            </p>
          </div>
        )}

        {/* ── STATES ── */}
        {tab === "states" && (
          <div className="h-full overflow-auto">
            <table style={{ borderCollapse: "collapse", minWidth: "100%" }}>
              <thead>
                <tr
                  className={theme.statsCard}
                  style={{ position: "sticky", top: 0, zIndex: 2 }}
                >
                  <th
                    className={`px-3 py-2 text-left text-xs font-semibold ${theme.sidebarHeading}`}
                    style={{ minWidth: 110, position: "sticky", left: 0, zIndex: 3 }}
                  >
                    <span className={theme.statsCard + " pr-2"}>State</span>
                  </th>
                  {nations.map(n => (
                    <th key={n.id} className="px-2 py-2 text-center" style={{ minWidth: 44 }}>
                      <div style={{ width: 16, height: 16, borderRadius: "50%",
                        backgroundColor: n.color, margin: "0 auto" }} title={n.name} />
                    </th>
                  ))}
                  {/* Unassign column */}
                  <th className={`px-2 py-2 text-center text-xs ${theme.statLabel}`} style={{ minWidth: 40 }}>—</th>
                </tr>
              </thead>
              <tbody>
                {SORTED_STATES.map(({ fips, name }) => {
                  const currentNationId = fipsNation[fips] ?? null;
                  return (
                    <tr key={fips} className={`border-t ${theme.statsCardDivide}`}>
                      <td
                        className={`px-3 py-2 text-xs whitespace-nowrap ${theme.statValue} ${theme.statsCard}`}
                        style={{ position: "sticky", left: 0 }}
                      >
                        {name}
                      </td>
                      {nations.map(n => (
                        <td key={n.id} className="px-2 py-2 text-center">
                          <input
                            type="radio"
                            name={`state-${fips}`}
                            checked={currentNationId === n.id}
                            onChange={() => onStateAssign(fips, n.id)}
                            style={{ accentColor: n.color, width: 17, height: 17, cursor: "pointer" }}
                          />
                        </td>
                      ))}
                      {/* Unassign */}
                      <td className="px-2 py-2 text-center">
                        <input
                          type="radio"
                          name={`state-${fips}`}
                          checked={currentNationId === null}
                          onChange={() => onStateAssign(fips, null)}
                          style={{ width: 17, height: 17, cursor: "pointer" }}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* ── MAP ── */}
        {tab === "map" && (
          <div className="h-full flex items-center justify-center p-4">
            <USMap
              stateColors={stateColors}
              stateNations={stateNations}
              onStateClick={onStateClick}
              mapBg={theme.mapBg}
              mapStroke={theme.mapStroke}
            />
          </div>
        )}

        {/* ── SUMMARY ── */}
        {tab === "summary" && (
          <div className="h-full overflow-y-auto p-3 space-y-2">
            {stats.filter(s => s.stateCount > 0).map(s => (
              <div key={s.id} className={`rounded-lg p-3 border ${theme.sidebarBorder} ${theme.statsCard}`}>
                <div className="flex items-center gap-2 mb-2">
                  <div style={{ width: 14, height: 14, borderRadius: "50%",
                    backgroundColor: s.color, flexShrink: 0 }} />
                  <span className={`text-sm font-semibold ${theme.headerText}`}>{s.name}</span>
                  <span className={`text-xs ml-auto ${theme.statLabel}`}>{s.stateCount} states</span>
                </div>

                <div className="grid grid-cols-3 gap-2 mb-2">
                  {[
                    { label: "Population", value: fmtPop(s.population) },
                    { label: "GDP",        value: fmtGdp(s.gdp) },
                    { label: "Area",       value: fmtArea(s.areaSqMi) },
                  ].map(({ label, value }) => (
                    <div key={label}>
                      <div className={`text-xs ${theme.statLabel}`} style={{ fontSize: 9 }}>{label}</div>
                      <div className={`font-mono font-semibold ${theme.statValue}`} style={{ fontSize: 11 }}>{value}</div>
                    </div>
                  ))}
                </div>

                {/* Political bar */}
                <div>
                  <div style={{ display: "flex", height: 8, borderRadius: 99, overflow: "hidden" }}>
                    <div style={{ width: `${s.demPct}%`, background: "#3b82f6" }} />
                    <div style={{ width: `${100 - s.demPct}%`, background: "#ef4444" }} />
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: 2 }}>
                    <span style={{ fontSize: 8, color: "#60a5fa", fontWeight: 700 }}>D {s.demPct}%</span>
                    <span style={{ fontSize: 8, color: "#f87171", fontWeight: 700 }}>R {100 - s.demPct}%</span>
                  </div>
                </div>
              </div>
            ))}

            {unassignedCount > 0 && (
              <p className={`text-xs text-center py-2 ${theme.statLabel}`}>
                {unassignedCount} state{unassignedCount !== 1 ? "s" : ""} unassigned
              </p>
            )}
          </div>
        )}
      </div>

      {/* Bottom tab bar */}
      <div className={`flex-shrink-0 flex border-t ${theme.sidebarBorder} ${theme.header}`}>
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex-1 py-2.5 flex flex-col items-center gap-0.5 text-xs font-medium transition-colors ${
              tab === t.id ? theme.scenarioBtnActive : theme.scenarioBtn
            }`}
          >
            <span style={{ fontSize: 16 }}>{t.emoji}</span>
            <span style={{ fontSize: 10 }}>{t.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

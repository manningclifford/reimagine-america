"use client";

import { useState, useEffect, useRef } from "react";
import { Nation } from "@/data/scenarios";
import { STATE_DATA } from "@/data/stateData";
import { Theme } from "@/data/themes";

const PRESET_COLORS = [
  "#f43f5e","#ef4444","#f97316","#f59e0b","#eab308",
  "#84cc16","#22c55e","#10b981","#14b8a6","#06b6d4",
  "#0ea5e9","#3b82f6","#6366f1","#8b5cf6","#a855f7",
  "#d946ef","#ec4899","#6b7280",
];

type Props = {
  nations: Nation[];
  unassignedFips: string[];
  theme: Theme;
  onNationColorChange: (id: string, color: string) => void;
};

type Stats = {
  id: string;
  name: string;
  color: string;
  stateCount: number;
  population: number;
  gdp: number;
  gdpPerCapita: number;
  areaSqMi: number;
  demPct: number;
  raceWhite: number;
  raceBlack: number;
  raceHispanic: number;
  raceAsian: number;
  raceOther: number;
};

function computeStats(nation: Nation): Stats {
  let population = 0, gdp = 0, areaSqMi = 0;
  let demVotes = 0, repVotes = 0;
  let rW = 0, rB = 0, rH = 0, rA = 0, rO = 0;

  for (const fips of nation.states) {
    const d = STATE_DATA[fips];
    if (!d) continue;
    population += d.population;
    gdp        += d.gdp;
    areaSqMi   += d.areaSqMi;
    demVotes   += d.demPct * d.population;
    repVotes   += (100 - d.demPct) * d.population;
    rW += d.raceWhite    * d.population;
    rB += d.raceBlack    * d.population;
    rH += d.raceHispanic * d.population;
    rA += d.raceAsian    * d.population;
    rO += d.raceOther    * d.population;
  }

  const totalVotes = demVotes + repVotes;
  const demPct = totalVotes > 0 ? Math.round((demVotes / totalVotes) * 100) : 50;
  const gdpPerCapita = population > 0 ? (gdp * 1e9) / population : 0;

  if (population > 0) {
    rW = Math.round(rW / population);
    rB = Math.round(rB / population);
    rH = Math.round(rH / population);
    rA = Math.round(rA / population);
    rO = Math.round(rO / population);
  }

  return {
    id: nation.id, name: nation.name, color: nation.color,
    stateCount: nation.states.length,
    population, gdp, gdpPerCapita, areaSqMi,
    demPct,
    raceWhite: rW, raceBlack: rB, raceHispanic: rH, raceAsian: rA, raceOther: rO,
  };
}

function fmtPop(n: number)  { return n >= 1e6 ? (n/1e6).toFixed(1)+"M" : n >= 1e3 ? (n/1e3).toFixed(0)+"K" : String(n); }
function fmtGdp(b: number)  { return b >= 1000 ? "$"+(b/1000).toFixed(1)+"T" : "$"+b.toFixed(0)+"B"; }
function fmtArea(s: number) { return s >= 1e6 ? (s/1e6).toFixed(1)+"M" : s >= 1e3 ? Math.round(s/1e3)+"K" : String(s); }

export default function NationStats({ nations, unassignedFips, theme, onNationColorChange }: Props) {
  const [openPickerId, setOpenPickerId] = useState<string | null>(null);
  const pickerRef = useRef<HTMLDivElement>(null);

  const activeNations = nations.filter((n) => n.states.length > 0);

  // Close picker on outside click
  useEffect(() => {
    function onDown(e: MouseEvent) {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
        setOpenPickerId(null);
      }
    }
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  if (activeNations.length === 0) {
    return (
      <div className={`text-sm italic ${theme.statLabel}`}>
        Click any state on the map to cycle it through nations.
      </div>
    );
  }

  const allStats = activeNations.map(computeStats);

  const maxPop  = Math.max(...allStats.map(s => s.population), 1);
  const maxGdp  = Math.max(...allStats.map(s => s.gdp), 1);
  const maxCap  = Math.max(...allStats.map(s => s.gdpPerCapita), 1);
  const maxArea = Math.max(...allStats.map(s => s.areaSqMi), 1);

  return (
    <div className="space-y-5" ref={pickerRef}>

      {/* ── Population ─────────────────────────────────────────── */}
      <StatSection label="Population" theme={theme}>
        {allStats.map(s => (
          <NationRow
            key={s.id}
            stats={s}
            barPct={s.population / maxPop * 100}
            value={fmtPop(s.population)}
            theme={theme}
            isPickerOpen={openPickerId === s.id}
            onTogglePicker={() => setOpenPickerId(openPickerId === s.id ? null : s.id)}
            onColorChange={(c) => { onNationColorChange(s.id, c); setOpenPickerId(null); }}
          />
        ))}
      </StatSection>

      {/* ── GDP ────────────────────────────────────────────────── */}
      <StatSection label="GDP (total)" theme={theme}>
        {allStats.map(s => (
          <NationRow
            key={s.id}
            stats={s}
            barPct={s.gdp / maxGdp * 100}
            value={fmtGdp(s.gdp)}
            theme={theme}
            onTogglePicker={() => {}}
          />
        ))}
      </StatSection>

      {/* ── GDP per capita ─────────────────────────────────────── */}
      <StatSection label="GDP per capita" theme={theme}>
        {allStats.map(s => (
          <NationRow
            key={s.id}
            stats={s}
            barPct={s.gdpPerCapita / maxCap * 100}
            value={"$" + Math.round(s.gdpPerCapita / 1000).toLocaleString() + "K"}
            theme={theme}
            onTogglePicker={() => {}}
          />
        ))}
      </StatSection>

      {/* ── Area ───────────────────────────────────────────────── */}
      <StatSection label="Area (mi²)" theme={theme}>
        {allStats.map(s => (
          <NationRow
            key={s.id}
            stats={s}
            barPct={s.areaSqMi / maxArea * 100}
            value={fmtArea(s.areaSqMi)}
            theme={theme}
            onTogglePicker={() => {}}
          />
        ))}
      </StatSection>

      {/* ── Political lean ─────────────────────────────────────── */}
      <StatSection label="Political lean (2024)" theme={theme}>
        {allStats.map(s => (
          <div key={s.id} className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: s.color }} />
              <span className={`text-xs truncate flex-1 min-w-0 ${theme.statValue}`}>{s.name}</span>
              <span className="text-blue-500 text-xs font-semibold flex-shrink-0">D{s.demPct}</span>
              <span className={`text-xs ${theme.statLabel}`}>/</span>
              <span className="text-red-500 text-xs font-semibold flex-shrink-0">R{100 - s.demPct}</span>
            </div>
            <div className="flex h-2 rounded-full overflow-hidden ml-4">
              <div className="bg-blue-500 h-full" style={{ width: `${s.demPct}%` }} />
              <div className="bg-red-500 h-full"  style={{ width: `${100 - s.demPct}%` }} />
            </div>
          </div>
        ))}
      </StatSection>

      {/* ── Racial breakdown ───────────────────────────────────── */}
      <StatSection label="Racial breakdown" theme={theme}>
        {allStats.map(s => (
          <div key={s.id} className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: s.color }} />
              <span className={`text-xs truncate flex-1 min-w-0 ${theme.statValue}`}>{s.name}</span>
              <span className={`text-xs ${theme.statLabel}`}>{s.raceWhite}% W · {s.raceHispanic}% H · {s.raceBlack}% B</span>
            </div>
            <div className="flex h-2 rounded-full overflow-hidden ml-4">
              {([
                { pct: s.raceWhite,    color: "#d1d5db" },
                { pct: s.raceHispanic, color: "#fbbf24" },
                { pct: s.raceBlack,    color: "#60a5fa" },
                { pct: s.raceAsian,    color: "#f472b6" },
                { pct: s.raceOther,    color: "#6b7280"  },
              ]).map((seg, i) =>
                seg.pct > 0 ? <div key={i} className="h-full" style={{ width: `${seg.pct}%`, backgroundColor: seg.color }} /> : null
              )}
            </div>
          </div>
        ))}
        {/* legend */}
        <div className={`flex flex-wrap gap-x-2.5 gap-y-0.5 text-xs pt-0.5 ${theme.statLabel}`}>
          {[["#d1d5db","White"],["#fbbf24","Hispanic"],["#60a5fa","Black"],["#f472b6","Asian"],["#6b7280","Other"]].map(([c,l])=>(
            <span key={l} className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-sm inline-block" style={{ backgroundColor: c }} />{l}
            </span>
          ))}
        </div>
      </StatSection>

      {unassignedFips.length > 0 && (
        <p className={`text-xs ${theme.statLabel}`}>
          {unassignedFips.length} state{unassignedFips.length !== 1 ? "s" : ""} unassigned
        </p>
      )}
    </div>
  );
}

function StatSection({ label, theme, children }: { label: string; theme: Theme; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <div className={`text-xs font-semibold uppercase tracking-widest ${theme.statLabel}`}>{label}</div>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function NationRow({ stats, barPct, value, theme, isPickerOpen, onTogglePicker, onColorChange }: {
  stats: Stats;
  barPct: number;
  value: string;
  theme: Theme;
  isPickerOpen?: boolean;
  onTogglePicker: () => void;
  onColorChange?: (c: string) => void;
}) {
  return (
    <div className="space-y-0.5">
      <div className="flex items-center gap-2">
        {/* Clickable color dot — only first section gets the picker trigger */}
        {onColorChange ? (
          <button
            className="w-2.5 h-2.5 rounded-full flex-shrink-0 hover:scale-125 transition-transform ring-offset-1 focus:outline-none"
            style={{ backgroundColor: stats.color, boxShadow: isPickerOpen ? `0 0 0 2px white, 0 0 0 3px ${stats.color}` : undefined }}
            onClick={onTogglePicker}
            title="Change colour"
          />
        ) : (
          <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: stats.color }} />
        )}
        <span className={`text-xs truncate flex-1 min-w-0 ${theme.statValue}`}>{stats.name}</span>
        <span className={`text-xs font-mono flex-shrink-0 ${theme.statLabel}`}>{value}</span>
      </div>

      {/* Bar */}
      <div className="ml-4 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: stats.color + "22" }}>
        <div
          className="h-full rounded-full transition-all duration-300"
          style={{ width: `${barPct}%`, backgroundColor: stats.color }}
        />
      </div>

      {/* Colour picker popover */}
      {isPickerOpen && onColorChange && (
        <div
          className="ml-4 mt-1.5 p-2 rounded-lg shadow-xl border z-20 relative"
          style={{ backgroundColor: "var(--picker-bg, #1f2937)", borderColor: "var(--picker-border, #374151)" }}
        >
          <div className="flex flex-wrap gap-1.5">
            {PRESET_COLORS.map((c) => (
              <button
                key={c}
                className={`w-5 h-5 rounded-full hover:scale-110 transition-transform ${stats.color === c ? "ring-2 ring-white scale-110" : ""}`}
                style={{ backgroundColor: c }}
                onClick={() => onColorChange(c)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

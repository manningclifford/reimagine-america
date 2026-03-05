"use client";

import { Nation } from "@/data/scenarios";
import { STATE_DATA } from "@/data/stateData";
import { Theme } from "@/data/themes";

type Props = {
  nations: Nation[];
  unassignedFips: string[];
  theme: Theme;
};

type Stats = {
  population: number;
  gdp: number;
  areaSqMi: number;
  stateCount: number;
  demVotes: number;
  repVotes: number;
  raceWhite: number;
  raceBlack: number;
  raceHispanic: number;
  raceAsian: number;
  raceOther: number;
};

function computeStats(fipsList: string[]): Stats {
  let population = 0, gdp = 0, areaSqMi = 0;
  let demVotes = 0, repVotes = 0;
  let raceWhite = 0, raceBlack = 0, raceHispanic = 0, raceAsian = 0, raceOther = 0;

  for (const fips of fipsList) {
    const d = STATE_DATA[fips];
    if (!d) continue;
    population += d.population;
    gdp += d.gdp;
    areaSqMi += d.areaSqMi;
    demVotes    += d.demPct * d.population;
    repVotes    += (100 - d.demPct) * d.population;
    raceWhite    += d.raceWhite    * d.population;
    raceBlack    += d.raceBlack    * d.population;
    raceHispanic += d.raceHispanic * d.population;
    raceAsian    += d.raceAsian    * d.population;
    raceOther    += d.raceOther    * d.population;
  }

  if (population > 0) {
    raceWhite    = Math.round(raceWhite    / population);
    raceBlack    = Math.round(raceBlack    / population);
    raceHispanic = Math.round(raceHispanic / population);
    raceAsian    = Math.round(raceAsian    / population);
    raceOther    = Math.round(raceOther    / population);
  }

  return { population, gdp, areaSqMi, stateCount: fipsList.length, demVotes, repVotes,
           raceWhite, raceBlack, raceHispanic, raceAsian, raceOther };
}

function fmtPop(n: number)  { return n >= 1e6 ? (n/1e6).toFixed(1)+"M" : n >= 1e3 ? (n/1e3).toFixed(0)+"K" : String(n); }
function fmtGdp(b: number)  { return b >= 1000 ? "$"+(b/1000).toFixed(1)+"T" : "$"+b.toFixed(0)+"B"; }
function fmtArea(s: number) { return s >= 1e6 ? (s/1e6).toFixed(2)+"M mi²" : s >= 1e3 ? (s/1e3).toFixed(0)+"K mi²" : s+" mi²"; }

export default function NationStats({ nations, unassignedFips, theme }: Props) {
  const activeNations = nations.filter((n) => n.states.length > 0);

  if (activeNations.length === 0) {
    return (
      <div className={`text-sm italic ${theme.statLabel}`}>
        Click any state on the map to cycle it through nations.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {activeNations.map((nation) => {
        const s = computeStats(nation.states);
        const totalVotes = s.demVotes + s.repVotes;
        const demPct = totalVotes > 0 ? Math.round((s.demVotes / totalVotes) * 100) : 50;
        const repPct = 100 - demPct;
        const gdpPerCapita = s.population > 0 ? (s.gdp * 1e9) / s.population : 0;

        return (
          <div key={nation.id} className={`rounded-xl overflow-hidden ${theme.statsCard}`}>
            {/* Header */}
            <div
              className="px-3 py-2.5 flex items-center gap-2"
              style={{ backgroundColor: nation.color + "22", borderBottom: `2px solid ${nation.color}` }}
            >
              <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: nation.color }} />
              <span className={`font-semibold text-sm truncate ${theme.statValue}`}>{nation.name}</span>
              <span className={`ml-auto text-xs flex-shrink-0 ${theme.statLabel}`}>
                {s.stateCount} state{s.stateCount !== 1 ? "s" : ""}
              </span>
            </div>

            <div className={`divide-y ${theme.statsCardDivide}`}>
              {/* Core row */}
              <div className={`grid grid-cols-3 divide-x ${theme.statsCardDivide}`}>
                <MiniStat label="Population" value={fmtPop(s.population)} theme={theme} />
                <MiniStat label="GDP" value={fmtGdp(s.gdp)} theme={theme} />
                <MiniStat label="Area" value={fmtArea(s.areaSqMi)} theme={theme} />
              </div>

              {/* GDP per capita */}
              <div className="flex items-center justify-between px-3 py-2">
                <span className={`text-xs ${theme.statLabel}`}>GDP per capita</span>
                <span className={`text-sm font-mono font-semibold ${theme.statValue}`}>
                  ${Math.round(gdpPerCapita / 1000).toLocaleString()}K
                </span>
              </div>

              {/* D/R split */}
              <div className="px-3 py-2 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-blue-500 font-semibold">Dem {demPct}%</span>
                  <span className={theme.statLabel}>political lean</span>
                  <span className="text-red-500 font-semibold">Rep {repPct}%</span>
                </div>
                <div className="flex h-2 rounded-full overflow-hidden">
                  <div className="bg-blue-500 h-full" style={{ width: `${demPct}%` }} />
                  <div className="bg-red-500 h-full" style={{ width: `${repPct}%` }} />
                </div>
              </div>

              {/* Race */}
              <div className="px-3 py-2 space-y-1.5">
                <span className={`text-xs ${theme.statLabel}`}>Racial breakdown</span>
                <div className="flex h-2.5 rounded-full overflow-hidden w-full">
                  {([
                    { pct: s.raceWhite,    color: "#e5e7eb", label: "White" },
                    { pct: s.raceHispanic, color: "#fbbf24", label: "Hispanic" },
                    { pct: s.raceBlack,    color: "#60a5fa", label: "Black" },
                    { pct: s.raceAsian,    color: "#f472b6", label: "Asian" },
                    { pct: s.raceOther,    color: "#6b7280", label: "Other" },
                  ] as const).map((seg) =>
                    seg.pct > 0 ? (
                      <div key={seg.label} className="h-full" style={{ width: `${seg.pct}%`, backgroundColor: seg.color }} title={`${seg.label}: ${seg.pct}%`} />
                    ) : null
                  )}
                </div>
                <div className={`flex flex-wrap gap-x-2.5 gap-y-0.5 text-xs ${theme.statLabel}`}>
                  {([
                    { pct: s.raceWhite,    color: "#e5e7eb", label: "White" },
                    { pct: s.raceHispanic, color: "#fbbf24", label: "Hispanic" },
                    { pct: s.raceBlack,    color: "#60a5fa", label: "Black" },
                    { pct: s.raceAsian,    color: "#f472b6", label: "Asian" },
                    { pct: s.raceOther,    color: "#6b7280", label: "Other" },
                  ] as const).map((seg) => (
                    <span key={seg.label} className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-sm inline-block" style={{ backgroundColor: seg.color }} />
                      {seg.label} {seg.pct}%
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {unassignedFips.length > 0 && (
        <p className={`text-xs pt-1 ${theme.statLabel}`}>
          {unassignedFips.length} state{unassignedFips.length !== 1 ? "s" : ""} unassigned
        </p>
      )}
    </div>
  );
}

function MiniStat({ label, value, theme }: { label: string; value: string; theme: Theme }) {
  return (
    <div className="px-2 py-2 text-center">
      <div className={`text-xs ${theme.statLabel}`}>{label}</div>
      <div className={`text-xs font-mono font-semibold mt-0.5 ${theme.statValue}`}>{value}</div>
    </div>
  );
}

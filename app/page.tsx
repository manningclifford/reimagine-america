"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import dynamic from "next/dynamic";
import { SCENARIOS, Nation } from "@/data/scenarios";
import { STATE_DATA } from "@/data/stateData";
import { THEMES, ThemeId } from "@/data/themes";
import ScenarioPanel from "@/components/ScenarioPanel";
import NationBottomPanel from "@/components/NationBottomPanel";
import StarTicker from "@/components/StarTicker";
import StatsModal from "@/components/StatsModal";

const USMap = dynamic(() => import("@/components/USMap"), { ssr: false });

const EXTRA_COLORS = [
  "#f43f5e","#3b82f6","#10b981","#f59e0b","#8b5cf6",
  "#06b6d4","#ec4899","#84cc16",
];

function deepCloneNations(nations: Nation[]): Nation[] {
  return nations.map((n) => ({ ...n, states: [...n.states] }));
}

export default function Home() {
  const [themeId, setThemeId] = useState<ThemeId>("parchment");
  const [activeScenarioId, setActiveScenarioId] = useState<string>(SCENARIOS[0].id);
  const [scenarioNations, setScenarioNations] = useState<Record<string, Nation[]>>(
    () => Object.fromEntries(SCENARIOS.map((s) => [s.id, deepCloneNations(s.nations)]))
  );
  const [leftOpen, setLeftOpen] = useState(true);
  const [statsOpen, setStatsOpen] = useState(false);
  const [scenarioNames, setScenarioNames] = useState<Record<string, string>>(
    () => Object.fromEntries(SCENARIOS.map((s) => [s.id, s.name]))
  );

  const theme = THEMES[themeId];
  const nations = scenarioNations[activeScenarioId] ?? [];
  const activeScenarioName = scenarioNames[activeScenarioId] ?? "";

  const stateColors = useMemo<Record<string, string>>(() => {
    const map: Record<string, string> = {};
    for (const nation of nations) {
      for (const fips of nation.states) map[fips] = nation.color;
    }
    return map;
  }, [nations]);

  const stateNations = useMemo<Record<string, string>>(() => {
    const map: Record<string, string> = {};
    for (const nation of nations) {
      for (const fips of nation.states) map[fips] = nation.name;
    }
    return map;
  }, [nations]);

  const allFips = Object.keys(STATE_DATA);
  const assignedFips = new Set(nations.flatMap((n) => n.states));
  const unassignedFips = allFips.filter((f) => !assignedFips.has(f));

  const handleSelectScenario = useCallback((id: string) => setActiveScenarioId(id), []);

  const handleStateClick = useCallback((fips: string) => {
    setScenarioNations((prev) => {
      const current = prev[activeScenarioId];
      const updated = deepCloneNations(current);
      const currentNationIdx = updated.findIndex((n) => n.states.includes(fips));
      for (const nation of updated) nation.states = nation.states.filter((s) => s !== fips);
      const nextIdx = currentNationIdx + 1;
      if (nextIdx < updated.length) updated[nextIdx].states.push(fips);
      return { ...prev, [activeScenarioId]: updated };
    });
  }, [activeScenarioId]);

  const handleNationRename = useCallback((nationId: string, name: string) => {
    setScenarioNations((prev) => {
      const updated = deepCloneNations(prev[activeScenarioId]);
      const n = updated.find((n) => n.id === nationId);
      if (n) n.name = name;
      return { ...prev, [activeScenarioId]: updated };
    });
  }, [activeScenarioId]);

  const handleNationColorChange = useCallback((nationId: string, color: string) => {
    setScenarioNations((prev) => {
      const updated = deepCloneNations(prev[activeScenarioId]);
      const n = updated.find((n) => n.id === nationId);
      if (n) n.color = color;
      return { ...prev, [activeScenarioId]: updated };
    });
  }, [activeScenarioId]);

  const handleAddNation = useCallback(() => {
    setScenarioNations((prev) => {
      const current = prev[activeScenarioId];
      const newNation: Nation = {
        id: `custom-${Date.now()}`,
        name: `New Nation ${current.length + 1}`,
        color: EXTRA_COLORS[current.length % EXTRA_COLORS.length],
        states: [],
      };
      return { ...prev, [activeScenarioId]: [...deepCloneNations(current), newNation] };
    });
  }, [activeScenarioId]);

  const handleRemoveNation = useCallback((nationId: string) => {
    setScenarioNations((prev) => {
      const updated = deepCloneNations(prev[activeScenarioId]).filter((n) => n.id !== nationId);
      return { ...prev, [activeScenarioId]: updated };
    });
  }, [activeScenarioId]);

  const handleResetScenario = useCallback(() => {
    const original = SCENARIOS.find((s) => s.id === activeScenarioId);
    if (!original) return;
    setScenarioNations((prev) => ({
      ...prev,
      [activeScenarioId]: deepCloneNations(original.nations),
    }));
  }, [activeScenarioId]);

  const handleScenarioRename = useCallback((id: string, name: string) => {
    setScenarioNames((prev) => ({ ...prev, [id]: name }));
  }, []);

  // Load shared state from URL hash on mount
  useEffect(() => {
    if (typeof window === "undefined") return;
    const hash = window.location.hash.slice(1);
    if (!hash) return;
    try {
      const parsed = JSON.parse(atob(hash));
      if (parsed.name && parsed.nations) {
        const id = `shared-${Date.now()}`;
        setScenarioNames((prev) => ({ ...prev, [id]: parsed.name }));
        setScenarioNations((prev) => ({ ...prev, [id]: parsed.nations }));
        setActiveScenarioId(id);
      }
    } catch { /* ignore invalid hash */ }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRandomize = useCallback(() => {
    setScenarioNations((prev) => {
      const current = prev[activeScenarioId];
      const allFips = Object.keys(STATE_DATA);
      const shuffled = [...allFips].sort(() => Math.random() - 0.5);
      const updated = deepCloneNations(current);
      updated.forEach((n) => (n.states = []));
      shuffled.forEach((fips, i) => { updated[i % updated.length].states.push(fips); });
      return { ...prev, [activeScenarioId]: updated };
    });
  }, [activeScenarioId]);

  return (
    <div className={`h-screen flex flex-col overflow-hidden ${theme.root}`}>
      {/* Header */}
      <header className={`flex-shrink-0 px-4 py-3 flex items-center gap-3 ${theme.header}`}>
        <button
          onClick={() => setLeftOpen((v) => !v)}
          className={`p-1.5 rounded transition-colors ${theme.resetBtn}`}
          title={leftOpen ? "Hide panel" : "Show panel"}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/flag.png"
          alt="US Flag"
          style={{ width: 38, height: 25, objectFit: "cover", borderRadius: 3, filter: themeId === "parchment" ? "none" : "invert(1)", flexShrink: 0 }}
        />

        <div className="flex flex-col gap-0.5">
          <h1 className={`text-base font-bold tracking-tight leading-none ${theme.headerText}`}>
            Redraw America
          </h1>
          <div className="flex items-center gap-1">
            <input
              className={`text-xs bg-transparent border-b border-transparent hover:border-current focus:border-current focus:outline-none transition-colors ${theme.headerSubtext}`}
              value={activeScenarioName}
              onChange={(e) => handleScenarioRename(activeScenarioId, e.target.value)}
              title="✏ Rename scenario"
              style={{ minWidth: 0, width: `${Math.max(activeScenarioName.length, 10)}ch` }}
            />
            <span className={`text-xs opacity-40 ${theme.headerSubtext}`} title="Click name to rename">✏</span>
          </div>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <div className="flex items-center gap-1">
            {(["dark", "parchment"] as ThemeId[]).map((id) => (
              <button
                key={id}
                onClick={() => setThemeId(id)}
                className={`px-2 py-1 rounded text-xs transition-colors ${
                  themeId === id ? "font-semibold " + theme.scenarioBtnActive : theme.scenarioBtn
                }`}
              >
                {THEMES[id].name}
              </button>
            ))}
          </div>

          <button
            onClick={() => {
              const payload = btoa(JSON.stringify({ name: activeScenarioName, nations }));
              const url = `${window.location.origin}/#${payload}`;
              navigator.clipboard.writeText(url);
            }}
            className={`text-xs px-3 py-1.5 rounded border transition-colors ${theme.resetBtn}`}
            title="Copy shareable link to clipboard"
          >
            🔗 Share
          </button>
          <button
            onClick={handleRandomize}
            className={`text-xs px-3 py-1.5 rounded border transition-colors ${theme.resetBtn}`}
            title="Randomly redistribute states"
          >
            🎲 Randomize
          </button>
          <button
            onClick={() => setStatsOpen(true)}
            className={`text-xs px-3 py-1.5 rounded border transition-colors ${theme.resetBtn}`}
            title="Expand stats for screenshot"
          >
            ⛶ Expand stats
          </button>
          <button
            onClick={handleResetScenario}
            className={`text-xs px-3 py-1.5 rounded border transition-colors ${theme.resetBtn}`}
          >
            Reset
          </button>
        </div>
      </header>

      {/* Body: map fills full width, sidebar floats over it */}
      <div className="flex flex-col flex-1 min-h-0">
        <div className="flex-1 min-h-0 relative">

          {/* Map — purely centered in the full area */}
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <div className="w-full max-w-3xl">
              <USMap
                stateColors={stateColors}
                stateNations={stateNations}
                onStateClick={handleStateClick}
                mapBg={theme.mapBg}
                mapStroke={theme.mapStroke}
              />
            </div>
          </div>

          {/* Hint — independently positioned to the right */}
          <div className="absolute right-4 top-1/2 -translate-y-1/2 w-20 pointer-events-none">
            <p className={`text-xs leading-snug ${theme.hintText}`}>
              Click any state to cycle it through nations
            </p>
          </div>

          {/* Sidebar floats over the map on the left */}
          {leftOpen && (
            <aside className={`absolute left-0 top-0 h-full w-56 z-10 overflow-y-auto p-3 ${theme.sidebar} ${theme.sidebarBorder}`}>
              <ScenarioPanel
                scenarios={SCENARIOS}
                scenarioNames={scenarioNames}
                activeScenarioId={activeScenarioId}
                onSelectScenario={handleSelectScenario}
                onScenarioRename={handleScenarioRename}
                theme={theme}
              />
            </aside>
          )}
        </div>

        {/* Bottom nation stats panel */}
        <NationBottomPanel
          nations={nations}
          unassignedFips={unassignedFips}
          theme={theme}
          onNationRename={handleNationRename}
          onNationColorChange={handleNationColorChange}
          onAddNation={handleAddNation}
          onRemoveNation={handleRemoveNation}
        />
      </div>

      <StarTicker themeId={themeId} />

      {statsOpen && (
        <StatsModal
          nations={nations}
          scenarioName={activeScenarioName}
          stateColors={stateColors}
          stateNations={stateNations}
          themeId={themeId}
          onClose={() => setStatsOpen(false)}
        />
      )}
    </div>
  );
}

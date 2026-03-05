"use client";

import { useState, useMemo, useCallback, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { SCENARIOS, Nation } from "@/data/scenarios";
import { STATE_DATA } from "@/data/stateData";
import { THEMES, ThemeId } from "@/data/themes";
import ScenarioPanel from "@/components/ScenarioPanel";
import NationBottomPanel from "@/components/NationBottomPanel";
import StarTicker from "@/components/StarTicker";
import StatsModal from "@/components/StatsModal";
import MobileLayout from "@/components/MobileLayout";

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

  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const handleStateAssign = useCallback((fips: string, nationId: string | null) => {
    setScenarioNations((prev) => {
      const updated = deepCloneNations(prev[activeScenarioId]);
      for (const n of updated) n.states = n.states.filter(s => s !== fips);
      if (nationId) {
        const target = updated.find(n => n.id === nationId);
        if (target) target.states.push(fips);
      }
      return { ...prev, [activeScenarioId]: updated };
    });
  }, [activeScenarioId]);

  const bottomPanelRef = useRef<HTMLDivElement>(null);
  const [bottomPanelHeight, setBottomPanelHeight] = useState(280);
  useEffect(() => {
    const el = bottomPanelRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setBottomPanelHeight(entry.contentRect.height));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const TICKER_H = 26;
  const HEADER_H = 56;
  const mapAreaHeight = `calc(100vh - ${HEADER_H}px - ${TICKER_H}px - ${bottomPanelHeight}px)`;

  if (isMobile) {
    return (
      <MobileLayout
        nations={nations}
        scenarios={SCENARIOS}
        scenarioNames={scenarioNames}
        activeScenarioId={activeScenarioId}
        theme={theme}
        themeId={themeId}
        stateColors={stateColors}
        stateNations={stateNations}
        unassignedCount={unassignedFips.length}
        onNationRename={handleNationRename}
        onNationColorChange={handleNationColorChange}
        onAddNation={handleAddNation}
        onRemoveNation={handleRemoveNation}
        onStateAssign={handleStateAssign}
        onStateClick={handleStateClick}
        onSelectScenario={handleSelectScenario}
        onResetScenario={handleResetScenario}
        onRandomize={handleRandomize}
        onThemeToggle={() => setThemeId(t => t === "dark" ? "parchment" : "dark")}
      />
    );
  }

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

      {/* Map area — height tracks the bottom panel size */}
      <div style={{ position: "relative", flexShrink: 0, height: mapAreaHeight, minHeight: 200 }}>
        {/* Map centered inside this area */}
        <div
          style={{
            position: "absolute", inset: 0,
            display: "flex", alignItems: "center", justifyContent: "center",
            padding: "1rem",
            pointerEvents: "none",
          }}
        >
          <div style={{ width: "min(calc(100vw - 3rem), 768px)", pointerEvents: "auto" }}>
            <USMap
              stateColors={stateColors}
              stateNations={stateNations}
              onStateClick={handleStateClick}
              mapBg={theme.mapBg}
              mapStroke={theme.mapStroke}
            />
          </div>
          {/* Hint to the right */}
          <div style={{ width: 80, flexShrink: 0, paddingTop: 8, pointerEvents: "none" }}>
            <p className={`text-xs leading-snug ${theme.hintText}`}>
              Click any state to cycle it through nations
            </p>
          </div>
        </div>

        {/* Sidebar — fixed, bottom tracks above the nation panel */}
        {leftOpen && (
          <aside className={`overflow-y-auto p-3 ${theme.sidebar} ${theme.sidebarBorder}`} style={{ position: "fixed", top: HEADER_H, bottom: TICKER_H + bottomPanelHeight, left: 0, width: 224, zIndex: 5 }}>
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

      {/* Spacer pushes bottom panel to the bottom */}
      <div style={{ flex: 1 }} />

      {/* Bottom panel — pinned to bottom, sits above sidebar */}
      <div ref={bottomPanelRef} style={{ position: "relative", zIndex: 10 }}>
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

"use client";

import { Scenario } from "@/data/scenarios";
import { Theme } from "@/data/themes";

type Props = {
  scenarios: Scenario[];
  scenarioNames: Record<string, string>;
  activeScenarioId: string;
  onSelectScenario: (id: string) => void;
  onScenarioRename: (id: string, name: string) => void;
  theme: Theme;
};

export default function ScenarioPanel({ scenarios, scenarioNames, activeScenarioId, onSelectScenario, onScenarioRename, theme }: Props) {
  return (
    <div className="flex flex-col gap-2">
      <h2 className={`text-xs font-semibold uppercase tracking-widest mb-1 ${theme.sidebarHeading}`}>
        Scenarios
      </h2>
      <div className="space-y-1">
        {scenarios.map((s) => {
          const isActive = activeScenarioId === s.id;
          return (
            <div key={s.id} className={`rounded-lg px-3 py-2 text-sm transition-colors ${isActive ? theme.scenarioBtnActive : theme.scenarioBtn}`}>
              {isActive ? (
                <>
                  <div className="flex items-center gap-1">
                    <input
                      className="flex-1 font-medium bg-transparent focus:outline-none min-w-0"
                      value={scenarioNames[s.id] ?? s.name}
                      onChange={(e) => onScenarioRename(s.id, e.target.value)}
                      placeholder="Scenario name"
                      title="✏ Rename scenario"
                    />
                    <span className="text-xs opacity-40 pointer-events-none">✏</span>
                  </div>
                  <div className={`text-xs mt-0.5 leading-snug ${theme.scenarioBtnActiveSub}`}>
                    {s.description}
                  </div>
                </>
              ) : (
                <button className="w-full text-left" onClick={() => onSelectScenario(s.id)}>
                  <div className="font-medium">{scenarioNames[s.id] ?? s.name}</div>
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

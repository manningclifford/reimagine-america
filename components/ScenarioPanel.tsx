"use client";

import { Scenario, Nation } from "@/data/scenarios";
import { Theme } from "@/data/themes";

type Props = {
  scenarios: Scenario[];
  scenarioNames: Record<string, string>;
  activeScenarioId: string;
  onSelectScenario: (id: string) => void;
  onScenarioRename: (id: string, name: string) => void;
  nations: Nation[];
  onNationRename: (id: string, name: string) => void;
  onAddNation: () => void;
  onRemoveNation: (id: string) => void;
  theme: Theme;
};

export default function ScenarioPanel({
  scenarios, scenarioNames, activeScenarioId, onSelectScenario, onScenarioRename,
  nations, onNationRename, onAddNation, onRemoveNation, theme,
}: Props) {
  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 className={`text-xs font-semibold uppercase tracking-widest mb-2 ${theme.sidebarHeading}`}>
          Scenarios
        </h2>
        <div className="space-y-1">
          {scenarios.map((s) => {
            const isActive = activeScenarioId === s.id;
            return (
              <div key={s.id} className={`rounded-lg px-3 py-2 text-sm transition-colors ${isActive ? theme.scenarioBtnActive : theme.scenarioBtn}`}>
                {isActive ? (
                  <input
                    className={`w-full font-medium bg-transparent focus:outline-none ${isActive ? "" : ""}`}
                    value={scenarioNames[s.id] ?? s.name}
                    onChange={(e) => onScenarioRename(s.id, e.target.value)}
                    placeholder="Scenario name"
                  />
                ) : (
                  <button
                    className="w-full text-left"
                    onClick={() => onSelectScenario(s.id)}
                  >
                    <div className="font-medium">{scenarioNames[s.id] ?? s.name}</div>
                    <div className={`text-xs mt-0.5 leading-snug ${theme.scenarioBtnSub}`}>
                      {s.description}
                    </div>
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div>
        <h2 className={`text-xs font-semibold uppercase tracking-widest mb-2 ${theme.sidebarHeading}`}>
          Nations
        </h2>
        <div className="space-y-2">
          {nations.map((nation) => (
            <NationEditor
              key={nation.id}
              nation={nation}
              totalNations={nations.length}
              onRename={(name) => onNationRename(nation.id, name)}
              onRemove={() => onRemoveNation(nation.id)}
              theme={theme}
            />
          ))}
        </div>

        {nations.length < 8 && (
          <button
            className={`mt-2 w-full px-3 py-2 rounded-lg border text-xs transition-colors ${theme.addNationBtn}`}
            onClick={onAddNation}
          >
            + Add nation
          </button>
        )}
      </div>
    </div>
  );
}

function NationEditor({ nation, totalNations, onRename, onRemove, theme }: {
  nation: Nation;
  totalNations: number;
  onRename: (name: string) => void;
  onRemove: () => void;
  theme: Theme;
}) {
  return (
    <div className={`rounded-lg border px-2 py-1.5 flex items-center gap-2 ${theme.nationCard}`}>
      <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: nation.color }} />
      <input
        className={`flex-1 text-sm focus:outline-none min-w-0 bg-transparent ${theme.nationInput}`}
        value={nation.name}
        onChange={(e) => onRename(e.target.value)}
        placeholder="Nation name"
      />
      <span className={`text-xs flex-shrink-0 ${theme.statLabel}`}>{nation.states.length}</span>
      {totalNations > 1 && (
        <button className="text-xs text-red-500/50 hover:text-red-400 flex-shrink-0" onClick={onRemove} title="Remove">✕</button>
      )}
    </div>
  );
}

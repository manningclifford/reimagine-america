"use client";

import { Scenario, Nation } from "@/data/scenarios";
import { Theme } from "@/data/themes";

type Props = {
  scenarios: Scenario[];
  activeScenarioId: string;
  onSelectScenario: (id: string) => void;
  nations: Nation[];
  onNationRename: (id: string, name: string) => void;
  onNationColorChange: (id: string, color: string) => void;
  onAddNation: () => void;
  onRemoveNation: (id: string) => void;
  theme: Theme;
};

const PRESET_COLORS = [
  "#f43f5e","#ef4444","#f97316","#f59e0b","#eab308",
  "#84cc16","#22c55e","#10b981","#14b8a6","#06b6d4",
  "#0ea5e9","#3b82f6","#6366f1","#8b5cf6","#a855f7",
  "#d946ef","#ec4899","#6b7280",
];

export default function ScenarioPanel({
  scenarios, activeScenarioId, onSelectScenario,
  nations, onNationRename, onNationColorChange, onAddNation, onRemoveNation, theme,
}: Props) {
  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 className={`text-xs font-semibold uppercase tracking-widest mb-2 ${theme.sidebarHeading}`}>
          Scenarios
        </h2>
        <div className="space-y-1">
          {scenarios.map((s) => (
            <button
              key={s.id}
              onClick={() => onSelectScenario(s.id)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                activeScenarioId === s.id ? theme.scenarioBtnActive : theme.scenarioBtn
              }`}
            >
              <div className="font-medium">{s.name}</div>
              <div className={`text-xs mt-0.5 leading-snug ${activeScenarioId === s.id ? theme.scenarioBtnActiveSub : theme.scenarioBtnSub}`}>
                {s.description}
              </div>
            </button>
          ))}
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
              onColorChange={(c) => onNationColorChange(nation.id, c)}
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

function NationEditor({ nation, totalNations, onRename, onColorChange, onRemove, theme }: {
  nation: Nation;
  totalNations: number;
  onRename: (name: string) => void;
  onColorChange: (color: string) => void;
  onRemove: () => void;
  theme: Theme;
}) {
  return (
    <div className={`rounded-lg border p-2 space-y-2 ${theme.nationCard}`}>
      <div className="flex items-center gap-2">
        <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: nation.color }} />
        <input
          className={`flex-1 text-sm focus:outline-none min-w-0 ${theme.nationInput}`}
          value={nation.name}
          onChange={(e) => onRename(e.target.value)}
          placeholder="Nation name"
        />
        <span className={`text-xs flex-shrink-0 ${theme.sidebarHeading}`}>{nation.states.length}</span>
      </div>
      <div className="flex flex-wrap gap-1">
        {PRESET_COLORS.map((c) => (
          <button
            key={c}
            className={`w-4 h-4 rounded-full hover:scale-110 transition-transform flex-shrink-0 ${nation.color === c ? "ring-2 ring-offset-1 ring-current scale-110" : ""}`}
            style={{ backgroundColor: c }}
            onClick={() => onColorChange(c)}
            title={c}
          />
        ))}
      </div>
      {totalNations > 1 && (
        <button className="text-xs text-red-500/70 hover:text-red-400" onClick={onRemove}>
          Remove
        </button>
      )}
    </div>
  );
}

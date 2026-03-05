"use client";

import { useState, useCallback } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { getStateName } from "@/data/stateData";

const GEO_URL = "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json";

type Tooltip = { x: number; y: number; stateName: string; nationName: string };

type Props = {
  stateColors: Record<string, string>;
  stateNations: Record<string, string>;
  onStateClick: (fips: string) => void;
  selectedNationId?: string | null;
  mapBg?: string;
  mapStroke?: string;
};

export default function USMap({
  stateColors,
  stateNations,
  onStateClick,
  mapBg = "#374151",
  mapStroke = "#111827",
}: Props) {
  const [tooltip, setTooltip] = useState<Tooltip | null>(null);

  const handleMouseMove = useCallback(
    (geo: { id: string }, evt: React.MouseEvent) => {
      setTooltip({
        x: evt.clientX,
        y: evt.clientY,
        stateName: getStateName(geo.id),
        nationName: stateNations[geo.id] ?? "Unassigned",
      });
    },
    [stateNations]
  );

  return (
    <div className="relative w-full">
      <ComposableMap
        projection="geoAlbersUsa"
        className="w-full h-auto"
        style={{ background: "transparent" }}
      >
        <Geographies geography={GEO_URL}>
          {({ geographies }) =>
            geographies.map((geo) => {
              const fill = stateColors[geo.id] ?? mapBg;
              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill={fill}
                  stroke={mapStroke}
                  strokeWidth={0.5}
                  style={{
                    default: { outline: "none", cursor: "pointer" },
                    hover:   { outline: "none", filter: "brightness(1.18)", cursor: "pointer" },
                    pressed: { outline: "none", filter: "brightness(0.85)" },
                  }}
                  onMouseMove={(evt: React.MouseEvent) => handleMouseMove(geo, evt)}
                  onMouseLeave={() => setTooltip(null)}
                  onClick={() => onStateClick(geo.id)}
                />
              );
            })
          }
        </Geographies>
      </ComposableMap>

      {tooltip && (
        <div
          className="fixed z-50 pointer-events-none bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-sm shadow-xl"
          style={{ left: tooltip.x + 12, top: tooltip.y - 44 }}
        >
          <div className="font-semibold text-white">{tooltip.stateName}</div>
          <div className="text-gray-400 text-xs">{tooltip.nationName}</div>
        </div>
      )}
    </div>
  );
}

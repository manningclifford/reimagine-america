export type ThemeId = "dark" | "parchment" | "slate";

export type Theme = {
  id: ThemeId;
  name: string;
  // Tailwind classes for each zone
  root: string;
  header: string;
  headerText: string;
  headerSubtext: string;
  sidebar: string;
  sidebarBorder: string;
  sidebarHeading: string;
  scenarioBtn: string;
  scenarioBtnActive: string;
  scenarioBtnActiveSub: string;
  scenarioBtnSub: string;
  nationCard: string;
  nationInput: string;
  addNationBtn: string;
  statsPanel: string;
  statsPanelBorder: string;
  statsCard: string;
  statsCardDivide: string;
  statLabel: string;
  statValue: string;
  mapBg: string;            // hex fill for unassigned states
  mapStroke: string;        // hex stroke between states
  legendText: string;
  legendUnassigned: string;
  resetBtn: string;
  hintText: string;
};

export const THEMES: Record<ThemeId, Theme> = {
  dark: {
    id: "dark",
    name: "Dark",
    root: "bg-gray-950 text-gray-100",
    header: "bg-gray-950 border-b border-gray-800",
    headerText: "text-white",
    headerSubtext: "text-gray-500",
    sidebar: "bg-gray-950",
    sidebarBorder: "border-r border-gray-800",
    sidebarHeading: "text-gray-500",
    scenarioBtn: "text-gray-300 hover:bg-gray-700/60",
    scenarioBtnActive: "bg-indigo-600 text-white",
    scenarioBtnActiveSub: "text-indigo-200",
    scenarioBtnSub: "text-gray-500",
    nationCard: "border border-gray-700/50 bg-gray-800/30",
    nationInput: "bg-transparent text-gray-200",
    addNationBtn: "border-dashed border-gray-700 text-gray-500 hover:border-gray-500 hover:text-gray-300",
    statsPanel: "bg-gray-950 border-l border-gray-800",
    statsPanelBorder: "border-l border-gray-800",
    statsCard: "border border-gray-700/60 bg-gray-900/60",
    statsCardDivide: "divide-gray-800",
    statLabel: "text-gray-500",
    statValue: "text-gray-100",
    mapBg: "#374151",
    mapStroke: "#111827",
    legendText: "text-gray-300",
    legendUnassigned: "text-gray-500",
    resetBtn: "text-gray-500 hover:text-gray-300 border-gray-700 hover:border-gray-500",
    hintText: "text-gray-600",
  },
  parchment: {
    id: "parchment",
    name: "Parchment",
    root: "bg-amber-50 text-stone-800",
    header: "bg-amber-100 border-b border-amber-300",
    headerText: "text-stone-900",
    headerSubtext: "text-stone-500",
    sidebar: "bg-amber-50",
    sidebarBorder: "border-r border-amber-300",
    sidebarHeading: "text-stone-400",
    scenarioBtn: "text-stone-700 hover:bg-amber-200/60",
    scenarioBtnActive: "bg-stone-700 text-amber-100",
    scenarioBtnActiveSub: "text-amber-200",
    scenarioBtnSub: "text-stone-500",
    nationCard: "border border-amber-300/60 bg-amber-100/40",
    nationInput: "bg-transparent text-stone-800",
    addNationBtn: "border-dashed border-amber-400 text-stone-400 hover:border-stone-500 hover:text-stone-600",
    statsPanel: "bg-amber-50 border-l border-amber-300",
    statsPanelBorder: "border-l border-amber-300",
    statsCard: "border border-amber-300/60 bg-amber-100/50",
    statsCardDivide: "divide-amber-300",
    statLabel: "text-stone-400",
    statValue: "text-stone-800",
    mapBg: "#d6cbb5",
    mapStroke: "#a89880",
    legendText: "text-stone-600",
    legendUnassigned: "text-stone-400",
    resetBtn: "text-stone-500 hover:text-stone-700 border-amber-400 hover:border-stone-500",
    hintText: "text-stone-400",
  },
  slate: {
    id: "slate",
    name: "Slate",
    root: "bg-slate-900 text-slate-100",
    header: "bg-slate-900 border-b border-slate-700",
    headerText: "text-white",
    headerSubtext: "text-slate-400",
    sidebar: "bg-slate-900",
    sidebarBorder: "border-r border-slate-700",
    sidebarHeading: "text-slate-400",
    scenarioBtn: "text-slate-300 hover:bg-slate-700/60",
    scenarioBtnActive: "bg-cyan-700 text-white",
    scenarioBtnActiveSub: "text-cyan-200",
    scenarioBtnSub: "text-slate-500",
    nationCard: "border border-slate-600/50 bg-slate-800/40",
    nationInput: "bg-transparent text-slate-200",
    addNationBtn: "border-dashed border-slate-600 text-slate-500 hover:border-slate-400 hover:text-slate-300",
    statsPanel: "bg-slate-900 border-l border-slate-700",
    statsPanelBorder: "border-l border-slate-700",
    statsCard: "border border-slate-600/60 bg-slate-800/60",
    statsCardDivide: "divide-slate-700",
    statLabel: "text-slate-400",
    statValue: "text-slate-100",
    mapBg: "#334155",
    mapStroke: "#0f172a",
    legendText: "text-slate-300",
    legendUnassigned: "text-slate-500",
    resetBtn: "text-slate-400 hover:text-slate-200 border-slate-600 hover:border-slate-400",
    hintText: "text-slate-600",
  },
};

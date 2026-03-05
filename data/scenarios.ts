export type Nation = {
  id: string;
  name: string;
  color: string;
  states: string[]; // FIPS codes
};

export type Scenario = {
  id: string;
  name: string;
  description: string;
  nations: Nation[];
};

// All 50 states + DC minus a given set
const ALL_FIPS = [
  "01","02","04","05","06","08","09","10","11","12","13","15","16","17","18",
  "19","20","21","22","23","24","25","26","27","28","29","30","31","32","33",
  "34","35","36","37","38","39","40","41","42","44","45","46","47","48","49",
  "50","51","53","54","55","56",
];

function remainder(used: string[]): string[] {
  const s = new Set(used);
  return ALL_FIPS.filter((f) => !s.has(f));
}

const NORTH_STATES = [
  "23","33","50","25","44","09","36","34","42","10","17","18","39","26","55",
  "27","19","29","20","31","38","46","08","56","30","16","53","41","06","32",
  "02","15","49",
];
const SOUTH_STATES = [
  "24","11","51","54","21","47","37","45","13","12","01","28","22","05","48",
  "40","35","04",
];

export const SCENARIOS: Scenario[] = [
  // ── FIVE NATIONS ────────────────────────────────────────────────────────────
  {
    id: "regional-blocs",
    name: "Five Nations",
    description: "America redivided into five natural regional blocs",
    nations: [
      {
        id: "yankeedom",
        name: "Yankeedom",
        color: "#6366f1",
        states: ["23","33","50","09","44","25","36","34","42","10","24","11"],
      },
      {
        id: "southern-cross",
        name: "The Southern Cross",
        color: "#f59e0b",
        states: ["51","37","45","13","12","01","28","22","05","47","40","48","54"],
      },
      {
        id: "heartland",
        name: "The Heartland",
        color: "#10b981",
        states: ["17","18","39","26","55","27","19","29","20","31","38","46","21"],
      },
      {
        id: "pacific-arcadia",
        name: "Pacific Arcadia",
        color: "#0ea5e9",
        states: ["06","41","53","02","15"],
      },
      {
        id: "high-plains",
        name: "High Plains Empire",
        color: "#d97706",
        states: ["08","32","49","35","16","30","56","04"],
      },
    ],
  },

  // ── RED VS BLUE ──────────────────────────────────────────────────────────────
  {
    id: "red-blue",
    name: "Red vs Blue",
    description: "Divided by the 2024 presidential election results",
    nations: [
      {
        id: "blue-america",
        name: "Blue America",
        color: "#2563eb",
        states: ["06","08","09","10","11","15","17","23","24","25","27","33","34","35","36","41","44","50","51","53"],
      },
      {
        id: "red-america",
        name: "Red America",
        color: "#dc2626",
        states: ["01","02","04","05","12","13","16","18","19","20","21","22","26","28","29","30","31","32","37","38","39","40","42","45","46","47","48","49","54","55","56"],
      },
    ],
  },

  // ── NORTH VS SOUTH ──────────────────────────────────────────────────────────
  {
    id: "north-south",
    name: "North vs South",
    description: "The Mason-Dixon line taken to its logical conclusion",
    nations: [
      {
        id: "north",
        name: "The Northern Republic",
        color: "#3b82f6",
        states: NORTH_STATES,
      },
      {
        id: "south",
        name: "The Southern Confederation",
        color: "#ef4444",
        states: SOUTH_STATES,
      },
    ],
  },

  // ── ORIGINAL THIRTEEN ───────────────────────────────────────────────────────
  {
    id: "original-thirteen",
    name: "The Original Thirteen",
    description: "Founding colonies vs the expansion states they spawned",
    nations: [
      {
        id: "founding",
        name: "The Founding Thirteen",
        color: "#7c3aed",
        // NH, MA, RI, CT, NY, NJ, PA, DE, MD, VA, NC, SC, GA
        states: ["33","25","44","09","36","34","42","10","24","51","37","45","13"],
      },
      {
        id: "expansion",
        name: "The Great Expansion",
        color: "#b45309",
        states: remainder(["33","25","44","09","36","34","42","10","24","51","37","45","13"]),
      },
    ],
  },

  // ── GREAT LAKES REPUBLIC ────────────────────────────────────────────────────
  {
    id: "great-lakes",
    name: "Great Lakes Republic",
    description: "The industrial lake states rise as a freshwater superpower",
    nations: [
      {
        id: "great-lakes",
        name: "The Great Lakes Republic",
        color: "#0891b2",
        // MN, WI, MI, IL, IN, OH, PA, NY
        states: ["27","55","26","17","18","39","42","36"],
      },
      {
        id: "usa-rest",
        name: "United States (Remainder)",
        color: "#4b5563",
        states: remainder(["27","55","26","17","18","39","42","36"]),
      },
    ],
  },

  // ── AMERICA'S COASTS ────────────────────────────────────────────────────────
  {
    id: "coasts",
    name: "America's Coasts",
    description: "The coastal elites secede, leaving the interior to fend for itself",
    nations: [
      {
        id: "coast",
        name: "The Coastal Alliance",
        color: "#0d9488",
        // East Coast + West Coast + Hawaii + Alaska
        states: ["23","33","25","44","09","36","34","42","10","24","11","51","37","45","13","12","06","41","53","15","02"],
      },
      {
        id: "interior",
        name: "Flyover Nation",
        color: "#92400e",
        states: remainder(["23","33","25","44","09","36","34","42","10","24","11","51","37","45","13","12","06","41","53","15","02"]),
      },
    ],
  },

  // ── SUN BELT SURGE ──────────────────────────────────────────────────────────
  {
    id: "sun-belt",
    name: "Sun Belt Surge",
    description: "The booming Sun Belt corridor breaks off from the rust-belt north",
    nations: [
      {
        id: "sun-belt",
        name: "The Sun Belt Federation",
        color: "#f97316",
        // CA, NV, AZ, NM, TX, OK(partial), FL, GA, NC, SC, TN, VA, CO
        states: ["06","32","04","35","48","12","13","37","45","47","51","08","40"],
      },
      {
        id: "rust-belt",
        name: "The Rust Belt Remnant",
        color: "#6b7280",
        states: remainder(["06","32","04","35","48","12","13","37","45","47","51","08","40"]),
      },
    ],
  },

  // ── FOUR QUADRANTS ──────────────────────────────────────────────────────────
  {
    id: "four-quadrants",
    name: "Four Quadrants",
    description: "The continent carved into four equal empires",
    nations: [
      {
        id: "ne-quad",
        name: "Northeast Quadrant",
        color: "#6366f1",
        states: ["23","33","50","25","44","09","36","34","42","10","24","11"],
      },
      {
        id: "se-quad",
        name: "Southeast Quadrant",
        color: "#f59e0b",
        states: ["51","54","21","47","37","45","13","12","01","28","22","05"],
      },
      {
        id: "sw-quad",
        name: "Southwest Quadrant",
        color: "#ef4444",
        states: ["48","40","35","04","06","32","49","08","15"],
      },
      {
        id: "nw-quad",
        name: "Northwest Quadrant",
        color: "#22c55e",
        states: ["53","41","16","30","56","02","38","46","31","20","27","19","29","18","17","39","26","55"],
      },
    ],
  },

  // ── PACIFIC REPUBLIC ────────────────────────────────────────────────────────
  {
    id: "pacific-republic",
    name: "Pacific Republic",
    description: "The entire West Coast breaks away to form a progressive paradise",
    nations: [
      {
        id: "pacific",
        name: "The Pacific Republic",
        color: "#06b6d4",
        states: ["06","41","53"],
      },
      {
        id: "remainder",
        name: "The Remainder",
        color: "#4b5563",
        states: remainder(["06","41","53"]),
      },
    ],
  },

  // ── CASCADIA ────────────────────────────────────────────────────────────────
  {
    id: "cascadia",
    name: "Cascadia",
    description: "The Pacific Northwest rises as a lush green republic",
    nations: [
      {
        id: "cascadia",
        name: "The Cascadian Collective",
        color: "#22c55e",
        states: ["53","41","16"],
      },
      {
        id: "usa-rest",
        name: "United States (Remainder)",
        color: "#4b5563",
        states: remainder(["53","41","16"]),
      },
    ],
  },

  // ── REPUBLIC OF TEXAS ───────────────────────────────────────────────────────
  {
    id: "texas-empire",
    name: "Republic of Texas",
    description: "Y'all think big — Texas swallows its neighbours whole",
    nations: [
      {
        id: "lone-star",
        name: "The Lone Star Empire",
        color: "#ef4444",
        states: ["48","40","35","22","05","20"],
      },
      {
        id: "usa-rest",
        name: "United States (Remainder)",
        color: "#4b5563",
        states: remainder(["48","40","35","22","05","20"]),
      },
    ],
  },

  // ── BLANK CANVAS ────────────────────────────────────────────────────────────
  {
    id: "blank",
    name: "Blank Canvas",
    description: "All states unassigned — paint your own nation from scratch",
    nations: [
      { id: "nation-1", name: "Nation Alpha", color: "#f43f5e", states: [] },
      { id: "nation-2", name: "Nation Beta",  color: "#3b82f6", states: [] },
      { id: "nation-3", name: "Nation Gamma", color: "#10b981", states: [] },
      { id: "nation-4", name: "Nation Delta", color: "#f59e0b", states: [] },
    ],
  },
];

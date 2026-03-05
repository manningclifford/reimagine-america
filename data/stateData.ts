// FIPS code → state info
// Population: 2023 US Census estimates
// GDP: 2023 BEA data (billions USD)
// Area: sq miles
// demPct: Democrat % of two-party presidential vote (2024)
// Race breakdown: approximate % from 2020 Census / 2022 ACS (non-Hispanic White, Black, Hispanic, Asian, Other)
export type StateInfo = {
  name: string;
  abbr: string;
  population: number;   // persons
  gdp: number;          // billions USD
  areaSqMi: number;
  demPct: number;       // Dem share of two-party vote 0–100
  raceWhite: number;    // % non-Hispanic White
  raceBlack: number;
  raceHispanic: number;
  raceAsian: number;
  raceOther: number;
};

export const STATE_DATA: Record<string, StateInfo> = {
  "01": { name: "Alabama",              abbr: "AL", population: 5108468,  gdp: 257,  areaSqMi: 52420,  demPct: 34, raceWhite: 64, raceBlack: 27, raceHispanic: 5,  raceAsian: 1,  raceOther: 3  },
  "02": { name: "Alaska",               abbr: "AK", population: 733583,   gdp: 62,   areaSqMi: 663268, demPct: 44, raceWhite: 60, raceBlack: 4,  raceHispanic: 7,  raceAsian: 6,  raceOther: 23 },
  "04": { name: "Arizona",              abbr: "AZ", population: 7431344,  gdp: 452,  areaSqMi: 113990, demPct: 48, raceWhite: 54, raceBlack: 5,  raceHispanic: 32, raceAsian: 4,  raceOther: 5  },
  "05": { name: "Arkansas",             abbr: "AR", population: 3067732,  gdp: 148,  areaSqMi: 53179,  demPct: 34, raceWhite: 68, raceBlack: 16, raceHispanic: 9,  raceAsian: 2,  raceOther: 5  },
  "06": { name: "California",           abbr: "CA", population: 38965193, gdp: 3897, areaSqMi: 163696, demPct: 65, raceWhite: 35, raceBlack: 6,  raceHispanic: 40, raceAsian: 15, raceOther: 4  },
  "08": { name: "Colorado",             abbr: "CO", population: 5877610,  gdp: 457,  areaSqMi: 104094, demPct: 56, raceWhite: 67, raceBlack: 4,  raceHispanic: 22, raceAsian: 4,  raceOther: 3  },
  "09": { name: "Connecticut",          abbr: "CT", population: 3617176,  gdp: 319,  areaSqMi: 5543,   demPct: 58, raceWhite: 67, raceBlack: 11, raceHispanic: 17, raceAsian: 5,  raceOther: 0  },
  "10": { name: "Delaware",             abbr: "DE", population: 1031890,  gdp: 85,   areaSqMi: 2489,   demPct: 57, raceWhite: 62, raceBlack: 22, raceHispanic: 10, raceAsian: 4,  raceOther: 2  },
  "11": { name: "District of Columbia", abbr: "DC", population: 678972,   gdp: 163,  areaSqMi: 68,     demPct: 92, raceWhite: 36, raceBlack: 45, raceHispanic: 11, raceAsian: 4,  raceOther: 4  },
  "12": { name: "Florida",              abbr: "FL", population: 22610726, gdp: 1389, areaSqMi: 65758,  demPct: 44, raceWhite: 53, raceBlack: 17, raceHispanic: 27, raceAsian: 3,  raceOther: 0  },
  "13": { name: "Georgia",              abbr: "GA", population: 11029227, gdp: 762,  areaSqMi: 59425,  demPct: 49, raceWhite: 51, raceBlack: 33, raceHispanic: 10, raceAsian: 4,  raceOther: 2  },
  "15": { name: "Hawaii",               abbr: "HI", population: 1435138,  gdp: 97,   areaSqMi: 10932,  demPct: 71, raceWhite: 22, raceBlack: 2,  raceHispanic: 9,  raceAsian: 38, raceOther: 29 },
  "16": { name: "Idaho",                abbr: "ID", population: 1964726,  gdp: 103,  areaSqMi: 83569,  demPct: 32, raceWhite: 82, raceBlack: 1,  raceHispanic: 13, raceAsian: 2,  raceOther: 2  },
  "17": { name: "Illinois",             abbr: "IL", population: 12549689, gdp: 1018, areaSqMi: 57914,  demPct: 58, raceWhite: 60, raceBlack: 15, raceHispanic: 18, raceAsian: 6,  raceOther: 1  },
  "18": { name: "Indiana",              abbr: "IN", population: 6862199,  gdp: 432,  areaSqMi: 36420,  demPct: 42, raceWhite: 78, raceBlack: 10, raceHispanic: 8,  raceAsian: 3,  raceOther: 1  },
  "19": { name: "Iowa",                 abbr: "IA", population: 3207004,  gdp: 233,  areaSqMi: 56272,  demPct: 43, raceWhite: 84, raceBlack: 4,  raceHispanic: 7,  raceAsian: 3,  raceOther: 2  },
  "20": { name: "Kansas",               abbr: "KS", population: 2940865,  gdp: 201,  areaSqMi: 82278,  demPct: 38, raceWhite: 74, raceBlack: 6,  raceHispanic: 13, raceAsian: 3,  raceOther: 4  },
  "21": { name: "Kentucky",             abbr: "KY", population: 4526154,  gdp: 252,  areaSqMi: 40408,  demPct: 35, raceWhite: 85, raceBlack: 9,  raceHispanic: 4,  raceAsian: 2,  raceOther: 0  },
  "22": { name: "Louisiana",            abbr: "LA", population: 4573749,  gdp: 270,  areaSqMi: 51840,  demPct: 38, raceWhite: 57, raceBlack: 33, raceHispanic: 6,  raceAsian: 2,  raceOther: 2  },
  "23": { name: "Maine",                abbr: "ME", population: 1395722,  gdp: 80,   areaSqMi: 35380,  demPct: 55, raceWhite: 93, raceBlack: 2,  raceHispanic: 2,  raceAsian: 2,  raceOther: 1  },
  "24": { name: "Maryland",             abbr: "MD", population: 6180253,  gdp: 476,  areaSqMi: 12407,  demPct: 67, raceWhite: 50, raceBlack: 31, raceHispanic: 11, raceAsian: 7,  raceOther: 1  },
  "25": { name: "Massachusetts",        abbr: "MA", population: 7001399,  gdp: 709,  areaSqMi: 10554,  demPct: 65, raceWhite: 71, raceBlack: 8,  raceHispanic: 13, raceAsian: 7,  raceOther: 1  },
  "26": { name: "Michigan",             abbr: "MI", population: 10037261, gdp: 610,  areaSqMi: 96714,  demPct: 49, raceWhite: 75, raceBlack: 14, raceHispanic: 6,  raceAsian: 3,  raceOther: 2  },
  "27": { name: "Minnesota",            abbr: "MN", population: 5737915,  gdp: 479,  areaSqMi: 86936,  demPct: 52, raceWhite: 79, raceBlack: 7,  raceHispanic: 6,  raceAsian: 5,  raceOther: 3  },
  "28": { name: "Mississippi",          abbr: "MS", population: 2939690,  gdp: 128,  areaSqMi: 48432,  demPct: 39, raceWhite: 56, raceBlack: 38, raceHispanic: 4,  raceAsian: 1,  raceOther: 1  },
  "29": { name: "Missouri",             abbr: "MO", population: 6196156,  gdp: 393,  areaSqMi: 69707,  demPct: 40, raceWhite: 79, raceBlack: 12, raceHispanic: 5,  raceAsian: 2,  raceOther: 2  },
  "30": { name: "Montana",              abbr: "MT", population: 1132812,  gdp: 67,   areaSqMi: 147040, demPct: 40, raceWhite: 85, raceBlack: 1,  raceHispanic: 4,  raceAsian: 1,  raceOther: 9  },
  "31": { name: "Nebraska",             abbr: "NE", population: 1978379,  gdp: 162,  areaSqMi: 77358,  demPct: 41, raceWhite: 79, raceBlack: 5,  raceHispanic: 12, raceAsian: 3,  raceOther: 1  },
  "32": { name: "Nevada",               abbr: "NV", population: 3194176,  gdp: 219,  areaSqMi: 110572, demPct: 49, raceWhite: 47, raceBlack: 10, raceHispanic: 30, raceAsian: 10, raceOther: 3  },
  "33": { name: "New Hampshire",        abbr: "NH", population: 1402054,  gdp: 102,  areaSqMi: 9349,   demPct: 52, raceWhite: 90, raceBlack: 2,  raceHispanic: 5,  raceAsian: 3,  raceOther: 0  },
  "34": { name: "New Jersey",           abbr: "NJ", population: 9290841,  gdp: 769,  areaSqMi: 8722,   demPct: 55, raceWhite: 54, raceBlack: 14, raceHispanic: 22, raceAsian: 9,  raceOther: 1  },
  "35": { name: "New Mexico",           abbr: "NM", population: 2114371,  gdp: 113,  areaSqMi: 121590, demPct: 55, raceWhite: 35, raceBlack: 3,  raceHispanic: 49, raceAsian: 2,  raceOther: 11 },
  "36": { name: "New York",             abbr: "NY", population: 19571216, gdp: 2053, areaSqMi: 54555,  demPct: 59, raceWhite: 55, raceBlack: 15, raceHispanic: 20, raceAsian: 9,  raceOther: 1  },
  "37": { name: "North Carolina",       abbr: "NC", population: 10835491, gdp: 700,  areaSqMi: 53819,  demPct: 48, raceWhite: 63, raceBlack: 22, raceHispanic: 10, raceAsian: 3,  raceOther: 2  },
  "38": { name: "North Dakota",         abbr: "ND", population: 779261,   gdp: 72,   areaSqMi: 70698,  demPct: 32, raceWhite: 84, raceBlack: 3,  raceHispanic: 4,  raceAsian: 2,  raceOther: 7  },
  "39": { name: "Ohio",                 abbr: "OH", population: 11785935, gdp: 782,  areaSqMi: 44826,  demPct: 44, raceWhite: 79, raceBlack: 13, raceHispanic: 5,  raceAsian: 2,  raceOther: 1  },
  "40": { name: "Oklahoma",             abbr: "OK", population: 4053824,  gdp: 228,  areaSqMi: 69899,  demPct: 33, raceWhite: 68, raceBlack: 8,  raceHispanic: 12, raceAsian: 3,  raceOther: 9  },
  "41": { name: "Oregon",               abbr: "OR", population: 4233358,  gdp: 318,  areaSqMi: 98379,  demPct: 57, raceWhite: 73, raceBlack: 2,  raceHispanic: 14, raceAsian: 5,  raceOther: 6  },
  "42": { name: "Pennsylvania",         abbr: "PA", population: 12961683, gdp: 914,  areaSqMi: 46054,  demPct: 49, raceWhite: 75, raceBlack: 12, raceHispanic: 8,  raceAsian: 4,  raceOther: 1  },
  "44": { name: "Rhode Island",         abbr: "RI", population: 1095962,  gdp: 74,   areaSqMi: 1545,   demPct: 62, raceWhite: 71, raceBlack: 6,  raceHispanic: 17, raceAsian: 3,  raceOther: 3  },
  "45": { name: "South Carolina",       abbr: "SC", population: 5373555,  gdp: 278,  areaSqMi: 32020,  demPct: 43, raceWhite: 64, raceBlack: 27, raceHispanic: 6,  raceAsian: 2,  raceOther: 1  },
  "46": { name: "South Dakota",         abbr: "SD", population: 919318,   gdp: 65,   areaSqMi: 77116,  demPct: 37, raceWhite: 82, raceBlack: 2,  raceHispanic: 4,  raceAsian: 1,  raceOther: 11 },
  "47": { name: "Tennessee",            abbr: "TN", population: 7126489,  gdp: 487,  areaSqMi: 42144,  demPct: 36, raceWhite: 73, raceBlack: 17, raceHispanic: 6,  raceAsian: 2,  raceOther: 2  },
  "48": { name: "Texas",                abbr: "TX", population: 30503301, gdp: 2356, areaSqMi: 268596, demPct: 44, raceWhite: 41, raceBlack: 12, raceHispanic: 40, raceAsian: 5,  raceOther: 2  },
  "49": { name: "Utah",                 abbr: "UT", population: 3417734,  gdp: 266,  areaSqMi: 84897,  demPct: 40, raceWhite: 75, raceBlack: 1,  raceHispanic: 16, raceAsian: 3,  raceOther: 5  },
  "50": { name: "Vermont",              abbr: "VT", population: 647464,   gdp: 40,   areaSqMi: 9616,   demPct: 68, raceWhite: 93, raceBlack: 2,  raceHispanic: 2,  raceAsian: 2,  raceOther: 1  },
  "51": { name: "Virginia",             abbr: "VA", population: 8715698,  gdp: 659,  areaSqMi: 42775,  demPct: 53, raceWhite: 61, raceBlack: 20, raceHispanic: 10, raceAsian: 7,  raceOther: 2  },
  "53": { name: "Washington",           abbr: "WA", population: 7812880,  gdp: 803,  areaSqMi: 71298,  demPct: 60, raceWhite: 67, raceBlack: 4,  raceHispanic: 14, raceAsian: 10, raceOther: 5  },
  "54": { name: "West Virginia",        abbr: "WV", population: 1770071,  gdp: 84,   areaSqMi: 24230,  demPct: 30, raceWhite: 94, raceBlack: 4,  raceHispanic: 1,  raceAsian: 1,  raceOther: 0  },
  "55": { name: "Wisconsin",            abbr: "WI", population: 5910955,  gdp: 406,  areaSqMi: 65496,  demPct: 50, raceWhite: 81, raceBlack: 7,  raceHispanic: 7,  raceAsian: 3,  raceOther: 2  },
  "56": { name: "Wyoming",              abbr: "WY", population: 584057,   gdp: 47,   areaSqMi: 97813,  demPct: 28, raceWhite: 84, raceBlack: 1,  raceHispanic: 11, raceAsian: 1,  raceOther: 3  },
};

export function getStateName(fips: string): string {
  return STATE_DATA[fips]?.name ?? fips;
}

export const MEAN = 2.170383376216376;
export const STD_DEV = 2;

export const LOCATIONS = {
  siliconValley: {
    key: "siliconValley",
    lat: 37.3382,
    lon: -121.8863,
    zoom: 10,
    bounds: {
      latMin: 36.8,
      latMax: 37.9,
      lonMin: -122.6,
      lonMax: -121.0,
    },
  },
  dubai: {
    key: "dubai",
    lat: 25.2048,
    lon: 55.2708,
    zoom: 10,
    bounds: {
      latMin: 24.7,
      latMax: 25.5,
      lonMin: 54.7,
      lonMax: 55.9,
    },
  },
} as const;

export type LocationKey = keyof typeof LOCATIONS;

// Gender × sickness pie — meaningful, not decorative:
// red = sick, green = healthy; darker shade = male, lighter = female.
// Order matches genderSicknessData: [Sick Male, Non-Sick Male, Sick Female, Non-Sick Female]
export const COLORS = ["#DC2626", "#16A34A", "#F87171", "#4ADE80"];

export const AGE_GROUP_KEYS = [
  "<20",
  "20-30",
  "30-40",
  "40-50",
  "50-60",
  "60-80",
  "80+",
] as const;
export type AgeGroupKey = (typeof AGE_GROUP_KEYS)[number];

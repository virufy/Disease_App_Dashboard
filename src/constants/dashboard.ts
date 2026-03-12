export const MEAN = 2.170383376216376;
export const STD_DEV = 2;

export const LOCATIONS = {
  siliconValley: {
    key: "siliconValley",  // use key for translation
    lat: 37.3382,
    lon: -121.8863,
    zoom: 10,
  },
  dubai: {
    key: "dubai",
    lat: 25.2048,
    lon: 55.2708,
    zoom: 10,
  },
} as const;

export type LocationKey = keyof typeof LOCATIONS;

export const COLORS = ["#FF6B6B", "#4ECDC4", "#1A535C", "#B565A7"];

export const AGE_GROUP_KEYS = ["<20", "20-30", "30-40", "40-50", "50-60", "60-80", "80+"] as const;
export type AgeGroupKey = typeof AGE_GROUP_KEYS[number];
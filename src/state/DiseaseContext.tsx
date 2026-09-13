import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import { buildSimulation, Simulation, TIMELINE_STEPS } from "../data/simulation";
import { ScenarioKey, SeasonKey, TimeFrame } from "../data/types";

export type AppLang = "en" | "ar";
export type PlaybackSpeed = 0.5 | 1 | 2;

interface DiseaseContextValue {
  sim: Simulation;
  frame: TimeFrame;
  index: number;
  setIndex: (i: number) => void;
  steps: number;

  playing: boolean;
  togglePlay: () => void;
  speed: PlaybackSpeed;
  setSpeed: (s: PlaybackSpeed) => void;
  freezeMotion: boolean;
  setFreezeMotion: (v: boolean) => void;

  season: SeasonKey;
  setSeason: (s: SeasonKey) => void;
  scenario: ScenarioKey;
  setScenario: (s: ScenarioKey) => void;

  showPrevalence: boolean;
  setShowPrevalence: (v: boolean) => void;

  language: AppLang;
  setLanguage: (l: AppLang) => void;
  dir: "ltr" | "rtl";

  /** slow-ticking counter for "live" liveliness (clock, sensor jitter) */
  tick: number;
  /** true when nothing is moving (paused + freeze) — pauses map motion */
  motionActive: boolean;
  reducedMotion: boolean;
}

const DiseaseContext = createContext<DiseaseContextValue | null>(null);

export const useDisease = (): DiseaseContextValue => {
  const ctx = useContext(DiseaseContext);
  if (!ctx) throw new Error("useDisease must be used within DiseaseProvider");
  return ctx;
};

const prefersReducedMotion = (): boolean =>
  typeof window !== "undefined" &&
  window.matchMedia &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export const DiseaseProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { i18n } = useTranslation();
  const reducedMotion = useMemo(prefersReducedMotion, []);

  const [season, setSeason] = useState<SeasonKey>("umrah");
  const [scenario, setScenario] = useState<ScenarioKey>("none");
  const sim = useMemo(() => buildSimulation(season, scenario), [season, scenario]);

  const [index, setIndex] = useState(Math.floor(TIMELINE_STEPS * 0.6));
  const [playing, setPlaying] = useState(!reducedMotion);
  const [speed, setSpeed] = useState<PlaybackSpeed>(1);
  const [freezeMotion, setFreezeMotion] = useState(false);
  const [showPrevalence, setShowPrevalence] = useState(true);
  const [tick, setTick] = useState(0);

  const [language, setLanguageState] = useState<AppLang>(
    (i18n.language?.startsWith("ar") ? "ar" : "en") as AppLang,
  );
  const dir: "ltr" | "rtl" = language === "ar" ? "rtl" : "ltr";

  const setLanguage = useCallback(
    (l: AppLang) => {
      setLanguageState(l);
      i18n.changeLanguage(l);
    },
    [i18n],
  );

  // keep <html> dir/lang in sync for global RTL
  useEffect(() => {
    document.documentElement.setAttribute("dir", dir);
    document.documentElement.setAttribute("lang", language);
  }, [dir, language]);

  // ── playback: advance the timeline ───────────────────────────
  const indexRef = useRef(index);
  indexRef.current = index;
  useEffect(() => {
    if (!playing) return;
    const period = 950 / speed;
    const id = window.setInterval(() => {
      const next = (indexRef.current + 1) % TIMELINE_STEPS;
      setIndex(next);
      setTick((t) => t + 1);
    }, period);
    return () => window.clearInterval(id);
  }, [playing, speed]);

  // ── liveliness: slow tick for clock + sensor jitter ──────────
  useEffect(() => {
    if (reducedMotion) return;
    const id = window.setInterval(() => setTick((t) => t + 1), 2000);
    return () => window.clearInterval(id);
  }, [reducedMotion]);

  const togglePlay = useCallback(() => setPlaying((p) => !p), []);

  const motionActive = !reducedMotion && !(freezeMotion && !playing);

  const frame = sim.frames[Math.min(index, sim.frames.length - 1)];

  const value: DiseaseContextValue = {
    sim,
    frame,
    index,
    setIndex,
    steps: TIMELINE_STEPS,
    playing,
    togglePlay,
    speed,
    setSpeed,
    freezeMotion,
    setFreezeMotion,
    season,
    setSeason,
    scenario,
    setScenario,
    showPrevalence,
    setShowPrevalence,
    language,
    setLanguage,
    dir,
    tick,
    motionActive,
    reducedMotion,
  };

  return (
    <DiseaseContext.Provider value={value}>{children}</DiseaseContext.Provider>
  );
};

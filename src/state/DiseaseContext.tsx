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
import { useLiveData, ConnStatus } from "../data/liveData";
import { Submission } from "../data/submissions";
import { IS_TEST_DATA } from "../data/config";
import { ScenarioKey, SeasonKey } from "../data/types";

export type AppLang = "en" | "ar";
export type PlaybackSpeed = 0.5 | 1 | 2;

interface DiseaseContextValue {
  // real data
  submissions: Submission[]; // all loaded
  visible: Submission[]; // revealed up to the timeline position
  filtered: Submission[]; // visible ∩ global filters (what most panels show)
  filteredAll: Submission[]; // all-loaded ∩ filters (ignores timeline; for the chart)
  total: number;
  status: ConnStatus;
  isTest: boolean;

  // global filters (multi-select; empty array = All)
  locations: string[];
  symptoms: string[];
  toggleLocation: (id: string) => void;
  toggleSymptom: (id: string) => void;
  clearLocations: () => void;
  clearSymptoms: () => void;

  // arrival-order session timeline
  visibleCount: number;
  scrubTo: (count: number) => void;
  follow: boolean; // at the live edge
  goLive: () => void;
  playing: boolean;
  togglePlay: () => void;
  speed: PlaybackSpeed;
  setSpeed: (s: PlaybackSpeed) => void;
  freezeMotion: boolean;
  setFreezeMotion: (v: boolean) => void;

  // modeled-layer controls
  season: SeasonKey;
  setSeason: (s: SeasonKey) => void;
  scenario: ScenarioKey;
  setScenario: (s: ScenarioKey) => void;

  showPrevalence: boolean;
  setShowPrevalence: (v: boolean) => void;

  language: AppLang;
  setLanguage: (l: AppLang) => void;
  dir: "ltr" | "rtl";

  tick: number;
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

export const DiseaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { i18n } = useTranslation();
  const reducedMotion = useMemo(prefersReducedMotion, []);

  const { submissions, status } = useLiveData();
  const total = submissions.length;

  const [season, setSeason] = useState<SeasonKey>("baseline");
  const [scenario, setScenario] = useState<ScenarioKey>("none");
  const [showPrevalence, setShowPrevalence] = useState(true);
  const [locations, setLocations] = useState<string[]>([]);
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const toggleLocation = useCallback(
    (id: string) => setLocations((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id])),
    [],
  );
  const toggleSymptom = useCallback(
    (id: string) => setSymptoms((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id])),
    [],
  );
  const clearLocations = useCallback(() => setLocations([]), []);
  const clearSymptoms = useCallback(() => setSymptoms([]), []);

  const [follow, setFollow] = useState(true); // default: show all, live edge
  const [manualCount, setManualCount] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState<PlaybackSpeed>(1);
  const [freezeMotion, setFreezeMotion] = useState(false);
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
  useEffect(() => {
    document.documentElement.setAttribute("dir", dir);
    document.documentElement.setAttribute("lang", language);
  }, [dir, language]);

  const visibleCount = follow ? total : Math.min(manualCount, total);

  const scrubTo = useCallback((count: number) => {
    setFollow(false);
    setPlaying(false);
    setManualCount(count);
  }, []);

  const goLive = useCallback(() => {
    setPlaying(false);
    setFollow(true);
  }, []);

  const togglePlay = useCallback(() => {
    setPlaying((p) => {
      const next = !p;
      if (next) {
        // start a replay from the beginning of the arrival timeline
        setFollow(false);
        setManualCount(0);
      }
      return next;
    });
  }, []);

  // ── replay: advance the arrival-order position ───────────────
  const totalRef = useRef(total);
  totalRef.current = total;
  useEffect(() => {
    if (!playing) return;
    const step = Math.max(1, Math.ceil(totalRef.current / 80));
    const period = 260 / speed;
    const id = window.setInterval(() => {
      setManualCount((c) => {
        const next = c + step;
        if (next >= totalRef.current) {
          setPlaying(false);
          setFollow(true); // return to live edge when the replay finishes
          return totalRef.current;
        }
        return next;
      });
      setTick((t) => t + 1);
    }, period);
    return () => window.clearInterval(id);
  }, [playing, speed]);

  // ── liveliness: clock / feed jitter ─────────────────────────
  useEffect(() => {
    if (reducedMotion) return;
    const id = window.setInterval(() => setTick((t) => t + 1), 2000);
    return () => window.clearInterval(id);
  }, [reducedMotion]);

  const visible = useMemo(
    () => (follow ? submissions : submissions.slice(0, visibleCount)),
    [submissions, follow, visibleCount],
  );

  const matches = useCallback(
    (s: Submission) =>
      (locations.length === 0 || locations.includes(s.locationId)) &&
      (symptoms.length === 0 || s.symptoms.some((x) => symptoms.includes(x))),
    [locations, symptoms],
  );
  const filtered = useMemo(() => visible.filter(matches), [visible, matches]);
  const filteredAll = useMemo(() => submissions.filter(matches), [submissions, matches]);

  const motionActive = !reducedMotion && !(freezeMotion && !playing);

  const value: DiseaseContextValue = {
    submissions,
    visible,
    filtered,
    filteredAll,
    total,
    status,
    isTest: IS_TEST_DATA,
    locations,
    symptoms,
    toggleLocation,
    toggleSymptom,
    clearLocations,
    clearSymptoms,
    visibleCount,
    scrubTo,
    follow,
    goLive,
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

  return <DiseaseContext.Provider value={value}>{children}</DiseaseContext.Provider>;
};

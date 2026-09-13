import React from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { useDisease, PlaybackSpeed } from "../../state/DiseaseContext";
import { Panel, Segmented, SegButton, IconBtn, Num } from "../../styles/cc";

const Wrap = styled(Panel)`
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 10px 16px;
  flex-wrap: wrap;
`;

const Now = styled.div`
  min-width: 78px;
  display: flex;
  flex-direction: column;
  line-height: 1.1;
  .l {
    font-size: 9px;
    font-weight: 700;
    letter-spacing: 0.6px;
    text-transform: uppercase;
    color: var(--faint);
  }
  .v {
    font-family: var(--font-num);
    font-size: 15px;
    font-weight: 700;
    color: var(--ink);
  }
`;

const Range = styled.input`
  flex: 1;
  min-width: 160px;
  appearance: none;
  height: 6px;
  border-radius: 999px;
  background: linear-gradient(
    90deg,
    rgba(34, 211, 238, 0.6) 0%,
    rgba(34, 211, 238, 0.6) var(--pct, 60%),
    rgba(148, 163, 184, 0.18) var(--pct, 60%),
    rgba(148, 163, 184, 0.18) 100%
  );
  outline: none;
  cursor: pointer;

  &::-webkit-slider-thumb {
    appearance: none;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: #22d3ee;
    border: 3px solid #0a0e17;
    box-shadow: 0 0 0 1px rgba(34, 211, 238, 0.6);
    cursor: pointer;
  }
  &::-moz-range-thumb {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: #22d3ee;
    border: 3px solid #0a0e17;
    cursor: pointer;
  }
  &:focus-visible {
    outline: 2px solid var(--signal);
    outline-offset: 3px;
  }
`;

const Freeze = styled.label`
  display: inline-flex;
  align-items: center;
  gap: 7px;
  font-size: 11px;
  font-weight: 600;
  color: var(--muted);
  cursor: pointer;
  user-select: none;
  input {
    accent-color: #22d3ee;
    width: 15px;
    height: 15px;
  }
`;

const speeds: PlaybackSpeed[] = [0.5, 1, 2];

const Timeline: React.FC = () => {
  const { t } = useTranslation();
  const {
    index,
    setIndex,
    steps,
    playing,
    togglePlay,
    speed,
    setSpeed,
    freezeMotion,
    setFreezeMotion,
    frame,
    dir,
  } = useDisease();

  const pct = (index / (steps - 1)) * 100;

  return (
    <Wrap>
      <IconBtn onClick={togglePlay} aria-label={playing ? t("dm.timeline.pause") : t("dm.timeline.play")}>
        {playing ? "❚❚" : "▶"}
      </IconBtn>

      <Now>
        <span className="l">{t("dm.lastUpdated")}</span>
        <span className="v">{frame.label}</span>
      </Now>

      <Range
        type="range"
        min={0}
        max={steps - 1}
        value={index}
        onChange={(e) => setIndex(Number(e.target.value))}
        style={{ ["--pct" as any]: `${pct}%`, transform: dir === "rtl" ? "scaleX(-1)" : undefined }}
        aria-label={t("dm.map.title")}
        aria-valuetext={frame.label}
      />

      <Segmented role="group" aria-label={t("dm.timeline.speed")}>
        {speeds.map((s) => (
          <SegButton key={s} $active={speed === s} onClick={() => setSpeed(s)}>
            <Num>{s}×</Num>
          </SegButton>
        ))}
      </Segmented>

      <Freeze>
        <input
          type="checkbox"
          checked={freezeMotion}
          onChange={(e) => setFreezeMotion(e.target.checked)}
        />
        {t("dm.timeline.freeze")}
      </Freeze>
    </Wrap>
  );
};

export default Timeline;

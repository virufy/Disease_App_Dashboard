import React from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { FiPlay, FiPause } from "react-icons/fi";
import { useDisease, PlaybackSpeed } from "../../state/DiseaseContext";
import { Panel, Segmented, SegButton, IconBtn, Num, Chip, LiveDot } from "../../styles/cc";

const Wrap = styled(Panel)`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 16px;
  flex-wrap: wrap;
`;
const Now = styled.div`
  min-width: 96px;
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
    rgba(77, 141, 246, 0.6) 0%,
    rgba(77, 141, 246, 0.6) var(--pct, 100%),
    rgba(148, 163, 184, 0.18) var(--pct, 100%),
    rgba(148, 163, 184, 0.18) 100%
  );
  outline: none;
  cursor: pointer;
  &::-webkit-slider-thumb {
    appearance: none;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: #4d8df6;
    border: 3px solid #0a0e17;
    box-shadow: 0 0 0 1px rgba(77, 141, 246, 0.6);
    cursor: pointer;
  }
  &::-moz-range-thumb {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: #4d8df6;
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
    accent-color: #4d8df6;
    width: 15px;
    height: 15px;
  }
`;
const GoLive = styled.button<{ $on: boolean }>`
  appearance: none;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  border: 1px solid ${({ $on }) => ($on ? "rgba(77, 141, 246,0.5)" : "var(--line)")};
  background: ${({ $on }) => ($on ? "rgba(77, 141, 246,0.14)" : "transparent")};
  color: ${({ $on }) => ($on ? "#9dc0ff" : "var(--muted)")};
  font-size: 11px;
  font-weight: 700;
  padding: 6px 11px;
  border-radius: 9px;
  cursor: pointer;
`;

const speeds: PlaybackSpeed[] = [0.5, 1, 2];

const Timeline: React.FC = () => {
  const { t } = useTranslation();
  const {
    visibleCount,
    total,
    scrubTo,
    follow,
    goLive,
    playing,
    togglePlay,
    speed,
    setSpeed,
    freezeMotion,
    setFreezeMotion,
    dir,
  } = useDisease();

  const pct = total ? (visibleCount / total) * 100 : 100;

  return (
    <Wrap>
      <IconBtn onClick={togglePlay} aria-label={playing ? t("dm.timeline.pause") : t("dm.timeline.replay")}>
        {playing ? <FiPause size={15} /> : <FiPlay size={15} />}
      </IconBtn>

      <Now>
        <span className="l">{t("dm.timeline.arrivalOrder")}</span>
        <span className="v">
          <Num>{visibleCount.toLocaleString()}</Num> / <Num>{total.toLocaleString()}</Num>
        </span>
      </Now>

      <Range
        type="range"
        min={0}
        max={Math.max(1, total)}
        value={visibleCount}
        onChange={(e) => scrubTo(Number(e.target.value))}
        style={{ ["--pct" as any]: `${pct}%`, transform: dir === "rtl" ? "scaleX(-1)" : undefined }}
        aria-label={t("dm.timeline.arrivalOrder")}
      />

      <GoLive $on={follow} onClick={goLive} aria-pressed={follow}>
        {follow && <LiveDot />} {t("dm.timeline.live")}
      </GoLive>

      <Segmented role="group" aria-label={t("dm.timeline.speed")}>
        {speeds.map((s) => (
          <SegButton key={s} $active={speed === s} onClick={() => setSpeed(s)}>
            <Num>{s}×</Num>
          </SegButton>
        ))}
      </Segmented>

      <Freeze>
        <input type="checkbox" checked={freezeMotion} onChange={(e) => setFreezeMotion(e.target.checked)} />
        {t("dm.timeline.freeze")}
      </Freeze>

      <Chip $tone="#fcd34d">{t("dm.tag.preview")}</Chip>
    </Wrap>
  );
};

export default Timeline;

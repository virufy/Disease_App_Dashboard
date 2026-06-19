import styled, { keyframes } from "styled-components";
import { tokens } from "./theme";

// ─── Entrance animations ──────────────────────────────────────────────────────

const slideDown = keyframes`
  from { opacity: 0; transform: translateX(-50%) translateY(-10px); }
  to   { opacity: 1; transform: translateX(-50%) translateY(0); }
`;

const slideUp = keyframes`
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
`;

// ─── Core Layout ──────────────────────────────────────────────────────────────

export const DashboardContainer = styled.div`
  flex: 1;
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: ${tokens.color.canvas};
`;

export const MapSection = styled.div`
  position: relative;
  flex: 1;
  width: 100%;
  overflow: hidden;
`;

// ─── Top Filter Bar ───────────────────────────────────────────────────────────

export const MapControls = styled.div`
  position: absolute;
  top: 18px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
  width: max-content;
  max-width: calc(100% - 40px);

  display: flex;
  align-items: center;
  padding: 9px 20px;

  /* Frosted glass pill — single soft shadow */
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border: 1px solid ${tokens.color.border};
  border-radius: ${tokens.radius.pill};
  box-shadow: ${tokens.shadow.lg};

  animation: ${slideDown} 0.4s cubic-bezier(0.16, 1, 0.3, 1) both;

  @media (max-width: 700px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
    width: calc(100% - 32px);
    left: 16px;
    transform: none;
    border-radius: ${tokens.radius.lg};
    animation: none;
  }
`;

export const FilterDivider = styled.div`
  width: 1px;
  height: 22px;
  background: linear-gradient(
    to bottom,
    transparent,
    ${tokens.color.border},
    transparent
  );
  margin: 0 14px;
  flex-shrink: 0;

  @media (max-width: 700px) {
    display: none;
  }
`;

export const FilterGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const FilterLabel = styled.span`
  color: ${tokens.color.muted};
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.8px;
  text-transform: uppercase;
  white-space: nowrap;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 5px;
`;

export const FilterBadge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 17px;
  height: 17px;
  padding: 0 4px;
  background: ${tokens.color.brand};
  color: ${tokens.color.white};
  border-radius: 10px;
  font-size: 9px;
  font-weight: 700;
  line-height: 1;
  flex-shrink: 0;
`;

export const ChipRow = styled.div`
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
  align-items: center;
`;

export const Chip = styled.button<{ $active: boolean }>`
  background: ${({ $active }) =>
    $active ? tokens.color.brand : tokens.color.surfaceAlt};
  color: ${({ $active }) =>
    $active ? tokens.color.white : tokens.color.body};
  border: 1px solid
    ${({ $active }) => ($active ? "transparent" : tokens.color.border)};
  border-radius: ${tokens.radius.pill};
  padding: 4px 12px;
  font-size: 11px;
  font-weight: ${({ $active }) => ($active ? "600" : "500")};
  cursor: pointer;
  transition: all 0.15s ease;
  white-space: nowrap;
  user-select: none;
  line-height: 1.5;

  &:hover {
    background: ${({ $active }) =>
      $active ? tokens.color.brandHover : "#EEF2F6"};
    color: ${({ $active }) =>
      $active ? tokens.color.white : tokens.color.heading};
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }

  &:focus-visible {
    outline: none;
    box-shadow: ${tokens.shadow.focus};
  }
`;

// ─── KPI Summary Bar ─────────────────────────────────────────────────────────

export const KPIBar = styled.div`
  position: absolute;
  top: 80px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 999;
  display: flex;
  gap: 8px;
  pointer-events: none;
  animation: ${slideDown} 0.5s 0.18s cubic-bezier(0.16, 1, 0.3, 1) both;

  @media (max-width: 700px) {
    display: none;
  }
`;

export const KPICard = styled.div<{ $color?: string }>`
  display: flex;
  flex-direction: column;
  padding: 7px 14px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid ${tokens.color.borderSoft};
  border-radius: ${tokens.radius.md};
  box-shadow: ${tokens.shadow.md};
  border-left: 3px solid ${({ $color }) => $color ?? tokens.color.brand};
  white-space: nowrap;
  min-width: 88px;
`;

export const KPIValue = styled.div`
  font-size: 19px;
  font-weight: 800;
  color: ${tokens.color.heading};
  line-height: 1;
  font-variant-numeric: tabular-nums;
  letter-spacing: -0.5px;
`;

export const KPILabel = styled.div`
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.7px;
  text-transform: uppercase;
  color: ${tokens.color.muted};
  margin-top: 4px;
`;

// ─── Empty State ──────────────────────────────────────────────────────────────

export const EmptyStateOverlay = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  gap: 6px;
`;

// ─── Bottom Charts Panel ──────────────────────────────────────────────────────

export const BottomCardsContainer = styled.div`
  display: flex;
  gap: 10px;
  height: 100%;
  min-height: 0;
`;

export const BottomCard = styled.div<{ $accent?: string }>`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  padding: 12px 14px 10px;
  background: ${tokens.color.surface};
  border: 1px solid ${tokens.color.borderSoft};
  border-radius: ${tokens.radius.md};
  box-shadow: ${tokens.shadow.sm};
  overflow: hidden;
  border-top: 2.5px solid ${({ $accent }) => $accent ?? tokens.color.border};
  transition: box-shadow 0.2s ease;

  &:hover {
    box-shadow: ${tokens.shadow.md};
  }
`;

export const FloatingCharts = styled.div`
  position: absolute;
  bottom: 16px;
  left: 16px;
  right: 16px;
  z-index: 1000;
  height: 34vh;

  /* Frosted glass panel */
  background: rgba(248, 250, 253, 0.97);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);

  /* Brand top accent + subtle border elsewhere */
  border-top: 2px solid rgba(13, 148, 136, 0.35);
  border-left: 1px solid ${tokens.color.borderSoft};
  border-right: 1px solid ${tokens.color.borderSoft};
  border-bottom: 1px solid ${tokens.color.borderSoft};

  border-radius: ${tokens.radius.lg};
  padding: 14px 16px;
  box-shadow: ${tokens.shadow.lg};

  animation: ${slideUp} 0.45s cubic-bezier(0.16, 1, 0.3, 1) both;

  & > ${BottomCardsContainer} {
    height: 100%;
  }

  @media (max-width: 768px) {
    left: 8px;
    right: 8px;
    padding: 10px 12px;
    height: 50vh;
    animation: none;

    & > ${BottomCardsContainer} {
      flex-direction: column;
      gap: 8px;
    }
  }
`;

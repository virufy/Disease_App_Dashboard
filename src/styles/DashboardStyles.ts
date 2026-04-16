import styled, { keyframes } from "styled-components";

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
  background: #0b1220;
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

  /* Bright frosted glass pill */
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border: 1px solid rgba(226, 232, 240, 0.9);
  border-radius: 50px;
  box-shadow:
    0 1px 0 rgba(255, 255, 255, 0.9) inset,
    0 6px 28px rgba(0, 0, 0, 0.18),
    0 2px 6px rgba(0, 0, 0, 0.08);

  animation: ${slideDown} 0.4s cubic-bezier(0.16, 1, 0.3, 1) both;

  @media (max-width: 700px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
    width: calc(100% - 32px);
    left: 16px;
    transform: none;
    border-radius: 16px;
    animation: none;
  }
`;

export const FilterDivider = styled.div`
  width: 1px;
  height: 22px;
  background: linear-gradient(
    to bottom,
    transparent,
    rgba(0, 0, 0, 0.12),
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
  color: #4b5563;
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
  background: linear-gradient(135deg, #2563eb, #4f46e5);
  color: #ffffff;
  border-radius: 10px;
  font-size: 9px;
  font-weight: 700;
  line-height: 1;
  flex-shrink: 0;
  box-shadow: 0 1px 4px rgba(37, 99, 235, 0.4);
`;

export const ChipRow = styled.div`
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
  align-items: center;
`;

export const Chip = styled.button<{ $active: boolean }>`
  background: ${({ $active }) =>
    $active
      ? "linear-gradient(135deg, #1d4ed8, #4f46e5)"
      : "rgba(0, 0, 0, 0.04)"};
  color: ${({ $active }) => ($active ? "#ffffff" : "#374151")};
  border: 1px solid
    ${({ $active }) => ($active ? "transparent" : "rgba(0, 0, 0, 0.08)")};
  border-radius: 20px;
  padding: 4px 12px;
  font-size: 11px;
  font-weight: ${({ $active }) => ($active ? "600" : "400")};
  cursor: pointer;
  transition: all 0.15s ease;
  white-space: nowrap;
  user-select: none;
  line-height: 1.5;
  box-shadow: ${({ $active }) =>
    $active ? "0 2px 6px rgba(37,99,235,0.35)" : "none"};

  &:hover {
    background: ${({ $active }) =>
      $active
        ? "linear-gradient(135deg, #1e40af, #4338ca)"
        : "rgba(0, 0, 0, 0.08)"};
    color: ${({ $active }) => ($active ? "#ffffff" : "#111827")};
    transform: translateY(-1px);
    box-shadow: ${({ $active }) =>
      $active ? "0 4px 10px rgba(37,99,235,0.4)" : "0 1px 3px rgba(0,0,0,0.08)"};
  }

  &:active {
    transform: translateY(0);
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.2);
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
  border: 1px solid rgba(0, 0, 0, 0.07);
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  border-left: 3px solid ${({ $color }) => $color ?? "#3b82f6"};
  white-space: nowrap;
  min-width: 88px;
`;

export const KPIValue = styled.div`
  font-size: 19px;
  font-weight: 800;
  color: #111827;
  line-height: 1;
  font-variant-numeric: tabular-nums;
  letter-spacing: -0.5px;
`;

export const KPILabel = styled.div`
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.7px;
  text-transform: uppercase;
  color: #9ca3af;
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
  background: #ffffff;
  border: 1px solid rgba(0, 0, 0, 0.06);
  border-radius: 12px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06), 0 4px 12px rgba(0, 0, 0, 0.04);
  overflow: hidden;
  border-top: 2.5px solid ${({ $accent }) => $accent ?? "#e2e8f0"};
  transition: box-shadow 0.2s ease;

  &:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1), 0 8px 20px rgba(0, 0, 0, 0.06);
  }
`;

export const FloatingCharts = styled.div`
  position: absolute;
  bottom: 16px;
  left: 16px;
  right: 16px;
  z-index: 1000;
  height: 34vh;

  /* Crisp frosted glass panel */
  background: rgba(248, 250, 253, 0.97);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);

  /* Coloured top accent + subtle border elsewhere */
  border-top: 2px solid rgba(99, 102, 241, 0.3);
  border-left: 1px solid rgba(0, 0, 0, 0.06);
  border-right: 1px solid rgba(0, 0, 0, 0.06);
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);

  border-radius: 16px;
  padding: 14px 16px;
  box-shadow:
    0 -4px 24px rgba(0, 0, 0, 0.08),
    0 16px 48px rgba(0, 0, 0, 0.14),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);

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

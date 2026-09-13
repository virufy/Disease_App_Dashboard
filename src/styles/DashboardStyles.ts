import styled, { keyframes } from "styled-components";

interface HeatmapCardProps {
  $hideOnMobile?: boolean;
}

/* ── Animations ─────────────────────────────────────────────── */
export const pulse = keyframes`
  0%   { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.55); }
  70%  { box-shadow: 0 0 0 7px rgba(16, 185, 129, 0); }
  100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
`;

export const rise = keyframes`
  from { opacity: 0; transform: translateY(-8px); }
  to   { opacity: 1; transform: translateY(0); }
`;

export const HeaderContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 98%;
  padding: 12px;
  position: relative;
  height: 12vh;
`;

export const DashboardContainer = styled.div`
  flex: 1;
  height: 100vh;
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  @media (max-width: 768px) {
    width: 90vw;
    height: auto;
    border-radius: 0;
  }
  @media (max-height: 800px) {
    height: auto;
    border-radius: 0;
  }
`;

export const HeatmapContainer = styled.div`
  display: flex;
  gap: 10px;
  height: 50%;

  @media (max-width: 768px) {
    flex-direction: column;
    height: 500px;
    width: 90vw;
  }
  @media (max-height: 800px) {
    height: 400px;
  }
`;

export const HeatmapCard = styled.div<HeatmapCardProps>`
  width: 45vw;
  height: 100%;
  min-height: 300px;
  min-width: 300px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  border-radius: 12px;
  overflow: hidden;
  display: flex;
  flex-direction: row; /* Arrange items side by side */

  @media (max-width: 768px) {
    height: 500px;
    width: 90vw;
  }
`;

export const BottomCardsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  height: 35%;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
    height: auto;
    width: 90vw;
  }
  @media (max-height: 800px) {
    height: 250px;
  }
`;

export const BottomCard = styled.div`
  flex: 1;
  margin: 10px;
  padding: 15px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  border-radius: 12px;
  background-color: #fff;
  text-align: center;
  @media (max-width: 768px) {
    width: calc(100% - 30px + 10px);
    min-height: 220px;
  }
`;

export const MapContainer = styled.div`
  width: 82%;
  height: 100%;
  border-radius: 12px;
  overflow: hidden;
  @media (max-width: 768px) {
    width: 94%;
  }
`;

export const SelectionContainer = styled.div`
  width: 13%;
  min-width: 75px;
  padding: 10px;
  padding-right: 30px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  @media (max-width: 768px) {
    width: 6%;
  }
`;

export const SelectDropdown = styled.div<{ $isArabic?: boolean }>`
  width: 100%;
  background-color: #f5f5f5;
  border-radius: 5px;
  border: 1px solid #ddd;
  padding: ${(props) => (props.$isArabic ? "5px 0px" : "10px")};
  font-size: 12px;
`;

export const DropdownOption = styled.div`
  padding: 5px 0;
  display: flex;
  align-items: center;
  cursor: pointer;

  &:hover {
    background-color: #e0e0e0;
  }

  &::before {
    content: "•";
    color: #007bff;
    margin-right: 10px;
  }
`;

export const MapSection = styled.div`
  position: relative;
  flex: 1;
  width: 100%;
  overflow: hidden;
`;

/* The main control bar – now a horizontal strip of filter groups */
export const MapControls = styled.div`
  position: absolute;
  top: 104px;
  left: 16px;
  z-index: 1000;

  display: flex;
  gap: 28px;
  padding: 12px 20px;

  background: rgba(255, 255, 255, 0.78);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border-radius: 18px;
  box-shadow: 0 10px 30px -12px rgba(15, 23, 42, 0.28);
  border: 1px solid rgba(15, 23, 42, 0.06);
  animation: ${rise} 0.4s ease both;

  /* On narrow screens, stack vertically */
  @media (max-width: 700px) {
    flex-direction: column;
    gap: 12px;
    left: 12px;
    right: 12px;
    top: 150px;
    border-radius: 16px;
  }
`;

/* Each filter group (e.g. location, symptoms) */
export const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const FilterLabel = styled.span`
  color: #64748b;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.7px;
  text-transform: uppercase;
  margin-left: 2px;
`;

/* Row of chip buttons */
export const ChipRow = styled.div`
  display: flex;
  gap: 5px;
  flex-wrap: wrap;
`;

/* Individual chip */
export const Chip = styled.button<{ $active: boolean }>`
  background: ${({ $active }) =>
    $active
      ? "linear-gradient(135deg, #0ea5a4 0%, #2563eb 100%)"
      : "rgba(15, 23, 42, 0.05)"};
  color: ${({ $active }) => ($active ? "#fff" : "#334155")};
  border: 1px solid
    ${({ $active }) => ($active ? "transparent" : "rgba(15, 23, 42, 0.08)")};
  border-radius: 999px;
  padding: 6px 15px;
  font-size: 12.5px;
  font-weight: ${({ $active }) => ($active ? "700" : "500")};
  cursor: pointer;
  transition: all 0.18s ease;
  white-space: nowrap;
  box-shadow: ${({ $active }) =>
    $active ? "0 6px 16px -6px rgba(37, 99, 235, 0.6)" : "none"};

  &:hover {
    transform: translateY(-1px);
    background: ${({ $active }) =>
      $active
        ? "linear-gradient(135deg, #0d9488 0%, #1d4ed8 100%)"
        : "rgba(15, 23, 42, 0.09)"};
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(14, 165, 164, 0.35);
  }
`;

/* Floating panel for the bottom charts */
export const FloatingCharts = styled.div`
  position: absolute;
  bottom: 16px;
  left: 16px;
  right: 16px;
  z-index: 1000;

  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-radius: 20px;
  padding: 14px 16px;
  box-shadow: 0 18px 40px -18px rgba(15, 23, 42, 0.4);
  border: 1px solid rgba(15, 23, 42, 0.06);

  /* Limit height so it doesn't cover the whole map */
  max-height: 34vh;
  overflow: hidden;

  /* Override the default BottomCardsContainer styles */
  & > ${BottomCardsContainer} {
    height: 100%;
    margin: 0;
    background: transparent;
    box-shadow: none;
    padding: 0;
    gap: 12px;
  }

  /* Make each bottom card take equal width and have a clean look */
  & ${BottomCard} {
    margin: 0;
    padding: 12px 14px;
    background: #ffffff;
    border: 1px solid rgba(15, 23, 42, 0.05);
    border-radius: 16px;
    box-shadow: 0 6px 18px -12px rgba(15, 23, 42, 0.35);
    transition:
      transform 0.2s ease,
      box-shadow 0.2s ease,
      border-color 0.2s ease;
  }

  & ${BottomCard}:hover {
    transform: translateY(-3px);
    box-shadow: 0 16px 34px -16px rgba(15, 23, 42, 0.5);
    border-color: rgba(14, 165, 164, 0.35);
  }

  /* Responsive adjustments for mobile */
  @media (max-width: 768px) {
    left: 10px;
    right: 10px;
    padding: 12px;
    max-height: 46vh;
    overflow-y: auto;

    & ${BottomCardsContainer} {
      flex-direction: column;
      gap: 8px;
    }

    & ${BottomCard} {
      margin: 0;
      width: 100%;
    }
  }
`;

/* ────────────────────────────────────────────────────────────────
   Stakeholder header: brand + live KPI strip (floats over the map)
   ──────────────────────────────────────────────────────────────── */
export const TopBar = styled.div`
  position: absolute;
  top: 16px;
  left: 16px;
  right: 16px;
  z-index: 1100;
  display: flex;
  align-items: stretch;
  gap: 12px;
  pointer-events: none;
  animation: ${rise} 0.45s ease both;

  & > * {
    pointer-events: auto;
  }

  @media (max-width: 900px) {
    flex-direction: column;
  }
`;

export const BrandPanel = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 18px;
  background: rgba(255, 255, 255, 0.82);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-radius: 18px;
  border: 1px solid rgba(15, 23, 42, 0.06);
  box-shadow: 0 10px 30px -12px rgba(15, 23, 42, 0.28);
  flex-shrink: 0;
`;

export const BrandMark = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: linear-gradient(135deg, #0ea5a4 0%, #2563eb 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 20px;
  box-shadow: 0 8px 18px -6px rgba(37, 99, 235, 0.6);
  flex-shrink: 0;
`;

export const BrandText = styled.div`
  display: flex;
  flex-direction: column;
  line-height: 1.15;
`;

export const BrandTitle = styled.div`
  font-family: "Plus Jakarta Sans", "Inter", sans-serif;
  font-weight: 800;
  font-size: 17px;
  letter-spacing: -0.3px;
  color: #0f172a;
`;

export const BrandSubtitle = styled.div`
  font-size: 11px;
  font-weight: 500;
  color: #64748b;
`;

export const LiveBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-top: 3px;
  padding: 2px 8px 2px 6px;
  width: fit-content;
  border-radius: 999px;
  background: rgba(16, 185, 129, 0.12);
  color: #047857;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.6px;
  text-transform: uppercase;
`;

export const LiveDot = styled.span`
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #10b981;
  animation: ${pulse} 1.8s infinite;
`;

export const KpiRow = styled.div`
  flex: 1;
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  overflow-x: auto;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }

  @media (max-width: 900px) {
    justify-content: flex-start;
  }
`;

export const KpiCard = styled.div`
  position: relative;
  min-width: 132px;
  padding: 11px 16px 11px 15px;
  background: rgba(255, 255, 255, 0.82);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-radius: 16px;
  border: 1px solid rgba(15, 23, 42, 0.06);
  box-shadow: 0 10px 30px -14px rgba(15, 23, 42, 0.28);
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 4px;
    background: var(--dm-accent, #2563eb);
  }
`;

export const KpiLabel = styled.div`
  font-size: 10.5px;
  font-weight: 700;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  color: #64748b;
  display: flex;
  align-items: center;
  gap: 6px;
`;

export const KpiValue = styled.div`
  font-family: "Plus Jakarta Sans", "Inter", sans-serif;
  font-weight: 800;
  font-size: 26px;
  letter-spacing: -0.6px;
  color: #0f172a;
  line-height: 1.1;
  margin-top: 3px;
  font-variant-numeric: tabular-nums;
`;

export const KpiSub = styled.div`
  font-size: 10.5px;
  font-weight: 600;
  color: #94a3b8;
  margin-top: 1px;
`;

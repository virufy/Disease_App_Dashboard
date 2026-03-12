import styled from "styled-components";

interface HeatmapCardProps {
  $hideOnMobile?: boolean;
}

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
  top: 20px;
  left: 10vw;
  z-index: 1000;
  width: calc(80% - 40px);

  display: flex;
  gap: 8%;
  padding: 8px 15px;

  background: rgba(255, 255, 255, 0.64);
  backdrop-filter: blur(8px);
  border-radius: 40px; /* pill shape */
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.1);

  /* On narrow screens, stack vertically */
  @media (max-width: 700px) {
    flex-direction: column;
    gap: 12px;
    width: calc(100% - 40px);
    left: 20px;
    right: 20px;
    border-radius: 20px;
  }
`;

/* Each filter group (e.g. location, symptoms) */
export const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const FilterLabel = styled.span`
  color: rgb(0, 0, 0);
  font-size: 10px;
  font-weight: 500;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  margin-left: 4px;
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
    $active ? "#007bff" : "rgba(0, 0, 0, 0.08)"}; /* light gray for inactive */
  color: ${({ $active }) => ($active ? "#fff" : "#333")};
  border: 1px solid
    ${({ $active }) => ($active ? "#007bff" : "rgba(0, 0, 0, 0.1)")}; /* subtle border for inactive */
  border-radius: 30px;
  padding: 5px 14px;
  font-size: 12px;
  font-weight: ${({ $active }) => ($active ? "600" : "400")};
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;

  &:hover {
    background: ${({ $active }) =>
      $active ? "#0056b3" : "rgba(0, 0, 0, 0.12)"};
    border-color: ${({ $active }) =>
      $active ? "#0056b3" : "rgba(0, 0, 0, 0.2)"};
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.5);
  }
`;

/* Floating panel for the bottom charts */
export const FloatingCharts = styled.div`
  position: absolute;
  height: 100vh;
  bottom: 20px;
  left: 20px;
  right: 20px;
  z-index: 1000;

  background: rgba(255, 255, 255, 0.16);
  backdrop-filter: blur(8px);
  border-radius: 16px;
  padding: 16px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.2);

  /* Limit height so it doesn't cover the whole map */
  max-height: 35vh;
  overflow-y: auto;

  /* Override the default BottomCardsContainer styles */
  & > ${BottomCardsContainer} {
    height: 100%;
    margin: 0;
    background: transparent;
    box-shadow: none;
    padding: 0;
  }

  /* Make each bottom card take equal width and have a clean look */
  & ${BottomCard} {
    margin: 0 8px;
    padding: 12px;
    background: rgba(255, 255, 255, 0.6);
    backdrop-filter: blur(4px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  /* Responsive adjustments for mobile */
  @media (max-width: 768px) {
    left: 10px;
    right: 10px;
    padding: 12px;
    max-height: 40vh;

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

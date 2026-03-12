import styled from 'styled-components';
import virufyLogo from '../virufyLogo.png';
import qrCode from '../qrcode.png';

export const HeaderContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 98%;
  padding: 12px;
  position: relative;
  height: 12vh;
`;

export const QRCode = styled.img.attrs({
  src: qrCode
})`
  height: 12vh;
  padding-bottom: 10px;
  padding-top: 10px;
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
`;

export const VirufyLogoPNG = styled.img.attrs({
  src: virufyLogo
})`
  min-height: 45px;
  height: 6vh;
`;

export const DashboardContainer = styled.div`
  width: 90vw;
  height: calc(100vh - 16px);
  margin: 8px auto;
  border-radius: 12px;
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
  gap: 10px;
  overflow: hidden;

  @media (max-width: 768px) {
    width: 90vw;
    min-height: 100vh;
    height: auto;
  }
`;

export const HeatmapContainer = styled.div`
  flex: 1;
  min-height: 0;

  @media (max-width: 768px) {
    min-height: 560px;
    width: 90vw;
  }
`;

export const HeatmapCard = styled.div`
  width: 100%;
  height: 100%;
  min-height: 0;
  min-width: 0;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  border-radius: 12px;
  overflow: hidden;
  position: relative;
  isolation: isolate;
  background-color: #ffffff;

  @media (max-width: 768px) {
    min-height: 560px;
    width: 90vw;
  }
`;

export const MapContainer = styled.div`
  width: 100%;
  height: 100%;
  border-radius: inherit;
  overflow: hidden;
  z-index: 1;
  @media (max-width: 768px) {
    width: 100%;
  }
`;

export const MapSelectionPanel = styled.div`
  position: absolute;
  top: 12px;
  left: 12px;
  z-index: 420;
  width: 210px;
  padding: 10px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.93);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.18);
  backdrop-filter: blur(3px);

  @media (max-width: 768px) {
    width: 180px;
  }
`;

export const OverlayToggleButton = styled.button<{ $expanded: boolean }>`
  position: absolute;
  top: 14px;
  right: 14px;
  z-index: 610;
  border: none;
  border-radius: 999px;
  padding: 8px 12px;
  font-size: 13px;
  font-weight: 600;
  color: #ffffff;
  background: ${({ $expanded }) => ($expanded ? "#1f2937" : "#0f766e")};
  box-shadow: 0 6px 14px rgba(0, 0, 0, 0.2);
  cursor: pointer;
`;

export const GraphOverlayPanel = styled.aside<{ $expanded: boolean }>`
  position: absolute;
  top: 56px;
  right: 12px;
  bottom: 12px;
  width: min(420px, 44vw);
  z-index: 600;
  border-radius: 12px;
  border: 1px solid rgba(148, 163, 184, 0.3);
  background: rgba(248, 250, 252, 0.96);
  box-shadow: 0 14px 28px rgba(0, 0, 0, 0.22);
  backdrop-filter: blur(3px);
  transform: ${({ $expanded }) =>
		$expanded ? "translateX(0)" : "translateX(calc(100% + 18px))"};
  transition: transform 220ms ease;
  pointer-events: ${({ $expanded }) => ($expanded ? "auto" : "none")};
  overflow-y: auto;
  padding: 12px;

  @media (max-width: 1024px) {
    width: min(360px, 86vw);
  }

  @media (max-width: 768px) {
    top: 52px;
    right: 8px;
    bottom: 8px;
    width: min(330px, 90vw);
    padding: 10px;
  }
`;

export const OverlayHeader = styled.div`
  font-size: 14px;
  font-weight: 700;
  margin-bottom: 10px;
  color: #0f172a;
`;

export const OverlayCardsStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const OverlayChartCard = styled.section`
  border-radius: 10px;
  background-color: #ffffff;
  border: 1px solid #e2e8f0;
  padding: 12px;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.08);
`;

export const OverlayChartTitle = styled.div`
  margin-bottom: 8px;
  font-size: 14px;
  font-weight: 700;
  color: #1e293b;
`;

export const OverlayChartBody = styled.div`
  width: 100%;
  height: 250px;

  @media (max-width: 768px) {
    height: 230px;
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

export const SelectDropdown = styled.div`
  width: 100%;
  background-color: #f5f5f5;
  border-radius: 5px;
  border: 1px solid #ddd;
  padding: 10px;
  font-size: 14px;
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

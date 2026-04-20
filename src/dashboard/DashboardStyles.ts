import styled from 'styled-components';
import virufyLogo from '../virufyLogo.png';
import qrCode from '../qrcode.png';

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
  height: 97vh;
  border-radius: 12px;
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  @media (max-width: 768px) {
    width: 90vw;
    height: auto;
  }
  @media (max-height: 800px) {
    height: auto;
  }
`;

export const HeatmapContainer = styled.div`
  display: flex;
  gap: 10px;
  height: 50%;
  width: 100%;

  @media (max-width: 768px) {
    height: auto;
    width: 90vw;
  }
  @media (max-height: 800px) {
    height: 400px;
  }
`;

export const HeatmapCard = styled.div<HeatmapCardProps>`
  width: 100%;
  flex: 1;
  height: 100%;
  min-height: 300px;
  min-width: 300px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  border-radius: 12px;
  overflow: hidden;
  display: flex;
  flex-direction: row;

  @media (max-width: 768px) {
    flex-direction: column;
    height: auto;
    width: 90vw;
    min-width: 0;
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
  flex: 1 1 auto;
  min-width: 0;
  height: 100%;
  border-radius: 12px;
  overflow: hidden;
  @media (max-width: 768px) {
    width: 100%;
    min-height: 320px;
  }
`;

export const SelectionContainer = styled.div`
  flex: 0 0 220px;
  width: 220px;
  min-width: 220px;
  max-width: 220px;
  padding: 10px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  min-height: 0;
  overflow: hidden;
  @media (max-width: 768px) {
    width: 100%;
    min-width: 0;
    max-width: none;
    flex: 0 0 auto;
  }
`;

export const SelectDropdown = styled.div`
  width: 100%;
  background-color: #f5f5f5;
  border-radius: 5px;
  border: 1px solid #ddd;
  padding: 10px;
  font-size: 14px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  box-sizing: border-box;
  flex: 1 1 auto;
  min-height: 0;
  overflow-y: auto;
`;

export const DropdownOption = styled.div`
  padding: 6px 8px;
  display: flex;
  align-items: center;
  cursor: pointer;
  border-radius: 4px;
  line-height: 1.3;
  white-space: nowrap;

  &:hover {
    background-color: #e0e0e0;
  }

  &::before {
    content: "•";
    color: #007bff;
    margin-right: 10px;
  }
`;

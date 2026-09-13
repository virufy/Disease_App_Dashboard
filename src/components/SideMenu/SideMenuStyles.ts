import styled, { css } from "styled-components";
import virufyLogo from "../../assets/images/virufyLogo.png";
import qrCode from "../../assets/images/qrcode.png";

interface SubMenuProps {
  isOpen: boolean;
}

interface SubMenuItemProps {
  active?: boolean;
}

export const SideMenuContainer = styled.div`
  width: 13%;
  min-width: 215px;
  background:
    radial-gradient(
      120% 60% at 0% 0%,
      rgba(14, 165, 164, 0.16) 0%,
      transparent 55%
    ),
    linear-gradient(180deg, #0b1220 0%, #0f1b33 100%);
  border-right: 1px solid rgba(255, 255, 255, 0.06);
  padding: 22px 0 0 0; /* remove bottom padding – footer will provide it */
  display: flex;
  flex-direction: column;
  box-shadow: 8px 0 32px -20px rgba(2, 6, 23, 0.9);
  transition: all 0.3s ease;
  height: 100vh;
  overflow-y: auto;

  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.18);
    background-clip: content-box;
  }

  /* RTL support via parent dir attribute */
  [dir="rtl"] & {
    border-right: none;
    border-left: 1px solid #e0e0e0;
  }

  @media (max-width: 600px) {
    width: 60px;
    min-width: 60px;
    overflow: hidden;
    // hide text, show icons only, etc.
  }
`;

export const LogoWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 16px 14px;

  a {
    display: inline-block;
    line-height: 0; /* remove extra space below image */
    background: #ffffff;
    padding: 10px 18px;
    border-radius: 14px;
    box-shadow: 0 10px 24px -14px rgba(2, 6, 23, 0.9);
    transition: transform 0.2s ease;

    &:hover {
      transform: translateY(-1px);
    }
  }

  img {
    max-width: 120px;
    height: auto;
  }
`;

export const TestDataText = styled.p`
  align-self: center;
  text-align: center;
  font-weight: 800;
  font-size: 10px;
  letter-spacing: 0.7px;
  text-transform: uppercase;
  margin: 0 16px 20px 16px;
  padding: 4px 12px;
  color: #fbbf24;
  background: rgba(251, 191, 36, 0.12);
  border: 1px solid rgba(251, 191, 36, 0.3);
  border-radius: 999px;
`;

/* Uppercase section label, e.g. OVERVIEW / SETTINGS */
export const SideSectionLabel = styled.div`
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 1.2px;
  text-transform: uppercase;
  color: #475569;
  margin: 18px 24px 8px;
`;

/* Live overview stat tiles */
export const StatGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin: 0 14px;
`;

export const StatTile = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 8px;
  padding: 10px 14px;
  background: rgba(255, 255, 255, 0.045);
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-radius: 12px;
`;

export const StatTileLabel = styled.span`
  font-size: 11px;
  font-weight: 600;
  color: #94a3b8;
`;

export const StatTileValue = styled.span`
  font-family: "Plus Jakarta Sans", "Inter", sans-serif;
  font-size: 17px;
  font-weight: 800;
  color: #5eead4;
  font-variant-numeric: tabular-nums;
`;

export const MenuItem = styled.div`
  cursor: pointer;
  font-weight: 600;
  font-size: 13.5px;
  color: #cbd5e1;
  padding-block: 10px;
  padding-inline: 14px;
  margin-inline: 14px;
  border-radius: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition:
    background-color 0.2s ease,
    color 0.2s ease;

  &:hover {
    background-color: rgba(94, 234, 212, 0.09);
    color: #5eead4;
  }

  svg {
    transition: transform 0.2s ease;
  }
`;

export const SubMenu = styled.div<SubMenuProps>`
  max-height: ${(props) => (props.isOpen ? "200px" : "0")};
  overflow: hidden;
  transition: max-height 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background-color: rgba(255, 255, 255, 0.04);
  border-radius: 10px;
  margin-block: ${(props) => (props.isOpen ? "4px" : "0")};
  margin-inline: 30px 14px;
  display: flex;
  flex-direction: column;
`;

export const SubMenuItem = styled.div<SubMenuItemProps>`
  padding: 8px 20px;
  cursor: pointer;
  font-size: 12.5px;
  font-weight: ${(props) => (props.active ? 700 : 500)};
  color: ${(props) => (props.active ? "#5eead4" : "#94a3b8")};
  background-color: ${(props) =>
    props.active ? "rgba(94, 234, 212, 0.08)" : "transparent"};
  transition: all 0.2s ease;
  border-left: 3px solid
    ${(props) => (props.active ? "#2dd4bf" : "transparent")};

  &:hover {
    background-color: rgba(255, 255, 255, 0.05);
    color: #5eead4;
    padding-left: 24px;
  }

  /* RTL adjustments */
  [dir="rtl"] & {
    border-left: none;
    border-right: 3px solid
      ${(props) => (props.active ? "#2dd4bf" : "transparent")};

    &:hover {
      padding-left: 20px;
      padding-right: 24px;
    }
  }
`;

export const SideMenuFooter = styled.div`
  margin-top: auto;
  padding: 16px 10px 22px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  border-top: 1px solid rgba(255, 255, 255, 0.07);
`;

export const FooterCaption = styled.div`
  font-size: 10.5px;
  font-weight: 600;
  color: #64748b;
  text-align: center;
`;

export const QRLink = styled.a`
  display: inline-block;
  cursor: pointer;
  transition: opacity 0.2s;
  &:hover {
    opacity: 0.8;
  }
`;

export const QRCode = styled.img.attrs({
  src: qrCode,
})`
  max-width: 76px;
  max-height: 76px;
  width: auto;
  height: auto;
  display: block;
  cursor: pointer;
  background: #ffffff;
  padding: 6px;
  border-radius: 12px;
  box-shadow: 0 10px 24px -14px rgba(2, 6, 23, 0.9);
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;

  &:hover {
    opacity: 0.9;
    transform: translateY(-1px);
  }
`;

export const VirufyLogoPNG = styled.img.attrs({
  src: virufyLogo,
})`
  min-height: 35px;
  height: 4vh;
`;

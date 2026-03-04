import styled, { css } from "styled-components";
import virufyLogo from '../../assets/images/virufyLogo.png';
import qrCode from '../../assets/images/qrcode.png';

interface SubMenuProps {
  isOpen: boolean;
}

interface SubMenuItemProps {
  active?: boolean;
}

export const SideMenuContainer = styled.div`
  width: 240px;
  min-width: 240px;
  background-color: #f8f9fa;
  border-right: 1px solid #dee2e6;
  padding: 24px 0 0 0; /* remove bottom padding – footer will provide it */
  display: flex;
  flex-direction: column;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.03);
  transition: all 0.3s ease;
  height: 100vh;
  overflow-y: auto;

  /* RTL support via parent dir attribute */
  [dir="rtl"] & {
    border-right: none;
    border-left: 1px solid #e0e0e0;
  }
`;

export const LogoWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 8px; /* reduced to let the text breathe */
  padding: 0 16px;

  a {
    display: inline-block;
    line-height: 0; /* remove extra space below image */
  }

  img {
    max-width: 120px;
    height: auto;
  }
`;

export const TestDataText = styled.p`
  text-align: center;
  font-weight: bold;
  margin: 0 16px 24px 16px;
  color: #333333;
`;

export const MenuItem = styled.div`
  cursor: pointer;
  font-weight: 500;
  font-size: 16px;
  color: #333333;
  padding-block: 8px;
  padding-inline: 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition:
    background-color 0.2s ease,
    color 0.2s ease;

  &:hover {
    background-color: #f5f5f5;
    color: #007bff;
  }

  svg {
    transition: transform 0.2s ease;
  }
`;

export const SubMenu = styled.div<SubMenuProps>`
  max-height: ${(props) => (props.isOpen ? "200px" : "0")};
  overflow: hidden;
  transition: max-height 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background-color: #f5f5f5;
  border-radius: 8px;
  margin-block: ${(props) => (props.isOpen ? "4px" : "0")};
  margin-inline: 40px 10px;
  display: flex;
  flex-direction: column;
`;

export const SubMenuItem = styled.div<SubMenuItemProps>`
  padding: 8px 24px;
  cursor: pointer;
  font-size: 14px;
  color: ${(props) => (props.active ? "#007bff" : "#333333")};
  background-color: ${(props) => (props.active ? "#f0f0f0" : "transparent")};
  transition: all 0.2s ease;
  border-left: 3px solid
    ${(props) => (props.active ? "#007bff" : "transparent")};

  &:hover {
    background-color: #f0f0f0;
    color: #007bff;
    padding-left: 28px;
  }

  /* RTL adjustments */
  [dir="rtl"] & {
    border-left: none;
    border-right: 3px solid
      ${(props) => (props.active ? "#007bff" : "transparent")};

    &:hover {
      padding-left: 24px;
      padding-right: 28px;
    }
  }
`;

export const SideMenuFooter = styled.div`
  margin-top: auto;
  padding: 10px;
  display: flex;
  justify-content: center;
  border-top: 1px solid #e0e0e0;
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
  src: qrCode
})`
  max-width: 80px;        /* fits nicely in the footer */
  max-height: 80px;
  width: auto;
  height: auto;
  display: block;
  cursor: pointer;
  transition: opacity 0.2s ease;

  &:hover {
    opacity: 0.8;
  }
`;


export const VirufyLogoPNG = styled.img.attrs({
  src: virufyLogo
})`
  min-height: 35px;
  height: 4vh;
`;
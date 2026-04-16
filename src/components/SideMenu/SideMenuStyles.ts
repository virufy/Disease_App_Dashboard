import styled, { keyframes } from "styled-components";
import virufyLogo from "../../assets/images/virufyLogo.png";
import qrCode from "../../assets/images/qrcode.png";

interface SubMenuProps {
  isOpen: boolean;
}

interface SubMenuItemProps {
  active?: boolean;
}

// ─── Animations ───────────────────────────────────────────────────────────────

const ripple = keyframes`
  0%   { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.55); }
  70%  { box-shadow: 0 0 0 7px rgba(16, 185, 129, 0); }
  100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
`;

// ─── Container ────────────────────────────────────────────────────────────────

export const SideMenuContainer = styled.div<{ $collapsed?: boolean }>`
  width: ${(p) => (p.$collapsed ? "64px" : "220px")};
  min-width: ${(p) => (p.$collapsed ? "64px" : "220px")};
  /* Rich layered dark gradient — subtle depth from top to bottom */
  background: linear-gradient(
    180deg,
    #0d1b35 0%,
    #0f172a 40%,
    #0b1528 100%
  );
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
  border-right: 1px solid rgba(255, 255, 255, 0.05);
  flex-shrink: 0;
  transition: width 0.25s cubic-bezier(0.4, 0, 0.2, 1),
    min-width 0.25s cubic-bezier(0.4, 0, 0.2, 1);

  [dir="rtl"] & {
    border-right: none;
    border-left: 1px solid rgba(255, 255, 255, 0.05);
  }
`;

// ─── Logo & Status ────────────────────────────────────────────────────────────

export const LogoWrapper = styled.div<{ $collapsed?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${(p) => (p.$collapsed ? "16px 0" : "22px 20px 18px")};
  gap: 10px;
  /* Warm blue glow under the logo */
  background: radial-gradient(
    ellipse at 50% 130%,
    rgba(37, 99, 235, 0.12) 0%,
    transparent 70%
  );
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  flex-shrink: 0;
`;

export const LiveBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 3px 10px;
  background: rgba(16, 185, 129, 0.1);
  border: 1px solid rgba(16, 185, 129, 0.28);
  border-radius: 20px;
`;

export const LiveDot = styled.span`
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #10b981;
  flex-shrink: 0;
  animation: ${ripple} 2s ease-out infinite;
`;

export const LiveLabel = styled.span`
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 1.1px;
  text-transform: uppercase;
  color: #10b981;
`;

export const TestDataText = styled.p`
  font-size: 9px;
  font-weight: 600;
  letter-spacing: 0.6px;
  text-transform: uppercase;
  color: rgba(100, 116, 139, 0.5);
  margin: 0;
  text-align: center;
`;

// ─── Live Stats ───────────────────────────────────────────────────────────────

export const StatsSection = styled.div`
  display: flex;
  align-items: stretch;
  margin: 12px 14px 4px;
  /* Gradient border via background-clip trick */
  background: linear-gradient(
    135deg,
    rgba(37, 99, 235, 0.1) 0%,
    rgba(16, 185, 129, 0.07) 100%
  );
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 10px;
  overflow: hidden;
  flex-shrink: 0;
`;

export const StatItem = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px 6px;
`;

export const StatDivider = styled.div`
  width: 1px;
  background: rgba(255, 255, 255, 0.07);
  align-self: stretch;
`;

export const StatValue = styled.div<{ $highlighted?: boolean }>`
  font-size: 20px;
  font-weight: 800;
  color: ${(p) => (p.$highlighted ? "#60a5fa" : "#f1f5f9")};
  font-variant-numeric: tabular-nums;
  letter-spacing: -0.8px;
  line-height: 1;
  ${(p) =>
    p.$highlighted &&
    `text-shadow: 0 0 16px rgba(96, 165, 250, 0.35);`}
`;

export const StatLabel = styled.div`
  font-size: 8px;
  font-weight: 700;
  color: rgba(100, 116, 139, 0.65);
  text-transform: uppercase;
  letter-spacing: 0.8px;
  margin-top: 4px;
`;

// ─── Navigation ───────────────────────────────────────────────────────────────

export const NavSection = styled.div`
  flex: 1;
  padding: 10px 0;
  overflow: hidden;
`;

export const MenuItem = styled.div`
  cursor: pointer;
  font-size: 13px;
  font-weight: 500;
  color: #94a3b8;
  padding: 9px 18px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.15s ease;
  border-left: 2px solid transparent;
  white-space: nowrap;
  letter-spacing: 0.1px;

  &:hover {
    background: rgba(255, 255, 255, 0.04);
    color: #e2e8f0;
    border-left-color: #3b82f6;
  }

  svg {
    color: #475569;
    flex-shrink: 0;
    transition: color 0.15s ease;
  }

  &:hover svg {
    color: #94a3b8;
  }
`;

export const MenuIconOnly = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px 0;
  cursor: pointer;
  color: #64748b;
  transition: all 0.15s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.05);
    color: #94a3b8;
  }
`;

export const SubMenu = styled.div<SubMenuProps>`
  max-height: ${(p) => (p.isOpen ? "200px" : "0")};
  overflow: hidden;
  transition: max-height 0.28s cubic-bezier(0.4, 0, 0.2, 1);
`;

export const SubMenuItem = styled.div<SubMenuItemProps>`
  padding: 8px 18px 8px 46px;
  cursor: pointer;
  font-size: 12px;
  font-weight: ${(p) => (p.active ? "600" : "400")};
  color: ${(p) => (p.active ? "#60a5fa" : "#64748b")};
  background: ${(p) =>
    p.active ? "rgba(59, 130, 246, 0.08)" : "transparent"};
  border-left: 2px solid ${(p) => (p.active ? "#3b82f6" : "transparent")};
  transition: all 0.15s ease;
  white-space: nowrap;
  letter-spacing: 0.1px;

  &:hover {
    background: rgba(255, 255, 255, 0.04);
    color: #94a3b8;
  }

  [dir="rtl"] & {
    padding: 8px 46px 8px 18px;
    border-left: none;
    border-right: 2px solid ${(p) => (p.active ? "#3b82f6" : "transparent")};
  }
`;

// ─── Collapse Toggle ──────────────────────────────────────────────────────────

export const CollapseButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  color: #475569;
  cursor: pointer;
  transition: all 0.15s ease;
  margin: 10px auto 6px;
  flex-shrink: 0;

  &:hover {
    background: rgba(59, 130, 246, 0.1);
    border-color: rgba(59, 130, 246, 0.35);
    color: #60a5fa;
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.35);
  }
`;

// ─── Footer ───────────────────────────────────────────────────────────────────

export const SideMenuFooter = styled.div<{ $collapsed?: boolean }>`
  padding: ${(p) => (p.$collapsed ? "12px 0" : "14px 20px")};
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  flex-shrink: 0;
`;

export const FooterLabel = styled.span`
  font-size: 9px;
  font-weight: 600;
  letter-spacing: 0.7px;
  text-transform: uppercase;
  color: rgba(100, 116, 139, 0.38);
  white-space: nowrap;
`;

export const QRLink = styled.a`
  display: inline-block;
  cursor: pointer;
  transition: opacity 0.2s, transform 0.2s;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.08);

  &:hover {
    opacity: 0.8;
    transform: scale(1.04);
  }
`;

export const QRCode = styled.img.attrs({ src: qrCode })`
  display: block;
  width: 66px;
  height: 66px;
  object-fit: contain;
  /* Slight invert so the QR is readable over any background */
  filter: invert(0.1) brightness(0.9);
`;

export const VirufyLogoPNG = styled.img.attrs({
  src: virufyLogo,
})<{ $small?: boolean }>`
  height: ${(p) => (p.$small ? "22px" : "30px")};
  width: auto;
  display: block;
  transition: height 0.25s cubic-bezier(0.4, 0, 0.2, 1);
`;

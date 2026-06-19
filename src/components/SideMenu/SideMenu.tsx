import React, { useState } from "react";
import {
  SideMenuContainer,
  LogoWrapper,
  LiveBadge,
  LiveDot,
  LiveLabel,
  NavSection,
  MenuItem,
  MenuIconOnly,
  SubMenu,
  SubMenuItem,
  TestDataText,
  StatsSection,
  StatItem,
  StatDivider,
  StatValue,
  StatLabel,
  CollapseButton,
  SideMenuFooter,
  FooterLabel,
  QRLink,
  VirufyLogoPNG,
  QRCode,
} from "./SideMenuStyles";
import {
  IoLanguage,
  IoChevronDown,
  IoChevronUp,
  IoChevronBack,
  IoChevronForward,
} from "react-icons/io5";
import { useTranslation } from "react-i18next";
import { useCountUp } from "../../hooks/useCountUp";

interface SideMenuProps {
  selectedLanguage: "en" | "ar" | "ja";
  onLanguageChange: (lang: "en" | "ar" | "ja") => void;
  totalRecords: number;
  filteredRecords: number;
}

const SideMenu: React.FC<SideMenuProps> = ({
  selectedLanguage,
  onLanguageChange,
  totalRecords,
  filteredRecords,
}) => {
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const { t, i18n } = useTranslation();

  const changeLanguage = (lang: "en" | "ar" | "ja") => {
    i18n.changeLanguage(lang);
    onLanguageChange(lang);
  };

  const toggleCollapse = () => {
    setIsCollapsed((prev) => {
      // Close submenu when collapsing
      if (!prev) setIsLangOpen(false);
      return !prev;
    });
  };

  const isRTL = i18n.language === "ar";
  const isFiltered = filteredRecords !== totalRecords;

  const animatedTotal = useCountUp(totalRecords);
  const animatedFiltered = useCountUp(filteredRecords);

  // ── Collapsed layout ──────────────────────────────────────────────────────
  if (isCollapsed) {
    return (
      <SideMenuContainer $collapsed dir={isRTL ? "rtl" : "ltr"}>
        <LogoWrapper $collapsed>
          <a
            href="https://virufy.org/en/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <VirufyLogoPNG $small />
          </a>
          <LiveDot />
        </LogoWrapper>

        <NavSection>
          <MenuIconOnly
            onClick={() => setIsCollapsed(false)}
            title={t("menu.language")}
          >
            <IoLanguage size={18} />
          </MenuIconOnly>
        </NavSection>

        <CollapseButton onClick={toggleCollapse} title={t("menu.expandSidebar")}>
          {isRTL ? <IoChevronBack size={14} /> : <IoChevronForward size={14} />}
        </CollapseButton>

        <SideMenuFooter $collapsed />
      </SideMenuContainer>
    );
  }

  // ── Expanded layout ───────────────────────────────────────────────────────
  return (
    <SideMenuContainer dir={isRTL ? "rtl" : "ltr"}>
      {/* ── Logo & Status ───────────────────────────────── */}
      <LogoWrapper>
        <a
          href="https://virufy.org/en/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <VirufyLogoPNG />
        </a>
        <LiveBadge>
          <LiveDot />
          <LiveLabel>Live</LiveLabel>
        </LiveBadge>
        <TestDataText>{t("menu.testData")}</TestDataText>
      </LogoWrapper>

      {/* ── Live Stats ──────────────────────────────────── */}
      <StatsSection>
        <StatItem>
          <StatValue>{animatedTotal.toLocaleString("en-US")}</StatValue>
          <StatLabel>{t("sidebar.total")}</StatLabel>
        </StatItem>
        <StatDivider />
        <StatItem>
          <StatValue $highlighted={isFiltered}>
            {animatedFiltered.toLocaleString("en-US")}
          </StatValue>
          <StatLabel>{t("sidebar.filtered")}</StatLabel>
        </StatItem>
      </StatsSection>

      {/* ── Navigation ─────────────────────────────────── */}
      <NavSection>
        <MenuItem onClick={() => setIsLangOpen((p) => !p)}>
          <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <IoLanguage size={15} />
            {t("menu.language")}
          </span>
          {isLangOpen ? <IoChevronUp size={13} /> : <IoChevronDown size={13} />}
        </MenuItem>

        <SubMenu $isOpen={isLangOpen}>
          <SubMenuItem
            $active={i18n.language === "en"}
            onClick={() => changeLanguage("en")}
          >
            {t("languages.english")}
          </SubMenuItem>
          <SubMenuItem
            $active={i18n.language === "ja"}
            onClick={() => changeLanguage("ja")}
          >
            {t("languages.japanese")}
          </SubMenuItem>
          <SubMenuItem
            $active={i18n.language === "ar"}
            onClick={() => changeLanguage("ar")}
          >
            {t("languages.arabic")}
          </SubMenuItem>
        </SubMenu>
      </NavSection>

      {/* ── Collapse toggle ─────────────────────────────── */}
      <CollapseButton onClick={toggleCollapse} title={t("menu.collapseSidebar")}>
        {isRTL ? <IoChevronForward size={14} /> : <IoChevronBack size={14} />}
      </CollapseButton>

      {/* ── Footer ─────────────────────────────────────── */}
      <SideMenuFooter>
        <FooterLabel>Disease App</FooterLabel>
        <QRLink href="/disease-app" target="_blank" rel="noopener noreferrer">
          <QRCode />
        </QRLink>
      </SideMenuFooter>
    </SideMenuContainer>
  );
};

export default SideMenu;

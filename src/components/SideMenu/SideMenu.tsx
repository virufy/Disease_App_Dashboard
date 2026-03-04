import React, { useState } from "react";
import {
  SideMenuContainer,
  LogoWrapper,
  MenuItem,
  SubMenu,
  SubMenuItem,
  TestDataText,
  SideMenuFooter,
  QRLink,
  VirufyLogoPNG,
  QRCode,
} from "./SideMenuStyles";
import { IoLanguage, IoChevronDown, IoChevronUp } from "react-icons/io5";

interface SideMenuProps {
  selectedLanguage: "en" | "ar" | "ja";
  onLanguageChange: (lang: "en" | "ar" | "ja") => void;
}

const SideMenu: React.FC<SideMenuProps> = ({
  selectedLanguage,
  onLanguageChange,
}) => {
  const [isLangOpen, setIsLangOpen] = useState(false);

  const toggleLangMenu = () => setIsLangOpen((prev) => !prev);

  const translations = {
    en: {
      languageLabel: "Language:",
    },
    ar: {
      languageLabel: "اللغة:",
    },
    ja: {
      languageLabel: "言語:",
    },
  };

  const t = translations[selectedLanguage];

  return (
    <SideMenuContainer dir={selectedLanguage === "ar" ? "rtl" : "ltr"}>
      <LogoWrapper>
        <a href="https://virufy.org/en/" target="_blank" rel="noopener noreferrer">
          <VirufyLogoPNG />
        </a>
      </LogoWrapper>

       {/* Test data text */}
      <TestDataText>Test data</TestDataText>

      {/* Language menu */}
      <MenuItem onClick={toggleLangMenu}>
        <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <IoLanguage size={18} />
          {t.languageLabel}
        </span>
        {isLangOpen ? <IoChevronUp size={16} /> : <IoChevronDown size={16} />}
      </MenuItem>

      <SubMenu isOpen={isLangOpen}>
        <SubMenuItem
          active={selectedLanguage === "en"}
          onClick={() => onLanguageChange("en")}
        >
          English
        </SubMenuItem>
        <SubMenuItem
          active={selectedLanguage === "ja"}
          onClick={() => onLanguageChange("ja")}
        >
          日本語 (Japanese)
        </SubMenuItem>
        <SubMenuItem
          active={selectedLanguage === "ar"}
          onClick={() => onLanguageChange("ar")}
        >
          العربية (Arabic)
        </SubMenuItem>
      </SubMenu>

      {/* QR code at bottom */}
      <SideMenuFooter>
        <QRLink href="/disease-app" target="_blank" rel="noopener noreferrer">
          <QRCode />
        </QRLink>
      </SideMenuFooter>
    </SideMenuContainer>
  );
};

export default SideMenu;

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
import { useTranslation } from "react-i18next";

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

  const { t, i18n } = useTranslation();

  const changeLanguage = (lang: "en" | "ar" | "ja") => {
    i18n.changeLanguage(lang);
    onLanguageChange(lang);
  };

  return (
    <SideMenuContainer dir={i18n.language === "ar" ? "rtl" : "ltr"}>
      <LogoWrapper>
        <a
          href="https://virufy.org/en/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <VirufyLogoPNG />
        </a>
      </LogoWrapper>

      {/* Test data text */}
      <TestDataText>{t("menu.testData")}</TestDataText>

      {/* Language menu */}
      <MenuItem onClick={toggleLangMenu}>
        <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <IoLanguage size={18} />
          {t("menu.language")}
        </span>
        {isLangOpen ? <IoChevronUp size={16} /> : <IoChevronDown size={16} />}
      </MenuItem>

      <SubMenu isOpen={isLangOpen}>
        <SubMenuItem
          active={i18n.language === "en"}
          onClick={() => changeLanguage("en")}
        >
          {t("languages.english")}
        </SubMenuItem>
        <SubMenuItem
          active={selectedLanguage === "ja"}
          onClick={() => changeLanguage("ja")}
        >
          {t("languages.japanese")}
        </SubMenuItem>
        <SubMenuItem
          active={selectedLanguage === "ar"}
          onClick={() => changeLanguage("ar")}
        >
          {t("languages.arabic")}
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

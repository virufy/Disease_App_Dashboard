import React, { useState } from "react";
import {
	SideMenuContainer,
	LogoWrapper,
	MenuItem,
	SubMenu,
	SubMenuItem,
	TestDataText,
	SideMenuFooter,
	FooterCaption,
	QRLink,
	VirufyLogoPNG,
	QRCode,
	SideSectionLabel,
	StatGrid,
	StatTile,
	StatTileLabel,
	StatTileValue
} from "./SideMenuStyles";
import { IoLanguage, IoChevronDown, IoChevronUp } from "react-icons/io5";
import { useTranslation } from "react-i18next";

interface SideMenuProps {
	selectedLanguage: "en" | "ar" | "ja";
	onLanguageChange: (lang: "en" | "ar" | "ja") => void;
	totalCases?: number;
	sickRate?: number;
	citiesLive?: number;
}

const SideMenu: React.FC<SideMenuProps> = ({
	selectedLanguage,
	onLanguageChange,
	totalCases = 0,
	sickRate = 0,
	citiesLive = 0
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

			{/* Live overview stats */}
			<SideSectionLabel>
				{t("menu.overview", { defaultValue: "Overview" })}
			</SideSectionLabel>
			<StatGrid>
				<StatTile>
					<StatTileLabel>
						{t("dashboard.kpi.submissions", { defaultValue: "Submissions" })}
					</StatTileLabel>
					<StatTileValue>{totalCases.toLocaleString()}</StatTileValue>
				</StatTile>
				<StatTile>
					<StatTileLabel>
						{t("dashboard.kpi.sickRate", { defaultValue: "Sick Rate" })}
					</StatTileLabel>
					<StatTileValue>{sickRate}%</StatTileValue>
				</StatTile>
				<StatTile>
					<StatTileLabel>
						{t("dashboard.kpi.cities", { defaultValue: "Cities" })}
					</StatTileLabel>
					<StatTileValue>{citiesLive}</StatTileValue>
				</StatTile>
			</StatGrid>

			{/* Language menu */}
			<SideSectionLabel>
				{t("menu.settings", { defaultValue: "Settings" })}
			</SideSectionLabel>
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
				<QRLink href="/dubai-app" target="_blank" rel="noopener noreferrer">
					<QRCode />
				</QRLink>
				<FooterCaption>
					{t("menu.scanToContribute", {
						defaultValue: "Scan to contribute data"
					})}
				</FooterCaption>
			</SideMenuFooter>
		</SideMenuContainer>
	);
};

export default SideMenu;

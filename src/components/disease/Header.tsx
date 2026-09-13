import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { useDisease } from "../../state/DiseaseContext";
import { Panel, Chip, LiveDot, Segmented, SegButton, IconBtn, Num } from "../../styles/cc";

const Bar = styled(Panel)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  padding: 12px 16px;
  flex-wrap: wrap;
`;

const Brand = styled.div`
  display: flex;
  align-items: center;
  gap: 13px;
`;

const Mark = styled.div`
  width: 42px;
  height: 42px;
  border-radius: 13px;
  display: grid;
  place-items: center;
  font-size: 21px;
  background: linear-gradient(135deg, rgba(34, 211, 238, 0.9), rgba(56, 189, 248, 0.55));
  box-shadow: 0 10px 26px -8px rgba(34, 211, 238, 0.6);
  animation: dm-live 3s ease-in-out infinite;
`;

const Title = styled.div`
  display: flex;
  flex-direction: column;
  line-height: 1.15;
  h1 {
    margin: 0;
    font-size: 19px;
    font-weight: 800;
    letter-spacing: -0.3px;
    color: var(--ink);
  }
  span {
    font-size: 11.5px;
    color: var(--muted);
    font-weight: 500;
  }
`;

const Right = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
`;

const Clock = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  line-height: 1.2;
  [dir="rtl"] & {
    align-items: flex-start;
  }
  .t {
    font-family: var(--font-num);
    font-size: 15px;
    font-weight: 700;
    color: var(--ink);
  }
  .l {
    font-size: 10px;
    color: var(--faint);
    font-weight: 600;
  }
`;

interface HeaderProps {
  onMethodology: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMethodology }) => {
  const { t } = useTranslation();
  const { language, setLanguage, frame, tick } = useDisease();
  const [now, setNow] = useState<string>("--:--:--");

  useEffect(() => {
    const d = new Date();
    setNow(
      d.toLocaleTimeString(language === "ar" ? "ar" : "en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }),
    );
  }, [tick, language]);

  return (
    <Bar as="header">
      <Brand>
        <Mark aria-hidden="true">🫁</Mark>
        <Title>
          <h1>{t("dm.appName")}</h1>
          <span>{t("dm.subtitle")}</span>
        </Title>
        <Chip>
          <LiveDot /> {t("dm.live")}
        </Chip>
      </Brand>

      <Right>
        <Clock>
          <span className="t">{now}</span>
          <span className="l">
            {t("dm.lastUpdated")}: <Num>{frame.label}</Num>
          </span>
        </Clock>

        <Segmented role="group" aria-label={t("dm.language")}>
          <SegButton $active={language === "en"} onClick={() => setLanguage("en")}>
            EN
          </SegButton>
          <SegButton $active={language === "ar"} onClick={() => setLanguage("ar")}>
            AR
          </SegButton>
        </Segmented>

        <IconBtn onClick={onMethodology} title={t("dm.methodology")} aria-label={t("dm.methodology")}>
          ⓘ
        </IconBtn>
      </Right>
    </Bar>
  );
};

export default Header;

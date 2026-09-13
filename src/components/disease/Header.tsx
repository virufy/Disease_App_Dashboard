import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { useDisease } from "../../state/DiseaseContext";
import { Panel, Chip, LiveDot, Segmented, SegButton, Num } from "../../styles/cc";
import virufyLogo from "../../assets/images/virufyLogo.png";

const Bar = styled(Panel)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  padding: 12px 18px;
  flex-wrap: wrap;
`;
const Brand = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  flex-wrap: wrap;
`;
const Logo = styled.img`
  height: 30px;
  width: auto;
  display: block;
`;
const Sep = styled.span`
  width: 1px;
  height: 30px;
  background: var(--line-strong);
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
  }
  .l {
    font-size: 10px;
    color: var(--faint);
    font-weight: 600;
  }
`;

const Header: React.FC = () => {
  const { t } = useTranslation();
  const { language, setLanguage, total, status, follow, isTest, tick } = useDisease();
  const [now, setNow] = useState("--:--:--");

  useEffect(() => {
    setNow(
      new Date().toLocaleTimeString(language === "ar" ? "ar" : "en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }),
    );
  }, [tick, language]);

  const connected = status === "open";

  return (
    <Bar as="header">
      <Brand>
        <Logo src={virufyLogo} alt="Virufy" />
        <Sep />
        <Title>
          <h1>{t("dm.appName")}</h1>
          <span>{t("dm.subtitle")}</span>
        </Title>
        {connected && follow && (
          <Chip>
            <LiveDot /> {t("dm.live")}
          </Chip>
        )}
        {isTest && <Chip $tone="#fcd34d">{t("dm.tag.testData")}</Chip>}
      </Brand>

      <Right>
        <Clock>
          <span className="t">{now}</span>
          <span className="l">
            <Num>{total.toLocaleString()}</Num> {t("dm.header.submissions")}
            {" · "}
            {t(`dm.status.${connected ? "live" : status === "idle" ? "idle" : "connecting"}`)}
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
      </Right>
    </Bar>
  );
};

export default Header;

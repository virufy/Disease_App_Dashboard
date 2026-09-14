import React from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { FiSmartphone } from "react-icons/fi";
import { Panel, PanelHead, PanelTitle } from "../../styles/cc";
import { APP_URL } from "../../data/config";
import appQr from "../../assets/images/disease-app-qr.png";

const Body = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 4px 14px 14px;
`;
const QrFrame = styled.a`
  flex-shrink: 0;
  width: 96px;
  height: 96px;
  padding: 7px;
  border-radius: 12px;
  background: #fff;
  border: 1px solid var(--line);
  display: grid;
  place-items: center;
  cursor: pointer;
  transition: transform 0.15s ease, box-shadow 0.15s ease, border-color 0.15s ease;
  img {
    width: 100%;
    height: 100%;
    display: block;
    object-fit: contain;
  }
  &:hover {
    transform: translateY(-1px);
    border-color: rgba(77, 141, 246, 0.55);
    box-shadow: 0 6px 18px rgba(77, 141, 246, 0.25);
  }
  &:focus-visible {
    outline: 2px solid var(--signal);
    outline-offset: 2px;
  }
`;
const Copy = styled.div`
  min-width: 0;
  .sub {
    font-size: 12.5px;
    font-weight: 700;
    line-height: 1.35;
    color: var(--ink);
  }
  .hint {
    margin-top: 4px;
    font-size: 11px;
    color: var(--muted);
    line-height: 1.4;
  }
`;

const QRCard: React.FC = () => {
  const { t } = useTranslation();

  return (
    <Panel>
      <PanelHead>
        <PanelTitle>
          <FiSmartphone size={13} /> {t("dm.qr.title")}
        </PanelTitle>
      </PanelHead>
      <Body>
        <QrFrame
          href={APP_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={t("dm.qr.title")}
          title={t("dm.qr.title")}
        >
          <img src={appQr} alt={t("dm.qr.title")} />
        </QrFrame>
        <Copy>
          <div className="sub">{t("dm.qr.subtitle")}</div>
          <div className="hint">{t("dm.qr.hint")}</div>
        </Copy>
      </Body>
    </Panel>
  );
};

export default QRCard;

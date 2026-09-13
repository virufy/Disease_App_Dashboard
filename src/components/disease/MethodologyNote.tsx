import React from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";

const FootBar = styled.button`
  width: 100%;
  text-align: start;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  border-radius: 12px;
  background: rgba(9, 12, 20, 0.5);
  border: 1px dashed var(--line-strong);
  color: var(--muted);
  font-size: 11px;
  line-height: 1.4;
  cursor: pointer;
  font-family: var(--font-ui);

  b {
    color: var(--signal);
    font-weight: 700;
  }
  &:hover {
    border-color: rgba(34, 211, 238, 0.4);
  }
`;

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 3000;
  display: grid;
  place-items: center;
  padding: 20px;
  background: rgba(4, 6, 12, 0.72);
  backdrop-filter: blur(6px);
  animation: dm-rise 0.2s ease both;
`;

const Modal = styled.div`
  max-width: 560px;
  width: 100%;
  background: var(--panel-solid);
  border: 1px solid var(--line-strong);
  border-radius: 18px;
  box-shadow: var(--shadow);
  padding: 22px 24px;

  h2 {
    margin: 0 0 6px;
    font-size: 17px;
    color: var(--ink);
  }
  p {
    margin: 10px 0 0;
    font-size: 13px;
    line-height: 1.6;
    color: var(--muted);
  }
  .badge {
    display: inline-block;
    font-size: 10px;
    font-weight: 800;
    letter-spacing: 0.6px;
    text-transform: uppercase;
    color: #a5f3fc;
    background: rgba(34, 211, 238, 0.12);
    border: 1px solid var(--line);
    padding: 3px 9px;
    border-radius: 999px;
  }
  button {
    margin-top: 18px;
    appearance: none;
    border: 1px solid var(--line-strong);
    background: rgba(34, 211, 238, 0.14);
    color: #a5f3fc;
    font-weight: 700;
    font-size: 13px;
    padding: 9px 18px;
    border-radius: 11px;
    cursor: pointer;
  }
`;

export const FootNote: React.FC<{ onOpen: () => void }> = ({ onOpen }) => {
  const { t } = useTranslation();
  return (
    <FootBar onClick={onOpen} aria-label={t("dm.methodology")}>
      <span aria-hidden="true">ⓘ</span>
      <span>
        <b>{t("dm.methodology")}:</b> {t("dm.methodologyNote")}
      </span>
    </FootBar>
  );
};

export const MethodologyModal: React.FC<{ open: boolean; onClose: () => void }> = ({
  open,
  onClose,
}) => {
  const { t } = useTranslation();
  if (!open) return null;
  return (
    <Overlay onClick={onClose} role="dialog" aria-modal="true">
      <Modal onClick={(e) => e.stopPropagation()}>
        <span className="badge">{t("dm.methodology")}</span>
        <h2 style={{ marginTop: 12 }}>{t("dm.appName")}</h2>
        <p>{t("dm.methodologyNote")}</p>
        <button onClick={onClose}>OK</button>
      </Modal>
    </Overlay>
  );
};
